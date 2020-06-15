const ajax = new Ajax()

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

function displayProduct(product){ // Function pour afficher les produits et informations contenus dans le serveur
    const listProduct = document.querySelector('#list-products');  // on crée un variable pour indiquer l'endroit en HTML 
    const productListItem = document.createElement('li'); // on demande de créer une balise li
    productListItem.innerHTML = '<div class="product-item">'+'<a href="product.html?id='+ product._id +'"><img src="' + product.imageUrl + '"alt=""></a>' +
    '<div class="product-name-price">'+'<a href="product.html?id='+ product._id +'">' + '<h3 class= "product-name">' + product.name + '</h3>'+
    '<p class="product-price">'+ separateThousands(product.price) + ' €</p>'+ '</a>'+'</div>'+'</div>' // on crée un HTLM avec l'image, le nom et le prix provenant du serveur
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