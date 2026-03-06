import requests
from requests.auth import HTTPBasicAuth

BASE_URL = "http://localhost:3000"
ENDPOINT = "/api/products/by-handles"
AUTH = HTTPBasicAuth("test", "Test@EOD")
HEADERS = {"Content-Type": "application/json"}
TIMEOUT = 30

def test_post_products_by_handles_should_return_multiple_products_or_reject_invalid():
    # Prepare valid handles: using dummy product handles
    valid_handles = ["diamond-ring", "gold-necklace", "silver-bracelet"]
    payload_valid = {"handles": valid_handles}

    # Test valid handles - expect 200 with products, found, requested keys
    try:
        response = requests.post(
            BASE_URL + ENDPOINT,
            json=payload_valid,
            headers=HEADERS,
            auth=AUTH,
            timeout=TIMEOUT,
        )
        assert response.status_code == 200, "Expected status code 200 for valid handles"
        data = response.json()
        assert isinstance(data, dict), "Response should be a JSON object"
        assert "products" in data, "Response must contain 'products' key"
        assert "found" in data, "Response must contain 'found' key"
        assert "requested" in data, "Response must contain 'requested' key"
        assert isinstance(data["products"], list), "'products' must be a list"
        assert isinstance(data["found"], int), "'found' must be int"
        assert isinstance(data["requested"], int), "'requested' must be int"
        assert data["requested"] == len(valid_handles), "'requested' count mismatch"
        assert data["found"] <= data["requested"], "'found' cannot be greater than 'requested'"
    except requests.RequestException as e:
        assert False, f"Request failed for valid handles: {e}"

    # Test empty handles array - expect 400 Bad Request
    payload_empty = {"handles": []}
    try:
        response = requests.post(
            BASE_URL + ENDPOINT,
            json=payload_empty,
            headers=HEADERS,
            auth=AUTH,
            timeout=TIMEOUT,
        )
        assert response.status_code == 400, "Expected status code 400 for empty handles array"
    except requests.RequestException as e:
        assert False, f"Request failed for empty handles array: {e}"

    # Test more than 50 handles - expect 400 Bad Request
    long_handles = [f"handle{i}" for i in range(51)]
    payload_long = {"handles": long_handles}
    try:
        response = requests.post(
            BASE_URL + ENDPOINT,
            json=payload_long,
            headers=HEADERS,
            auth=AUTH,
            timeout=TIMEOUT,
        )
        assert response.status_code == 400, "Expected status code 400 for more than 50 handles"
    except requests.RequestException as e:
        assert False, f"Request failed for more than 50 handles: {e}"

test_post_products_by_handles_should_return_multiple_products_or_reject_invalid()