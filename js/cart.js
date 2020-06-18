//------------------------------------ Definition des variables globales -----------------------

const ajax = new Ajax()
let localStorageCartContent = [];
let consolidatedList = [];
let totalCost = 0;
let serverProductList = [];
let serverAnswer = [];
let orderId = '';
let orderPrice = '0';

class ProductItem { // tableau avec le contenu d'un article (produit)
    constructor (id, quantity, lense, price) { 
        this.id = id; // l'id du produit
        this.quantity = quantity; // la quantité
        this.lense = lense; // la lentille
        this.price = price; // le prix
    }
}

class contactObject {
    constructor(firstname, lastname, address, city, email){
        this.firstname = firstname;
        this.lastname = lastname;
        this.address = address;
        this.city = city;
        this.email = email;
    }
}

let contact = new contactObject()
console.log(contact);

//------------------------------------ Execution -----------------------

ajax.get('http://localhost:3000/api/cameras').then((products) => {
    serverProductList = products;
    displayProductListInformation()
    createDeleteBouttonForAll()
    formValid();
}, (err) => {
    console.log(err)
})


//------------------------------------ Definition des fonctions -----------------------

//-----------------------------------------------
// Function name:   getCartFromLocal
// Description:     récupérer les produits du stockage local
// Inputs:          -
// Outputs:         un tableau 

function getCartFromLocal() { 
    localStorageCartContent = localStorage.getItem('storedCartContent') // on crée une variable pour le contenu du panier dans le stockage local
    if (localStorageCartContent == null){ // Si le panier est vide
        localStorageCartContent = [] // on crée un tableau
    } else {
        localStorageCartContent = JSON.parse(localStorageCartContent) // on transforme le contenu en un tableau d'objet (pour que soit lisible par JS)
        // console.log(localStorageCartContent)
    }
}

//-----------------------------------------------
// Function name:   displayCartNumber
// Description:     afficher le numéro d'articles dans le panier
// Inputs:          -
// Outputs:         le nombre des produits dans la local storage

function displayCartNumber() { 
    document.querySelector('#cart-item-quantity').textContent = localStorageCartContent.length // l'emplacement où il sera affiché la quantité des produits dans la liste du local storage
}

//-----------------------------------------------
// Function name:   searchSameId
// Description:     Cherche les poduits avec même ID dans le local storage ou la liste consolidée
// Inputs:          l'id recherché et la liste d'objets
// Outputs:         la liste des numéros de ligne où on trouve l'id

function searchSameId(searchedId, objectList) { 
    let searchResult = [] // crée une variable avec un tableau pour les produits recherchés
    for (let i = 0; i < objectList.length; i++) { // boucle pour la liste d'objets
        if (objectList[i].id === searchedId) { // Si l'id de l'objet numéro i est égal à l'id recherché
            searchResult.push(i); // on enregistre i (numéro de ligne dans le tableau d'objet) à la suite du tableau du résultat de recherche
        } 
    }
    return searchResult;
}

//-----------------------------------------------
// Function name:   searchSameId2
// Description:     Cherche les poduits avec même ID sur le serveur  
// Inputs:          l'id recherché et la liste d'objets
// Outputs:         le numéro de ligne où on trouve l'id

function searchSameId2(searchedId, objectList) { 
    let searchResult = 0 // crée un tableau avec 0
    for (let i = 0; i < objectList.length; i++) { // boucle pour la liste d'objets
        if (objectList[i]._id === searchedId) { // Si l'id de l'objet numéro i est égal à l'id recherché
            searchResult=i; // on enregistre i (numéro de ligne dans le tableau d'objet)
        } 
    }
    return searchResult; 
}

//-----------------------------------------------
// Function name:   searchSameLense
// Description:     Cherche les poduits avec la même lentille parmis ceux qui ont la même id
// Inputs:          x
// Outputs:         la liste des numéros de ligne où on trouve le même id et la même lentille

function searchSameLense(searchedLense, objectList, candidateItems) { 
    let searchResult = [] // crée un tableau
    for (let i = 0; i < candidateItems.length; i++) {
        if (objectList[candidateItems[i]].lense === searchedLense) { // Si la lentille de l'objet numéro i est le même que la lentille recherchée
            searchResult.push(candidateItems[i]); // on enregistre candidateItems d'i (numéro de ligne dans le tableau d'objet) à la suite du tableau du résultat de recherche
        } 
    }
    return searchResult;
}


