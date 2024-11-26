import requests
import json

class KommoAPI:
    BASE_URL_TEMPLATE = "https://{subdomain}.kommo.com/api/v4"

    def __init__(self, access_token, subdomain):
        self.access_token = access_token
        self.subdomain = subdomain

    def _get_headers(self):
        return {
            "Authorization": f"Bearer {self.access_token}",
            "Content-Type": "application/json",
        }

    def get_contact(self, email):
        url = f"https://{self.subdomain}.kommo.com/api/v4/contacts?query={email}"
        headers = {"Authorization": f"Bearer {self.access_token}"}
        
        try:
            response = requests.get(url, headers=headers)
            response.raise_for_status()
            
            # Validar si la respuesta tiene contenido
            if response.text.strip():  # Si no está vacío
                return response.json()
            else:
                return {"contacts": []}  # Devolver lista vacía si no hay datos
        except requests.exceptions.HTTPError as http_err:
            print(f"HTTP error occurred: {http_err}")
            print(f"Response body: {response.text}")
            return {"contacts": []}  # Manejo básico de error
        except Exception as err:
            print(f"Other error occurred: {err}")
            return {"contacts": []}

    def create_contact(self, contact_data):
        url = f"https://{self.subdomain}.kommo.com/api/v4/contacts"
        headers = self._get_headers()
        contact_data = {"add": contact_data}
        print(json.dumps(contact_data, indent=4))
        try:
            response = requests.post(url, json=contact_data, headers=headers)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.HTTPError as http_err:
            print(f"HTTP error occurred: {http_err}")
            print(f"Response body: {response.text}")
        except Exception as err:
            print(f"Other error occurred: {err}")
            if response.text:
                print(f"Response body: {response.text}")

    def update_contact(self, contact_id, update_data):
        url = f"https://{self.subdomain}.kommo.com/api/v4/contacts/{contact_id}"
        headers = {
            "Authorization": f"Bearer {self.access_token}",
            "Content-Type": "application/json"
        }
        response = requests.patch(url, json=update_data, headers=headers)
        response.raise_for_status()
        return response.json()
