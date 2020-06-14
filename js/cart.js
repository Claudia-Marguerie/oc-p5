const ajax = new Ajax()


function getCartFromLocal() { // récupère les produits du stockage local
    let cartContentLocal = localStorage.getItem('storedCartContent') // on crée une variable pour le contenu du panier dans le stockage local
    if (cartContentLocal == null){ // Si le panier est vide
        cartContentLocal = [] // on crée un tableau
    } else {
        cartContentLocal = JSON.parse(cartContentLocal) // on transforme le contenu en un tableau d'objet (pour que soit lisible par JS)
        console.log(cartContentLocal)
    }
    return cartContentLocal
}


function displayCartNumber(cartContent) { // function pour afficher le numéro d'articles dans le panier
    document.querySelector('#cart-item-quantity').textContent = cartContent.length // l'emplacement où il sera affiché
}


function searchSameId(searchedId, objectList) { // Cherche les poduits avec même ID dans le local storage ou la liste consolidée
    let searchResult = [] // crée une variable avec un tableau pour les produits recherchés
    for (let i = 0; i < objectList.length; i++) { // boucle pour la liste d'objets
        if (objectList[i].id === searchedId) { // Si l'id de l'objet numéro i est égal à l'id recherché
            searchResult.push(i); // on enregistre i (numéro de ligne dans le tableau d'objet) à la suite du tableau du résultat de recherche
        } 
    }
    return searchResult; // le résultat de la function est la liste des numéros de ligne où on trouve l'id
}


function searchSameId2(searchedId, objectList) { // Cherche les poduits sur le serveur avec même ID 
    let searchResult = 0 // crée un tableau avec 0
    for (let i = 0; i < objectList.length; i++) { // boucle pour la liste d'objets
        if (objectList[i]._id === searchedId) { // Si l'id de l'objet numéro i est égal à l'id recherché
            searchResult=i; // on enregistre i (numéro de ligne dans le tableau d'objet)
        } 
    }
    return searchResult; // le résultat de la function est le numéro de ligne où on trouve l'id
}


function searchSameLense(searchedLense, objectList, candidateItems) { // Cherche les poduits avec la même lentille parmis ceux qui ont la même id
    let searchResult = [] // crée un tableau
    for (let i = 0; i < candidateItems.length; i++) {
        if (objectList[candidateItems[i]].lense === searchedLense) { // Si la lentille de l'objet numéro i est le même que la lentille recherchée
            searchResult.push(candidateItems[i]); // on enregistre candidateItems d'i (numéro de ligne dans le tableau d'objet) à la suite du tableau du résultat de recherche
        } 
    }
    return searchResult; // le résultat de la function est la liste des numéros de ligne où on trouve le même id et la même lentille
}


class ProductItem { // tableau avec le contenu d'un article 
    constructor (id, quantity, lense, price) { 
        this.id = id; // l'id du produit
        this.quantity = quantity; // la quantité
        this.lense = lense; // la lentille
        this.price = price; // le prix
    }
}


function idCompare(a, b) { // Définition du critère de tri suivant l'id
    const idA = a.id; // comparer deux Id
    const idB = b.id; // comparer deux Id
  
    let comparison = 0;
    if (idA > idB) {
      comparison = 1;
    } else if (idA < idB) {
      comparison = -1;
    }
    return comparison; // identification s'ils ont le même id ou non
}
  

