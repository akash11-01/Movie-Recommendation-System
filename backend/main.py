import pickle
import pandas as pd
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()


origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


movies = pickle.load(open("movies.pkl","rb"))
similarity = pickle.load(open("similarity.pkl","rb"))

def recommend(movie):
    movie_idx = movies[movies['title'] == movie].index[0]
    distances = similarity[movie_idx]

    movies_list = sorted(
        list(enumerate(distances)),
        reverse=True,
        key=lambda x: x[1]
    )[1:6]

    recommended_movies = []

    for i in movies_list:
        recommended_movies.append(movies.iloc[i[0]].title)

    return recommended_movies
def recommend(movie):
    movie = movie.lower()

    matches = movies[movies['title'].str.lower() == movie]

    if matches.empty:
        return ["Movie not found"]

    movie_idx = matches.index[0]

    distances = similarity[movie_idx]

    movies_list = sorted(
        list(enumerate(distances)),
        reverse=True,
        key=lambda x: x[1]
    )[1:6]

    return [movies.iloc[i[0]].title for i in movies_list]

@app.get("/")
def home():
    return {"message": "Movie Recommendation API"}


@app.get("/recommend/{movie}")
def get_recommendations(movie: str):
    return {"recommendations": recommend(movie)}

@app.get("/search/{query}")
def search(query: str):
    result = movies[movies['title'].str.contains(query, case=False)]
    return result['title'].head(10).tolist()