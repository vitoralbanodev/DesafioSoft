async function pickUrlParams(){
    const urlParams = new URLSearchParams(window.location.search);
    var code = urlParams.get("code");
    getJsonTableCondition("order_item", "order_code", code).then(data => {
        fillTable(data)
    });
}

function fillTable(dataProducts){
    cleanTable();
    var totalDisplay = 0;
    var taxDisplay = 0;
    const table = document.getElementById("tableBody")
    dataProducts.forEach(data =>{
        totalDisplay += parseFloat(data.price);
        taxDisplay += parseFloat(data.tax)
        let row = table.insertRow();
        let code = row.insertCell();
        code.innerHTML = data.code;
        let name = row.insertCell();
        name.innerHTML = data.product_name.replace(/[^a-z0-9 ]/gi, '');
        let category = row.insertCell();
        category.innerHTML = data.category_name.replace(/[^a-z0-9 ]/gi, '');
        let amount = row.insertCell();
        amount.innerHTML = numberRegex('' + data.amount);
        let tax = row.insertCell();
        tax.innerHTML = "$" + data.tax;
        let total = row.insertCell();
        total.innerHTML = "$" + data.price;
    });

    document.getElementById("taxLabel").value = "$" + taxDisplay.toFixed(2);
    document.getElementById("totalLabel").value = "$" + (totalDisplay + taxDisplay).toFixed(2);
}