const express = require('express');
const passport = require('passport');
const router = express.Router();

const checkAuth = require('../functions/checkAuth');
const instance = require('../functions/instance');

router.get('/', async (req, res) => {
    res.render('index', {
        tag : (req.user ? req.user.tag : "login"),
        bot: req.client,
        user: req.user || null,
    })
});

router.get('/login', passport.authenticate('discord', { failureRedirect: "/" }), async function(req, res) {
    if(!req.user.id || ! req.user.guilds) {
        res.redirect('/');
        return;
    } else res.redirect('/');
});

router.get('/logout', async(req, res, next) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
});

router.get('/profile', checkAuth, async (req, res) => {
    res.render('Profile/profile_components', {
        tag : (req.user ? req.user.tag : "login"),
        bot: req.client,
        user: req.user || null,
    })
})

// router.get('/test', checkAuth, async (req, res) => {
//     res.render('Profile/profile_test', {
//         tag : (req.user ? req.user.tag : "login"),
//         bot: req.client,
//         user: req.user || null,
//         db: req.db.query(`SELECT * FROM profile WHERE userID = ${req.user.id}`)
//     })
// })
router.get('/test', checkAuth, async (req, res) => {
    req.db.query(`SELECT * FROM profile WHERE userID = ${req.user.id}`, function(err, result) {
        console.log(result);
        if (err) {
            console.error(err);
            res.status(500).send('Erreur du serveur');
        } else {
            res.render('Profile/profile_test', {
                tag: (req.user ? req.user.tag : "login"),
                bot: req.client,
                user: req.user || null,
                result: result, // Récupère le prénom depuis le résultat de la requête
            });
        }
    });
});
router.get('/docs', checkAuth, async (req, res) => {
    res.render('Documentation/docs_components', {
        tag : (req.user ? req.user.tag : "login"),
        bot: req.client,
        user: req.user || null,
    })
})

router.get('/subs', checkAuth, async (req, res) => {
    res.render('Subscriptions/subs_components', {
        tag : (req.user ? req.user.tag : "login"),
        bot: req.client,
        user: req.user || null,
    })
})

module.exports = router;