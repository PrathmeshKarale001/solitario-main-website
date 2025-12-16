import { NextRequest, NextResponse } from 'next/server';

const DELHIVERY_API_KEY = process.env.DELHIVERY_API_KEY;
const DELHIVERY_BASE_URL = 'https://track.delhivery.com';

// Get list of registered warehouses from Delhivery
export async function GET(request: NextRequest) {
  if (!DELHIVERY_API_KEY) {
    return NextResponse.json({
      success: false,
      error: 'Delhivery API key not configured',
    }, { status: 503 });
  }

  try {
    // Try to fetch warehouses from Delhivery API
    const response = await fetch(`${DELHIVERY_BASE_URL}/api/backend/clientwarehouse/`, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${DELHIVERY_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    const text = await response.text();
    
    // Check if response is JSON
    try {
      const data = JSON.parse(text);
      return NextResponse.json({
        success: true,
        warehouses: data,
      });
    } catch {
      // Response is not JSON (likely HTML error page)
      return NextResponse.json({
        success: false,
        error: 'Could not fetch warehouses. The API may require browser authentication.',
        hint: 'Please check your Delhivery dashboard manually: Settings → Warehouses/Pickup Locations',
        rawResponse: text.substring(0, 500),
      });
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch warehouses',
    }, { status: 500 });
  }
}

// Register a new warehouse/pickup location
export async function POST(request: NextRequest) {
  if (!DELHIVERY_API_KEY) {
    return NextResponse.json({
      success: false,
      error: 'Delhivery API key not configured',
    }, { status: 503 });
  }

  try {
    const body = await request.json();
    const { name, address, city, state, pin, phone } = body;

    if (!name || !address || !city || !pin || !phone) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: name, address, city, pin, phone',
      }, { status: 400 });
    }

    // Register warehouse with Delhivery
    const warehouseData = {
      name: name,
      registered_name: name,
      address: address,
      city: city,
      state: state || 'Maharashtra',
      country: 'India',
      pin: pin,
      phone: phone,
    };

    const response = await fetch(`${DELHIVERY_BASE_URL}/api/backend/clientwarehouse/create/`, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${DELHIVERY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(warehouseData),
    });

    const text = await response.text();
    
    try {
      const data = JSON.parse(text);
      
      if (response.ok) {
        return NextResponse.json({
          success: true,
          message: 'Warehouse registered successfully',
          warehouse: data,
        });
      } else {
        return NextResponse.json({
          success: false,
          error: data.error || data.message || 'Failed to register warehouse',
          details: data,
        }, { status: response.status });
      }
    } catch {
      return NextResponse.json({
        success: false,
        error: 'Unexpected response from Delhivery',
        rawResponse: text.substring(0, 500),
      }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to register warehouse',
    }, { status: 500 });
  }
}
