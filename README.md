# 🛡️ LifeVault AI

LifeVault AI is a state-of-the-art, premium digital vault designed to securely store, manage, and retrieve your most important life documents (Passports, Driving Licenses, Insurance Policies, etc.). Powered by a stunning **Aurora/Cyberpunk Glassmorphism** user interface and intelligent OCR backend processing.

## ✨ Features

- **Premium UI/UX:** A gorgeously designed glassmorphism frontend with animated mesh backgrounds, floating components, and interactive micro-animations.
- **Secure Authentication:** JWT-based user authentication and encrypted passwords.
- **Intelligent Dashboard:** Real-time statistics, document tracking, and an automated "Expiring Soon" alert system for important documents.
- **Smart Uploads:** Instantly upload and categorize documents. Files are stored securely with local disk fallbacks.
- **AI OCR Integration (Tesseract):** Automated optical character recognition to extract and index text from uploaded images.
- **Profile Management:** Complete settings page with Avatar uploads, Security management, and Notification preferences.

## 🛠️ Technology Stack

- **Frontend:** React 18, Vite, TypeScript, Tailwind CSS, Redux Toolkit, React Router, Lucide React (Icons).
- **Backend:** Node.js, Express, TypeScript, MongoDB, Mongoose, Tesseract.js (OCR), Multer (File Uploads), Cloudinary (Optional Cloud Storage).

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (Running locally or MongoDB Atlas URI)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Charuz1/Life_Vault.git
   cd Life_Vault
   ```

2. **Setup the Backend**
   ```bash
   cd backend
   npm install
   ```
   - Create a `.env` file in the `backend/` directory:
     ```env
     PORT=5000
     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET=your_super_secret_key
     ```
   - Start the backend server:
     ```bash
     npm run dev
     ```

3. **Setup the Frontend**
   ```bash
   cd ../frontend
   npm install
   ```
   - Start the frontend development server:
     ```bash
     npm run dev
     ```

4. **Open the Application**
   - Navigate to `http://localhost:5173` in your browser to experience LifeVault AI.

## 🎨 Theme Architecture
The application uses a custom **Sunset Aura** theme defined in `index.css`, merging rich Rose/Pink, warm Gold, and deep Violet accents over an obsidian dark mode base. Custom Tailwind utilities like `.glass` and `.glass-card` are used globally to enforce the glassmorphism aesthetic.

---
*Built with ❤️ for a secure and beautiful digital life.*
