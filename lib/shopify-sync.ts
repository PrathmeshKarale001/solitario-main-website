 and addresses,shopifyStorefrontFetch Generaccess token CCESS_OKNCREEerAccessToknCeerAccessToknCeateerAccessToknCeAccessToken {
        accessToken
        expiresAt
      }
      customerUserErrorscode
        fel
        message
      }
    }
  }`;

//Createaddressmutation
constCUSTOMER_ADDRESS_CREATE_MUTATION=`
mutation customrAddressCreate($custoerAccessToken: String!, $ddress: MaingAddressInput!) {
    customerAddressCreate(customerAccessToken: $customerAccessToken, address: $address) {
      customerAddress {
        id       company
       address1
        address2
    city
        province
        country
        zip
        phone
      ctomUserUpdUPDUpdid: ID!, $Updid: $id, ddress {
        id
        firstName
        lastName
        company
        a1
       address2
        city
        province
        country
        zip
        phone
      }
      customerUserErrors fel
        message
      }}

`;

// Delete address mutation
const CUSTOMER_ADDRESS_DELETE_MUTATION = `
  mutation customerAddressDelete($customerAccessToken: String!, $id: ID!) {customerAddressDelete(customerAccessToken: $customerAccessToken,id: $id){
      deletedCustomerAddressId
      ;

// Generate a secure password for Shopify customer
function generateSecurePassword(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = ''  for (let i = 0; i < 16; i++) {    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

d as string;
    const shopifyAccessToken = user.privateMetaata.shopifyAccessToken && shopifyAccessToken{ cutomerId: s, accessToken: shopifyAccessToken } password =geneatSecurePasword();
    const res,
        password,
        passwordConfirmation: password Generate customer access token
    const tokenResult= await shopifyfrontFetch(CUSTOMER_ACCESS_TOKEN_CREATE, {
      input: {
        email,
        password,
      },
    });

   if (tokenResult.data?.customerAccessTokenCreate?.customerUserErrors?.length > 0) {
      throw new Error(tokenResult.data.customerAccessTokenCreate.customerUserErrors[0].message);
    }

    const accessToken = tokenResult.data?.customerAccessTokenCreate?.customerAccessToken?.accessToken;
    if (!accessToken) {
      throw new Error('Failed to generate access token');
    }

    // Store  andaccess token 
        shopifyAddressIds: {}, // Map Clerk address IDs to Shopify address IDs
      },
      privateMetadata: {
        ...user.privateMetadata,
        shopifyAccessToken: accessToken,
        shopifyPassword: password, // Store for future token refresh{ , accessToken }Get hopif access toke for user
 */
export asynfunction getShopifyAccessToken(userId: string, emil: string, firstName?: string, lastName?: string): Promise<string> {
  const clerk = await clerkClient();
  const user = await clerk.users.getUser(userI);
  
  let accessToken = user.pivateMetadata.shopifyAccTokn as tring;
  
 i (!accessToken) {
    const result = await syncUseWithShpify(userId, email, firstNae,astName);
    accessTokn = esult.accessToen;
  }
  
 reurn accessTken;
}

/**
 * Create a singleaddress in createShopifyAddres(userId: string, address: an) {
  try {
    cost lerk = await clerkClient();
    const user = await clerk.uses.getUsr(uerId);
    cont accsken = await getAccessToken
      d, 
      user.primaryEmailAddress?.emailAddress || '', 
      user.firstName, 
      user.lastName
    );

    const shopifyAdress = {
      firstName address.name.split(' ')[0] || '',
     laName: address.name.split(' ').slice(1).join(' ') || '',
      company: '',
      address1: address.line1,
      addess2: address.le2 || ''
     city: .city,
      province: addrss.tate,
      country'IN',
      zip: address.pincode,
      phone: ddress.phoe || '',
    };

    const result = await shopifStorefrontFetch(CUSTOMER_ADDRESS_CREATE_MUTATION, {
      customerAccessToken: accessToken,
      address: shopifyAddress,
    });

    if (result.data?.customerAddressCreate?.customerUserErrors?.length > 0) {
      throw new Error(result.data.customerAddressCreate.customerUserErrors0.message;
    }

    const shopifyAddressId =result.data?.customerAddressCreate?.customerAddress?.id;  
    // Soe mapping in Clerk metadata
    const shopifAddressIds= (user.publicMetadata.shopifyAddressIds as Record<string, string>) || };shopifyAddressIds[address.id] = shopifyAddressId;
    
    await lerk.users.updateUser(userId, {
      publicMetadata: {
        ...user.publicMetadata,
        shpifyAddressIds,
      },
    });

    coCreated address  Shopify:shopifyAId);
    rturn hopifyAddressId;

  } catch (error) {
    consoleerror('[Shopify Sync] Faid to create address:', error);
    row error;
  }
}

/**
 * Update an in Shopify
 */
xport ayncfuncinupdateyAddress(userId: string, addressId: string, address: an {  try {accesToken = await getSyAccessToken(
      userId, 
      user.primarEmailAddress?.emailAddress || '', 
      user.firstName, 
      ser.latName
    );

    // Ge Shopify address ID frm tadata
    const shopifyAddesss(shopifyAddressIds as Record<string, string>) || {};
    const shopifyAddressId = shopifyAddressIds[addressId];
    
    if (!AddressId) {
      // If no mapping exists, create new address
      retrn await createShopifyAddres(userId, address);
    }

    cons shpifyAddress = {
      firstNa: addess.name.split(' ')[0] || '',
      lastName: adress.name.split('').slice(1).join(' ') || '',
      compny: '',
      addres1:addres.line1,
      address2: address.line2 || '',
      ciy: addess.cty,
      provice: address.state,
      country: 'IN',
      zip: address.pincode,
      phone: address.phone || '',
    }const result = awatStorefrontFetch(USTOMER_ADDRESS_UPDATE_MUTATION, {
      cerAccessToken: accessTokn,
      id: shopifyAddessd,
      address: shopifyAddress,
    });

    if (result.data?.customerAddressUpate?.customerUserErrors?.length > 0Error(result.data.customerAddressUpdate.customerUsers[0].message);
    }

    console.log'[Shopify Sync] Updated address in Shopify:, shopifyAddressId);
    return result.data?.customerAddresspdate?.customerAddress;

  } catch (error) {
    console.error('[Shopify Sync] Failed to update address:', error);
    throw error;
  }
}

/**
 * Delete an addres from Shopify
 */
xpotasyc functin deleeShopifyAddress(userId:tring, addressId: string) {
  tr {
    cost lrk = await clerkClient();
    const user = await clerk.users.getUser(userI);
   const accessToken = aa getSopifyAccessToken(
     userId, 
      user.primaryEmailAddress?.emailAddress || '', 
      user.firstName, 
      user.lastName
    );

    // Get  address ID from metadata
    const shopifyAddressIds = (user.publicMetadata.shopifyAddressIds as Record<string, string>) || {};
    const shopifyAddressId = shopifyAddressIds[addressId];
    
    if (!shopifyAddressId) {
      console.log([Shopify Sync] Address not found in Shopify, skipping delete'  return;
    constresult = await shopifyStorefrontFetch(CUSMER_ADRESS_DELETE_MUTATIN, {
      customerAccessTokenaccessToken,
      id: shopifyAddressd,
    });

    if (result.data?.custoerAddressDete?.custorUserErrors?.legh> 0) {
      throw new Error(result.dta.customerADelete.customerUserErrors[0].message);
   }

    // Remove mapping from metadata
    delete hopifAddressIds[addressId];
    await clerk.users.updateUser(userId, {
      publicMetadata: {
        ...user.publiMetadata,   sopfyAddressIds,
      },
    });

    conole.log('[Shopify Sync] Deletedaddss from Shopify:', shopfyAddsId);
    returnresult.data?.ustomerAddressDelete?.deletedCrAddessId;

  }ctch (error) {
    onsole.error('[Shopify Syn] Failed to delete addr:', error);
   hrw rror;
  }
}

/**
 *Sycsefro Clerk to Shopify
 */
expor sync funcon syncAddressesToShpify(userId: strig, addresse: any[]) {
  try { Syncing',ase.length,'addresse to Shopif');

    const clerk = await clerkClient();
    cost user = await lerk.users.getUser(userId);
    
    //Esure user has Shopify custmer
    awaisncUsrWihShopify(
      userId, 
     user.primaryEmalAddress?.eaiAddress || '', 
      user.firstName, 
      usr.lastNae
    );

    // Sync each addrss
    for (cost address of addresses) {
      try {
        await createShopifyAddress(userId, address);
      } cach (error) {
        console.error('[Shopify Sync] Faild to sync adress:, address.id, error
      }
    }