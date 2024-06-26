import http from 'http';
import express from 'express';
import session from 'express-session';
import passport from 'passport';
import config from './config/config.js';
import cors from 'cors';
import './config/passport.js';
import { savedUsers } from './config/passport.js';
import 'dotenv/config';

const router = express();
const httpServer = http.createServer(router);

//Parsing the body of the request and implementing Passport middleware
router.use(passport.initialize());

//Configuring the session
router.use(session(config.session));
router.use(passport.session({
    secret: config.session.secret,
    secure: true, //Production ENV
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: 'auto',
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24,
        sameSite: 'None', //Scenarios for SSO across different redirects.
        domain: '.vercel.app'
      }
}));

router.use(express.urlencoded({ extended: false })); 
router.use(express.json()); 

const corsOptions = {
    origin: "https://unipoolsamlclient.vercel.app", 
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
    credentials: true // Allow credentials (cookies, authorization headers, etc.)
};

router.use(cors(corsOptions));

//Rules for defining the APIs
router.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', req.header('origin'));
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');

    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }

    next();
});

//Passport and SAML Routes for defining login and IDP callback, defined URLS on OKTA developer console
router.get('/login', passport.authenticate('saml', config.saml.options), (req, res, next) => {
    return res.redirect(process.env.FRONTEND_URL);
});

//After successful IDP Authentication, callback redirecting to frontend /from route of UniPool Application
router.post('/login/sso/callback', passport.authenticate('saml', config.saml.options), (req, res, next) => {
    return res.redirect(process.env.FRONTEND_URL_HOME); 
});

//Route to verify at frontend to get the username as nameID from OKTA IDP
router.get('/verify', (req, res, next) => {
    if (!req.isAuthenticated()) {

        return res.status(401).json({
            message: 'Unauthorized'
        });
    } else {
        return res.status(200).json({ user: req.user });
    }
});

//Health Check Route
router.get('/healthcheck', (req, res, next) => {
    return res.status(200).json({ messgae: 'Server is running!' });
});

//Defining logout route
router.post('/logout', (req, res) => {
    //Accessed the logoutURL && logoutCallbackUrl by providing unique signature certificate of OKTA IDP
    const { nameID } = req.body;
    req.logout((err) => {
        if (err) {
            console.error('Error logging out:', err);
            return res.status(500).json({ message: 'Logout failed' });
        }

        // Remove user from savedUsers
        const userIndex = savedUsers.findIndex(user => user.nameID === nameID);
        if (userIndex > -1) {
            savedUsers.splice(userIndex, 1);
        }

        req.session.destroy((err) => {
            if (err) {
                console.error('Error destroying session:', err);
                return res.status(500).json({ message: 'Session destruction failed' });
            }
            res.clearCookie('connect.sid'); 
            res.redirect(process.env.FRONTEND_URL); 
        });
    });
});
    
//Logout callback route for OKTA IDP Dev Console
router.post('/logout/callback', (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.session.destroy(() => {
            res.redirect(process.env.FRONTEND_URL);
        });
    });
});

//Error Handling
router.use((req, res, next) => {
    const error = new Error('Not found');

    res.status(404).json({
        message: error.message
    });
});

httpServer.listen(process.env.PORT, () => console.log(`Server is running on port ${process.env.PORT}`));