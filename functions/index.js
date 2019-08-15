const functions = require('firebase-functions');
const express = require('express');
const app = express();
const FBAuth = require('./util/FBAuth');
const cors = require('cors');


const {getAllFactures, 
        postFacture, 
        getOneFacture,
        createCommande,
        createProduct,
        createCompany,
        getAllCompanies,
        getAllProducts
        } = require('./handlers/factures');

const {signup, login} = require('./handlers/users');

 app.use(cors({ origin: true }));

 app.get('/factures', FBAuth,getAllFactures );
 app.get('/companies', FBAuth, getAllCompanies );
 app.get('/products', FBAuth, getAllProducts );
 app.post('/createFacture', FBAuth, postFacture);
 app.get('/factures/:factureId', FBAuth, getOneFacture);
 app.post('/factures/:factureId/commande', FBAuth, createCommande);
 app.post('/createProduct', FBAuth, createProduct);
 app.post('/createCompany', FBAuth, createCompany);



//signup route
app.post('/signup', signup);
app.post('/login', login);

//TODO: manage user
//TODO: set user role
// TODO secure the signup route 

exports.api = functions.https.onRequest(app);