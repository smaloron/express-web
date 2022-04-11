const router = require('express').Router();

const photoUploadManager = require('../middlewares/upload-middleware');
const csrfProtection = require('csurf')();

router.get('/test', (req, res) => {
    res.render('test', {
        pageTitle: 'Mon super titre',
        name: 'Seb',
        age: 50,
        languages: [
            { name: 'Java', difficulty: 'medium' },
            { name: 'C', difficulty: 'hard' },
            { name: 'Haskell', difficulty: 'hard' },
            { name: 'HTML', difficulty: 'finger in the nose' },
        ],
        photographers: [
            { name: 'Cunningham', firstName: 'Imogen' },
            { name: 'Arbus', firstName: 'Diane' },
            { name: 'Dorothea', firstName: 'Lange' },
            { name: 'Model', firstName: 'Lisette' },
            { name: 'Abbot', firstName: 'Berenice' },
            { name: 'Taro', firstName: 'Gerda' },
            { name: 'Modotti', firstName: 'Tina' }
        ]
    });
});

router.all('/contact-form', (req, res) => {

    if (req.body.name && req.body.name.length > 2) {
        req.session.name = req.body.name;
        req.session.test = 5;
        console.log(req.session);

        req.flash('info', 'Vous êtes bien indentifié');

        return res.redirect('/home');
    }

    res.render('contact-form', {
        name: req.body.name || ''
    });
});

router.get('/home', (req, res) => {
    console.log(req.session);
    res.render('home', {
        name: req.session.name || 'anonyme'
    });
});

router.get('/upload', csrfProtection, (req, res) => {
    res.render('upload-form', {
        token: req.csrfToken()
    });
});

router.post('/upload', [photoUploadManager, csrfProtection], (req, res) => {
    req.flash('info', 'Votre photo est enregistrée');
    res.redirect('/home');
});


module.exports = router