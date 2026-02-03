import { NextResponse } from 'next/server';

// India Post API for PIN code lookup
// API Documentation: https://www.postalpincode.in/Api-Details

interface PostOffice {
  Name: string;
  Description: string | null;
  BranchType: string;
  DeliveryStatus: string;
  Circle: string;
  District: string;
  Division: string;
  Region: string;
  Block: string;
  State: string;
  Country: string;
  Pincode: string;
}

interface IndiaPostResponse {
  Message: string;
  Status: string;
  PostOffice: PostOffice[] | null;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const pincode = searchParams.get('pincode');

  if (!pincode) {
    return NextResponse.json(
      { success: false, error: 'PIN code is required' },
      { status: 400 }
    );
  }

  // Validate PIN code format (6 digits)
  if (!/^\d{6}$/.test(pincode)) {
    return NextResponse.json(
      { success: false, error: 'Invalid PIN code format. Must be 6 digits.' },
      { status: 400 }
    );
  }

  try {
    // Fetch from India Post API
    const response = await fetch(
      `https://api.postalpincode.in/pincode/${pincode}`,
      {
        headers: {
          'Accept': 'application/json',
        },
        // Cache for 1 day since PIN code data doesn't change often
        next: { revalidate: 86400 },
      }
    );

    if (!response.ok) {
      throw new Error(`India Post API returned ${response.status}`);
    }

    const data: IndiaPostResponse[] = await response.json();

    if (!data || data.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No data received from India Post API' },
        { status: 404 }
      );
    }

    const result = data[0];

    if (result.Status !== 'Success' || !result.PostOffice || result.PostOffice.length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid PIN code or no data found',
          message: result.Message 
        },
        { status: 404 }
      );
    }

    // Get the first post office (usually the main one)
    const postOffice = result.PostOffice[0];
    
    // Get all unique areas/localities for this PIN code
    const areas = result.PostOffice.map(po => po.Name);

    return NextResponse.json({
      success: true,
      pincode: pincode,
      city: postOffice.District,
      state: postOffice.State,
      district: postOffice.District,
      region: postOffice.Region,
      country: postOffice.Country,
      areas: areas, // All localities/areas in this PIN code
      postOffices: result.PostOffice.map(po => ({
        name: po.Name,
        branchType: po.BranchType,
        deliveryStatus: po.DeliveryStatus,
      })),
    });
  } catch (error) {
    console.error('PIN code lookup error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch PIN code details. Please try again or enter manually.' 
      },
      { status: 500 }
    );
  }
}
