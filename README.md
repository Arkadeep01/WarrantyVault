# 🛡️ WarrantyVault

> Intelligent, AI-powered warranty management and receipt tracking platform designed to keep your purchases organized and protected.

[![Live Demo](https://img.shields.io/badge/Live_Demo-Vercel-black?style=for-the-badge\&logo=vercel)](https://warranty-vault-beta.vercel.app)
[![Built with Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge\&logo=vite\&logoColor=white)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge\&logo=typescript\&logoColor=white)](https://www.typescriptlang.org/)
[![Powered by Gemini](https://img.shields.io/badge/Google_Gemini-8E75B2?style=for-the-badge\&logo=google\&logoColor=white)](https://ai.google.dev/)

<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" /> </div>

---

# Run and Deploy Your AI Studio App

This contains everything you need to run your app locally.

**View your app in AI Studio:**
https://ai.studio/apps/fcc89fb5-5a1b-4fe3-a35b-2e38782c73b1

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:

   ```bash
   npm install
   ```

2. Set the `GEMINI_API_KEY` in `.env.local` to your Gemini API key.

3. Run the app:

   ```bash
   npm run dev
   ```

---

## 📌 Overview

**WarrantyVault** simplifies tracking product warranties, invoices, and expiry deadlines. By leveraging Google Gemini AI, the platform automatically parses receipts, extracts key product data, calculates expiration windows, and keeps users informed before protection plans lapse.

🔗 **Live Deployment:**
https://warranty-vault-beta.vercel.app

---

## ✨ Key Features

* 🧾 **AI-Powered Receipt Parsing:** Upload invoices or receipts to automatically extract product name, purchase date, retailer, and warranty duration via Gemini.
* ⏳ **Real-Time Expiration Tracking:** Visual indicators and countdowns for active, expiring, and lapsed warranties.
* 📁 **Centralized Document Storage:** Securely store proof of purchase and warranty paperwork in one organized dashboard.
* ⚡ **Fast and Responsive UI:** Built with Vite, React, and TypeScript for instantaneous page loads and smooth interactions.

---

## 🛠️ Tech Stack

* **Frontend:** React, TypeScript, Vite
* **Styling:** Tailwind CSS
* **AI / OCR Extraction:** Google Gemini API (`@google/genai`)
* **Runtime / Package Management:** Node.js / Bun
* **Deployment:** Vercel

---

## 🚀 Getting Started

### Prerequisites

* [Node.js](https://nodejs.org/) (v18+ recommended) or [Bun](https://bun.sh/)
* A Google AI Studio API key ([Get one here](https://aistudio.google.com/))

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/Arkadeep01/WarrantyVault.git
cd WarrantyVault
```

#### 2. Install Dependencies

```bash
npm install
```

Or, using Bun:

```bash
bun install
```

#### 3. Configure Environment Variables

Create a `.env.local` file in the root directory and add your Gemini API key:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

#### 4. Run the Development Server

Using npm:

```bash
npm run dev
```

Or using Bun:

```bash
bun dev
```

#### 5. Open the Application

Open the following URL in your browser:

```text
http://localhost:5173
```

---

## 📦 Project Structure

```text
WarrantyVault/
├── src/               # Application source code (components, pages, hooks, utils)
├── .env.example       # Example environment variables
├── index.html         # Application entry HTML
├── server.ts          # Backend / API handler logic
├── vite.config.ts     # Vite configuration
└── package.json       # Project dependencies and scripts
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

---

## 📄 License

This project is licensed under the MIT License — see the `LICENSE` file for details.
::: 
