module.exports = {
    ensureAuthenticated: function(req , res , next) {
        if (req.isAuthenticated()) {
            res.status(401);
            return next();
        }
        req.flash('warning_msg' , 'Veuillez vous connecter à votre session !');
        res.redirect('/connexion');
    },

    forwardAuthenticated: function(req , res , next) {
        if (!req.isAuthenticated()){
            return next();
        }
        req.flash('warning_msg' , "Vous êtes déjà connecté");
        res.redirect('/nav_CDR');
    }
};