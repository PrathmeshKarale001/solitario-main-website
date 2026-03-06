import requests

def test_post_contact_api_should_accept_valid_inquiry_and_send_email():
    base_url = "http://localhost:3000"
    endpoint = "/api/contact"
    url = base_url + endpoint

    headers = {
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
    payload = {
        "name": "John Doe",
        "email": "johndoe@example.com",
        "subject": "Inquiry about Lab-Grown Diamond Collection",
        "message": "I am interested in your lab-grown diamond collection. Please send more information."
    }

    try:
        response = requests.post(url, json=payload, headers=headers, timeout=30)
    except requests.RequestException as e:
        assert False, f"Request to {url} failed with exception: {e}"

    # Assert HTTP status code 200 or 201 (depending on API design)
    assert response.status_code in (200, 201), f"Unexpected status code: {response.status_code}. Response body: {response.text}"

    # Validate response content indicates confirmation message triggered
    try:
        response_json = response.json()
    except ValueError:
        assert False, f"Response is not valid JSON: {response.text}"

    # Expecting a confirmation or success message in response_json
    assert "message" in response_json or "confirmation" in response_json, "No confirmation message found in response."

    # If there is a specific key for confirmation, validate it's not empty or false
    confirmation_msg = response_json.get("message") or response_json.get("confirmation")
    assert confirmation_msg and isinstance(confirmation_msg, str) and len(confirmation_msg) > 0, "Confirmation message is empty or invalid."

test_post_contact_api_should_accept_valid_inquiry_and_send_email()