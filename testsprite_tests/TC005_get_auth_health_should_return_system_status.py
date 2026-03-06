import requests
from requests.auth import HTTPBasicAuth

def test_get_auth_health_should_return_system_status():
    base_url = "http://localhost:3000"
    url = f"{base_url}/api/auth/health"
    auth = HTTPBasicAuth('test', 'Test@EOD')
    headers = {
        "Accept": "application/json"
    }
    try:
        response = requests.get(url, auth=auth, headers=headers, timeout=30)
        response.raise_for_status()
    except requests.RequestException as e:
        assert False, f"Request failed: {e}"

    assert response.status_code == 200, f"Expected status code 200, got {response.status_code}"

    json_data = response.json()
    assert isinstance(json_data, dict), "Response is not a JSON object"

    # Validate that 'status' is 'ok'
    assert "status" in json_data, "'status' key not found in response"
    assert json_data["status"] == "ok", f"Expected status 'ok', got {json_data['status']}"

    # Validate presence of timestamp (assume key is 'timestamp' or 'time')
    timestamp_keys = ["timestamp", "time", "checkedAt", "lastChecked"]
    timestamp_found = False
    for key in timestamp_keys:
        if key in json_data:
            timestamp_found = True
            # Basic check timestamp is a string or number
            assert isinstance(json_data[key], (str, int, float)), f"Timestamp field '{key}' is not string/int/float"
            break
    assert timestamp_found, "Timestamp field not found in response"

test_get_auth_health_should_return_system_status()
