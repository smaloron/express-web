const router = require('express').Router();
const bcrypt = require('bcrypt');
const userDAO = require('../models/user-dao');
const uploadManager = require('../middlewares/upload-middleware');


const checkIfUserIsLoggedIn = (req, res, next) => {
    if(req.session.user){
        return next();
    }

    req.flash('info', 'Vous devez vous authentifier');
    res.redirect('/login');
}

const validateRegister = async (req, errors) => {
    if (req.body.email != req.body.email_confirm) {
        errors.push("L'email et sa confirmation doivent être identiques");
    }
    if (req.body.password != req.body.password_confirm) {
        errors.push("Le mot de passe et sa confirmation doivent être identiques");
    }

    if (req.body.password.length < 8 || req.body.password.length > 15) {
        errors.push('Le mot de passe doit comporter entre 8 et 15 caractères');
    }

    if (req.body.user_name.length === 0) {
        errors.push('Le nom ne peut être vide');
    }

    if (req.body.user_firstName.length === 0) {
        errors.push('Le prénom ne peut être vide');
    }

    if(await userDAO.checkIfEmailAlreadyExists(req.body.email)){
        errors.push('Cette adresse email existe déjà');
    }

    return errors.length === 0;
}

router.all('/register', uploadManager,  async (req, res, next) => {
    const errors = [];
    if(req.method === "POST" && await validateRegister(req, errors)){
       const salt = await bcrypt.genSalt(1);
       const hash = await bcrypt.hash(req.body.password, salt);
       delete req.body.password;
       delete req.body.password_confirm;
       delete req.body.email_confirm;

        if(req.uploadedFileName){
            req.body.photo = req.uploadedFileName;
        }

       req.body.hashed_password = hash;

       try {
        await userDAO.insert(req.body);
        req.flash('info', 'Votre inscription est enregistrée');
        req.session.user = req.body;
        return res.redirect('/secure/home');
       } catch(err){
           next(err);
       }

    }

    res.render('security/register', {errors});
});

router.get('/secure/home', checkIfUserIsLoggedIn, (req, res) => {
    res.render('secure/home');
});

router.get('/login', (req, res)=> {
    res.render('security/login');
});

router.post('/login', async (req, res) => {
    const user = await userDAO.findOneBy('email', req.body.email);
    const ok = await bcrypt.compare(req.body.password, user.hashed_password);
    if(ok){
        req.flash('info', 'Vous êtes authentifié');
        delete user.hashed_password;
        req.session.user = user;
        res.redirect('/secure/home');
    } else {
        req.flash('info', 'Vos infos de connexion sont incorrectes');
        res.redirect('/login');
    }
});


module.exports = router;


