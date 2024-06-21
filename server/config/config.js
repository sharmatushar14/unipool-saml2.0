import 'dotenv/config';
const config = {
    // Creating an object for SAML Configuration with SSO OKta Dev 
    // Referred from Okta Dev Docs
    //This file is for referring configurations
    saml: {
        cert: process.env.cert,
        entryPoint: process.env.entryPoint,
        issuer: process.env.BACKEND_URL,
        options: {
            failureRedirect: '/login',
            failureFlash: true
        }
    },
    server: {
        port: process.env.PORT
    },
    session: {
        //Making valid states for session, no need to refactor the session at every request
        resave: false,
        secret: process.env.SECRET,
        saveUninitialized: false
    }
};

export default config;