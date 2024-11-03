function cleanTable(){
    var table = document.getElementsByClassName("genericTable")[0]
    var rowCount = table.rows.length;
    for (var i = rowCount - 1; i > 0; i--){
        table.deleteRow(i);
    }
}

function defineRouteURL(table){
    return 'http://localhost/routes/' + table + '.php'
}

async function getJsonTable(table){
    var url = defineRouteURL(table);
    var response  = await fetch(url, {
        method: "GET"
    });

    var tableJson = response.json();

    return tableJson ? tableJson : [];
}

async function getJsonTableCondition(table, column, condition){
    var url = defineRouteURL(table);
    var response = await fetch(url, {
        headers: {"Content-Type" : "application/json"},
        method: "POST",
        body: JSON.stringify({
            'table': table,
            'column': column,
            'condition': condition
        })});
    var tableJson =  response.json()
    return tableJson ? tableJson : [];
}

function getLocalStorage(table){
    var tableJson = localStorage.getItem(table);

    return tableJson ? JSON.parse(tableJson) : [];
}

function deleteRow(codeRow, key, validate, code){
    if(window.confirm("Are you sure you want to remove this?")){
        if(validate){
            if(key == "shoppingCart") deleteShoppingCart(codeRow, code)
            else deleteRowOnLoad(codeRow, key, code)
        }
        else alert("It was not possible to delete this item! \nPlease verify if it is not linked with another table.")
    }
}

async function deleteShoppingCart(code, productCode){
    var amountData = await getJsonTableCondition("products", "products.code", productCode).then(product => product[0].amount);
    await getJsonTableCondition("order_item", "product_code", productCode).then(async product => {
        if(product.length == 0) await updateTable("candelete = true", productCode);
    });
    var cart = getLocalStorage("shoppingCart");
    cart.forEach(async (data, index) => {
        if(data.code == code){
            var value = parseInt(data.amount) + amountData;
            cart.splice(index, 1);
            await updateTable("amount = " + value, productCode)
        }
    })
    localStorage.setItem("shoppingCart", JSON.stringify(cart));
}

async function updateTable(value, code){
    var url = defineRouteURL("products");
    await fetch(url, {
        headers: {"Content-Type" : "application/json"},
        method: "PATCH",
        body: JSON.stringify({
            'value': value,
            'code': code
        })
    });
}

function verifyExistence(name, table, column){
    var boolean = true;
    var nameString = "LOWER('" + name + "')";
    var column = "LOWER("+column+")";
    getJsonTableCondition(table, column, nameString).then(list =>{
        if(list.length > 0){
            boolean = false;
        }
    });
    return boolean;
}

function numberRegex(string){
    return string.replace(/[^0-9,.]/g,'');
}

function verifyNumbers(number){
    var boolean = true;
    if(number.constructor === Array)
    {
        number.forEach(data => {
            if(data == "" || isNaN(data)) boolean = false;
        });
    }
    else{

        boolean = (!number == "") && !isNaN(number);
    }

    return boolean;
}

function verifyTaxNumber(tax){
    const taxNumber = parseInt(tax)
    if(taxNumber < 0){
        alert("The tax amount can't be a negative number.")
        return false;
    }
    if(taxNumber > 100){
        alert("The tax amount can't exceed 100.")
        return false;
    }

    return true;
}

function verifyName(name){
    var boolean = true;
    if(name.constructor === Array)
        {
            name.forEach(data => {
                if(data.length <= 3 || data.length > 25) boolean = false;
            });
        }
        else{
            boolean = name.length > 3 && name.length <= 25;
        }

    return boolean;
}
// FUNÇÕES CORRIGIDAS COM BANCO

function verifyBoughtItem(itemName){
    var canDelete = true
    var dataList = getLocalStorage("shoppingCart");
    dataList.forEach(data => {
        if(data.name === itemName){
            canDelete = false;
        }
    });

    return canDelete;
}

function orderCode(list){
    list.sort(function(a,b){
        return parseInt(a.code) - parseInt(b.code);
    });
}

//codigo MORTO

// if(key == "shoppingCart")
// {
//     var productList = getJsonTable("products");
//     productList.forEach(product => {
//         if(data.name == product.name && verifyNumbers(data.amount)){
//             product.amount += parseInt(data.amount);
//         }
//     });
//     localStorage.setItem("products", JSON.stringify(productList));
// }
//