// class ProductItem { // tableau avec le contenu d'un article (produit)
//     constructor (id, quantity, lense, price) { 
//         this.id = id; // l'id du produit
//         this.quantity = quantity; // la quantité
//         this.lense = lense; // la lentille
//         this.price = price; // le prix
//     }
// }

//-----------------------------------------------
// Function name:   idCompare
// Description:     Définir le critère de tri suivant l'id
// Inputs:          les id
// Outputs:         identification s'ils ont le même id ou non

function idCompare(a, b) { 
    const idA = a.id; // comparer deux Id
    const idB = b.id; // comparer deux Id
  
    let comparison = 0;
    if (idA > idB) {
      comparison = 1;
    } else if (idA < idB) {
      comparison = -1;
    }
    return comparison;
}
  
//-----------------------------------------------
// Function name:   consolidateCartList
// Description:     Consolider la liste trié par les id et les lentilles
// Inputs:          -
// Outputs:         liste avec les produits groupés par le même id et la même lentille

function consolidateCartList() {
    consolidatedList = []; 
    let resultSameID = []; // création de la liste de numéro de ligne dans le tableau d'objet des produits selon l'id
    let resultSameLense = []; // création de la liste de numéro de ligne dans le tableau d'objet des produits selon la lentille
    console.log(localStorageCartContent);

    if (localStorageCartContent.length > 0){
        let newItem = new ProductItem; // création d'un objet vide 
        console.log(newItem);

        newItem.id = localStorageCartContent[0].id; // recopie les informations depuis le produit i du panier vers newItem
        newItem.quantity = 1; // on donne 1 comme quantité
        newItem.lense = localStorageCartContent[0].lense; // recopie les informations depuis le produit i du panier vers newItem

        consolidatedList.push(newItem); // ajout de newItem à la liste qui sera à retourner
        console.log(consolidatedList);

        for (let i = 1; i < localStorageCartContent.length; i++) { // boucle pour tous les produits contenus dans le panier
            let currentId = localStorageCartContent[i].id; // on recupére l'id du produit numéro i dans le panier
            console.log(currentId);

            resultSameID = searchSameId(currentId, consolidatedList); // recherche du même id dans la liste consolidée
            resultSameLense = searchSameLense(localStorageCartContent[i].lense, consolidatedList, resultSameID); // recherche la même lentille dans la liste consolidée

            if (resultSameID.length > 0 && resultSameLense.length > 0 ) { // si l'id existe déjà dans la liste consolidée et si la lentille existe dejà dans la liste consolidée
                consolidatedList[resultSameLense[0]].quantity++; // il incremente la quantité de lentilles
            } else {
                let newItem2 = new ProductItem; // création d'un objet vide 
                newItem2.id = currentId; // recopie les informations depuis le produit i du panier vers newItem
                newItem2.quantity = 1; // on donne 1 comme quantité
                newItem2.lense = localStorageCartContent[i].lense; // recopie les informations depuis le produit i du panier vers newItem
                // console.log(newItem2);
                consolidatedList.push(newItem2); // ajout de newItem à la liste qui sera à retourner
                }
        }
        consolidatedList.sort(idCompare); 
    }
}

//-----------------------------------------------
// Function name:   displayCartItems
// Description:     Affichage de chaque produit dans le panier dans le DOM (HTML)
// Inputs:          x
// Outputs:         x

