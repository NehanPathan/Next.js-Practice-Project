
# 🚀 Next.js Anonymous Messenger

A modern anonymous messaging platform built with **Next.js**, allowing users to send and receive messages anonymously. This project leverages AI-generated suggestions for engaging interactions and provides a clean, responsive interface.

---

## ✨ Features

- 📨 Send anonymous messages to users
- 🤖 AI-generated suggested messages using Google Generative AI
- 🖥️ Dynamic user pages with real-time message display
- 📁 Modular Next.js folder structure with `app` directory
- 🛡️ TypeScript support for type safety
- 🔑 Easy integration with environment variables for API keys

---

## 📂 Project Structure

```

.
├── app/                  # Main application routes and pages
├── components/           # Reusable UI components
├── context/              # React context providers
├── data/                 # Mock data or static files
├── helpers/              # Utility functions
├── lib/                  # Library helpers, API calls
├── model/                # TypeScript models
├── schemas/              # Validation schemas (Zod, etc.)
├── types/                # TypeScript type definitions
├── middleware.ts         # Custom Next.js middleware
├── public/               # Static assets
├── src/                  # Source code
├── .gitignore
├── package.json
├── tsconfig.json
├── yarn.lock
└── README.md

````

---

## ⚡ Getting Started

### 📝 Prerequisites

- Node.js 
- Yarn (preferred) or npm
- Google Gemini API Key for AI suggestions

### 💻 Installation

1. Clone the repository:

```bash
git clone https://github.com/NehanPathan/Next.js-Practice-Project.git
cd Next.js-Practice-Project
````

2. Install dependencies using Yarn:

```bash
yarn install
```

> If you prefer npm:

```bash
npm install
```

3. Create a `.env.local` file at the root and add your environment variables:

```env
GEMINI_API_KEY=your_google_generative_ai_api_key
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 🚀 Run Locally

```bash
yarn dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛠️ Usage

* 👤 Visit `/u/[username]` to send anonymous messages to a specific user.
* ✨ Click on suggested AI messages to send instantly.
* 📬 Messages are displayed in real-time below the input area.

---

## 🧰 Tech Stack

* **Next.js** (App Router)
* **TypeScript**
* **React**
* **Yarn / npm**
* **Google Generative AI**
* **Tailwind CSS** (optional, based on your setup)

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/my-feature`)
5. Open a pull request

---

## 🧑‍💻 Author

**Nehan Pathan**
📧 Email: [pathannehan26@gmail.com](mailto:pathannehan26@gmail.com)