function listProducts(products, cartItems) {
    let consolidatedList = []; // création de la liste à retourner avec les produits groupés par le même id et même lentille
    let resultSameID = []; // création de la liste de numéro de ligne dans le tableau d'objet
    let resultSameLense = []; // création de la liste de numéro de ligne dans le tableau d'objet des produits selon la lentille
    console.log(cartItems);

    if (cartItems.length > 0){
        let newItem = new ProductItem; // création d'un objet vide 
        console.log(newItem);

        newItem.id = cartItems[0].id; // recopie les informations depuis le produit i du panier vers newItem
        newItem.quantity = 1; // on donne 1 comme quantité
        newItem.lense = cartItems[0].lense; // recopie les informations depuis le produit i du panier vers newItem

        consolidatedList.push(newItem); // ajout de newItem à la liste qui sera à retourner
        console.log(consolidatedList);

        for (let i = 1; i < cartItems.length; i++) { // boucle pour tous les produits contenus dans le panier
            let currentId = cartItems[i].id; // on recupére l'id du produit numéro i dans le panier
            console.log(currentId);

            resultSameID = searchSameId(currentId, consolidatedList); // recherche du même id dans la liste consolidée
            resultSameLense = searchSameLense(cartItems[i].lense, consolidatedList, resultSameID); // recherche la même lentille dans la liste consolidée

            if (resultSameID.length > 0 && resultSameLense.length > 0 ) { // si l'id existe déjà dans la liste consolidée et si la lentille existe dejà dans la liste consolidée
                consolidatedList[resultSameLense[0]].quantity++; // il incremente la quantité de lentilles
            } else {
                let newItem2 = new ProductItem; // création d'un objet vide 
                newItem2.id = currentId; // recopie les informations depuis le produit i du panier vers newItem
                newItem2.quantity = 1; // on donne 1 comme quantité
                newItem2.lense = cartItems[i].lense; // recopie les informations depuis le produit i du panier vers newItem
                // console.log(newItem2);
                consolidatedList.push(newItem2); // ajout de newItem à la liste qui sera à retourner
                }
        }
        consolidatedList.sort(idCompare); 
    }
    return consolidatedList; // on obtient la liste consolidée avec les produits triés par ID et lentilles
    // console.log(consolidatedList);
}


function displayCartItems(i, consolidatedListItem, itemServerInformation, itemTypeCost) { // Affichage de chaque produit selectioné dans le panier dans le DOM
    const listProduct = document.querySelector('#product-display-zone'); // on défine l'endroit où il va afecter le HTML
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
    listProduct.appendChild(productListItem); // ça applique aux childs de la liste dans le panier
}

function displayTotalCost (totalCost) { // Afficher le coût total
    document.querySelector('.total-cost').textContent = separateThousands(totalCost) + ' €' // l'émplacement à afficher le prix total
    document.querySelector('.panier-total--cost').textContent = separateThousands(totalCost) + ' €' // l'émplacement à afficher le prix total
}


function createDeleteBoutton (i, productId, productLense, products) { 
    document.querySelector('#delete-product'+i).addEventListener('click', () => {
    // console.log('"button' + i + 'clické"')   
    deleteProduct(productId, productLense, products, false) // on active la function deleteProduct
    })
}


function createDeleteBouttonForAll () {
    document.querySelector('#delete-all').addEventListener('click', () => { 
    deleteProduct('', '', [], true) // on active la function deleteProduct
    })
}


function deleteProduct(productId, productLense, products, deleteAll) { // function pour effacer un produit de la liste
    // console.log('je veux supprimer larticle ' + productId + ' avec ' + productLense)
    let newCartContent = [] // on crée une nouvelle liste
    let sortedProductList = [] // on crée une nouvelle liste

    if (!deleteAll) { // Si la demande n'est pas de tout effacer, on exécute pas les actions dessous
        let cartContentInitial = getCartFromLocal() // on récupere la liste des produits dans la local storage
        resultSameID = searchSameId(productId, cartContentInitial); // recherche du même id dans le local storage
        resultSameLense = searchSameLense(productLense, cartContentInitial, resultSameID); // on definie la liste d'exclusion
        // console.log(resultSameID)
        // console.log(resultSameLense)
        
        for(let i = 0; i < cartContentInitial.length; i++) {
            if (!resultSameLense.includes(i)) { // si le produit n'est pas dans la liste d'exclusion
                newCartContent.push(cartContentInitial[i]) 
            }
        }
    }
    
    localStorage.setItem("storedCartContent", JSON.stringify(newCartContent)) // on converti la liste en string pour qu'elle soit lisible par javascript
    displayCartNumber(newCartContent); // on affiche le numéro dans la panier
   
    sortedProductList = listProducts(products, newCartContent); // nouvelle liste sans le produit effacé
    console.log(sortedProductList)

    const numberOfDiv = document.getElementById("product-display-zone").childElementCount; // indique le numéro de la division à effacer
    console.log(numberOfDiv)

    for(let i = 1; i <= numberOfDiv; i++){  // On demande d'effacer la div dans le DOM
        const productToDelete = document.querySelector('#product-display-zone div');
        productToDelete.parentNode.removeChild(productToDelete);
    }

    let totalCost = 0; // le prix commence à O EUROS

    if (sortedProductList.length == 0) { // S'il n'y a pas de produit dans le panier (sortedProductList), on active la function displayCartEmpty 
        displayCartEmpty() 
    }

    for(let i = 0; i < sortedProductList.length; i++){ 
        let y = searchSameId2(sortedProductList[i].id, products); // on cherche la liste des produits avec le même id
        let itemTypeCost = sortedProductList[i].quantity * products[y].price; // on calcule le prix en function à la quantité
        totalCost = totalCost + itemTypeCost; // on calcule le total avec la somme du total de chaque item
        // console.log(products[y])
        // console.log(sortedProductList[i]

        displayCartItems(i, sortedProductList[i], products[y], itemTypeCost); // on re affiche le produit i de la liste restant dans le panier

        // console.log(sortedProductList[i].id);
        // console.log(y);
        createDeleteBoutton(i, sortedProductList[i].id, sortedProductList[i].lense, products) // on active la function correspondant au button supprimer du produit i
    }
    displayTotalCost(totalCost) // on affiche le prix total actualisé
}


