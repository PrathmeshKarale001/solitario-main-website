import requests
from requests.auth import HTTPBasicAuth

def test_get_gift_product_api_should_return_gift_product_data():
    base_url = "http://localhost:3000"
    endpoint = "/api/products/gift"
    url = base_url + endpoint
    timeout = 30
    auth = HTTPBasicAuth('test', 'Test@EOD')
    headers = {
        "Accept": "application/json"
    }

    try:
        response = requests.get(url, headers=headers, auth=auth, timeout=timeout)
    except requests.RequestException as e:
        assert False, f"Request to {url} failed: {e}"

    assert response.status_code == 200, f"Expected status code 200 but got {response.status_code}"
    try:
        json_data = response.json()
    except ValueError:
        assert False, "Response is not valid JSON"

    # Check that response has required fields with fallback value checking
    # Name must be present and non-empty string (fallback may be empty string)
    assert "name" in json_data, "'name' field is missing in response"
    assert isinstance(json_data["name"], str), "'name' field is not a string"
    # It can be empty string as a fallback, so no assert on empty content

    # Image field must be present and string (fallback may be empty string)
    assert "image" in json_data, "'image' field is missing in response"
    assert isinstance(json_data["image"], str), "'image' field is not a string"

    # Price field must be present and a number (int or float)
    assert "price" in json_data, "'price' field is missing in response"
    price = json_data["price"]
    assert isinstance(price, (int, float)), "'price' field is not a number"

test_get_gift_product_api_should_return_gift_product_data()