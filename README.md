# AuraSynth

![AuraSynth Screenshot](https://github.com/user-attachments/assets/5d4fea9a-7b6c-4013-bd89-3a337e11db77)

## 🚀 Overview

AuraSynth is an intelligent music composition platform that generates **MIDI music from textual descriptions** using advanced AI models. It features a modern React frontend built with **Vite**, **Tailwind CSS**, and **TypeScript**, alongside a Node.js backend powering AI-driven MIDI generation and processing.

## 🎼 Core Features

* 🎹 Text-to-MIDI generation via discrete diffusion and transformer models
* ⚡ Fast and high-quality MIDI output optimized for real-time use
* 🎛️ Interactive frontend with smooth animations and playback support
* 💾 Export generated MIDI files for download
* 🔗 Clean separation between frontend UI and AI-powered backend services

## 🤖 AI Architecture

### 1. Text Prompt Encoding with FLAN-T5

The process begins with **FLAN-T5**, a large language model fine-tuned for instruction-following tasks. It processes the user's textual prompt, such as "a melancholic piano piece with a slow tempo," and generates a semantic embedding that captures the nuances of the description.

![FLAN-T5 Architecture](https://huggingface.co/google/flan-t5-base/resolve/main/assets/architecture.png)

*Image Source: [Hugging Face](https://huggingface.co/google/flan-t5-base)*

### 2. MIDI Representation with REMI Tokenization

To bridge the gap between text and music, AuraSynth utilizes the **REMI (REvamped MIDI)** tokenizer. This tokenizer converts musical elements into a structured sequence of tokens representing pitch, velocity, duration, bar, and position. This structured representation allows the model to understand and generate complex musical compositions.

![REMI Tokenization](https://miditok.readthedocs.io/en/v2.0.7/_images/remi_example.png)

*Image Source: [MidiTok Documentation](https://miditok.readthedocs.io/en/v2.0.7/tokenizations.html)*

### 3. Music Generation with Discrete Diffusion Models

At the core of the music generation process is a **Discrete Diffusion Probabilistic Model (D3PM)**. This model operates by gradually adding noise to a MIDI sequence and then learning to reverse this process to generate new sequences. The denoising process is guided by the semantic embeddings from FLAN-T5, ensuring that the generated music aligns with the original text prompt.

![Diffusion Model Process](https://datasciencedojo.com/blog/wp-content/uploads/2023/05/Stable-Audio-2.0-Architecture.png)

*Image Source: [Data Science Dojo](https://datasciencedojo.com/blog/5-ai-music-generation-models/)*

### 4. MIDI Decoding and Post-Processing

Once the diffusion model generates a sequence of MIDI tokens, they are decoded back into a standard MIDI format. Post-processing steps are applied to ensure the musicality and expressiveness of the composition, including adjustments to tempo, dynamics, and articulation.

## 🛠 Backend Architecture

The backend of AuraSynth is designed to handle the complexities of AI model inference and MIDI processing efficiently.

### Backend Components:

* **Model Inference Engine:** Handles the execution of the FLAN-T5 and D3PM models, processing text prompts and generating MIDI sequences.

* **MIDI Processor:** Manages the conversion between MIDI token sequences and standard MIDI files, applying necessary post-processing steps.

* **API Layer:** Exposes RESTful endpoints for the frontend to interact with the backend, facilitating the submission of prompts and retrieval of generated compositions.

* **Database:** Stores user data, prompt histories, and generated compositions for future reference and analysis.

## 🛠 Technologies Used

### Frontend

```plaintext
- React (TypeScript)
- Vite
- Tailwind CSS
- React Lucid UI
- Framer Motion
- React Router DOM
```

### Backend

```plaintext
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

