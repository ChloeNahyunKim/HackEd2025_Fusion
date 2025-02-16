from pymongo import MongoClient

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

print("Fusion - Bad URL Collection:", bad_urls_fusion)
print("Fusion - Bad URL Collection:", good_urls_fusion)

# Example: Print one document from each collection
print("Fusion - Bad URL Document:", bad_urls_fusion.find_one())
print("Fusion - Bad URL Document:", good_urls_fusion.find_one())

def check_url(url):
    # Print the query results for debugging
    bad_url_result_fusion = bad_urls_fusion.find_one({"url": url})
    good_url_result_fusion = good_urls_fusion.find_one({"url": url})
    
    print("Fusion - Bad URL Query Result:", bad_url_result_fusion)
    
    # Check if the URL is in the "Bad URL" collection in admin
    
    
    # Check if the URL is in the "Bad URL" collection in Fusion
    if bad_url_result_fusion:
        return "Bad URL (Fusion)"
    elif good_url_result_fusion:
        return "Good URL (Fusion)"
    
    # If the URL is not found in any collection
    return "Unknown URL"

def check_google_in_fusion():
    # Check for "google.com" in the Fusion Bad URL collection
    print("Documents in 'Bad URL' collection (Fusion) containing 'google.com':")
    for document in bad_urls_fusion.find():
        if "google.com" in document["url"]:
            print(document)

# Example usage
if __name__ == "__main__":
    url_to_check = "rea.com"  # Replace with the URL you want to check
    result = check_url(url_to_check)
    print(f"The URL is classified as: {result}")
    
    # Check for "google.com" in the Fusion Bad URL collection
    