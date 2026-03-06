import requests
from requests.auth import HTTPBasicAuth

def test_get_shipping_track_api_should_require_waybill_parameter():
    base_url = "http://localhost:3000"
    endpoint = "/api/shipping/track"
    url = base_url + endpoint
    auth = HTTPBasicAuth("test", "Test@EOD")
    headers = {
        "Accept": "application/json"
    }
    try:
        response = requests.get(url, headers=headers, auth=auth, timeout=30)
    except requests.RequestException as e:
        assert False, f"Request failed: {e}"

    assert response.status_code == 400, f"Expected status code 400 but got {response.status_code}"
    try:
        json_data = response.json()
    except ValueError:
        assert False, "Response is not valid JSON"

    # Validate error message presence
    error_message_keys = ['error', 'message', 'detail']
    error_found = any(key in json_data and isinstance(json_data[key], str) and json_data[key].strip() for key in error_message_keys)
    assert error_found, f"Expected error message in response JSON keys {error_message_keys}, got: {json_data}"

test_get_shipping_track_api_should_require_waybill_parameter()