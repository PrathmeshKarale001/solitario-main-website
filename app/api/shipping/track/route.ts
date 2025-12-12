import { NextRequest, NextResponse } from 'next/server';
import { trackDelhiveryShipment } from '@/lib/delhivery';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const waybill = searchParams.get('waybill');

    if (!waybill) {
      return NextResponse.json(
        { error: 'Waybill number is required' },
        { status: 400 }
      );
    }

    const result = await trackDelhiveryShipment(waybill);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to track shipment' },
        { status: 500 }
      );
    }

    // Format tracking data for frontend
    const shipmentData = result.tracking?.ShipmentData?.[0]?.Shipment;
    
    if (!shipmentData) {
      return NextResponse.json(
        { error: 'Shipment not found' },
        { status: 404 }
      );
    }

    const formattedTracking = {
      waybill,
      status: shipmentData.Status?.Status || 'Unknown',
      statusLocation: shipmentData.Status?.StatusLocation || '',
      statusDateTime: shipmentData.Status?.StatusDateTime || '',
      instructions: shipmentData.Status?.Instructions || '',
      origin: shipmentData.Origin || '',
      destination: shipmentData.Destination || '',
      pickupDate: shipmentData.PickUpDate || '',
      deliveredTo: shipmentData.DestRecievedBy || '',
      codAmount: shipmentData.CODAmount || 0,
      referenceNo: shipmentData.ReferenceNo || '',
      scans: shipmentData.Scans?.map((scan: any) => ({
        dateTime: scan.ScanDetail?.ScanDateTime || '',
        status: scan.ScanDetail?.Scan || '',
        location: scan.ScanDetail?.ScannedLocation || '',
        instructions: scan.ScanDetail?.Instructions || '',
      })) || [],
    };

    return NextResponse.json({
      success: true,
      tracking: formattedTracking,
    });
  } catch (error) {
    console.error('Error tracking shipment:', error);
    return NextResponse.json(
      { error: 'Failed to track shipment' },
      { status: 500 }
    );
  }
}
