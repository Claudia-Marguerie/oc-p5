const url = new URL(window.location.href);
const params = new URLSearchParams(url.search);
const ajax = new Ajax()
const productId = params.get('id')

function displayProduct(product){
    document.querySelector('title').textContent = product.name
    document.querySelector('.menu p.menu-item').textContent = product.name
    document.querySelector('#product-name').textContent = product.name
    document.querySelector('#product-image').setAttribute('src', product.imageUrl)
    document.querySelector('#product-price').textContent = product.price + '€'
    document.querySelector('#product-description p').textContent = product.description
    document.querySelector('#add-cart').addEventListener('click', () => {
        addToCart(product)
    })
}

function displayProductOptions(product){ //fonction pour aller chercher chaque option de lentille de chaque produit
    const listOptions = document.querySelector('#option-lentille'); //l'endroit où la fonction va accéder aux éléments du DOM 
    for(let i = 0; i < product.lenses.length; i++){ //boucle pour aller chercher chaque option
        const optionItem = document.createElement('option'); //va créer un nouveau élément
        optionItem.innerHTML = '<option id="option-lentille" value="">' + product.lenses[i] +'</option>' //la structure qui va créer en HTML avec chaque option
        listOptions.appendChild(optionItem); //une option après l'autre
    }
}

function addToCart(){
    
}

// function displayProduct(product){
//     document.querySelector('#product-name').textContent = product.name
//     document.querySelector('#product-image').setAttribute('src', product.imageUrl)
//     document.querySelector('#product-price').textContent = product.price + '€'
//     document.querySelector('#add-cart').addEventListener('click', () => {
//         addToCart(product)
//     })
// }

ajax.get('http://localhost:3000/api/cameras/' + productId).then((product) => {
    displayProduct(product)
    displayProductOptions(product)
})