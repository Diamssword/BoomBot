const { forwardAuthenticated } = require('../config/auth');
const passport = require('passport');

async function router(router) {
    router.get('/connexion' , forwardAuthenticated , async (req , res) => {
        res.render('connexion.ejs');
    });

    router.post('/connexion' , async (req , res , next) => {
        passport.authenticate('local' , {
            successRedirect: '/manager',
            failureRedirect: '/connexion',
            failureFlash: true
        })(req , res , next);
    });
}

module.exports = router;