function displayCartItems(i, consolidatedListItem, itemServerInformation, itemTypeCost) { 
    const listProductHtml = document.querySelector('#product-display-zone'); // on défine l'endroit où il va afecter le HTML
    const productListItem = document.createElement('div'); // on démande de créer une balise <div>
    let lenseText = consolidatedListItem.lense; // variable pour les options des lentilles
    if (lenseText == "") { // s'il n'y a pas d'option selecctionée
        lenseText = "-" // on ajoute un tiret
    }
    productListItem.innerHTML =  // on crée la partie ci-dessous en HTML
                '<div id="panier-items">'+                
                    '<div class="panier-product">'+
                        '<img class="product-image" src="' + itemServerInformation.imageUrl + '" alt="">'+ // on récupère l'image du serveur
                    '</div>'+
                    '<div class="panier-product">'+
                        '<div class="product-info">'+
                            '<h3>PRODUIT</h3>'+
                        '</div>'+
                        '<div class="product-info">'+
                            '<p class="product-name">' + itemServerInformation.name + '</p>'+ // on récupère le nom du produit du serveur
                        '</div>'+
                    '</div>'+
                    '<div class="panier-product">'+
                        '<div class="product-info">'+
                            '<h3>QTE</h3>'+
                        '</div>'+
                        '<div class="product-info">'+
                            '<p class="product-quantity">' + consolidatedListItem.quantity + '</p>'+ // on récupère la quantité dans la liste consolidée
                        '</div>'+
                    '</div>'+
                    '<div class="panier-product">'+
                        '<div class="product-info">'+
                            '<h3>LENTILLE</h3>'+
                        '</div>'+
                        '<div class="product-info">'+
                            '<p class="product-quantity">' + lenseText + '</p>'+ // on utilise la variable lenseText
                        '</div>'+
                    '</div>'+
                    '<div class="panier-product">'+
                        '<div class="product-info">'+
                            '<h3>PRIX</h3>'+
                        '</div>'+
                        '<div class="product-info">'+
                            '<p class="product-price">' + separateThousands(itemTypeCost) + ' €</p>'+ // on utilise la variable pricePerItem
                        '</div>'+
                    '</div>'+
                    '<div class="btn-remove">'+
                        '<button id="delete-product' + i +'"><img src="images/trash.png" alt="Picto supprimer"></button>'+
                    '</div>'+
                '</div>'
    listProductHtml.appendChild(productListItem); // ça applique aux childs de la liste dans le panier
}

//-----------------------------------------------
// Function name:   displayTotalCost
// Description:     Afficher le coût total
// Inputs:          -
// Outputs:         l'addition des prix des produits dans le panier

function displayTotalCost () { 
    document.querySelector('.total-cost').textContent = separateThousands(totalCost) + ' €' // l'émplacement à afficher le prix total
    document.querySelector('.panier-total--cost').textContent = separateThousands(totalCost) + ' €' // l'émplacement à afficher le prix total
}

//-----------------------------------------------
// Function name:   createDeleteBoutton
// Description:     Activer l'évenement "click" pour effacer un produit
// Inputs:          x
// Outputs:         activer la function deleteProduct

function createDeleteBoutton (i, productId, productLense) { 
    document.querySelector('#delete-product'+i).addEventListener('click', () => {
    deleteProduct(productId, productLense, false) // on active la function deleteProduct
    })
}

//-----------------------------------------------
// Function name:   createDeleteBouttonForAll
// Description:     Activer l'évenement "click" pour effacer tous les produits du panier
// Inputs:          x
// Outputs:         activer la function deleteProduct

function createDeleteBouttonForAll () {
    document.querySelector('#delete-all').addEventListener('click', () => { 
    deleteProduct('', '', true) // on active la function deleteProduct
    })
}

//-----------------------------------------------
// Function name:   deleteProduct
// Description:     Effacer un produit de la liste du panier
// Inputs:          x
// Outputs:         x

function deleteProduct(productId, productLense, deleteAll) { 
    let newCartContent = [] // on crée une nouvelle liste vide

    if (!deleteAll) { // Si la demande n'est pas de tout effacer, on exécute pas les actions dessous
        resultSameID = searchSameId(productId, localStorageCartContent); // recherche du même id dans le local storage
        resultSameLense = searchSameLense(productLense, localStorageCartContent, resultSameID); // on definie la liste d'exclusion
        
        for(let i = 0; i < localStorageCartContent.length; i++) {
            if (!resultSameLense.includes(i)) { // si le produit n'est pas dans la liste d'exclusion
                newCartContent.push(localStorageCartContent[i]) // on ajout le produit à la suite
            }
        }
    }

    localStorage.setItem("storedCartContent", JSON.stringify(newCartContent)) // on converti la liste en string pour qu'elle soit lisible par javascript. On écrasse le panier stocké en local avec le nouv contenu du panier(un produit en moins ou tout effacé)
    
    const numberOfDiv = document.getElementById("product-display-zone").childElementCount; // indique le numéro de la division à effacer
    // console.log(numberOfDiv)

    for(let i = 1; i <= numberOfDiv; i++){  // On demande d'effacer la div dans le DOM
        const productToDelete = document.querySelector('#product-display-zone div'); // on supprime la div du produit à effacer
        productToDelete.parentNode.removeChild(productToDelete);
    }

    displayProductListInformation();
}

