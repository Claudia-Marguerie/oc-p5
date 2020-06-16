const url = new URL(window.location.href);
const params = new URLSearchParams(url.search);
const ajax = new Ajax()
const productId = params.get('id')

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
    document.querySelector('title').textContent = product.name // on récupère le nom du produit pour l'afficher dans le titre de la page
    document.querySelector('.menu p.menu-item').textContent = product.name // on récupère le nom du produit pour l'afficher dans le ménu de navigation
    document.querySelector('#product-name').textContent = product.name // on récupère le nom du produit pour l'afficher dans la fiche du produit
    document.querySelector('#product-image').setAttribute('src', product.imageUrl) // on récupère l'image du produit pour l'afficher dans la fiche du produit
    document.querySelector('#product-price').textContent = separateThousands(product.price) + ' €' // on récupère le prix en utilisant la fucntion separateThousand et on ajout le symbole Euro
    document.querySelector('#product-description p').textContent = product.description // on récupère le description du produit pour l'afficher dans la fiche du produit
    document.querySelector('#add-cart').addEventListener('click', () => { // on crée un évenement click pour ajouter un produit au panier
        addToCart(product) // on utilise la function addToCart
    })
    displayCartNumber() // on utilise la function pour afficher le nombre dans le panier
}

function displayProductOptions(product){  // function pour afficher les options des lentilles
    const listOptions = document.querySelector('#option-lentille'); // variable pour détérminer l'emplacement en HTML
    for(let i = 0; i < product.lenses.length; i++){  // boucle pour la liste des lentilles
        const optionItem = document.createElement('option'); // on crée une balise option en HTML
        optionItem.setAttribute("value", product.lenses[i]) // prend les value des lentilles de chaque produit
        optionItem.innerHTML = product.lenses[i]  // le retourne en HTML
        listOptions.appendChild(optionItem); // l'applique aux "enfants" d'option-lentille
    }
}

function addToCart(product){ // fucntion pour ajouter un produit au panier
    let cartContent = localStorage.getItem('storedCartContent') // on transfère le panier stocké dans le local storage ver la variable cartContent
    if (cartContent == null){ // si le cartContent n'existe pas
        cartContent = [] // on crée un tableau
    } else {
        cartContent = JSON.parse(cartContent) // on tranforme le contenu de la cartContent de string à objet JavaScript
    }
    cartContent.push({
        id: product._id, lense: document.querySelector("#option-lentille").value // on ajoute à la liste l'id et la lentille du produit à ajouter
    })
    // console.log(cartContent)
    localStorage.setItem("storedCartContent", JSON.stringify(cartContent)) // on récupère la liste du local storage en transformant le contenu en objet JavaScript
    document.querySelector('#cart-item-quantity').textContent = cartContent.length // on mets à jour le nombre dans le panier
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


ajax.get('http://localhost:3000/api/cameras/' + productId).then((product) => {
    displayProduct(product)
    displayProductOptions(product)
    cartInit()
})