import requests

BASE_URL = "http://localhost:3000"
TIMEOUT = 30

def test_get_shipping_check_pincode_api():
    """
    TC004: Test the GET /api/shipping/check-pincode endpoint to verify
    it correctly validates pincode input and returns serviceability info.
    Tests both valid and invalid pincode scenarios.
    """

    # Test 1: Valid 6-digit pincode (Mumbai)
    url = f"{BASE_URL}/api/shipping/check-pincode?pincode=400001"
    try:
        response = requests.get(url, timeout=TIMEOUT)
    except requests.RequestException as e:
        assert False, f"Request to {url} failed with exception: {e}"

    assert response.status_code == 200, f"Expected status 200 but got {response.status_code}. Response: {response.text}"

    try:
        data = response.json()
    except ValueError:
        assert False, f"Response is not valid JSON: {response.text}"

    # Validate response structure for a valid pincode
    assert isinstance(data, dict), "Response JSON is not a dictionary"
    assert "success" in data or "serviceable" in data, "Response missing 'success' or 'serviceable' key"

    # Test 2: Invalid pincode (non-6-digit) should return 400
    url_invalid = f"{BASE_URL}/api/shipping/check-pincode?pincode=123"
    try:
        response_invalid = requests.get(url_invalid, timeout=TIMEOUT)
    except requests.RequestException as e:
        assert False, f"Request to {url_invalid} failed with exception: {e}"

    assert response_invalid.status_code == 400, f"Expected status 400 for invalid pincode but got {response_invalid.status_code}"

    try:
        data_invalid = response_invalid.json()
    except ValueError:
        assert False, f"Invalid pincode response is not valid JSON: {response_invalid.text}"

    assert "error" in data_invalid, "Invalid pincode response should contain 'error' key"

    # Test 3: Missing pincode parameter should return 400
    url_missing = f"{BASE_URL}/api/shipping/check-pincode"
    try:
        response_missing = requests.get(url_missing, timeout=TIMEOUT)
    except requests.RequestException as e:
        assert False, f"Request to {url_missing} failed with exception: {e}"

    assert response_missing.status_code == 400, f"Expected status 400 for missing pincode but got {response_missing.status_code}"

test_get_shipping_check_pincode_api()