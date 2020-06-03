const ajax = new Ajax()

function displayProduct(product){
    const listProduct = document.querySelector('#list-products');
    const productListItem = document.createElement('li');
    productListItem.innerHTML = '<div class="product-item">'+'<a href="product.html?id='+ product._id +'"><img src="' + product.imageUrl + '"alt=""></a>' +
    '<div class="product-name-price">'+'<a href="product.html?id='+ product._id +'">' + '<h3 class= "product-name">' + product.name + '</h3>'+
    '<p class="product-price">'+ product.price + ' €</p>'+ '</a>'+'</div>'+'</div>'
    listProduct.appendChild(productListItem);
}

function displayTextEnd(){
    const listProduct = document.querySelector('#list-products');
    const textBoxEnd = document.createElement('div');
    textBoxEnd.innerHTML = '<div class="text-end"><p>Nos meilleurs sélections sont présentées ici chaque semaine !</p></div>'
    listProduct.appendChild(textBoxEnd);
}

// // function displayProduct(product){
// //     const ul = document.querySelector('#list-products');
// //     const li = document.createElement('li');
// //     li.innerHTML = '<div>' +
// //         '<a href="product.html?id='+ product._id +'">' + product.name + '</a>' +
// //         '</div>'
// //     ul.appendChild(li);
// }

ajax.get('http://localhost:3000/api/cameras').then((products) => {
    for(let i = 0; i < products.length; i++){
        displayProduct(products[i])
    }
    displayTextEnd()
}, (err) => {
    console.log(err)
})