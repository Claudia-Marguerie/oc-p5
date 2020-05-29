const url = new URL(window.location.href);
const params = new URLSearchParams(url.search);
const ajax = new Ajax()
const productId = params.get('id')

function addToCart(product){
    console.log(product)
}

function displayProduct(product){
    document.querySelector('#product-name').textContent = product.name
    document.querySelector('#product-image').setAttribute('src', product.imageUrl)
    document.querySelector('#product-price').textContent = product.price + '€'
    document.querySelector('#add-cart').addEventListener('click', () => {
        addToCart(product)
    })
}

ajax.get('http://localhost:3000/api/cameras/' + productId).then((product) => {
    displayProduct(product)

})