import requests
from requests.auth import HTTPBasicAuth

BASE_URL = "http://localhost:3000"
AUTH = HTTPBasicAuth("test", "Test@EOD")
TIMEOUT = 30

def test_get_shipping_check_pincode_should_validate_and_return_serviceability():
    url = f"{BASE_URL}/api/shipping/check-pincode"
    headers = {
        "Accept": "application/json"
    }

    # Test with valid 6-digit pincode
    valid_pincode = "560001"
    params_valid = {"pincode": valid_pincode}
    try:
        response_valid = requests.get(url, headers=headers, params=params_valid, auth=AUTH, timeout=TIMEOUT)
    except requests.RequestException as e:
        assert False, f"Request with valid pincode failed: {e}"

    assert response_valid.status_code == 200, f"Expected 200 for valid pincode, got {response_valid.status_code}"
    try:
        json_data = response_valid.json()
    except ValueError:
        assert False, "Response is not valid JSON for valid pincode request"

    # Check presence of keys indicating serviceability info (assuming keys like 'serviceable', 'estimated_delivery' may be present)
    assert isinstance(json_data, dict), "Response JSON should be an object"
    assert "serviceable" in json_data, "Response JSON missing 'serviceable' key for valid pincode"
    # serviceable should be bool
    assert isinstance(json_data["serviceable"], bool), "'serviceable' key should be a boolean"

    # Test with invalid pincode (less than 6 digits)
    invalid_pincode = "123"
    params_invalid = {"pincode": invalid_pincode}
    try:
        response_invalid = requests.get(url, headers=headers, params=params_invalid, auth=AUTH, timeout=TIMEOUT)
    except requests.RequestException as e:
        assert False, f"Request with invalid pincode failed: {e}"

    assert response_invalid.status_code == 400, f"Expected 400 for invalid pincode, got {response_invalid.status_code}"

    # Test with missing pincode param
    try:
        response_missing = requests.get(url, headers=headers, auth=AUTH, timeout=TIMEOUT)
    except requests.RequestException as e:
        assert False, f"Request with missing pincode failed: {e}"

    assert response_missing.status_code == 400, f"Expected 400 for missing pincode, got {response_missing.status_code}"

test_get_shipping_check_pincode_should_validate_and_return_serviceability()