//-----------------------------------------------
// Function name:   displayCartEmpty
// Description:     function à activer quand le panier est vide
// Inputs:          -
// Outputs:         Message que le panier est vide

function displayCartEmpty() { 
    const emptyList = document.querySelector('#product-display-zone'); // on détermine l'endroit à ajouter
    const emptyItem = document.createElement('div'); // on demande de créer une div
    emptyItem.innerHTML = '<h3 id="empty-cart">Panier vide !</h3>'; // l'élement à créer avec le texte à afficher
    console.log(emptyItem)
    emptyList.appendChild(emptyItem); // ajout un élement à la liste
}

//-----------------------------------------------
// Function name:   displayProductListInformation
// Description:     x
// Inputs:          -
// Outputs:         x

function displayProductListInformation(){
    getCartFromLocal(); // on transfère les informations du panier stocké en local vers la variable globale localStorageCartContent
    displayCartNumber(); // on appelle la function displayCartNumber
    consolidateCartList(); // on crée la variable avec la function consolidateCartList
    
    totalCost = 0; //le total cost est égal à O

    if (consolidatedList.length == 0) { // si le panier est égal à 0, on déclanche la function displayCartEmpty
        displayCartEmpty() 
    }
    
    for(let i = 0; i < consolidatedList.length; i++){
        let y = searchSameId2(consolidatedList[i].id, serverProductList);
        let itemTypeCost = consolidatedList[i].quantity * serverProductList[y].price;
        totalCost = totalCost + itemTypeCost;
        displayCartItems(i, consolidatedList[i], serverProductList[y],itemTypeCost);
        createDeleteBoutton(i, consolidatedList[i].id, consolidatedList[i].lense, serverProductList)
    }
    displayTotalCost()
}

//-----------------------------------------------
// Function name:   separateThousands
// Description:     sépare les milliers des chiffres
// Inputs:          nombre non séparé (number or string)
// Outputs:         nombre avec chiffres séparés 3 par 3 (string)

function separateThousands(nb) { // Function pour séparer les milliers des chiffres
    let nbs = nb.toString(); // on convertit en string
    let sepNb = ''; // on crée une string vide
    let longNb = nbs.length; // on calcule le nombre des chiffres dans le nombre initial
    for(i = 0; i < longNb; i++){ // pour tous les chiffres du nombre initial
        sepNb = sepNb + nbs[i]; // on tranfère le chiffre i du nombre initial vers la nouvelle string
        let chiffresRestants = longNb - (i + 1); // on calcule le nombre de chiffres restants à transfèrer
        if (((chiffresRestants % 3) == 0) && (chiffresRestants > 0)){ // si le nombre de chiffre à tranfèrer est multiple de 3 et qui resente encore des chiffres à transferer 
            sepNb = sepNb + ' '; // on ajoute un space
        }     
    }
    return sepNb; // on sort une string
}

//-----------------------------------------------
// Function name:   formValid
// Description:     x
// Inputs:          -
// Outputs:         x

function formValid() { 
    document.getElementById('form').addEventListener('submit', checkAndSubmitData);
}

//-----------------------------------------------
// Function name:   checkAndSubmitData
// Description:     Vérifier que le formulaire est conforme et envoyer la commande au serveur
// Inputs:          x
// Outputs:         x


