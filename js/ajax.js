class Ajax {

    get(url){
        return new Promise((resolve, reject) => {
            const request = new XMLHttpRequest();
            request.onreadystatechange = function() {
                if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
                    const response = JSON.parse(this.responseText);
                    resolve(response)
                }
            };
            request.open("GET", url);
            request.send();
        })
    }

    post(url, orderContent){
        return new Promise((resolve, reject) => {
            const request = new XMLHttpRequest();
            request.onreadystatechange = function() {
                if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
                    const response = JSON.parse(this.responseText);
                    resolve(response)
                    // alert("ok")
                    // console.log(response);
                    // console.log(this);
                }
            };
            request.open("POST", url);
            request.setRequestHeader("Content-Type", "application/json");
            request.send(orderContent);
        })
    }

}



// function loadDoc() {
//     var xhttp = new XMLHttpRequest();
//     xhttp.onreadystatechange = function() {
//       if (this.readyState == 4 && this.status == 200) {
//         document.getElementById("demo").innerHTML = this.responseText;
//       }
//     };
//     xhttp.open("POST", "demo_post2.asp", true);
//     xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
//     xhttp.send("fname=Henry&lname=Ford");
//   }

/* Appel de la function:
ajax.get('http://localhost:3000/api/cameras').then((products) => {
    serverProductList = products;
    displayProductListInformation()
    createDeleteBouttonForAll()
    formValid();
}, (err) => {
    console.log(err)
})
*/


        // let request = new XMLHttpRequest();
        // request.open("POST", "http://localhost:3000/api/cameras");
        // request.setRequestHeader("Content-Type", "application/json");
        // request.send(JSON.stringify(contact, product)); 