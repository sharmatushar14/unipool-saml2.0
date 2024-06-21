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

//Allowing Passport to deserialize the user correctly based on the session.
router.use(passport.initialize());


//Parsing the body of the request and implementing Passport middleware
router.use(session(config.session));
router.use(passport.initialize());
router.use(passport.session({
    //Session to be stored in the memory by default
    secret: config.session.secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: true, // Secure cookies in production
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 // 1 day
    }
}));
router.use(express.urlencoded({ extended: false })); 
router.use(express.json()); 

//Rules for defining the APIs
router.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin',  req.header('origin'));
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');

    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }

    next();
});

const corsOptions = {
    origin: ["https://unipoolsamlclient.vercel.app"], // Allow requests from localhost:3000 or production frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
    credentials: true // Allow credentials (cookies, authorization headers, etc.)
};

router.use(cors(corsOptions));

//Passport and SAML Routes for defining login and IDP callback, defined URLS on OKTA developer console
router.get('/login', passport.authenticate('saml', config.saml.options), (req, res, next) => {
    return res.redirect("https://unipoolsamlclient.vercel.app");
});

//After successful IDP Authentication, callback redirecting to frontend /from route of UniPool Application
router.post('/login/sso/callback', passport.authenticate('saml', config.saml.options), (req, res, next) => {
    return res.redirect("https://unipoolsamlclient.vercel.app/from"); //Current, as per Local ENV
});

//Will be using these route to verify at frontend to get the username as nameID from OKTA IDP
router.get('/verify', (req, res, next) => {
    console.log('Session ID:', req.sessionID);
    console.log('Session:', req.session); 
    if (!req.isAuthenticated()) {
        console.log('User not authenticated');

        return res.status(401).json({
            message: 'Unauthorized'
        });
    } else {
        console.log('User authenticated');
        console.log(req.user);
        return res.status(200).json({ user: req.user });
    }
});



//Health Check Route
router.get('/healthcheck', (req, res, next) => {
    return res.status(200).json({ messgae: 'Server is running!' });
});


//Defining logout route
//Accessed the logoutURL && logoutCallbackUrl by providing unique signature certificate of OKTA IDP
router.post('/logout', (req, res) => {
    //Getting the nameID from the frontend, indicating to the current user session and details
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
            res.clearCookie('connect.sid'); // Clear session cookie
            res.redirect(process.env.FRONTEND_URL); // Redirect to frontend
        });
    });
});
    
//Logout callback route for OKTA IDP Dev Console
//Returning back to frontend, as per local environment
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