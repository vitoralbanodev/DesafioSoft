var url = defineRouteURL("products");

function fillCategorySelect(){
    var selectInput = document.getElementById("productSelect");
    getJsonTable("categories").then(categories => {
        categories.forEach(category => {
            var taxNumber = category.tax;
            if(verifyNumbers(taxNumber) && verifyTaxNumber(taxNumber)){
                selectInput.innerHTML += `<option value="` + category.code + `">` + category.name.replace(/[^a-z0-9 ]/gi, '') + `</option>`
            }
            else deleteRowOnLoad(category.code, "categories")
        });
    });
}

async function createProduct(){
    var select = document.getElementById("productSelect");
    var category = select.options[select.selectedIndex].value;
    var name = document.getElementById("largerInput").value;
    var amount = document.getElementById("amount").value;
    var price = document.getElementById("unitPrice").value;
    if(validateProduct(name, amount, price)){
        await fetch(url,{
            method: "POST",
            body: JSON.stringify({
                "name": name,
                "amount": amount,
                "price": price,
                "category": category
            })
        })
        .then(response => {
            if(!response.ok){
                throw new Error('Error on internal request to server')
            }
            return response.json();
        })
        .then(data => {
            if(data.success) alert(data.message);
            else alert(data.message)
        })
        .catch(error => {
            alert("Something went wrong: " + error.message)
        })
        .finally(() => location.reload());
    }
}

function fillTable(){
    cleanTable();
    const table = document.getElementById("tableBody")
    getJsonTable("products").then(async productList => {
        orderCode(productList);
        productList.forEach(async data => {
            let productNameRegex = data.name.replace(/[^a-z0-9 ]/gi, '');
            let amountNumber = numberRegex('' + data.amount);
            let unitPriceNumber = numberRegex('' + data.price);
            let categoryRegex = data.category_name.replace(/[^a-z0-9 ]/gi, '');
            let canDelete = await verifyCanDelete(data.code, productNameRegex);
            let row = table.insertRow();
            let code = row.insertCell();
            code.innerHTML = data.code;
            let name = row.insertCell();
            name.innerHTML = productNameRegex;
            let amount = row.insertCell();
            amount.innerHTML = amountNumber;
            let unitPrice = row.insertCell();
            unitPrice.innerHTML = "$" + unitPriceNumber;
            let category = row.insertCell();
            category.innerHTML = categoryRegex;
            let deleteButton = row.insertCell();
            deleteButton.innerHTML = `<button class='labels' type='submit' id='deleteButton' onclick='deleteRow(` + JSON.stringify(data.code) + `, "products", ` + canDelete + `)'><i class="fa-solid fa-trash"></i></button>`;
        });
    });
}


function validateProduct(name, amount, price){
    if(!verifyName(name)){
        alert("The product name must be a minimum of 4 and a maximum of 25 characters");
        return false;
    }
    if(amount.length < 1 && !verifyNumbers(amount)){
        alert("The product amount must be a minimum of 1 item");
        return false;
    }
    if(price.length < 1 && !verifyNumbers(price)){
        alert("You must to define a price to this product");
        return false;
    }
    
    return true
}

async function verifyCanDelete(productCode, productName){
    var boolean = true;
    if(!verifyBoughtItem(productName)) boolean = false;
    await getJsonTableCondition("order_item", "product_code", productCode).then(list =>{
        if(list.length > 0) boolean = false;
    });

    return boolean;
}