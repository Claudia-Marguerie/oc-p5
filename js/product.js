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

})