import requests
from requests.auth import HTTPBasicAuth

def test_get_products_api_should_return_filtered_and_paginated_results():
    base_url = "http://localhost:3000"
    endpoint = "/api/products"
    url = base_url + endpoint

    auth = HTTPBasicAuth('test', 'Test@EOD')
    headers = {
        "Accept": "application/json"
    }

    # Define query params with category filters, limit, and collection filtering
    params = {
        "category": "rings,necklaces",  # example categories filter
        "limit": "5",
        "collection": "best-sellers"
    }

    try:
        response = requests.get(url, headers=headers, auth=auth, params=params, timeout=30)
        response.raise_for_status()
    except requests.exceptions.RequestException as e:
        assert False, f"Request failed: {e}"

    # Validate response status code
    assert response.status_code == 200, f"Expected status code 200, got {response.status_code}"

    try:
        data = response.json()
    except Exception as e:
        assert False, f"Response is not valid JSON: {e}"

    # Validate data structure
    assert isinstance(data, dict), "Response JSON should be an object"
    assert "products" in data, "Response should contain 'products' key"

    products = data["products"]
    assert isinstance(products, list), "'products' should be a list"

    # Check pagination keys if present
    if "pagination" in data:
        pagination = data["pagination"]
        assert isinstance(pagination, dict), "'pagination' should be a dict"
        assert "limit" in pagination, "'pagination' should contain 'limit'"
        assert pagination["limit"] == int(params["limit"]), "Returned limit should match requested limit"

    # Verify each product has correct structure and GIFT products are excluded
    for product in products:
        assert isinstance(product, dict), "Each product should be a dictionary"
        # Typical required keys: id, name, category, collection, price, etc.
        required_keys = ["id", "name", "category", "collection", "price"]
        for key in required_keys:
            assert key in product, f"Product missing required key: {key}"

        # Check that product category or name does not indicate a GIFT product
        prod_name = product.get("name", "").lower()
        prod_category = product.get("category", "").lower() if isinstance(product.get("category"), str) else ""
        prod_collection = product.get("collection", "").lower() if isinstance(product.get("collection"), str) else ""

        contains_gift = any(keyword in prod_name for keyword in ["gift"]) or \
                        any(keyword in prod_category for keyword in ["gift"]) or \
                        any(keyword in prod_collection for keyword in ["gift"])
        assert not contains_gift, "GIFT products should be excluded from results"

    # Optionally: Check that number of products does not exceed limit
    assert len(products) <= int(params["limit"]), f"Number of products exceeds requested limit {params['limit']}"

test_get_products_api_should_return_filtered_and_paginated_results()