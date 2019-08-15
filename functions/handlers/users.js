const {db} = require('../util/admin');
const firebaseConfig = require('../util/config');
const firebase = require('firebase');
firebase.initializeApp(firebaseConfig);
const {validateSignup, validateLogin} = require('../util/validators');

exports.signup = (request, response) => {
  
    const newUser = {
        email: request.body.email,
        password: request.body.password,
        confirmPassword: request.body.confirmPassword
    }
  
    const {errors, valid} = validateSignup(newUser);
    if(!valid)return response.status(404).json(errors);
  
    firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password)
    .then(() =>{
        return response.status(201).json({message: 'L\'utilisateur a été ajouté avec succès !'});
    })
    .catch(error => {
        if(error.code === "auth/email-already-in-use"){
            return response.status(400).json({email: "Cet email est déjà en cours d'utilisation"})
        }
        else{
            return response.status(500).json({error: error.code});
        }
        
    
    });
  }

  exports.login = (request, response) => {
       
    const user = {
        email: request.body.email,
        password: request.body.password
    };
    

    
    const {errors, valid} = validateLogin(user);
    if(!valid)return response.status(404).json(errors);

    firebase.auth().signInWithEmailAndPassword(user.email, user.password)
    .then(data => {
        return data.user.getIdToken();  
    })
    .then(token => {
        return  response.status(200).json({token});
    })
    .catch(error => {
        if(error.code === "auth/wrong-password"){
            return response.status(403).json({general: 'Vos identifiants sont incorrectes, Réessayez!!!'})
        }
        else if(error.code === "auth/user-not-found"){
            return response.status(400).json({general: "Cet utilisateur n'existe pas"}) 
        }
        else{
            console.error(error);
            return response.status(500).json({error: error.code});
        }
        
    })
};