function displayCartEmpty () { // function à activer quand le panier est vide
    const emptyList = document.querySelector('#product-display-zone'); // on détermine l'endroit à ajouter
    const emptyItem = document.createElement('div'); // on demande de créer une div
    emptyItem.innerHTML = '<h3 id="empty-cart">Panier vide !</h3>'; // l'élement à créer avec le texte à afficher
    console.log(emptyItem)
    emptyList.appendChild(emptyItem); // ajout un élement à la liste
}


ajax.get('http://localhost:3000/api/cameras').then((products) => {
    let cartContent = getCartFromLocal(); // on crée un variable pour la function getCartFromLocal
    displayCartNumber(cartContent); // on appelle la function
    let sortedProductList = listProducts(products, cartContent); // on crée la variable avec la function listProducts
    console.log(products)
    console.log(sortedProductList)
    
    let totalCost = 0; //le total cost est égal à O

    if (sortedProductList.length == 0) { // si le panier est égal à 0, on déclanche la function displayCartEmpty
        displayCartEmpty() 
    }
    
    for(let i = 0; i < sortedProductList.length; i++){
        let y = searchSameId2(sortedProductList[i].id, products);
        let itemTypeCost = sortedProductList[i].quantity * products[y].price;
        totalCost = totalCost + itemTypeCost;
        // console.log(products[y])
        // console.log(sortedProductList[i]
        displayCartItems(i, sortedProductList[i], products[y],itemTypeCost);
        // console.log(sortedProductList[i].id);
        // console.log(y);
        createDeleteBoutton(i, sortedProductList[i].id, sortedProductList[i].lense, products)
    }
    console.log(totalCost)
    displayTotalCost(totalCost)
    createDeleteBouttonForAll()
    formValid();
}, (err) => {
    console.log(err)
})


function separateThousands(nb) { // Function pour séparer les milliers des chiffres
    let nbs = nb.toString(); // on convertit en string
    let sepNb = ''; // on crée une string vide
    let longNb = nbs.length; // on calcule le nombre des chiffres dans le nombre initial
    for(i=0; i<longNb; i++){ // pour tous les chiffres du nombre initial
        sepNb = sepNb + nbs[i]; // on tranfère le chiffre i du nombre initial vers la nouvelle string
        let chiffresRestants = longNb - (i + 1); // on calcule le nombre de chiffres restants à transfèrer
        if (((chiffresRestants % 3) == 0) && (chiffresRestants > 0)){ // si le nombre de chiffre à tranfèrer est multiple de 3 et qui resente encore des chiffres à transferer 
            sepNb = sepNb + ' '; // on ajoute un space
        }     
    }
    return sepNb; // on sort une string
}


function formValid() { 
    // let i = 0
    document.getElementById('form').addEventListener('submit', checkAndSubmitData);
    
}


function checkAndSubmitData(event){
    // let event2 = event;
    let i = 0
    let formOK = formCheck(event);
    // console.log("on est dans la fonction checkAndSubmitData()");
    // console.log(sortedProductList);
    if (formOK && i == 0){ // Si le formulaire à un bon format et si le panier n'est pas vide (rajouter)
        // on cree le tableau de contact
        // on cree le tableau panier
        // on envoie les donnees au serveur
        // on attend la confirmation
        // Suite a la confirmation du serveur, on envoie vers la page command.html
    }
    console.log('on est arrivée là?')
}

