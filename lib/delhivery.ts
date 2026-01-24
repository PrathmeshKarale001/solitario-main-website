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

// Check pincode serviceability with ETA using Delhivery's EDD API
export async function checkPincodeServiceability(
  pincode: string
): Promise<{ success: boolean; serviceable?: boolean; cod?: boolean; prepaid?: boolean; eta?: string; error?: string }> {
  if (!DELHIVERY_API_KEY) {
    return { success: false, error: 'Shipping service not configured' };
  }

  try {
    // Step 1: Check if pincode is serviceable
    const serviceabilityResponse = await fetch(
      `${DELHIVERY_BASE_URL}/c/api/pin-codes/json/?filter_codes=${pincode}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Token ${DELHIVERY_API_KEY}`,
        },
      }
    );

    if (!serviceabilityResponse.ok) {
      return { success: false, error: `Pincode API error: ${serviceabilityResponse.status}` };
    }

    const serviceabilityResult = await serviceabilityResponse.json();
    
    if (serviceabilityResult.delivery_codes && serviceabilityResult.delivery_codes.length > 0) {
      const pincodeData = serviceabilityResult.delivery_codes[0].postal_code;
      
      // Step 2: Get ETA from Delhivery's EDD API
      // Calculate pickup date (2 days from now for processing time)
      const pickupDate = new Date();
      pickupDate.setDate(pickupDate.getDate() + 2);
      const pickupDateStr = pickupDate.toISOString().split('T')[0]; // YYYY-MM-DD format
      
      // Call Delhivery EDD API
      // API: /api/kinko/v1/invoice/charges/.json
      // Parameters: md (mode), ss (origin), d_pin (destination), cgm (weight), pt (prepaid/cod)
      const eddResponse = await fetch(
        `${DELHIVERY_BASE_URL}/api/kinko/v1/invoice/charges/.json?md=S&ss=Delivered&d_pin=${pincode}&o_pin=${WAREHOUSE.pin}&cgm=500&pt=Pre-paid`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Token ${DELHIVERY_API_KEY}`,
          },
        }
      );

      let etaString = '';
      
      if (eddResponse.ok) {
        const eddResult = await eddResponse.json();
        
        // Delhivery EDD API returns estimated delivery days
        if (eddResult[0]?.edd) {
          const eddDays = parseInt(eddResult[0].edd);
          const etaDate = new Date();
          etaDate.setDate(etaDate.getDate() + eddDays);
          
          etaString = etaDate.toLocaleDateString('en-IN', {
            weekday: 'short',
            day: 'numeric',
            month: 'short'
          });
        }
      }
      
      // Fallback: If EDD API fails, use realistic estimates
      if (!etaString) {
        // Calculate realistic ETA based on location and logistics
        // Includes: Order processing (2 days) + Transit time
        const currentDate = new Date();
        const state = pincodeData.state_code;
        const city = pincodeData.city?.toUpperCase() || '';
        
        // Processing time: 2 business days for order preparation and AWB approval
        const processingDays = 2;
        
        // Transit time based on actual logistics reality
        let transitDays = 3; // Default
        
        // Pune Metro Area (Same city/nearby) - 2-3 days total
        if (['411001', '411002', '411003', '411004', '411005', '411006', '411007', '411008', '411009', 
             '411011', '411012', '411013', '411014', '411015', '411016', '411017', '411018', '411019',
             '411020', '411021', '411022', '411023', '411024', '411025', '411026', '411027', '411028',
             '411029', '411030', '411031', '411032', '411033', '411034', '411035', '411036', '411037',
             '411038', '411039', '411040', '411041', '411042', '411043', '411044', '411045', '411046',
             '411047', '411048', '411051', '411052', '411057', '411058', '411060', '411061', '411062'].includes(pincode)) {
          transitDays = 1; // Local Pune - 1 day transit
        }
        // Mumbai Metro (Major hub, well connected) - 3-4 days
        else if (city.includes('MUMBAI') || ['400001', '400002', '400003', '400004', '400005', '400006', '400007', '400008', '400009', '400010',
                  '400011', '400012', '400013', '400014', '400015', '400016', '400017', '400018', '400019', '400020',
                  '400021', '400022', '400023', '400024', '400025', '400026', '400027', '400028', '400029', '400030',
                  '400031', '400034', '400035', '400036', '400037', '400038', '400039', '400042', '400043', '400049',
                  '400050', '400051', '400052', '400053', '400054', '400055', '400056', '400057', '400058', '400059',
                  '400060', '400061', '400062', '400063', '400064', '400065', '400066', '400067', '400068', '400069',
                  '400070', '400071', '400072', '400074', '400075', '400076', '400077', '400078', '400079', '400080',
                  '400081', '400082', '400083', '400084', '400085', '400086', '400087', '400088', '400089', '400090',
                  '400091', '400092', '400093', '400094', '400095', '400096', '400097', '400098', '400099', '400101',
                  '400102', '400103', '400104', '400105', '400106', '400107', '400108', '400109', '400110'].includes(pincode)) {
          transitDays = 2; // Mumbai - 2 days transit
        }
        // Major Maharashtra cities (Nashik, Nagpur, Aurangabad) - 4-5 days
        else if (state === 'MH' && (city.includes('NASHIK') || city.includes('NAGPUR') || city.includes('AURANGABAD'))) {
          transitDays = 3; // Major MH cities - 3 days transit
        }
        // Rest of Maharashtra (Amravati, Kolhapur, etc.) - 5-6 days
        else if (state === 'MH') {
          transitDays = 4; // Other MH cities - 4 days transit
        }
        // Gujarat (Ahmedabad, Surat, Vadodara) - 4-5 days
        else if (state === 'GJ') {
          transitDays = 3; // Gujarat - 3 days transit
        }
        // Madhya Pradesh (Indore, Bhopal) - 5-6 days
        else if (state === 'MP') {
          transitDays = 4; // MP - 4 days transit
        }
        // Delhi NCR (Major hub) - 4-5 days
        else if (['DL', 'HR'].includes(state) && (city.includes('DELHI') || city.includes('GURGAON') || city.includes('NOIDA') || city.includes('FARIDABAD'))) {
          transitDays = 3; // Delhi NCR - 3 days transit
        }
        // North India (UP, Punjab, Rajasthan, Haryana) - 5-7 days
        else if (['UP', 'PB', 'RJ', 'HR'].includes(state)) {
          transitDays = 5; // North India - 5 days transit
        }
        // South India metros (Bangalore, Chennai, Hyderabad) - 5-6 days
        else if (['KA', 'TN', 'TS'].includes(state) && (city.includes('BENGALURU') || city.includes('BANGALORE') || 
                  city.includes('CHENNAI') || city.includes('HYDERABAD'))) {
          transitDays = 4; // South metros - 4 days transit
        }
        // Rest of South India (Kerala, AP, TN interior) - 6-8 days
        else if (['KA', 'TN', 'AP', 'TS', 'KL'].includes(state)) {
          transitDays = 6; // South India - 6 days transit
        }
        // East India (Kolkata, Bhubaneswar) - 6-8 days
        else if (['WB', 'OR'].includes(state) && (city.includes('KOLKATA') || city.includes('BHUBANESWAR'))) {
          transitDays = 5; // East metros - 5 days transit
        }
        // Rest of East India (Bihar, Jharkhand, Assam) - 7-10 days
        else if (['WB', 'OR', 'JH', 'BR', 'AS'].includes(state)) {
          transitDays = 7; // East India - 7 days transit
        }
        // Remote areas (NE states, J&K, HP, Uttarakhand) - 8-12 days
        else {
          transitDays = 9; // Remote areas - 9 days transit
        }
        
        // Total ETA = Processing + Transit
        const totalDays = processingDays + transitDays;
        
        // Calculate delivery date (skip Sundays)
        const etaDate = new Date(currentDate);
        let daysAdded = 0;
        while (daysAdded < totalDays) {
          etaDate.setDate(etaDate.getDate() + 1);
          // Skip Sundays (day 0)
          if (etaDate.getDay() !== 0) {
            daysAdded++;
          }
        }
        
        etaString = etaDate.toLocaleDateString('en-IN', {
          weekday: 'short',
          day: 'numeric',
          month: 'short'
        });
      }
      
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
