const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session')
const ejs = require('ejs');
const passport = require('passport');
const { Strategy } = require('passport-discord');
const colors = require('colors');

const app = express();

module.exports.load = async(client, con) => {
    app.use(bodyParser.urlencoded({ extended : true}));;
    app.use(bodyParser.json());
    app.engine('html', ejs.renderFile);
    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, '../dashboard/views'));
    app.use(express.static(path.join(__dirname, '../dashboard/public')));
    app.use(session({
        secret: "BotDashboard",
        resave: false,
        saveUninitialized: false
    }))

    app.use(async function(req, res, next) {
        req.client = client;
        req.db = con;
        next()
    })

    app.use(passport.initialize())
    app.use(passport.session())

    passport.serializeUser((user, done) => {
        done(null, user)
    })

    passport.deserializeUser((obj, done) => {
        done(null, obj)
    })

    passport.use(new Strategy({
        clientID : "994388669605625876",
        clientSecret: 'gu3WYf3lCfpqxaFcyz-4u-QL1Ap8NU7d',
        callbackURL: 'http://localhost:90/login',
        scope: ['identify', 'email', 'guilds']
    }, function(accessToken, refreshToken, profile, done) {
        process.nextTick(function() {
            return done(null, profile);
        });
    }));

    app.get('/', require('./routes/main'));
    app.get('/login', require('./routes/main'));
    app.get('/logout', require('./routes/main'));
    app.get('/profile', require('./routes/main'));
    app.get('/docs', require('./routes/main'));
    app.get('/subs', require('./routes/main'));
    app.get('/test', require('./routes/main'));

    app.listen(90, () => console.log(`WEB > `.bold.white + `Web server has been started.`.bold.green ));
}