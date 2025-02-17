from flask import Flask, request, jsonify
import requests
import base64
import firebase_admin
from firebase_admin import credentials, firestore

# Initialize Firebase Admin SDK
cred = credentials.Certificate("/Users/chloekim/Downloads/HackEd2025_Fusion/fusion-ccfe3-firebase-adminsdk-fbsvc-2ca5394d8e.json")  # Replace with your Firebase service account key
firebase_admin.initialize_app(cred)

# Initialize Firestore
db = firestore.client()

# Google Safe Browsing API function
def google_safe_browsing(url):
    API_KEY = "AIzaSyA1CmCivCfSHk6Ub2j9-pGWbGJnjNk1MRE"
    api_url = "https://safebrowsing.googleapis.com/v4/threatMatches:find"

    payload = {
        "client": {
            "clientId": "your-client-id",  # Replace with your client ID
            "clientVersion": "1.0"
        },
        "threatInfo": {
            "threatTypes": ["MALWARE", "SOCIAL_ENGINEERING", "UNWANTED_SOFTWARE", "POTENTIALLY_HARMFUL_APPLICATION"],
            "platformTypes": ["ANY_PLATFORM"],
            "threatEntryTypes": ["URL"],
            "threatEntries": [{"url": url}]
        }
    }

    params = {"key": API_KEY}
    response = requests.post(api_url, json=payload, params=params)

    if response.status_code == 200:
        matches = response.json().get("matches", [])
        if matches:
            db.collection("bad_urls").add({"url": url})  # Add to Firestore "bad_urls" collection
            return "Bad URL"
        else:
            return "Not suspicious URL"
    else:
        return "Unknown URL"

def virus_total(url):
    VT_API_KEY = "8554009f375f25f2e52a377589aebf072f312dd806668c34d49b99d0c6ef5a5b"  # Replace with your VirusTotal API key
    headers = {"x-apikey": VT_API_KEY}
    urltoscan = url
    url_id = base64.urlsafe_b64encode(urltoscan.encode()).decode().strip("=")
    response = requests.get(f"https://www.virustotal.com/api/v3/urls/{url_id}", headers=headers)

    try:
        categories = response.json()["data"]["attributes"]["last_analysis_results"]
        for value in categories.values():
            if value["category"] == "malicious" or value["category"] == "suspicious":
                db.collection("bad_urls").add({"url": url})  # Add to Firestore "bad_urls" collection
                return "Bad URL"
            else:
                db.collection("good_urls").add({"url": url})  # Add to Firestore "good_urls" collection
                return "Good URL"
    except:
        return google_safe_browsing(url)

def check_url(url):
    # Check if URL exists in Firestore "bad_urls" collection
    bad_url_query = db.collection("bad_urls").where("url", "==", url).get()
    if bad_url_query:
        return "Bad URL (Fusion)"

    # Check if URL exists in Firestore "good_urls" collection
    good_url_query = db.collection("good_urls").where("url", "==", url).get()
    if good_url_query:
        return "Good URL (Fusion)"

    # If URL is not in Firestore, check with VirusTotal and Google Safe Browsing
    output = virus_total(url)
    return output

# API endpoint to check a URL
@app.route('/check-url', methods=['POST'])
def check_url_endpoint():
    data = request.json
    url = data.get("url")
    if not url:
        return jsonify({"error": "URL is required"}), 400

    result = check_url(url)
    return jsonify({"result": result})

if __name__ == '__main__':
    app.run(debug=True)