const express = require('express');
const session = require('express-session');
const cors = require('cors');
//const FileStorage = require('session-file-store')(session);

const flash = require('express-flash-messages');

const photoUploadManager = require('./middlewares/upload-middleware');

const csrfProtection = require('csurf')();

const app = express();

// configuration de PUG
app.set('views', './views');
app.set('view engine', 'pug');

// Définition des ressources statiques
app.use('/bootstrap', express.static('node_modules/bootstrap/dist'));

app.use(cors());

// Récupération de la saisie
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
    secret: '123',
    name: 'appSession',
    saveUninitialized: true,
    resave: true,
    //store: new FileStorage 
}));

app.use(flash());


// Routes
app.use(require('./routes/default-routes'));


app.use((error, req, res, next) => {
    console.log(req.headers);
    console.log(error);
    if (error.code === 'EBADCSRFTOKEN' && req.headers['sec-fetch-site'] !== 'same-origin') {
        return res.status(500).json({ message: 'passez par notre formulaire'});
    }

    next(error);
});
app.use((error, req, res, next) => {
    res.render('error', {error});
});


app.listen(3000, () => console.log('server started'));