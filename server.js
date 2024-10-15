/*********************************************************************************
*  WEB422 – Assignment 1
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: Darshan Kalpeshbhai Prajapati Student ID: 112908215
*  Date: 15th October, 2024
*  Githun Link: 
*
********************************************************************************/ 

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const MoviesDB = require('./modules/moviesDB.js'); 
const app = express();
const db = new MoviesDB();
const HTTP_PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));  

// Initialize MongoDB connection
mongoose.connect(process.env.MONGODB_CONN_STRING, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(HTTP_PORT, () => {
            console.log(`Server running on port ${HTTP_PORT}`);
        });
    })
    .catch(err => console.log('Error connecting to MongoDB:', err));

// API route to get paginated movies with optional title filtering
app.get('/api/movies', (req, res) => {
    const { page = 1, perPage = 10, title } = req.query;
    db.getAllMovies(page, perPage, title)
        .then(movies => res.json(movies))
        .catch(err => res.status(500).json({ error: err.message }));
});

// API route to get a movie by ID
app.get('/api/movies/:id', (req, res) => {
    db.getMovieById(req.params.id)
        .then(movie => res.json(movie))
        .catch(err => res.status(500).json({ error: err.message }));
});