function checkAndSubmitData(event){
    contact.firstName = event.target.firstname.value; // on cree le tableau de contact avec les donnés entrées dans le formulaire
    contact.lastName = event.target.lastname.value;
    contact.address = event.target.address.value;
    contact.city = event.target.city.value;
    contact.email = event.target.email.value;
    console.log(contact);
    
    let formOK = formCheck(event); // on stock le résultat de la vérification du formulaire 

    if (formOK && localStorageCartContent.length != 0){ // Si le formulaire à un bon format et si le panier n'est pas vide (rajouter)
        products = []; // on cree le tableau panier
        for(i = 0; i < localStorageCartContent.length; i++){
            let id = localStorageCartContent[i].id; // on ajoute l'id du produit i dans la liste du panier
            products.push(id); // on enregistre i (numéro de ligne dans le tableau d'objet) à la suite du tableau du résultat de recherche
        }
        // console.log(products);

        let orderContentObject = {contact: contact, products: products} // on crée un objet contenant l'objet contact et l'objet product pour envoyer au serveur
        let orderContent = JSON.stringify(orderContentObject); // on le transforme en string
        // console.log(orderContentObject);
        // console.log(orderContent);

        ajax.post('http://localhost:3000/api/cameras/order',orderContent).then((response) => { // on envoie les données au serveur
            // serverAnswer = response;
            console.log(response)
            orderId = response.orderId // on stock l'identifiant de la commande donné par le serveur
            console.log(orderId)

            orderPrice = 0; // on crée une variable pour recalculer le prix
            let orderedProducts = response.products // on récupère la liste des produits commandées

            for(let i = 0; i < orderedProducts.length; i++){ // boucle pour calculer le prix total de la commande
                orderPrice = orderPrice + orderedProducts[i].price; // on adissione les prix des produits i dans la liste commandée
                console.log(orderPrice)
            }

            let newCartContent = [] // on crée une nouvelle liste vide
            localStorage.setItem("storedCartContent", JSON.stringify(newCartContent)) // on converti la liste en string pour qu'elle soit lisible par javascript. On écrasse le panier stocké en local avec le panier à 0

            document.location.assign('command.html?orderId='+ orderId+ '&orderPrice='+ orderPrice); // on envoie l'id de la commande et le prix total vers la page de confirmation de commande
            
        }, (err) => {
            console.log(err)
        })
    }
}


//-----------------------------------------------
// Function name:   formCheck
// Description:     x
// Inputs:          x
// Outputs:         x

function formCheck(event) {
    event.preventDefault()
    console.log('hello, event en dessous')
    console.log(event)
    let formOK = true;
    let firstName = event.target.firstname;
    let lastName = event.target.lastname;
    let address = event.target.address;
    let city = event.target.city;
    let email = event.target.email;

    let firstNameValid = /^[a-zA-ZéèîïÉÈÎÏ][a-zéèêàçîï]+([-'\s][a-zA-ZéèîïÉÈÎÏ][a-zéèêàçîï]+)?$/;
    let lastNameValid = /^[a-zA-ZéèîïÉÈÎÏ][a-zéèêàçîï]+([-'\s][a-zA-ZéèîïÉÈÎÏ][a-zéèêàçîï]+)?$/;
    let addressValid = /^[0-9]+\s[a-zA-ZéèîïÉÈÎÏ][a-zéèêàçîï]+([-'\s][a-zA-ZéèîïÉÈÎÏ][a-zéèêàçîï]+).{1,30}?$/;
    let cityValid = /^[a-zA-ZéèîïÉÈÎÏ][a-zéèêàçîï]+([-'\s][a-zA-ZéèîïÉÈÎÏ][a-zéèêàçîï]+)?$/;
    let emailValid = /^[a-zA-Z0-9._-]+@[a-z0-9._-]{2,}\.[a-z]{2,4}$/;

    if (firstName.validity.valueMissing) { // Si le champ 'prénom' est vide
        event.preventDefault();
        formOK = false;
    } else if (firstNameValid.test(firstName.value) == false) { // Si le format est incorrect
        event.preventDefault();
        formOK = false;
    } else {
    }

    if (lastName.validity.valueMissing) { // Si le champ 'nom' est vide
        event.preventDefault();
        formOK = false;
    } else if (lastNameValid.test(lastName.value) == false) { // Si le format est incorrect
        event.preventDefault();
        formOK = false;
    } else {
    }

    if (address.validity.valueMissing) { // Si le champ 'nom' est vide
        event.preventDefault();
        formOK = false;
    } else if (addressValid.test(address.value) == false) { // Si le format est incorrect
        event.preventDefault();
        formOK = false;
    } else {
    }

    if (city.validity.valueMissing) { // Si le champ 'nom' est vide
        event.preventDefault();
        formOK = false;
    } else if (cityValid.test(city.value) == false) { // Si le format est incorrect
        event.preventDefault();
        formOK = false;
    } else {
    }

    if (email.validity.valueMissing) { // Si le champ 'e-mail' est vide
        event.preventDefault();
        formOK = false;
    } else if (emailValid.test(email.value) == false) { // Si le format est incorrect
        event.preventDefault();
        formOK = false;
    } else {
    }
    console.log("test du formulaire par le JS est OK? " + formOK)
    return formOK;
}