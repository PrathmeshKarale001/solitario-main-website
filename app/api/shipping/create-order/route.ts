import { NextRequest, NextResponse } from 'next/server';
import { createDelhiveryShipment, isDelhiveryConfigured } from '@/lib/delhivery';

// Create Delhivery shipment order (without manifest - can be manifested later)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, customer, items, total, paymentMode = 'Prepaid' } = body;

    // Validate required fields
    if (!orderId || !customer || !items || !total) {
      return NextResponse.json(
        { error: 'Missing required fields: orderId, customer, items, total' },
        { status: 400 }
      );
    }

    // Validate customer details
    if (!customer.name || !customer.phone || !customer.address) {
      return NextResponse.json(
        { error: 'Missing customer details: name, phone, address required' },
        { status: 400 }
      );
    }

    // Validate address
    const { address } = customer;
    if (!address.line1 || !address.city || !address.state || !address.pincode) {
      return NextResponse.json(
        { error: 'Missing address details: line1, city, state, pincode required' },
        { status: 400 }
      );
    }

    // Check if Delhivery is configured
    if (!isDelhiveryConfigured()) {
      return NextResponse.json(
        { error: 'Shipping service not configured. Please set DELHIVERY_API_KEY.' },
        { status: 503 }
      );
    }

    // Prepare items with SKU
    const shippingItems = items.map((item: any) => ({
      name: item.name,
      sku: item.sku || item.productId || 'UNKNOWN',
      quantity: item.quantity || 1,
      price: item.price || 0,
    }));

    // Create shipment in Delhivery
    const result = await createDelhiveryShipment(
      orderId,
      customer,
      shippingItems,
      total,
      paymentMode
    );

    if (!result.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: result.error || 'Failed to create shipment',
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      orderId,
      waybill: result.waybill,
      trackingUrl: `https://www.delhivery.com/track/package/${result.waybill}`,
      message: 'Shipment order created successfully. Ready for manifest.',
    });
  } catch (error) {
    console.error('Error creating shipping order:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create shipping order' },
      { status: 500 }
    );
  }
}
