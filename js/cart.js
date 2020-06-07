const ajax = new Ajax()
// localStorage.clear()

function getCartFromLocal() { // récupère les produits du stockage local
    let cartContentLocal = localStorage.getItem('storedCartContent')
    if (cartContentLocal == null){
        cartContentLocal = []
    } else {
        cartContentLocal = JSON.parse(cartContentLocal)
        console.log(cartContentLocal)
    }
    return cartContentLocal
}

function displayCartNumber(cartContent) {
    document.querySelector('#cart-item-quantity').textContent = cartContent.length
}

function searchSameId(searchedId, objectList) { // Cherche les poduits avec même ID 
    let searchResult = []
    for (let i = 0; i < objectList.length; i++) {
        if (objectList[i].id === searchedId) { // Si l'id de l'objet numéro i est égal à l'id recherché
            searchResult.push(i); // on enregistre i (numéro de ligne dans le tableau d'objet) à la suite du tableau du résultat de recherche
        } 
    }
    return searchResult; // le résultat de la function est la liste des numéros de ligne où on trouve l'id
}

function searchSameId2(searchedId, objectList) { // Cherche les poduits sur le  serveur avec même ID 
    let searchResult = 0
    for (let i = 0; i < objectList.length; i++) {
        if (objectList[i]._id === searchedId) { // Si l'id de l'objet numéro i est égal à l'id recherché
            searchResult=i; // on enregistre i (numéro de ligne dans le tableau d'objet)
        } 
    }
    return searchResult; // le résultat de la function est le numéro de ligne où on trouve l'id
}

function searchSameLense(searchedLense, objectList, candidateItems) { // Cherche les poduits avec la même lentille parmis ceux qui ont la même id
    let searchResult = []
    for (let i = 0; i < candidateItems.length; i++) {
        if (objectList[candidateItems[i]].lense === searchedLense) { // Si la lentille de l'objet numéro i est le même que la lentille recherchée
            searchResult.push(candidateItems[i]); // on enregistre candidateItems d'i (numéro de ligne dans le tableau d'objet) à la suite du tableau du résultat de recherche
        } 
    }
    return searchResult; // le résultat de la function est la liste des numéros de ligne où on trouve le même id et la même lentille
}

class ProductItem {
    constructor (id, quantity, lense, price) {
        this.id = id;
        this.quantity = quantity;
        this.lense = lense;
        this.price = price;
    }
}

function idCompare(a, b) { // Définition du critère de tri suivant l'id
    const idA = a.id;
    const idB = b.id;
  
    let comparison = 0;
    if (idA > idB) {
      comparison = 1;
    } else if (idA < idB) {
      comparison = -1;
    }
    return comparison;
}
  

function listProducts(products, cartItems) {
    let consolidatedList = []; // création de la liste à retourner avec les produits groupés par le même id et même lentille
    let resultSameID = []; // creéation de la liste de numéro de ligne dans le tableau d'objet
    let resultSameLense = [];
    console.log(cartItems);

    let newItem = new ProductItem; // création d'un objet vide 
    console.log(newItem);

    newItem.id = cartItems[0].id; // recopie les informations depuis le premier produit du panier vers newItem
    newItem.quantity = 1;
    newItem.lense = cartItems[0].lense;

    consolidatedList.push(newItem); // ajout de newItem à la liste qui sera à retourner
    console.log(consolidatedList);

    for (let i = 1; i < cartItems.length; i++) { // boucle pour tous les produits contenus dans le panier
        let currentId = cartItems[i].id; // on recupére l'id du produit numéro i dans le panier
        console.log(currentId);

        resultSameID = searchSameId(currentId, consolidatedList); // recherche du même id dans la liste consolidée
        resultSameLense = searchSameLense(cartItems[i].lense, consolidatedList, resultSameID);

        if (resultSameID.length > 0 && resultSameLense.length > 0 ) { // si l'id existe déjà dans la liste consolidée et si la lentille existe dejà dans la liste consolidée
            consolidatedList[resultSameLense[0]].quantity++; // il incremente la quantité de lentilles
        } else {
            let newItem2 = new ProductItem; // création d'un objet vide 
            newItem2.id = currentId; // recopie les informations depuis le produit i du panier vers newItem
            newItem2.quantity = 1; 
            newItem2.lense = cartItems[i].lense;
            // console.log(newItem2);
            consolidatedList.push(newItem2); // ajout de newItem à la liste qui sera à retourner
        }
    }
    consolidatedList.sort(idCompare); 
    return consolidatedList;
    // console.log(consolidatedList);
}

function displayCartItems(consolidatedListItem, itemServerInformation) {
    const listProduct = document.querySelector('#product-display-zone');
    const productListItem = document.createElement('div');
    let lenseText = consolidatedListItem.lense; // 
    if (lenseText == "") {
        lenseText = "-"
    }
    console.log(lenseText)
    productListItem.innerHTML = 
                '<div id="panier-items">'+                
                    '<div class="panier-product">'+
                        '<img class="product-image" src="' + itemServerInformation.imageUrl + '" alt="">'+
                    '</div>'+
                    '<div class="panier-product">'+
                        '<div class="product-info">'+
                            '<h3>PRODUIT</h3>'+
                        '</div>'+
                        '<div class="product-info">'+
                            '<p class="product-name">' + itemServerInformation.name + '</p>'+
                        '</div>'+
                    '</div>'+
                    '<div class="panier-product">'+
                        '<div class="product-info">'+
                            '<h3>QTE</h3>'+
                        '</div>'+
                        '<div class="product-info">'+
                            '<p class="product-quantity">' + consolidatedListItem.quantity + '</p>'+
                        '</div>'+
                    '</div>'+
                    '<div class="panier-product">'+
                        '<div class="product-info">'+
                            '<h3>LENTILLE</h3>'+
                        '</div>'+
                        '<div class="product-info">'+
                            '<p class="product-quantity">' + lenseText + '</p>'+
                        '</div>'+
                    '</div>'+
                    '<div class="panier-product">'+
                        '<div class="product-info">'+
                            '<h3>PRIX</h3>'+
                        '</div>'+
                        '<div class="product-info">'+
                            '<p class="product-price">' + itemServerInformation.price + '</p>'+
                        '</div>'+
                    '</div>'+
                    '<div class="btn-remove">'+
                        '<button><img src="images/trash.png" alt="Picto supprimer"></button>'+
                    '</div>'+
                '</div>'
    listProduct.appendChild(productListItem);
}



ajax.get('http://localhost:3000/api/cameras').then((products) => {
    let cartContent = getCartFromLocal();
    displayCartNumber(cartContent);
    let sortedProductList = listProducts(products, cartContent);
    console.log(products)
    for(let i = 0; i < sortedProductList.length; i++){
        let y = searchSameId2(sortedProductList[i].id, products);
        // console.log(products[y])
        // console.log(sortedProductList[i])
        displayCartItems(sortedProductList[i], products[y]);
        // console.log(sortedProductList[i].id);
        // console.log(y);
    }
}, (err) => {
    console.log(err)
})