function formCheck(event) {
    //let event2 = event;
    event.preventDefault()
    console.log('hello, event en dessous')
    console.log(event)
    let formOK = true;
    let firstName = event.target.firstname;
    let lastName = event.target.lastname;
    let address = event.target.address;
    let city = event.target.city;
    let email = event.target.email;

    let missFirstName = document.getElementById('missFirstName');
    let missLastName = document.getElementById('missLastName');
    let missAddress = document.getElementById('missAddress');
    let missCity = document.getElementById('missCity');
    let missEmail = document.getElementById('missEmail');

    let firstNameValid = /^[a-zA-ZéèîïÉÈÎÏ][a-zéèêàçîï]+([-'\s][a-zA-ZéèîïÉÈÎÏ][a-zéèêàçîï]+)?$/;
    let lastNameValid = /^[a-zA-ZéèîïÉÈÎÏ][a-zéèêàçîï]+([-'\s][a-zA-ZéèîïÉÈÎÏ][a-zéèêàçîï]+)?$/;
    let addressValid = /^[0-9]+\s[a-zA-ZéèîïÉÈÎÏ][a-zéèêàçîï]+([-'\s][a-zA-ZéèîïÉÈÎÏ][a-zéèêàçîï]+).{1,30}?$/;
    let cityValid = /^[a-zA-ZéèîïÉÈÎÏ][a-zéèêàçîï]+([-'\s][a-zA-ZéèîïÉÈÎÏ][a-zéèêàçîï]+)?$/;
    let emailValid = /^[a-zA-Z0-9._-]+@[a-z0-9._-]{2,}\.[a-z]{2,4}$/;

    if (firstName.validity.valueMissing) { // Si le champ 'prénom' est vide
        event.preventDefault();
        missFirstName.textContent = "Ce champ est obligatoire : prénom manquant";
        formOK = false;
    } else if (firstNameValid.test(firstName.value) == false) { // Si le format est incorrect
        event.preventDefault();
        missFirstName.textContent = 'Format incorrect';
        formOK = false;
    } else {
        missFirstName.textContent = '';
    }

    if (lastName.validity.valueMissing) { // Si le champ 'nom' est vide
        event.preventDefault();
        missLastName.textContent = 'Ce champ est obligatoire : nom manquant';
        formOK = false;
    } else if (lastNameValid.test(lastName.value) == false) { // Si le format est incorrect
        event.preventDefault();
        missLastName.textContent = 'Format incorrect';
        formOK = false;
    } else {
        missLastName.textContent = '';
    }

    if (address.validity.valueMissing) { // Si le champ 'nom' est vide
        event.preventDefault();
        missAddress.textContent = 'Ce champ est obligatoire : adresse manquante';
        formOK = false;
    } else if (addressValid.test(address.value) == false) { // Si le format est incorrect
        event.preventDefault();
        missAddress.textContent = 'Format incorrect';
        formOK = false;
    } else {
        missAddress.textContent = '';
    }

    if (city.validity.valueMissing) { // Si le champ 'nom' est vide
        event.preventDefault();
        missCity.textContent = 'Ce champ est obligatoire : ville manquante';
        formOK = false;
    } else if (cityValid.test(city.value) == false) { // Si le format est incorrect
        event.preventDefault();
        missCity.textContent = 'Format incorrect';
        formOK = false;
    } else {
        missCity.textContent = '';
    }

    if (email.validity.valueMissing) { // Si le champ 'e-mail' est vide
        event.preventDefault();
        missEmail.textContent = 'Ce champ est obligatoire : e-mail manquant';
        formOK = false;
    } else if (emailValid.test(email.value) == false) { // Si le format est incorrect
        event.preventDefault();
        missEmail.textContent = 'Format incorrect';
        formOK = false;
    } else {
        missEmail.textContent = '';
    }
    console.log("test du formulaire par le JS est OK? " + formOK)
    return formOK;
}







function confirmOrder(){
    document.location = 'command.html';
    console.log(document.location)
    
}


class Contact {
    constructor(firstname, lastname, address, city, email){
        this.firstname = "";
        this.lastname = "";
        this.address = "";
        this.city = "";
        this.email = "";
    }
}

// let contact = new Contact(firstname, lastname, address, city, email)


// let request = new XMLHttpRequest();
// request.open("POST", "http://localhost:3000/api/cameras");
// request.setRequestHeader("Content-Type", "application/json");
// request.send(JSON.stringify(jsonBody));