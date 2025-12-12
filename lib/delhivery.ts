// Delhivery Shipping Integration
// API Documentation: https://developer.delhivery.com/

const DELHIVERY_API_KEY = process.env.DELHIVERY_API_KEY;
const DELHIVERY_BASE_URL = 'https://track.delhivery.com';

// Warehouse/Pickup location details - Update with your actual warehouse
// TODO: Update these with actual Solitario warehouse details
const WAREHOUSE = {
  name: process.env.DELHIVERY_WAREHOUSE_NAME || 'Solitario Warehouse',
  add: process.env.DELHIVERY_WAREHOUSE_ADDRESS || 'Your Warehouse Address',
  city: process.env.DELHIVERY_WAREHOUSE_CITY || 'Pune',
  state: process.env.DELHIVERY_WAREHOUSE_STATE || 'Maharashtra',
  country: 'India',
  pin: process.env.DELHIVERY_WAREHOUSE_PIN || '411001',
  phone: process.env.DELHIVERY_WAREHOUSE_PHONE || '9999999999',
};

export interface DelhiveryShipmentItem {
  name: string;
  sku: string;
  units: number;
  selling_price: number;
  discount: number;
  tax: number;
  hsn_code?: string;
}

export interface DelhiveryShipmentRequest {
  shipments: Array<{
    name: string;
    add: string;
    city: string;
    state: string;
    country: string;
    pin: string;
    phone: string;
    order: string; // Order ID
    payment_mode: 'Prepaid' | 'COD';
    return_pin: string;
    return_city: string;
    return_phone: string;
    return_add: string;
    return_state: string;
    return_country: string;
    return_name: string;
    products_desc: string;
    hsn_code?: string;
    cod_amount: number;
    order_date: string;
    total_amount: number;
    seller_add: string;
    seller_name: string;
    seller_inv?: string;
    quantity: number;
    waybill?: string;
    shipment_width?: number;
    shipment_height?: number;
    weight?: number;
    seller_gst_tin?: string;
    shipping_mode?: 'Surface' | 'Express';
    address_type?: 'home' | 'office';
  }>;
  pickup_location: {
    name: string;
    add: string;
    city: string;
    pin: string;
    state: string;
    country: string;
    phone: string;
  };
}

export interface DelhiveryResponse {
  success: boolean;
  rmk?: string;
  upload_wbn?: string;
  packages?: Array<{
    waybill: string;
    refnum: string;
    status: string;
    remarks: string;
  }>;
  cash_pickups_count?: number;
  package_count?: number;
  cod_count?: number;
  prepaid_count?: number;
}

export interface TrackingResponse {
  ShipmentData: Array<{
    Shipment: {
      Status: {
        Status: string;
        StatusLocation: string;
        StatusDateTime: string;
        Instructions: string;
      };
      Scans: Array<{
        ScanDetail: {
          ScanDateTime: string;
          ScanType: string;
          Scan: string;
          StatusDateTime: string;
          ScannedLocation: string;
          Instructions: string;
        };
      }>;
      PickUpDate: string;
      Destination: string;
      DestRecievedBy: string;
      Origin: string;
      CODAmount: number;
      ReferenceNo: string;
    };
  }>;
}

// Check if Delhivery is configured
export const isDelhiveryConfigured = (): boolean => {
  return !!DELHIVERY_API_KEY;
};

