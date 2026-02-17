# Personal Website

A modular, bilingual personal website built with **Vite** and **p5.js**.

## 🚀 How to Run Locally

1.  **Install Dependencies** (First time only):
    ```bash
    npm install
    ```

2.  **Start Development Server**:
    ```bash
    npm run dev
    ```
    > This will start the site at `http://localhost:5173/`. It updates instantly when you save files.

3.  **Build for Production** (Optional):
    ```bash
    npm run build
    npm run preview
    ```

## 📂 Project Structure

-   `src/data/`: **Edit content here.** (JSON files for Home, Philosophy, etc.)
-   `src/sketches/`: The p5.js visual code for each module.
-   `public/uploads/`: Drop your images and PDFs here.

## 🌍 Bilingual Support
The site supports **English (en)** and **Chinese (cn)**. Toggle it via the button in the top right.
Add translations in the `src/data/*.json` files under `"en"` and `"cn"` keys.
