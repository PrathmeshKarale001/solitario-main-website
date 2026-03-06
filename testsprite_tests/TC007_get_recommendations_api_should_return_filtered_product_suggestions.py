import requests
from requests.auth import HTTPBasicAuth

def test_get_recommendations_api_should_return_filtered_product_suggestions():
    base_url = "http://localhost:3000"
    endpoint = "/api/recommendations"
    auth = HTTPBasicAuth("test", "Test@EOD")
    timeout = 30

    params = {
        "maxPrice": "5000",
        "limit": "10",
        "category": "ring"
    }
    headers = {
        "Accept": "application/json"
    }

    try:
        response = requests.get(
            f"{base_url}{endpoint}",
            params=params,
            headers=headers,
            auth=auth,
            timeout=timeout
        )
    except requests.RequestException as e:
        assert False, f"Request to {endpoint} failed: {e}"

    assert response.status_code == 200, f"Expected status 200, got {response.status_code}"

    try:
        data = response.json()
    except ValueError:
        assert False, "Response is not valid JSON"

    assert isinstance(data, list), "Response data should be a list"
    assert len(data) <= int(params["limit"]), f"Returned more items than limit {params['limit']}"

    # Check product structure keys for each suggestion
    required_keys = {"id", "name", "price", "category", "image"}
    for product in data:
        assert isinstance(product, dict), "Each product should be a dictionary"
        assert required_keys.issubset(product.keys()), f"Product missing required keys: {required_keys - product.keys()}"
        assert isinstance(product["price"], (int, float)), "Product price should be a number"
        assert product["category"].lower() == params["category"].lower(), "Product category does not match filter"
        assert product["price"] <= float(params["maxPrice"]), "Product price exceeds maxPrice filter"

    # Check if the product suggestions are shuffled - simple heuristic:
    # Fetch twice and compare order; order should differ in at least one position or length < 2
    try:
        response2 = requests.get(
            f"{base_url}{endpoint}",
            params=params,
            headers=headers,
            auth=auth,
            timeout=timeout
        )
        response2.raise_for_status()
        data2 = response2.json()
    except requests.RequestException as e:
        assert False, f"Second request to {endpoint} failed: {e}"
    except ValueError:
        assert False, "Second response is not valid JSON"

    if len(data) > 1 and len(data2) > 1 and len(data) == len(data2):
        same_order = all(p1["id"] == p2["id"] for p1, p2 in zip(data, data2))
        assert not same_order, "Product suggestions appear not to be shuffled (same order in consecutive responses)"

test_get_recommendations_api_should_return_filtered_product_suggestions()