# AuraSynth

![AuraSynth Screenshot](https://github.com/user-attachments/assets/5d4fea9a-7b6c-4013-bd89-3a337e11db77)

## 🚀 Overview

AuraSynth is an intelligent music composition platform that generates **MIDI music from text prompts** using advanced AI models. It features a modern React frontend built with **Vite**, **Tailwind CSS**, and **TypeScript**, alongside a Node.js backend powering AI-driven MIDI generation and processing.

## 🎼 Core Features

* 🎹 Text-to-MIDI generation via discrete diffusion and transformer models
* ⚡ Fast and high-quality MIDI output optimized for real-time use
* 🎛️ Interactive frontend with smooth animations and playback support
* 💾 Export generated MIDI files for download
* 🔗 Clean separation between frontend UI and AI-powered backend services

## 🤖 AI Model & Backend Architecture

```plaintext
AI Model:
- Discrete Diffusion Probabilistic Model (D3PM) for tokenized MIDI sequence generation
- FLAN-T5 large language model for semantic text understanding and embedding
- REMI Tokenizer to represent MIDI events (notes, durations, velocity)
- Transformer-based decoder with cross-attention to FLAN-T5 embeddings
- Cosine Beta Schedule for efficient noise scheduling

Backend:
- Node.js + Express REST API serving AI model inference endpoints
- Converts text prompts to MIDI token sequences
- Post-processes tokens into normalized MIDI files with expressive enhancements
- Scalable and modular design for model integration and feature expansion
```

## 🛠 Technologies Used

```plaintext
Frontend:
- React (TypeScript)
- Vite
- Tailwind CSS
- React Lucid UI
- Framer Motion
- React Router DOM

Backend:
- Node.js with Express
- AI model inference (Python or integrated modules)
- MIDI processing utilities
```

## 📁 Project Structure

```plaintext
aurasynth-frontend/
├── src/
│   ├── components/    # Reusable UI components
│   ├── pages/         # Application pages
│   ├── App.tsx        # Main App component
│   └── main.tsx       # Entry point
├── public/            # Static assets
├── package.json       # Dependencies and scripts
├── tsconfig.json      # TypeScript config
└── vite.config.ts     # Vite config

aurasynth-backend/
├── models/            # AI models and training code
├── routes/            # API routes
├── utils/             # MIDI processing scripts
├── server.js          # Backend server entry point
├── package.json
└── ...
```

## 💻 Installation

```bash
git clone https://github.com/saidipo/Aurasynth
cd Aurasynth/aurasynth-frontend
npm install
```

```bash
cd ../aurasynth-backend
npm install
```

## 🚀 Usage

Start the frontend server:

```bash
npm run dev
```

Start the backend server:

```bash
node server.js
```

Open your browser at `http://localhost:3000` to use AuraSynth.

## 📧 Contact

For questions or licensing inquiries, contact [mohamedsaidi2003@gmail.com](mailto:mohamedsaidi2003@gmail.com).

---

