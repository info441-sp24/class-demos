import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import sessions from 'express-session'

// To install msal-node-wrapper, run:
//     npm install https://gitpkg.now.sh/kylethayer/ms-identity-javascript-nodejs-tutorial-msal-node-v2-/Common/msal-node-wrapper?main

import WebAppAuthProvider from 'msal-node-wrapper'
// original msal-node-wrapper code is here 
//    (https://github.com/Azure-Samples/ms-identity-javascript-nodejs-tutorial/tree/main/Common/msal-node-wrapper),
//  but at the time of making this, the original code depends on outdated version of @azure/msal-node 

const authConfig = {
	auth: {
		clientId: "Client ID or Application ID HERE",
        authority: "https://login.microsoftonline.com/Paste_the_Tenant_directory_ID_Here",
        clientSecret: "Client or Application secret here (NOT THE 'secret id', but the 'secret value')",
        redirectUri: "/redirect"
	},

	system: {
    	loggerOptions: {
        	loggerCallback(loglevel, message, containsPii) {
            	console.log(message);
        	},
        	piiLoggingEnabled: false,
        	logLevel: 3,
    	}
	}
};


import usersRouter from './routes/users.js';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

var app = express();

// When you deploy to azure, your project will run on http://localhost inside a secure container, and the
// container will convert the http://localhost requests to "https" requests at your url on the public internet
//
// By default, express doesn't trust the https in your site's url if it sees it is running on http://localhost,
// and will switch any "https"s to "http"s
// 
// The code below tells express to trust the "https" in your site's url, so it will correctly
// use "https" in the redirectUri on your deployed app
app.enable('trust proxy')

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const oneDay = 1000 * 60 * 60 * 24
app.use(sessions({
    secret: "this is some secret key I am making up p8kn fwlihftrn3oinyswnwd3in4oin",
    saveUninitialized: true,
    cookie: {maxAge: oneDay},
    resave: false
}))

const authProvider = await WebAppAuthProvider.WebAppAuthProvider.initialize(authConfig);
app.use(authProvider.authenticate());

app.use('/users', usersRouter);

app.get('/signin', (req, res, next) => {
    return req.authContext.login({
        postLoginRedirectUri: "/", // redirect here after login
    })(req, res, next);

});
app.get('/signout', (req, res, next) => {
    return req.authContext.logout({
        postLogoutRedirectUri: "/", // redirect here after logout
    })(req, res, next);

});

/**
 * This error handler is needed to catch interaction_required errors thrown by MSAL.
 * Make sure to add it to your middleware chain after all your routers, but before any other 
 * error handlers.
 */

app.use(authProvider.interactionErrorHandler());


export default app;
