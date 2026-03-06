import requests
from requests.auth import HTTPBasicAuth

BASE_URL = "http://localhost:3000"
AUTH = HTTPBasicAuth("test", "Test@EOD")
TIMEOUT = 30

def test_get_product_handle_api_should_return_product_details_or_404():
    # Known valid handle to test the success path; we need to find one by querying /api/products
    # We'll get one product handle from the products list endpoint to ensure a valid handle for the test.
    try:
        resp_products = requests.get(f"{BASE_URL}/api/products", auth=AUTH, timeout=TIMEOUT)
        resp_products.raise_for_status()
        products_data = resp_products.json()
        assert isinstance(products_data, list) or ("products" in products_data and isinstance(products_data["products"], list))
        # Extract handle from first product found
        if isinstance(products_data, list):
            products = products_data
        else:
            products = products_data.get("products", [])
        assert len(products) > 0, "No products found to test valid handle"

        valid_handle = products[0].get("handle")
        assert isinstance(valid_handle, str) and valid_handle != ""

        # Test valid handle returns detailed product info with correct keys
        resp_valid = requests.get(f"{BASE_URL}/api/products/{valid_handle}", auth=AUTH, timeout=TIMEOUT)
        resp_valid.raise_for_status()
        product_detail = resp_valid.json()
        # Verify response keys according to update: product details should have expected keys
        # We will check for presence of at least some common keys in product detail response
        expected_keys = {"id", "title", "handle", "description", "variants", "images", "price"}
        assert any(k in product_detail for k in expected_keys), "Response missing expected product detail keys"
        assert product_detail.get("handle") == valid_handle

    except requests.HTTPError as e:
        assert False, f"Failed to get valid product handle info: {e}"
    except Exception as e:
        assert False, f"Unexpected error during valid handle test: {e}"

    # Test invalid handle returns 404 status code
    invalid_handle = "nonexistent-handle-1234567890"
    try:
        resp_invalid = requests.get(f"{BASE_URL}/api/products/{invalid_handle}", auth=AUTH, timeout=TIMEOUT)
        # We expect a 404 status code, so raise_for_status() should raise an HTTPError; if not, fail
        if resp_invalid.status_code == 404:
            # Expected outcome
            pass
        else:
            assert False, f"Expected 404 for invalid handle but got {resp_invalid.status_code}"
    except requests.HTTPError as err:
        if err.response.status_code == 404:
            pass  # Expected
        else:
            assert False, f"Unexpected HTTP error code for invalid handle: {err.response.status_code}"
    except Exception as e:
        assert False, f"Unexpected error during invalid handle test: {e}"

test_get_product_handle_api_should_return_product_details_or_404()