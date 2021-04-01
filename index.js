const express = require('express');
const app = express();
const port = 4000;

const d = new Date();
const TIME = d.getHours() + ":" + d.getSeconds();

// const d = new Date();
// const s = d.getSeconds() < 1000 ? (d.getSeconds() < 100 ? (d.getSeconds() < 10 ? '000' + d.getSeconds() : '00' + d.getSeconds())  : '0' + d.getSeconds()) : '' + d.getSeconds();
// const h = d.getHours();
// const TIME = h + ":" + d.s;

const movies = [
    { title: 'Jaws', year: 1975, rating: 8 },
    { title: 'Avatar', year: 2009, rating: 7.8 },
    { title: 'Brazil', year: 1985, rating: 8 },
    { title: 'الإرهاب والكباب‎', year: 1992, rating: 6.2 }
];

app.get('/', (req, res) => {
    res.send('ok')
});

app.get('/test', (req, res) => {
    res.status(200).send('ok');
});

app.get('/time', (req, res) => {
    let t = TIME;
    res.status(200).send(String(t));
});

app.get('/hello/:id', (req, res) => {
    res.status(200).send('Hello, ' + req.params.id)
});

app.get('/search', (req, res) => {
    if (req.query.s == "" || req.query.s == undefined) {
        res.status(500).send('You have to enter a search');
    }
    else {
        res.status(200).send('ok, ' + req.query.s);
    }
});

app.get('/movies/', (req, res) => {
    res.status(200).send(movies)
});

app.get('/movies/:by', (req, res) => {
    if (req.params.by == '' || req.params.by == undefined) {
        res.status(200).send(movies)
    }
    else if (req.params.by == 'by-date') {
        movies.sort((a, b) => { return a.year - b.year; })
        res.status(200).send(movies);
    }
    else if (req.params.by == 'by-rating') {
        movies.sort((a, b) => { return b.rating - a.rating; })
        res.status(200).send(movies);
    }
    else if (req.params.by == 'by-title') {
        movies.sort((a, b) => { return a.title.localeCompare(b.title); })
        res.status(200).send(movies);
    }
});

app.get('/movies/read/id/:id', (req, res) => {
    if (req.params.id <= 0 || req.params.id > movies.length) {
        res.status(404).send('The movie ' + req.params.id + ' does not exist');
    }
    else {
        res.status(200).send(movies[req.params.id - 1])
    }
});

app.post('/movies', (req, res) => {
    var t = req.query.title;
    var y = req.query.year;
    var r = req.query.rating;
    if (t == "" || y == "" || y.toString().length != 4 || isNaN(y)) { res.status(403).send('You cannot create a movie without providing a title and a year') }
    else {
        if (r == "" || typeof r == undefined) { r = 4; }
    }
    movies.push({ title: t, year: parseInt(y), rating: parseInt(r) });
    res.status(200).send(movies)
});

app.delete('/movies/:id', (req, res) => {
    if (req.params.id < 1 || req.params.id > movies.length) {
        res.status(404).send('The movie ' + req.params.id + ' does not exist')
    }
    else {
        movies.splice(req.params.id - 1, 1)
        res.send(movies)
    }
});

app.put('/movies/:id', (req, res) => {
    var id = req.params.id
    if (id <= 0 || id > movies.length) {
        res.status(404).send('The movie ' + id + ' doesn\'t exist');
    }
    else { var movie = movies[id - 1]; }
    var arrV = Object.values(movie);
    var t = req.query.title;
    var y = req.query.year;
    var r = req.query.rating;
    if ((t == "" || t == undefined) && (r == "" || r == undefined) && (y == "" || y == undefined)) {
        res.status(404).send('Nothing to update');
    } else {
        (t == undefined || t == "") ? movie['title'] = arrV[0] : movie['title'] = t;
        (y == undefined || y == "") ? movie['year'] = arrV[1] : movie['year'] = parseInt(y);
        (r == undefined || r == "") ? movie['rating'] = arrV[2] : movie['rating'] = parseInt(r);
        res.send(movie);
    }
});

app.listen(port, () => console.log(`Success! Your application is running on \"http://localhost:${port}\"`));