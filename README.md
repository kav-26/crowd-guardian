# 🧭 Crowd Guardian

**Crowd Guardian** is a full-stack web application designed to provide real-time information about crowd density at popular public locations such as temples, parks, and metro stations.  
It helps users make informed and safe travel decisions by displaying live crowd data, visual charts, and community-submitted reports.



## 🚀 Features

- 🗺️ **Live Crowd Dashboard** – Real-time map showing current crowd levels across key locations.  
- 📊 **Crowd Analytics** – Displays distribution, composition, and time-based trends.  
- 🧍‍♂️ **Community Reporting** – Users can report current crowd levels to help keep data up-to-date.  
- 🌗 **Dark / Light Mode** – Switchable interface for better readability.  
- 🔐 **User Authentication** – Secure login and registration with JWT-based authorization.  
- ⚡ **Auto-Refresh** – Dashboard updates automatically to reflect the latest crowd data.


 ### 📸 Screenshots

 🖥️ Dashboard View

 1. Live Dashboard Overview 

Shows real-time crowd updates, map markers, and status cards.  
![Dashboard Overview](frontend\images\dashboard-main.png)

2. Crowd Trend & Distribution Charts  

Displays live crowd distribution and trend analysis over time.  
*Line & Bar Charts:** Show crowd activity and category-wise distribution.  
- **Pie Chart & Footer:** Highlight overall crowd composition and project footer.  
![Dashboard Charts](frontend\images\dashboard-charts1.png), (frontend\images\dashboard-charts2.png)


3. Dark Mode Interface  

The dashboard also supports a clean and modern dark theme.  
![Dashboard Dark Mode](frontend\images\dashboard-dark.png)

🧾 Report Crowd Form

Users can report current crowd levels through an easy form.  
![Report Form Screenshot](frontend\images\report form .png)


 ℹ️ About Page

Provides details about the project’s mission and features.  
![About Page Screenshot](frontend\images\about.png)





## 🧩 Folder Structure

CROWD-GUARDIAN/
│
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── .env         
│   ├── db.js
│   ├── seed.js
│   └── server.js
│
├── frontend/
│   ├── css/
│   ├── images/
│   ├── js/
│   ├── about.html
│   ├── dashboard.html
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   └── report.html
│
├── .gitignore      
├── package.json
├──
└── README.md



---

## ⚙️ Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/kav-26/crowd-guardian
   cd CrowdGuardian


 
Install dependencies
npm install

Create a .env file in the backend folder
PORT=8000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key


Start the backend server
node backend/server.js

Open the frontend
npx live-server frontend

### 🔗 API Endpoints Summary

| Method   | Endpoint              | Description |
|:--------:|:----------------------------------  |
| **POST** | `/api/auth/register`  | Register a new user |
| **POST** | `/api/auth/login`     | Login and receive an authentication token |
| **GET**  | `/api/places`         | Retrieve the list of all available places |
| **GET**  | `/api/crowd`          | Fetch the current crowd data for all places |
| **PATCH**| `/api/places/:id`     | Update crowd percentage for a specific place (used in Report Crowd feature) |



📊 Dashboard Charts

-Crowd Distribution → Bar chart showing the number of low, moderate, and high crowd locations.

-Crowd Trend Over Time → Line chart displaying average crowd % change over recent updates.

-Crowd Composition → Donut chart representing proportional crowd levels.


🧑‍💻 Contributor

Anjani Kavya – Developer of Crowd Guardian
