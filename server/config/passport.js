import fs from 'fs';
import passport from 'passport';
import { Strategy } from 'passport-saml';
import config from './config.js';
import 'dotenv/config'

const savedUsers = [];

// Serializing and Deserializing with passport
passport.serializeUser((currUser, cb) => {
    console.log(currUser, 'Serialize User');
    cb(null, currUser);
});

passport.deserializeUser((currUser, cb) => {
    console.log(currUser, 'Deserialize User');
    cb(null, currUser);
});

passport.use(
    new Strategy(
        {
            issuer: config.saml.issuer,
            protocol: 'https://',
            path: '/login/sso/callback',
            entryPoint: config.saml.entryPoint,
            // cert: fs.readFileSync(config.saml.cert, 'utf-8'),
            cert: process.env.cert,
            logoutUrl: process.env.logoutUrl,
            logoutCallbackUrl:  process.env.logoutCallbackUrl,
        },
        (servedUser, done) => {
            if (!savedUsers.includes(servedUser)) {
                savedUsers.push(servedUser);
            }

            return done(null, servedUser);
        }
    )
);

export {savedUsers}