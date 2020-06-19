const ajax = new Ajax()

function displayProduct(product){ // Function pour afficher les produits et informations contenus dans le serveur
    const listProduct = document.querySelector('#list-products');  // on crée un variable pour indiquer l'endroit en HTML 
    const productListItem = document.createElement('li'); // on demande de créer une balise li
    productListItem.innerHTML = '<div class="product-item">'+'<a href="product.html?id='+ product._id +'"><img src="' + product.imageUrl + '"alt=""></a>' +
    '<div class="product-name-price">'+'<a href="product.html?id='+ product._id +'">' + '<h3 class= "product-name">' + product.name + '</h3>'+
    '<p class="product-price">'+ new Intl.NumberFormat().format(product.price) + ' €</p>'+ '</a>'+'</div>'+'</div>' // on crée un HTLM avec l'image, le nom et le prix provenant du serveur
    listProduct.appendChild(productListItem); // on applique aux "enfants" de la liste de produits
}

function displayTextEnd(){ // function pour afficher un texte dynaqmique à la fin de la liste des produits affichés
    const listProduct = document.querySelector('#list-products'); // on indique l'endorit en HTML
    const textBoxEnd = document.createElement('div'); // on demande d'ajoute une balise div
    textBoxEnd.innerHTML = '<div class="text-end"><p>Nos meilleures sélections sont présentées ici chaque semaine !</p></div>' // le texte à ajouter en HTML
    listProduct.appendChild(textBoxEnd); // on applique aux "enfants" de la liste de produits 
}

function displayCartNumber() { // function pour afficher le nombre des produits dans le panier
    let cartContent = localStorage.getItem('storedCartContent') // on transfère le panier stocké dans le local storage ver la variable cartContent
    if (cartContent == null){ // si le cartContent n'existe pas
        cartContent = [] // on crée un tableau 
    } else {
        cartContent = JSON.parse(cartContent) // on tranforme le contenu de la cartContent de string à objet JavaScript
    }
    document.querySelector('#cart-item-quantity').textContent = cartContent.length // on indique la quantité des produits (longeur de la cartContent) en HTML
}


ajax.get('http://localhost:3000/api/cameras').then((products) => {
    for(let i = 0; i < products.length; i++){
        displayProduct(products[i])
    }
    displayCartNumber()
    displayTextEnd()
}, (err) => {
    console.log(err)
})