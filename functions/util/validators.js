const isEmpty = (string) => {
    return (string.trim() === '');
}
const isEmail = (email) => {
  const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(email);
}

const isPasswordValid = (password) => {
    return (password.length < 6);
}

const isQuantityValid = (qty) => {
    const regx = /^[0-9]+$/;
    return (regx.test(qty) && qty > 0);
}

const isPriceValid = (price) => {
    const regx = /^[0-9]+$/;
    return (regx.test(price) && price >=0);
}

exports.validateLogin = (data) => {
    let errors = {};
    if(isEmpty(data.email)){
        errors.email = 'le champ email ne doit pas être vide';
    }
    else if(!isEmail(data.email)){
        errors.email = "Veuillez entrez un email valide";
    }
    if(isEmpty(data.password)){
        errors.password = 'le mot de passe ne doit pas être vide';
    }
    

    return {
        errors,
        valid: (Object.keys(errors).length > 0)? false : true
    };
}

exports.validateSignup = (data) => {
    let errors = {};
    if(isEmpty(data.email)){
        errors.email = 'le champ email ne doit pas être vide';
    }
    else if(!isEmail(data.email)){
        errors.email = "Veuillez entrez un email valide";
    }
  
    if(isEmpty(data.password)){
        errors.password = 'le mot de passe ne doit pas être vide';
    }
    else if(isPasswordValid(data.password)){
        errors.password = 'Votre mot de passe contient moins de 6 charactères';
    }
    else if(data.password !== data.confirmPassword){
        
        errors.confirmPassword = 'Vos mots de passe ne correspondent pas';
    }
    

    return {
        errors,
        valid: (Object.keys(errors).length > 0)? false : true
    }
};

exports.validateCommande = (data) => {
    let errors = {};
    if(isEmpty(data.product)){
        errors.product = 'Entrez une désignation de produit !';
    }

    if(isEmpty(data.price)){
        errors.price = 'Vous devez entrer un prix !'
    }
    else if(!isPriceValid(data.price)){
        errors.price = 'Entrez un prix valide'
    }

    if(!isQuantityValid(data.qty)){
        errors.qty = 'Entrez une quantité valide'
    }

    return {
        errors,
        valid: (Object.keys(errors).length > 0)? false : true
    }
};

exports.validateProduct = (data) => {
    let errors = {};
    if(isEmpty(data.product)){
        errors.product = 'Entrez une désignation de produit !';
    }

    
     if(!isPriceValid(data.defaultPrice)){
        errors.defaultPrice = 'Vous devez entrer un prix valide'
    }

    return {
        errors,
        valid: (Object.keys(errors).length > 0)? false : true
    }
}

exports.validateCompany = (data) => {
    let errors = {};

    if(isEmpty(data.company)){
        errors.company = 'Entrez le nom de la compagnie concernée !';
    }

    return {
        errors,
        valid: (Object.keys(errors).length > 0)? false : true
    }

}