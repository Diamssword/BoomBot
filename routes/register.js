const { forwardAuthenticated } = require('../config/auth');
const USER = require('../models/users')
const bcrypt = require('bcryptjs');
const passport = require('passport');
async function router(router) {
    router.get('/register', forwardAuthenticated, async (req, res) => {
        res.render('register.ejs');
    });

    router.post('/register', async (req, res) => {
        const { name, password, confirm } = req.body;
        if (name, password, confirm) {
            if (password == confirm) {

                const d = new Date();
                const str = d.getFullYear().toString().substring(2)+d.getMonth().toString()+d.getDay().toString()+d.getHours().toString()+d.getMinutes().toString();
                new USER({ NAME: name, MDP: bcrypt.hashSync(password, 10),CODE:str }).save().then((doc) => {
                    req.flash('success', "Compte crée! Redirection...");
                    res.redirect("/register?redirect='true'");
                    passport.authenticate('local', {
                        successRedirect: '/manager',
                        failureRedirect: '/connexion',
                        failureFlash: true
                    })(req, res, next);
                }).catch(err => {
                    if (err) {
                        if (err.keyPattern && err.keyPattern['NAME']) {
                            req.flash('error', "Pseudo déja pris!");
                            res.redirect("/register")
                        } else
                            console.log(err);
                    }
                });
                return;
            }
            else
                req.flash('error', "Les 2 champs de mot de passe sont differents");

        }
        else {
            req.flash('error', "Champs incomplets");
        }
        res.redirect("/register")
    });
}

module.exports = router;