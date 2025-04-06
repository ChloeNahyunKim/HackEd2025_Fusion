# HackEd2025_Fusion : Qusion

QR code phishing is an escalating threat, with cybercriminals using QR codes to trick users into revealing sensitive information. Incidents like the fraudulent Interac e-transfer in December 2023 highlighted the urgency of protecting individuals from these scams. Inspired by the rising dangers, we created Qusion to provide an instant, reliable solution to identify malicious QR codes and prevent financial loss and data theft.

### What it does? 
Qusion is a mobile app that scans QR codes and verifies the safety of the associated URLs. It analyzes URLs in real-time, cross-referencing them with trusted security databases like VirusTotal, Google Safe Browsing, and our own internal database. The app instantly alerts users whether the site is safe, suspicious, or unverified, empowering them to make informed decisions before interacting with potentially harmful links. Additionally, users can report suspicious URLs to help keep the database up to date.

### How we built it 
We built Qusion by integrating real-time QR code scanning into a mobile app. Using URL analysis, we tap into multiple security databases, including external sources and our own internal database, which allows us to offer faster, more efficient protection without overloading API requests. Our system processes URLs, detects threats, and provides instant feedback to the user. This was achieved through a combination of iOS mobile development and integration with security databases for real-time analysis.

### Challenges we ran into

Speed and Efficiency: Balancing real-time scanning with efficient security checks required optimizing database queries and minimizing API calls, especially when dealing with constantly changing malicious URLs.
Database Management: Building and maintaining an internal database that stays ahead of emerging threats, particularly in Fast Flux attacks, where malicious domains frequently rotate, presented a unique challenge.
User Experience: Ensuring the app provides instant, clear feedback without causing delays was crucial to keeping users engaged and informed in real-time. Scalability: Expanding from iOS to Android while ensuring seamless integration and maintaining security across different devices posed significant technical hurdles.

### Accomplishments 
* We’ve successfully identified and flagged over 500 suspicious and malicious websites in our internal database.
* Real-time detection of dangerous QR codes, alerting users instantly when a URL is flagged as unsafe or unverified.
* Integrated with iOS and are actively expanding to Android to ensure a broader user base.
* Developed a user feedback feature, enabling users to contribute to improving the database and help stay ahead of new threats.
* What we learned The importance of continuous updates: QR code phishing scams are constantly evolving, and maintaining a dynamic, up-to-date database is key to staying ahead of attackers.
* User collaboration: Allowing users to report suspicious URLs has proven to be an invaluable resource, enriching the app's ability to detect new threats.
* Balancing speed and security: Ensuring real-time scanning without sacrificing accuracy or performance taught us the importance of optimizing backend operations.

### What's next for Qusion Fusion 
Expansion into Android: We’re preparing for a full launch on Android to ensure wider protection for users across both major mobile platforms. Direct camera integration: We're working on integrating QR code scanning directly into phone cameras for a more seamless experience, making it easier for users to protect themselves. Scam detection in SMS and phone apps: We plan to extend our security services by integrating scam detection directly into phone and SMS apps, verifying phone numbers against a trusted scam database for real-time protection. Database growth: We aim to double our internal database, increasing our ability to protect users from emerging threats and stay ahead of Fast Flux attacks.

## Team Members
* Guneet Kaur
* Chloe Kim
* Sai Vashnavi Jattu
* Ria Ahir

## Built With
3. Expo
4. Firebase
5. Flask
6. Python
7. Virustotal API
8. Googlesafebrowsing API
10. React Native
