const {db} = require('../util/admin');
const {validateCommande, validateProduct, validateCompany} = require('../util/validators');

exports.getAllFactures = (request, response) => {
    console.log('factures');
   db.collection('facture')
   .orderBy('createdAt', 'desc').get()
   .then(data => {
           let factures = [];

           data.forEach((doc) => {
               factures.push({
                   factureId: doc.id,
                   companyName: doc.data().companyName,
                   totalPrice: doc.data().totalPrice,
                   createdAt: doc.data().createdAt
                   
               });
           });

          return  response.status(200).json(factures);
   })
   .catch(error => console.error(error));
}

exports.getAllCompanies = (request, response) => {
   
   db.collection('compagnie').get()
   .then(data => {
           let companies = [];

           data.forEach((doc) => {
               companies.push({
                   
                   companyName: doc.id,
                   address: doc.data().address,
                   tel: doc.data().tel
                   
               });
           });

          return  response.status(200).json(companies);
   })
   .catch(error => console.error(error));
}

exports.getAllProducts = (request, response) => {
   
    db.collection('product').get()
    .then(data => {
            let products = [];
 
            data.forEach((doc) => {
                products.push({
                    
                    product: doc.id,
                    defaultPrice: doc.data().defaultPrice,
                    description: doc.data().description
                    
                });
            });
 
           return  response.status(200).json(products);
    })
    .catch(error => console.error(error));
 }

exports.postFacture = (request, response) => {
    const facture = {
       companyName: request.body.companyName,
       totalPrice: request.body.totalPrice,
       createdAt: new Date().toISOString(),
       commandes: request.body.commandes
    };

    db.collection('facture').add(facture)
    .then((doc) => {
      return response.status(200).json({message: `Votre facture a été créée avec succès`});
    })
    .catch(error => 
        {console.error(error)
        
            return response.status(500).json({error: 'Désolé!!! Une erreur s\'est produite, Veuillez rééssayer...'});
        });
};

exports.getOneFacture = (request, response) => {

    let factureData = {};
    db.doc(`facture/${request.params.factureId}`).get()
    .then(doc => {
        if(!doc.exists){
            return response.status(403).json({message:'Cette facture n\'existe pas'});
        }

        factureData = doc.data();
        factureData.factureId = doc.id;

        return db.collection('commande').where('factureId', '==', request.params.factureId).get();
    })
    .then(data => {
        
        factureData.commandes = [];
        data.forEach(doc => {
           
                factureData.commandes.push(doc.data());
        });

        return db.doc(`compagnie/${factureData.companyName}`).get()        
    })
    .then(doc => {
        factureData.companyDetails = doc.data();
        
        return response.json({factureData});
    })
    .catch(error => {
        console.error(error);
        response.status(500).json({error});
    })
};

exports.createCommande = (request, response) => {
    const commandeData = {
        factureId : request.params.factureId,
        commandes: request.body.commandes
    };

    //const {errors, valid} = validateCommande(commandeData);
    //if(!valid)return response.status(404).json(errors);
    
     db.collection('commande').add(commandeData)
     .then(() => {
        return response.status(201).json({message: "Commande created succesfully"})
     })
     .catch(error => {
         console.log(error);
         return response.status(500).json({error: error.code});
     })
    
}

exports.createProduct = (request, response) => {

    const productData = {
        product: request.body.product,
        defaultPrice: request.body.defaultPrice,
        description: request.body.description
    }

    const {errors, valid} = validateProduct(productData);
    if(!valid)return response.status(400).json(errors);
    
    db.doc(`product/${productData.product}`).get()
    .then(doc => {
        if(doc.exists){
            return response.status(403).json({message: 'Ooops!!! ce produit existe déjà !'});
        }

      return  db.collection('product').doc(productData.product).set({
            defaultPrice: productData.defaultPrice,
            description: productData.description
        }, {merge: true})
    })
    .then(() => {
        return response.status(201).json({message: 'Votre produit a été enregistré'})
    })
    .catch(error => {
        console.error(error);
        return response.json({error: error.code});
    });
};

exports.createCompany = (request, response) => {

    const companyData =  {
        company : request.body.company,
        tel: request.body.tel,
        address: request.body.address
    };

    const {errors, valid} = validateCompany(companyData);
    if(!valid)return response.status(404).json(errors);

    db.doc(`compagnie/${companyData.company}`).get()
    .then(doc => {
        if(doc.exists){
            return response.status(403).json({message: 'Cette compagnie fait déjà partie de vos clients'});
        }

      return  db.collection('compagnie').doc(companyData.company).set({
            tel: companyData.tel,
            address: companyData.address
        })
    })
    .then(() => {
        return response.status(201).json({message: 'Félicitations!!! Un client de plus à votre actif'})
    })
    .catch(error => {
        console.error(error);
        return response.json({error: error.code});
    });
};


