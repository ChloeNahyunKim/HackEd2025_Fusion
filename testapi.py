import requests
import base64
import pprint

VT_API_KEY = "8554009f375f25f2e52a377589aebf072f312dd806668c34d49b99d0c6ef5a5b"

headers = {
    "x-apikey": VT_API_KEY
}

urltoscan = input()
url_id = base64.urlsafe_b64encode(urltoscan.encode()).decode().strip("=")

response = requests.get(f"https://www.virustotal.com/api/v3/urls/{url_id}", headers=headers)

malicious = False
categories = response.json()["data"]["attributes"]["last_analysis_results"]

for value in categories.values():
    if value["category"] == "malicious" or value["category"] == "suspicious":
        malicious = True
        break

print(malicious)

GL_API_KEY = "AIzaSyA1CmCivCfSHk6Ub2j9-pGWbGJnjNk1MRE"
url = "https://safebrowsing.googleapis.com/v4/threatMatches:find"
payload = {'client': {'clientId': "mycompany", 'clientVersion': "0.1"},
        'threatInfo': {'threatTypes': ["SOCIAL_ENGINEERING", "MALWARE"],
                       'platformTypes': ["ANY_PLATFORM"],
                       'threatEntryTypes': ["URL"],
                       'threatEntries': [{'url': f"{urltoscan}"}]}}
params = {'key': GL_API_KEY}
response = requests.post(url, params=params, json=payload)
pprint.pprint(response.json())