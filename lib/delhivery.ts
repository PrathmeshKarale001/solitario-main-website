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
    shipment_length?: number; // Box length in cm
    shipment_width?: number;  // Box width in cm
    shipment_height?: number; // Box height in cm
    weight?: number; // Weight in grams
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
// Set manifestLater=true to create order without immediate manifest (can be manifested later via dashboard)
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
  paymentMode: 'Prepaid' | 'COD' = 'Prepaid',
  options: {
    manifestLater?: boolean; // If true, order is created but not manifested immediately
    shippingMode?: 'Surface' | 'Express';
    weight?: number; // Weight in grams (leave undefined to let Delhivery calculate)
    boxDimensions?: { length: number; width: number; height: number }; // Box size in cm
  } = {}
): Promise<{ success: boolean; waybill?: string; error?: string; manifested?: boolean }> {
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

    const { 
      manifestLater = false, 
      shippingMode = 'Surface', 
      weight, // Don't set default - let Delhivery calculate if not provided
      boxDimensions = { length: 20, width: 20, height: 8 } // Default box size: 20x20x8 cm
    } = options;

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
          shipping_mode: shippingMode,
          // Box dimensions (20x20x8 cm default)
          shipment_length: boxDimensions.length,
          shipment_width: boxDimensions.width,
          shipment_height: boxDimensions.height,
          // Weight is optional - Delhivery will calculate if not provided
          ...(weight ? { weight } : {}),
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

    // Delhivery API endpoints:
    // /api/cmu/create.json - Creates order (waybill generated, ready for manifest)
    // /api/p/packing_slip - For manifest/pickup scheduling (done separately by management)
    // 
    // Orders created via create.json will appear in "Pending AWB" or "Ready to Ship" 
    // in Delhivery dashboard. Management can then manifest them when ready.
    const endpoint = `${DELHIVERY_BASE_URL}/api/cmu/create.json`;

    console.log(`Calling Delhivery API: ${endpoint}`);
    console.log(`Shipment data:`, JSON.stringify(shipmentData, null, 2));

    const response = await fetch(endpoint, {
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
      const status = result.packages[0].status;
      console.log(`Delhivery shipment created: Waybill ${waybill} for Order ${orderId} (Status: ${status})`);
      
      // If manifestLater is true, the order is created but needs manual manifest via Delhivery dashboard
      // The waybill is generated but pickup won't be scheduled until manifest
      return { 
        success: true, 
        waybill,
        manifested: !manifestLater // If manifestLater=false, it's manifested immediately
      };
    } else {
      // Log full error details including remarks array
      const packageError = result.packages?.[0];
      const remarksArray = packageError?.remarks;
      const remarksStr = Array.isArray(remarksArray) ? remarksArray.join(', ') : remarksArray;
      
      console.error('Delhivery shipment creation failed:', JSON.stringify(result, null, 2));
      console.error('Package remarks:', remarksStr);
      
      return { 
        success: false, 
        error: remarksStr || result.rmk || 'Failed to create shipment' 
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

// Check pincode serviceability with ETA
export async function checkPincodeServiceability(
  pincode: string
): Promise<{ success: boolean; serviceable?: boolean; cod?: boolean; prepaid?: boolean; eta?: string; error?: string }> {
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
      
      // Calculate ETA based on distance and service type
      // For lab grown diamond jewelry, we typically use Express service
      const currentDate = new Date();
      let etaDays = 2; // Default 2 days for Express
      
      // Adjust ETA based on location (rough estimation)
      const state = pincodeData.state_code;
      if (['MH', 'GJ', 'MP'].includes(state)) {
        etaDays = 1; // Same region - 1 day
      } else if (['DL', 'UP', 'HR', 'PB', 'RJ'].includes(state)) {
        etaDays = 2; // North India - 2 days
      } else if (['KA', 'TN', 'AP', 'TS', 'KL'].includes(state)) {
        etaDays = 3; // South India - 3 days
      } else if (['WB', 'OR', 'JH', 'BR', 'AS'].includes(state)) {
        etaDays = 3; // East India - 3 days
      } else {
        etaDays = 4; // Remote areas - 4 days
      }
      
      const etaDate = new Date(currentDate);
      etaDate.setDate(currentDate.getDate() + etaDays);
      
      const etaString = etaDate.toLocaleDateString('en-IN', {
        weekday: 'short',
        day: 'numeric',
        month: 'short'
      });
      
      return {
        success: true,
        serviceable: true,
        cod: pincodeData.cod === 'Y',
        prepaid: pincodeData.pre_paid === 'Y',
        eta: `Expected by ${etaString}`,
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
