var currentOrder = "asc";
var historyList;
var url = defineRouteURL("orders")

function fillTable(){
    cleanTable();
    const table = document.getElementById("tableBody")
    historyList.forEach(data => {
        let taxNumber = numberRegex(data.tax);
        let totalNumber = numberRegex(data.total);
        let purchaseDate = new Date(data.purchase_date);
        let formatDate = purchaseDate.toLocaleDateString("pt-BR") + "<br>" + purchaseDate.toLocaleTimeString("pt-BR");
        if(verifyNumbers([taxNumber, totalNumber])){
            let row = table.insertRow();
            let code = row.insertCell();
            code.innerHTML = data.code;
            let productList = row.insertCell();
            productList.innerHTML = data.quantity;
            let tax = row.insertCell();
            tax.innerHTML = '$' + taxNumber;
            let total = row.insertCell();
            total.innerHTML = data.total;
            let date = row.insertCell();
            date.innerHTML = formatDate;
            let deleteButton = row.insertCell();
            deleteButton.innerHTML = `<a href="details.html?code=` + data.code + `"><button class="labels" id="viewButton"><i class="fa-solid fa-eye"></i></button></a> 
                <button class="labels" id="deleteButton" onclick='deleteRowOnLoad(` + JSON.stringify(data.code) + `, "orders")'><i class="fa-solid fa-trash"></i></button>`;
        }
        else deleteRowOnLoad(data.code, "orders")
    });
}

async function clearHistory(){
    await fetch(url, {
        headers: {"Content-Type" : "application/json"},
        method: "DELETE"
    });
    cleanTable();
}

async function orderByDate(){
    historyList = await getJsonTable("orders")
    if(currentOrder === "asc"){
        historyList.sort(function(a,b){
            return new Date(b.purchase_date) - new Date(a.purchase_date);
        });
        document.getElementById("sortIcon").className = "fa-solid fa-arrow-up-wide-short";
        currentOrder = "desc";
    }
    else{
        historyList.sort(function(a,b){
            return new Date(a.purchase_date) - new Date(b.purchase_date);
        });
        document.getElementById("sortIcon").className = "fa-solid fa-arrow-down-short-wide";
        currentOrder = "asc";
    }

    fillTable();
}