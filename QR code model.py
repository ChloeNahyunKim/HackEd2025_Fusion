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
    """
    Checks if a URL is classified as Bad, Good, or Unknown.
    Displays the report count if applicable.
    """

    # Print the query results for debugging
    bad_url_result_fusion = bad_urls_fusion.find_one({"url": url})
    good_url_result_fusion = good_urls_fusion.find_one({"url": url})
        
    # Check if the URL is in the "Bad URL" collection in Fusion
    if bad_url_result_fusion:
        report_count = bad_url_result_fusion.get("reports", 0)
        return f"Bad URL (Fusion) - Reports: {report_count}"
    elif good_url_result_fusion:
        report_count = bad_url_result_fusion.get("reports", 0)
        return f"Good URL (Fusion) - Reports: {report_count}"
    
    # If the URL is not found in any collection
    return f"Unknown URL (Fusion) - Reports: 0"

def report_bad_url(url):
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

def report_good_url(url):
    """
    Reports a URL as Good. If it exists, increments the 'reports' field.
    If not, adds it to the collection.
    """
    good_url_result = good_urls_fusion.find_one({"url": url})

    if good_url_result:
        good_urls_fusion.update_one({"url": url}, {"$inc": {"reports": 1}})
        print(f"Report count increased for {url}. New count: {good_url_result['reports'] + 1}")
    else:
        good_urls_fusion.insert_one({"url": url, "reports": 1})
        print(f"{url} added to 'Good URL' collection with 1 report.")

# Example usage
if __name__ == "__main__":
    url_to_check = input("Enter the URL to check: ").strip()
    result = check_url(url_to_check)
    print(f"The URL is classified as: {result}")

    # Ask the user if they want to report the URL
    if result.startswith("Unknown URL (Fusion)"):
        report_choice = input("This URL is unknown. Would you like to report it as (bad/good)? ").strip().lower()
        if report_choice == "bad":
            report_bad_url(url_to_check)
        elif report_choice == "good":
            report_good_url(url_to_check)
    elif result.startswith("Bad URL (Fusion)") or result.startswith("Good URL (Fusion)"):
        report_choice = input("Would you like to increase the report count for this URL? (yes/no): ").strip().lower()
        if report_choice == "yes":
            if result.startswith("Bad URL (Fusion)"):
                report_bad_url(url_to_check)
            else:
                report_good_url(url_to_check) 