import requests
from requests.auth import HTTPBasicAuth

BASE_URL = "http://localhost:3000"
TIMEOUT = 30
AUTH = HTTPBasicAuth("test", "Test@EOD")
HEADERS = {
    "Accept": "application/json"
}

def test_get_dynamic_content_api_should_return_hero_sections_or_reject_invalid_type():
    # 1. Valid type=home-hero returns success with data array
    params_valid = {"type": "home-hero"}
    response_valid = requests.get(f"{BASE_URL}/api/dynamic-content", headers=HEADERS, auth=AUTH, params=params_valid, timeout=TIMEOUT)
    assert response_valid.status_code == 200, f"Expected 200 OK for valid type, got {response_valid.status_code}"
    json_valid = response_valid.json()
    assert isinstance(json_valid, dict), "Response is not a JSON object"
    assert "data" in json_valid, "'data' key missing in response"
    assert isinstance(json_valid["data"], list), "'data' is not a list"

    # 2. Missing type param returns 400
    response_missing = requests.get(f"{BASE_URL}/api/dynamic-content", headers=HEADERS, auth=AUTH, timeout=TIMEOUT)
    assert response_missing.status_code == 400, f"Expected 400 Bad Request when type param missing, got {response_missing.status_code}"

    # 3. Invalid type param returns 400
    params_invalid = {"type": "invalid-type"}
    response_invalid = requests.get(f"{BASE_URL}/api/dynamic-content", headers=HEADERS, auth=AUTH, params=params_invalid, timeout=TIMEOUT)
    assert response_invalid.status_code == 400, f"Expected 400 Bad Request for invalid type, got {response_invalid.status_code}"

test_get_dynamic_content_api_should_return_hero_sections_or_reject_invalid_type()