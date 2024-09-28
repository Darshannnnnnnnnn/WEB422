/**********************************************************************************
 *  WEB422 – Assignment 1* 
 * I declare that this assignment is my own work in accordance with Seneca Academic Policy. 
 * No part of this assignment has been copied manually or electronically from any other source* 
 * (including web sites) or distributed to other students.* 
 * Name: Darshan Kalpeshbhai Prajapati Student ID: 112908215 Date : 28th sep 2024
 * vercel Link: https://vercel.com/darshannnnnnnnnns-projects/web-422
 * *********************************************************************************/

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
const HTTP_PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

const MoviesDB = require("./modules/moviesDB.js");
const db = new MoviesDB();


db.initialize(process.env.MONGODB_CONN_STRING)
    .then(() => {
        app.listen(HTTP_PORT, () => {
            console.log(`Server listening on: ${HTTP_PORT}`);
        });
    })
    .catch((err) => {
        console.log("Failed to connect to the database:", err);
    });

app.post('/api/movies', (req, res) => {
    db.addNewMovie(req.body)
        .then((newMovie) => {
            res.status(201).json(newMovie); 
        })
        .catch((err) => {
            res.status(500).json({ error: err.message }); 
        });
});

app.get('/api/movies', (req, res) => {
    const { page, perPage, title } = req.query;
    const pageNum = parseInt(page) || 1; 
    const perPageNum = parseInt(perPage) || 10; 

    db.getAllMovies(pageNum, perPageNum, title)
        .then((movies) => {
            res.json(movies);
        })
        .catch((err) => {
            res.status(500).json({ error: err.message });
        });
});


app.get('/api/movies/:id', (req, res) => {
    const { id } = req.params;

    db.getMovieById(id)
        .then((movie) => {
            if (movie) {
                res.json(movie);
            } else {
                res.status(404).json({ error: "Movie not found" });
            }
        })
        .catch((err) => {
            res.status(500).json({ error: err.message });
        });
});


app.put('/api/movies/:id', (req, res) => {
    const { id } = req.params;

    db.updateMovieById(req.body, id)
        .then(() => {
            res.status(204).end();
        })
        .catch((err) => {
            res.status(500).json({ error: err.message });
        });
});


app.delete('/api/movies/:id', (req, res) => {
    const { id } = req.params;

    db.deleteMovieById(id)
        .then(() => {
            res.status(204).end(); 
        })
        .catch((err) => {
            res.status(500).json({ error: err.message });
        });
});


app.get('/', (req, res) => {
    res.json({ message: "API Listening" });
});
