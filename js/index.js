const ajax = new Ajax()

function displayProduct(product){
    const ul = document.querySelector('#list-products');
    const li = document.createElement("li");
    li.innerHTML = '<div>' +
        '<a href="product.html?id='+ product._id +'">' + product.name + '</a>' +
        '</div>'
    ul.appendChild(li)
}

console.log(displayProduct);



// Code Rémi
// function displayProduct(product){
//     const ul = document.querySelector('#list-products');
//     const li = document.createElement("li");
//     li.innerHTML = '<div>' +
//         '<a href="product.html?id='+ product._id +'">' + product.name + '</a>' +
//         '</div>'
//     ul.appendChild(li)
// }


ajax.get('http://localhost:3000/api/cameras').then((products) => {
    for(let i = 0; i < products.length; i++){
        displayProduct(products[i])
    }
}, (err) => {
    console.log(err)
})