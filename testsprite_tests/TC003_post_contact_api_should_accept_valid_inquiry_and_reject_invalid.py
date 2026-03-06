import requests
from requests.auth import HTTPBasicAuth

BASE_URL = "http://localhost:3000"
CONTACT_ENDPOINT = "/api/contact"
TIMEOUT = 30
AUTH = HTTPBasicAuth("test", "Test@EOD")
HEADERS = {
    "Content-Type": "application/json"
}


def test_post_contact_api_should_accept_valid_inquiry_and_reject_invalid():
    url = BASE_URL + CONTACT_ENDPOINT

    valid_payload = {
        "name": "John Doe",
        "email": "johndoe@example.com",
        "subject": "Inquiry about products",
        "message": "Hello, I am interested in your product range."
    }

    invalid_payloads = [
        {},  # empty payload
        {"name": "John Doe"},  # missing email, subject, message
        {"email": "invalidemail", "name": "John Doe", "subject": "Hi", "message": "Test"},  # invalid email format
        {"name": "John Doe", "email": "johndoe@example.com", "subject": "", "message": "Message"},  # empty subject
        {"name": "John Doe", "email": "johndoe@example.com", "subject": "Hello", "message": ""},  # empty message
        {"name": "", "email": "johndoe@example.com", "subject": "Hello", "message": "Test"}  # empty name
    ]

    # Test valid payload returns success (likely 200 or 201)
    try:
        response = requests.post(url, json=valid_payload, headers=HEADERS, auth=AUTH, timeout=TIMEOUT)
    except requests.RequestException as e:
        assert False, f"Request to {url} with valid payload failed: {e}"

    assert response.status_code in (200, 201), f"Expected 200 or 201 for valid payload, got {response.status_code}"
    try:
        resp_json = response.json()
    except ValueError:
        assert False, "Response for valid payload is not valid JSON"

    # Expect some confirmation in response, e.g. success message or status
    assert (
        isinstance(resp_json, dict) and ("success" in resp_json or "message" in resp_json)
    ), "Response JSON for valid payload missing expected keys"

    # Test invalid payloads return 400
    for invalid_payload in invalid_payloads:
        try:
            resp = requests.post(url, json=invalid_payload, headers=HEADERS, auth=AUTH, timeout=TIMEOUT)
        except requests.RequestException as e:
            assert False, f"Request to {url} with invalid payload {invalid_payload} failed: {e}"
        assert resp.status_code == 400, (
            f"Expected 400 for invalid payload {invalid_payload}, got {resp.status_code}"
        )


test_post_contact_api_should_accept_valid_inquiry_and_reject_invalid()