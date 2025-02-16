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

def check_url(url):
    # Print the query results for debugging
    bad_url_result_fusion = bad_urls_fusion.find_one({"url": url})
    good_url_result_fusion = good_urls_fusion.find_one({"url": url})
    
    print("Fusion - Bad URL Query Result:", bad_url_result_fusion)    
    
    # Check if the URL is in the "Bad URL" collection in Fusion
    if bad_url_result_fusion:
        return "Bad URL (Fusion)"
    elif good_url_result_fusion:
        return "Good URL (Fusion)"
    
    # If the URL is not found in any collection
    return "Unknown URL"

def report_url(url):
    """
    If the URL exists in the 'Bad URL' collection, increment the 'reports' field.
    If the URL does not exist, add it to the collection with 'reports' set to 1.
    """
    bad_url_result = bad_url_result = bad_urls_fusion.find_one({"url": url})

    if bad_url_result:
        # Increment the 'reports' field
        bad_urls_fusion.update_one({"url": url}, {"$inc": {"reports": 1}})
        print(f"Report count increased for {url}. New count: {bad_url_result['reports'] + 1}")
    else:
        # Insert a new document with reports set to 1
        bad_urls_fusion.insert_one({"url": url, "reports": 1})
        print(f"{url} added to 'Bad URL' collection with 1 report.")

# Example usage
if __name__ == "__main__":
    url_to_check = input("Enter the URL to check: ").strip()
    result = check_url(url_to_check)
    print(f"The URL is classified as: {result}")

    # If the URL is not found, ask if the user wants to report it
    if result == "Unknown URL" or result == "Bad URL (Fusion)":
        report_choice = input("This URL is unknown. Would you like to report it as bad? (yes/no): ").strip().lower()
        if report_choice == "yes":
            report_url(url_to_check) 