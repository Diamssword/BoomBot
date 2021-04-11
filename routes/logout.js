module.exports = async function(router) {
    router.get('/logout' , async (req , res) => {
        if(!req.isAuthenticated()){
            res.status(400);
            req.flash('error_msg' , "Vous n'êtes pas connecté");
            return res.redirect('/connexion');
        }

        req.logout();
        req.flash('success_msg' , "Vous êtes bel et bien déconnecté");
        res.redirect('/connexion');
    });
}