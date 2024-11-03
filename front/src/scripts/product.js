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

async function createProduct(event){
    event.preventDefault()
    var select = document.getElementById("productSelect");
    var category = select.options[select.selectedIndex].value;
    var name = document.getElementById("largerInput").value.replace(/[^a-z0-9 ]/gi, '');
    var amount = numberRegex(document.getElementById("amount").value);
    var price = numberRegex(document.getElementById("unitPrice").value);
    
    if(validateProduct(name, amount, price, category)){
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
    getJsonTable("products").then(productList => {
        productList.forEach(async data => {
            let productNameRegex = data.name.replace(/[^a-z0-9 ]/gi, '');
            let amountNumber = numberRegex('' + data.amount);
            let unitPriceNumber = numberRegex('' + data.price);
            let categoryRegex = data.category_name.replace(/[^a-z0-9 ]/gi, '');
            let canDelete = data.candelete;
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
            deleteButton.innerHTML = `<button class='labels' type='submit' id='deleteButton' onclick='deleteRow(` + JSON.stringify(data.code) + `, "products", ` + canDelete + `, ` + JSON.stringify(data.category_code) + `)'><i class="fa-solid fa-trash"></i></button>`;
        });
    });
}


function validateProduct(name, amount, price, category){
    if(category == "Category"){
        alert("You must to select a category to this product");
        return false;
    }
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