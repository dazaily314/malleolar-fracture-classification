# OrthoVision: Malleolar Fracture Classification

OrthoVision is a full-stack medical AI application designed to classify malleolar ankle fractures using deep learning. It features a FastAPI backend with a PyTorch model and a modern Next.js frontend with multi-language support (English, French, Arabic).

## 🚀 Getting Started

To run this project locally, you'll need to set up both the backend and the frontend.

### Prerequisites

- **Python 3.8+**
- **Node.js 18+**
- **npm** or **yarn**

---

## 🛠️ Backend Setup (FastAPI)

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Create a virtual environment:**
    - **Linux / macOS:**
      ```bash
      python3 -m venv venv
      source venv/bin/activate
      ```
    - **Windows:**
      ```bash
      python -m venv venv
      .\venv\Scripts\activate
      ```

3.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Run the backend server:**
    ```bash
    uvicorn main:app --reload
    ```
    The API will be available at `http://127.0.0.1:8000`.

---

## 💻 Frontend Setup (Next.js)

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The frontend will be available at `http://localhost:3000`.

---

## 🔑 Admin Access

By default, newly registered users have the `user` role. To promote a user to `admin` (allowing them to manage users and delete predictions):

1.  Register an account through the UI.
2.  In the `backend` directory, run the promotion script:
    ```bash
    # Linux / macOS / Windows
    python promote_admin.py your_email@example.com
    ```

---

## 🌍 Features

- **Fracture Classification:** Upload radiographs to classify **Weber A, Weber B, or Weber C** (three-class model).
- **Diagnostic History:** Secure storage of analysis results for each user.
- **Admin Dashboard:** Full CRUD for user management and data cleanup.
- **Multi-language UI:** Support for English, French, and Arabic (with RTL support).
- **Theme Support:** Light and Dark mode.

## 📄 License

This project is intended for educational and research purposes.
