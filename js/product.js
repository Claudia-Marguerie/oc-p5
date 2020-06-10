const url = new URL(window.location.href);
const params = new URLSearchParams(url.search);
const ajax = new Ajax()
const productId = params.get('id')

function displayProduct(product){
    document.querySelector('title').textContent = product.name
    document.querySelector('.menu p.menu-item').textContent = product.name
    document.querySelector('#product-name').textContent = product.name
    document.querySelector('#product-image').setAttribute('src', product.imageUrl)
    document.querySelector('#product-price').textContent = product.price + ' €'
    document.querySelector('#product-description p').textContent = product.description
    document.querySelector('#add-cart').addEventListener('click', () => {
        addToCart(product)
    })
    displayCartNumber()
}

function displayProductOptions(product){ 
    const listOptions = document.querySelector('#option-lentille'); 
    for(let i = 0; i < product.lenses.length; i++){ 
        const optionItem = document.createElement('option'); 
        optionItem.setAttribute("value", product.lenses[i])
        optionItem.innerHTML = product.lenses[i] 
        listOptions.appendChild(optionItem); 
    }
}

function addToCart(product){
    let cartContent = localStorage.getItem('storedCartContent')
    if (cartContent == null){
        cartContent = []
    } else {
        cartContent = JSON.parse(cartContent)
    }
    cartContent.push({
        id: product._id, lense: document.querySelector("#option-lentille").value
    })
    // console.log(cartContent)
    localStorage.setItem("storedCartContent", JSON.stringify(cartContent))
    document.querySelector('#cart-item-quantity').textContent = cartContent.length
}

function displayCartNumber() {
    let cartContent = localStorage.getItem('storedCartContent')
    if (cartContent == null){
        cartContent = []
    } else {
        cartContent = JSON.parse(cartContent)
    }
    document.querySelector('#cart-item-quantity').textContent = cartContent.length
}


ajax.get('http://localhost:3000/api/cameras/' + productId).then((product) => {
    displayProduct(product)
    displayProductOptions(product)
 //   sessionStorage.clear();
    cartInit()
})