// Create a shipment in Delhivery
export async function createDelhiveryShipment(
  orderId: string,
  customer: {
    name: string;
    phone: string;
    email: string;
    address: {
      line1: string;
      line2?: string;
      city: string;
      state: string;
      pincode: string;
      country: string;
    };
  },
  items: Array<{
    name: string;
    sku: string;
    quantity: number;
    price: number;
  }>,
  orderTotal: number,
  paymentMode: 'Prepaid' | 'COD' = 'Prepaid'
): Promise<{ success: boolean; waybill?: string; error?: string }> {
  if (!DELHIVERY_API_KEY) {
    console.error('Delhivery API key not configured');
    return { success: false, error: 'Shipping service not configured' };
  }

  try {
    // Prepare product description with SKUs
    const productDesc = items
      .map(item => `${item.name} (SKU: ${item.sku}) x${item.quantity}`)
      .join(', ');

    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

    const shipmentData: DelhiveryShipmentRequest = {
      shipments: [
        {
          name: customer.name,
          add: `${customer.address.line1}${customer.address.line2 ? ', ' + customer.address.line2 : ''}`,
          city: customer.address.city,
          state: customer.address.state,
          country: customer.address.country || 'India',
          pin: customer.address.pincode,
          phone: customer.phone.replace(/\D/g, '').slice(-10), // Last 10 digits
          order: orderId,
          payment_mode: paymentMode,
          return_pin: WAREHOUSE.pin,
          return_city: WAREHOUSE.city,
          return_phone: WAREHOUSE.phone,
          return_add: WAREHOUSE.add,
          return_state: WAREHOUSE.state,
          return_country: WAREHOUSE.country,
          return_name: WAREHOUSE.name,
          products_desc: productDesc,
          cod_amount: paymentMode === 'COD' ? orderTotal : 0,
          order_date: new Date().toISOString().split('T')[0],
          total_amount: orderTotal,
          seller_add: WAREHOUSE.add,
          seller_name: WAREHOUSE.name,
          quantity: totalQuantity,
          shipping_mode: 'Surface', // or 'Express' for faster delivery
          weight: 100, // Weight in grams - adjust based on product
        },
      ],
      pickup_location: {
        name: WAREHOUSE.name,
        add: WAREHOUSE.add,
        city: WAREHOUSE.city,
        pin: WAREHOUSE.pin,
        state: WAREHOUSE.state,
        country: WAREHOUSE.country,
        phone: WAREHOUSE.phone,
      },
    };

    // Format data for Delhivery API
    const formData = `format=json&data=${encodeURIComponent(JSON.stringify(shipmentData))}`;

    const response = await fetch(`${DELHIVERY_BASE_URL}/api/cmu/create.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Token ${DELHIVERY_API_KEY}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Delhivery API error:', response.status, errorText);
      return { success: false, error: `Shipping API error: ${response.status}` };
    }

    const result: DelhiveryResponse = await response.json();

    if (result.success && result.packages && result.packages.length > 0) {
      const waybill = result.packages[0].waybill;
      console.log(`Delhivery shipment created: Waybill ${waybill} for Order ${orderId}`);
      return { success: true, waybill };
    } else {
      console.error('Delhivery shipment creation failed:', result);
      return { 
        success: false, 
        error: result.rmk || result.packages?.[0]?.remarks || 'Failed to create shipment' 
      };
    }
  } catch (error) {
    console.error('Error creating Delhivery shipment:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

// Track a shipment by waybill number
export async function trackDelhiveryShipment(
  waybill: string
): Promise<{ success: boolean; tracking?: TrackingResponse; error?: string }> {
  if (!DELHIVERY_API_KEY) {
    return { success: false, error: 'Shipping service not configured' };
  }

  try {
    const response = await fetch(
      `${DELHIVERY_BASE_URL}/api/v1/packages/json/?waybill=${waybill}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Token ${DELHIVERY_API_KEY}`,
        },
      }
    );

    if (!response.ok) {
      return { success: false, error: `Tracking API error: ${response.status}` };
    }

    const result: TrackingResponse = await response.json();
    return { success: true, tracking: result };
  } catch (error) {
    console.error('Error tracking Delhivery shipment:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

// Check pincode serviceability
export async function checkPincodeServiceability(
  pincode: string
): Promise<{ success: boolean; serviceable?: boolean; cod?: boolean; prepaid?: boolean; error?: string }> {
  if (!DELHIVERY_API_KEY) {
    return { success: false, error: 'Shipping service not configured' };
  }

  try {
    const response = await fetch(
      `${DELHIVERY_BASE_URL}/c/api/pin-codes/json/?filter_codes=${pincode}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Token ${DELHIVERY_API_KEY}`,
        },
      }
    );

    if (!response.ok) {
      return { success: false, error: `Pincode API error: ${response.status}` };
    }

    const result = await response.json();
    
    if (result.delivery_codes && result.delivery_codes.length > 0) {
      const pincodeData = result.delivery_codes[0].postal_code;
      return {
        success: true,
        serviceable: true,
        cod: pincodeData.cod === 'Y',
        prepaid: pincodeData.pre_paid === 'Y',
      };
    }

    return { success: true, serviceable: false };
  } catch (error) {
    console.error('Error checking pincode serviceability:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

// Cancel a shipment
export async function cancelDelhiveryShipment(
  waybill: string
): Promise<{ success: boolean; error?: string }> {
  if (!DELHIVERY_API_KEY) {
    return { success: false, error: 'Shipping service not configured' };
  }

  try {
    const response = await fetch(
      `${DELHIVERY_BASE_URL}/api/p/edit`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Token ${DELHIVERY_API_KEY}`,
        },
        body: `waybill=${waybill}&cancellation=true`,
      }
    );

    if (!response.ok) {
      return { success: false, error: `Cancel API error: ${response.status}` };
    }

    return { success: true };
  } catch (error) {
    console.error('Error cancelling Delhivery shipment:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

// Generate shipping label PDF URL
export function getShippingLabelUrl(waybill: string): string {
  return `${DELHIVERY_BASE_URL}/api/p/packing_slip?wbns=${waybill}&pdf=true`;
}
