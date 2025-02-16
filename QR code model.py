from pymongo import MongoClient
import requests
import base64

# MongoDB connection URI
MONGO_URI = "mongodb://localhost:27017/"

# Connect to MongoDB
client = MongoClient(MONGO_URI)

# Select the databases

fusion_db = client["Fusion"]

# Select the collections

bad_urls_fusion = fusion_db["Bad URL"]
good_urls_fusion = fusion_db["Good URL"]
# Print the collections to verify they exist




# Google Safe Browsing API function
def google_safe_browsing(url, bad_urls, good_urls):
    API_KEY = " AIzaSyA1CmCivCfSHk6Ub2j9-pGWbGJnjNk1MRE"  # Replace with your Google Safe Browsing API key
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
        print(response.json())
        matches = response.json().get("matches", [])
        print(matches)
        if matches:
            # URL is flagged as unsafe
            
            bad_urls.insert_one({"url": url})
            print("Bad URL (Google Safe Browsing) and inserted into database.")
            return "Bad URL"
           
        else:
            # URL is safe
            
            return "Not supicious URL"
    else:
        # Handle API errors
        print("Error: Unable to scan URL with Google Safe Browsing API.")
        return "Unknown URL"

def virsus_total(url, bad_urls, good_urls):
    

    VT_API_KEY = "8554009f375f25f2e52a377589aebf072f312dd806668c34d49b99d0c6ef5a5b"

    headers = {
        "x-apikey": VT_API_KEY
    }

    urltoscan = url
    url_id = base64.urlsafe_b64encode(urltoscan.encode()).decode().strip("=")

    response = requests.get(f"https://www.virustotal.com/api/v3/urls/{url_id}", headers=headers)

    try:
        categories = response.json()["data"]["attributes"]["last_analysis_results"]
    
        for value in categories.values():
            
            if value["category"] == "malicious" or value["category"] == "suspicious":
                bad_urls.insert_one({"url": url})
                print("Bad URL (VirusTotal) and inaerted")
                return "Bad URL"
            else:
                good_urls.insert_one({"url": url})
                print("Good URL")
                return "Good URL"
                
                    
    except:    
        print("in the except running google" )    
        answer  = google_safe_browsing(url, bad_urls_fusion, good_urls_fusion)
        print("answer for google", answer)
        return answer
        

    
        

def check_url(url):
    # Print the query results for debugging
    bad_url_result_fusion = bad_urls_fusion.find_one({"url": url})
    good_url_result_fusion = good_urls_fusion.find_one({"url": url})
    
    """ print("Fusion - Bad URL Query Result:", bad_url_result_fusion)
     """
    # Check if the URL is in the "Bad URL" collection in admin
    
    
    # Check if the URL is in the "Bad URL" collection in Fusion
    if bad_url_result_fusion:
        print("Bad URL (Fusion) inside the check url")
        return "Bad URL (Fusion)"
    elif good_url_result_fusion:
        print("Good URL (Fusion) inside the check url")
        return "Good URL (Fusion)"
    
    # If the URL is not found in any collection
    else:
        print("Not found in Fusion")
        output = virsus_total(url, bad_urls_fusion, good_urls_fusion)
        ## Virus total
        # "Unknown URL"
        if output == "Good URL":
            return "Good URL"
        elif output == "Bad URL":
            return "Bad URL"
        elif output == "Unknown URL":
            return "Unknown URL"
        elif output == "Not supicious URL":
            return "Not supicious URL"


# Example usage
if __name__ == "__main__":
    url_to_check = "https://riavashchloe.com"  # Replace with the URL you want to check
    
    resultanswer = check_url(url_to_check)
    print(f"The URL is classified as: {resultanswer}")
    
    # Check for "google.com" in the Fusion Bad URL collection
    