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
                if (this.readyState == XMLHttpRequest.DONE && this.status == 201) {
                    const response = JSON.parse(this.responseText);
                    resolve(response)
                    console.log(response)
                }
            };
            request.open("POST", url);
            request.setRequestHeader("Content-Type", "application/json");
            request.send(orderContent);
        })
    }

}