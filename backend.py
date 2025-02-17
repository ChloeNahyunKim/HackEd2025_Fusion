from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
import requests
import base64

app = Flask(__name__)

# MongoDB connection URI
MONGO_URI = "mongodb://localhost:27017/Fusion"
app.config["MONGO_URI"] = MONGO_URI
mongo = PyMongo(app)

# Select the databases and collections
fusion_db = mongo.db["Fusion"]
bad_urls_fusion = fusion_db["Bad URL"]
good_urls_fusion = fusion_db["Good URL"]

# Google Safe Browsing API function
def google_safe_browsing(url, bad_urls, good_urls):
    API_KEY = "AIzaSyA1CmCivCfSHk6Ub2j9-pGWbGJnjNk1MRE"  # Replace with your Google Safe Browsing API key
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
            bad_urls.insert_one({"url": url})
            return "Bad URL"
        else:
            return "Not suspicious URL"
    else:
        return "Unknown URL"

def virsus_total(url, bad_urls, good_urls):
    VT_API_KEY = "8554009f375f25f2e52a377589aebf072f312dd806668c34d49b99d0c6ef5a5b"  # Replace with your VirusTotal API key
    headers = {"x-apikey": VT_API_KEY}
    urltoscan = url
    url_id = base64.urlsafe_b64encode(urltoscan.encode()).decode().strip("=")
    response = requests.get(f"https://www.virustotal.com/api/v3/urls/{url_id}", headers=headers)

    try:
        categories = response.json()["data"]["attributes"]["last_analysis_results"]
        for value in categories.values():
            if value["category"] == "malicious" or value["category"] == "suspicious":
                bad_urls.insert_one({"url": url})
                return "Bad URL"
            else:
                good_urls.insert_one({"url": url})
                return "Good URL"
    except:
        return google_safe_browsing(url, bad_urls, good_urls)

def check_url(url):
    bad_url_result_fusion = bad_urls_fusion.find_one({"url": url})
    good_url_result_fusion = good_urls_fusion.find_one({"url": url})

    if bad_url_result_fusion:
        return "Bad URL (Fusion)"
    elif good_url_result_fusion:
        return "Good URL (Fusion)"
    else:
        output = virsus_total(url, bad_urls_fusion, good_urls_fusion)
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
