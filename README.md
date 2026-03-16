# CineMatch — Movie Recommendation System

A full-stack, content-based movie recommendation app. Type any movie title, pick a match from live suggestions, and instantly receive five visually-rich recommendations — all backed by a precomputed cosine-similarity model served through a FastAPI REST API.

---

## Demo

**Backend (Render):** https://movie-recommendation-system-5qzn.onrender.com  
**Movie posters:** fetched live from the [OMDb API](https://www.omdbapi.com/)

---

## Features

- Live search with autocomplete as you type
- Content-based filtering using precomputed cosine similarity
- Poster artwork fetched from OMDb for every recommendation
- Responsive grid layout — works on mobile, tablet, and desktop
- Smooth animations powered by Framer Motion

---

## Tech Stack

| Layer      | Technology                                  |
| ---------- | ------------------------------------------- |
| Frontend   | React 19, Vite, Tailwind CSS, Framer Motion |
| Backend    | FastAPI, Uvicorn                            |
| ML / Data  | scikit-learn, pandas, NumPy, pickle         |
| Posters    | OMDb API                                    |
| Deployment | Render (backend)                            |

---

## Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+

---

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

The API will be available at `http://127.0.0.1:8000`.

> **Note:** `movies.pkl` and `similarity.pkl` must be present in the `backend/` folder before starting the server. Generate them by running your model-training notebook.

#### API Endpoints

| Method | Endpoint             | Description                             |
| ------ | -------------------- | --------------------------------------- |
| GET    | `/`                  | Health check                            |
| GET    | `/search/{query}`    | Returns up to 10 matching movie titles  |
| GET    | `/recommend/{movie}` | Returns 5 content-based recommendations |

---

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

To build for production:

```bash
npm run build
```

---

## How It Works

1. At startup, the backend loads a pre-trained cosine-similarity matrix (`similarity.pkl`) and a movies DataFrame (`movies.pkl`).
2. The `/search` endpoint filters movie titles by substring match and returns the top 10 results for the autocomplete dropdown.
3. When a movie is selected, `/recommend/{movie}` looks up the index of that title in the matrix, sorts all other movies by descending similarity score, and returns the top 5.
4. The React frontend fetches a poster for each recommendation from the OMDb API and displays the results in an animated, responsive grid.

---

## Environment Variables

No `.env` file is required to run locally. The OMDb API key is embedded in the frontend fetch call. For production, consider moving it to a build-time environment variable:

```env
VITE_OMDB_API_KEY=your_key_here
```

Then in `App.jsx`:

```js
const OMDB_KEY = import.meta.env.VITE_OMDB_API_KEY;
```

---
