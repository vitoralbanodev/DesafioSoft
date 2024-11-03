var productName;

function fillProductSelect(){
    var selectInput = document.getElementById("productSelect");
    getJsonTable("products").then(products => {
        products.forEach(product => {
            let taxValue = numberRegex('' + product.tax);
            let unitPrice = numberRegex('' + product.price);
            if(verifyNumbers([taxValue, unitPrice]) && verifyTaxNumber(taxValue)){
                selectInput.innerHTML += `<option value="` + product.code + `">` + product.name.replace(/[^a-z0-9 ]/gi, '') + `</option>`
            }
            else deleteRowOnLoad(product.code, "products")
        });
    });
}

function fillValueInputs(code){
    getJsonTableCondition("products", "products.code", code).then(productList => {
        let product = productList[0];
        let taxValue = parseInt(numberRegex('' + product));
        let unitPrice = parseFloat(numberRegex('' + product.price));
        productName = product.name.replace(/[^a-z0-9 ]/gi, '');
        document.getElementById("taxInput").value = `$` + ((taxValue * unitPrice)/100).toFixed(2);
        document.getElementById("unitInput").value = `$` + unitPrice;
        document.getElementById("hiddenInput").value = product.category_code;
    });
}

async function addNewProduct(){
    var select = document.getElementById("productSelect");
    var productCode = select.options[select.selectedIndex].value;
    var unitPrice = document.getElementById("unitInput").value.replace(/[$]/g, '');
    var amountData = document.getElementById("largerInput").value;
    var tax = document.getElementById("taxInput").value.replace(/[$]/g, '') * amountData;
    var category = document.getElementById("hiddenInput").value;
    var total = unitPrice * amountData;
    if(category != "nothing"){
        if(amountData <= 0){
            alert("The amount value can't be less than or equal to zero.")
            return;
        }
        if(await verifyStock(productCode, amountData))
        {
            await updateTable("candelete = false", productCode);
            var cartList = getLocalStorage("shoppingCart");
            var lastIndex =  cartList.at(-1);
            var code = lastIndex ? (parseInt(lastIndex.code)+ 1) : "001";
            code = code.toString().padStart(3, "0")
            var newProduct = {
                "code" : code,
                "productCode" : productCode,
                "name" : productName,
                "amount" : amountData,
                "price" : unitPrice,
                "category" : category,
                "tax" : tax.toFixed(2),
                "total" : total.toFixed(2)
            }
            cartList.push(newProduct);
            localStorage.setItem("shoppingCart", JSON.stringify(cartList));
    
            alert("A new product has been added successfully to your shopping cart!");
            location.reload();
        }
        else alert("Sorry, it appears this product is out of stock or doesn't have the desired quantity available.")
    }
    else alert("Please, select a product to add to you shopping cart.")
}

function fillTable(){
    cleanTable();
    var productList = getLocalStorage("shoppingCart");
    orderCode(productList);
    const table = document.getElementById("tableBody")
    var totalDisplay = 0;
    var taxDisplay = 0;
    productList.forEach(data => {
        let productName = data.name.replace(/[^a-z0-9 ]/gi, '');
        let unitPriceNumber = numberRegex('' + data.price);
        let amountNumber = numberRegex('' + data.amount);
        let totalNumber = numberRegex('' + data.total);
        if(verifyNumbers([totalNumber, amountNumber, unitPriceNumber])){
            totalDisplay += parseFloat(data.total);
            taxDisplay += parseFloat(data.tax)
            let row = table.insertRow();
            let name = row.insertCell();
            name.innerHTML = productName;
            let unitPrice = row.insertCell();
            unitPrice.innerHTML = "$" + unitPriceNumber;
            let amount = row.insertCell();
            amount.innerHTML = amountNumber;
            let total = row.insertCell();
            total.innerHTML = "$" + totalNumber;
            let deleteButton = row.insertCell();
            deleteButton.innerHTML = `<button class='labels' type='submit' id='deleteButton' onclick='deleteRow(` + JSON.stringify(data.code) + `, "shoppingCart", true, ` + JSON.stringify(data.productCode) + `)'><i class="fa-solid fa-trash"></i></button>`;
        }
        else deleteShoppingCart(data.code, data.productCode)
    });
    fillProductSelect()
    document.getElementById("taxLabel").value = "$" + taxDisplay.toFixed(2);
    document.getElementById("totalLabel").value = "$" + (totalDisplay + taxDisplay).toFixed(2);
}

function cancelShoppingCart(){
    if(confirm("Are you sure you want to cancel your purchase?")){
        var productList = getLocalStorage("shoppingCart");
        productList.forEach(data => {
            deleteShoppingCart(data.code, data.productCode)
        });
    }
}

async function verifyStock(code, amountData){
    var boolean = false;
    await getJsonTableCondition("products", "products.code", code).then(productList => {
        let data = productList[0];
        if(parseInt(data.amount) >= amountData){
            let value = (data.amount - amountData);
            boolean = true;
            updateTable("amount = " + value, code);
        }
    });
    return boolean;
}

async function finishShoppingCart(){
    var productList = getLocalStorage("shoppingCart");
    if(productList.length > 0){
        if(confirm("Are you sure you want to finish your purchase?")){
            var total = numberRegex(document.getElementById("totalLabel").value);
            var taxTotal = numberRegex(document.getElementById("taxLabel").value);
            var order = await createOrder(total, taxTotal, productList.length);
            productList.forEach(product =>{
                createOrderItem(product, order);
            })
            localStorage.removeItem("shoppingCart");
            location.reload();

            alert("Your order has been placed successfully!")
        }
    }
    else alert("There is no items on your shopping cart.")
}

async function createOrder(total, tax, qtd){
    var url = defineRouteURL("orders");
    var response = await fetch(url,{
        method: "POST",
        body: JSON.stringify({
            "total": total,
            "tax": tax,
            "quantity": qtd,
            "date": getDate()
        })
    })
    .then(response => {
        if(!response.ok){
            throw new Error('Error on internal request to server')
        }
        
        return response.json();
    })
    .then(data => data.order.code)
    .catch(error => {
        alert("Something went wrong: " + error.message)
    });

    return response;
}

async function createOrderItem(product, orderCode){
    var url = defineRouteURL("order_item");
    await fetch(url,{
        method: "POST",
        body: JSON.stringify({
            "code" : product.productCode,
            "tax" : product.tax,
            "price" : product.total,
            "amount" : product.amount,
            "order_code" : orderCode
        })
    })
    .then(response => {
        if(!response.ok){
            throw new Error('Error on internal request to server')
        }
        return response.json();
    })
}

function getDate(){
    var datete = new Date;
    var hours = `${datete.getHours()}:${datete.getMinutes()}:${datete.getSeconds()}`
    return `${datete.getFullYear()}-${datete.getMonth()}-${datete.getDate()} ${hours}`;
}