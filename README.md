<div align="center">
  <h1>✨ Mockup Studio</h1>
  <p><strong>A professional tool for creating 3D mockups, business cards, and stunning screen presentations.</strong></p>
</div>

---

## 📌 About the Project

**Mockup Studio** is a modern and powerful application designed to help you create high-quality 3D mockups and design presentations. It features an intuitive user interface and provides a wide range of options to customize, adjust, and save your design elements. Built with Electron, it functions perfectly as both a web application and a standalone desktop program.

## 🚀 Key Features

- **3D Transformations:** Move, rotate, and adjust the angles of your designs (Pan, Tilt, Rotation, Perspective) to achieve a realistic 3D look.
- **High-Quality Export:** Export your final mockups in PNG or JPEG formats, with support for custom dimensions and high-resolution scaling.
- **Custom Presets:** Create your own design setups, save them, and reuse them later (data is persisted locally via IndexedDB/LocalStorage).
- **Drag & Drop Support:** Simply drag and drop your images onto the designated slots for a fast and seamless workflow.
- **Multilingual Interface:** The application interface is available in both English and Armenian.
- **Shadows & Lighting:** Take full control over shadow depth, blur, and realistic card glare to make your mockups stand out.

## 🛠 Built With

This project is built using modern and highly-demanded technologies, ensuring maximum performance and flexibility:

- **React 19** - For building the user interface
- **TypeScript** - For type-safe and reliable code
- **Vite 6** - For lightning-fast bundling and development
- **Electron** - For building cross-platform desktop applications (Windows, macOS, Linux)
- **Tailwind CSS v4** - For rapid and modern UI styling
- **Framer Motion** - For fluid animations and interactive transitions
- **html-to-image** - For exporting the design canvas to images

## ⚙️ Getting Started

Follow these steps to set up and run the project locally on your machine.

### 1. Clone the repository
```bash
git clone <repository-url>
cd "Card Busines Mockup"
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run the Application
You can run the project in different modes depending on your needs.

**For Web Development (Browser Preview):**
```bash
npm run dev
```

**For Desktop App (Electron) Preview:**
```bash
npm run electron:dev
```

### 4. Build for Production
To bundle the application and generate an executable file (e.g., `.exe` for Windows):
```bash
npm run electron:build
```
Or for Windows specifically:
```bash
npm run electron:build:win
```

*The final built files will be saved in the `release-app` or similar designated output directory.*

---
<div align="center">
  <p>Crafted with love and attention to detail. 🎨</p>
</div>
