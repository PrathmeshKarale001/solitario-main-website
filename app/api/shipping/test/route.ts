import { NextRequest, NextResponse } from 'next/server';
import { 
  isDelhiveryConfigured, 
  checkPincodeServiceability, 
  createDelhiveryShipment,
  trackDelhiveryShipment 
} from '@/lib/delhivery';

// Test endpoint to verify Delhivery integration
// GET /api/shipping/test - Check configuration status
// GET /api/shipping/test?action=pincode&pincode=411001 - Test pincode check
// GET /api/shipping/test?action=track&waybill=123456 - Test tracking
// POST /api/shipping/test - Create test shipment (use with caution)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    // Check if Delhivery is configured
    const isConfigured = isDelhiveryConfigured();
    
    if (!isConfigured) {
      return NextResponse.json({
        success: false,
        configured: false,
        error: 'Delhivery API key not configured. Set DELHIVERY_API_KEY in environment variables.',
        envCheck: {
          DELHIVERY_API_KEY: !!process.env.DELHIVERY_API_KEY,
          DELHIVERY_WAREHOUSE_NAME: process.env.DELHIVERY_WAREHOUSE_NAME || 'Not set (using default)',
          DELHIVERY_WAREHOUSE_CITY: process.env.DELHIVERY_WAREHOUSE_CITY || 'Not set (using default)',
          DELHIVERY_WAREHOUSE_PIN: process.env.DELHIVERY_WAREHOUSE_PIN || 'Not set (using default)',
        },
      });
    }

    // Test pincode serviceability
    if (action === 'pincode') {
      const pincode = searchParams.get('pincode') || '411001';
      const result = await checkPincodeServiceability(pincode);
      
      return NextResponse.json({
        success: true,
        action: 'pincode_check',
        pincode,
        result,
      });
    }

    // Test tracking
    if (action === 'track') {
      const waybill = searchParams.get('waybill');
      if (!waybill) {
        return NextResponse.json({
          success: false,
          error: 'Waybill number required for tracking test',
        }, { status: 400 });
      }
      
      const result = await trackDelhiveryShipment(waybill);
      return NextResponse.json({
        success: true,
        action: 'tracking',
        waybill,
        result,
      });
    }

    // Default: Return configuration status
    return NextResponse.json({
      success: true,
      configured: true,
      message: 'Delhivery integration is configured and ready',
      envCheck: {
        DELHIVERY_API_KEY: '✓ Set',
        DELHIVERY_WAREHOUSE_NAME: process.env.DELHIVERY_WAREHOUSE_NAME || 'Using default: Solitario Warehouse',
        DELHIVERY_WAREHOUSE_CITY: process.env.DELHIVERY_WAREHOUSE_CITY || 'Using default: Pune',
        DELHIVERY_WAREHOUSE_PIN: process.env.DELHIVERY_WAREHOUSE_PIN || 'Using default: 411001',
      },
      availableTests: {
        pincode: '/api/shipping/test?action=pincode&pincode=411001',
        track: '/api/shipping/test?action=track&waybill=YOUR_WAYBILL',
        createTestOrder: 'POST /api/shipping/test with test order data',
      },
    });
  } catch (error) {
    console.error('Delhivery test error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}

// POST: Create a test shipment (for testing purposes only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { testMode = true } = body;

    if (!isDelhiveryConfigured()) {
      return NextResponse.json({
        success: false,
        error: 'Delhivery not configured',
      }, { status: 503 });
    }

    // Test order data
    const testOrderId = `TEST-${Date.now().toString(36).toUpperCase()}`;
    const testCustomer = body.customer || {
      name: 'Test Customer',
      phone: '9876543210',
      email: 'test@example.com',
      address: {
        line1: 'Test Address Line 1',
        line2: 'Test Address Line 2',
        city: 'Pune',
        state: 'Maharashtra',
        pincode: '411001',
        country: 'India',
      },
    };

    const testItems = body.items || [
      {
        name: 'Test Diamond Ring',
        sku: 'TEST-SKU-001',
        quantity: 1,
        price: 50000,
      },
    ];

    const testTotal = body.total || 50000;

    if (testMode) {
      // In test mode, just validate the data without actually creating shipment
      return NextResponse.json({
        success: true,
        testMode: true,
        message: 'Test data validated. Set testMode: false to create actual shipment.',
        orderData: {
          orderId: testOrderId,
          customer: testCustomer,
          items: testItems,
          total: testTotal,
        },
      });
    }

    // Create actual shipment (use with caution!)
    const result = await createDelhiveryShipment(
      testOrderId,
      testCustomer,
      testItems,
      testTotal,
      'Prepaid'
    );

    return NextResponse.json({
      success: result.success,
      testMode: false,
      orderId: testOrderId,
      waybill: result.waybill,
      error: result.error,
      warning: 'This created a REAL shipment in Delhivery. Cancel if needed.',
    });
  } catch (error) {
    console.error('Test shipment error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
