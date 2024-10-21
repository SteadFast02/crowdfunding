Crowdfunding Platform
A decentralized crowdfunding platform built using Node.js, Express, MongoDB, and Socket.io. The platform allows users to create campaigns, pledge to campaigns, maintain a transaction ledger, and get real-time updates. It includes JWT-based authentication, scheduled tasks, and encryption for security.

Features
Campaign Creation: Users can create crowdfunding campaigns with details such as goals and deadlines.
Pledging: Contributors can pledge to campaigns.
Transaction Ledger: Maintain a ledger of all transactions.
Real-time Updates: Using Socket.io to push updates to the UI in real-time.
Scheduled Jobs: Automated tasks such as checking campaign deadlines and goals.
End-to-End Encryption: Secure communication between API and clients.
JWT Authentication: Secure login and user authentication using JSON Web Tokens.
MongoDB: Database to store user, campaign, and transaction information.
Tech Stack
Backend: Node.js, Express
Database: MongoDB
Real-time Functionality: Socket.io
Authentication: JWT (JSON Web Token)
Task Scheduling: Cron Jobs
Encryption: End-to-end encryption for API communication
Installation
Prerequisites
Make sure you have the following installed:

Node.js: Download Node.js
MongoDB: Either local installation or use a service like MongoDB Atlas
Git: Install Git
Steps
Clone the repository:

bash
Copy code
git clone https://github.com/your-username/crowdfunding-platform.git
cd crowdfunding-platform
Install dependencies:

Run the following command to install all dependencies:

bash
Copy code
npm install
