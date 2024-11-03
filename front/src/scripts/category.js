var url = defineRouteURL("categories");

async function createCategory(e){
    e.preventDefault();
    var name = document.getElementById("categoryName").value.replace(/[^a-z0-9 ]/gi, '');
    var tax = numberRegex(document.getElementById("categoryTax").value);
    if(validateCategory(name, tax)){
        await fetch(url,{
            method: "POST",
            body: JSON.stringify({
                "name": name,
                "tax": tax
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

async function fillTable(){
    cleanTable();
    const table = document.getElementById("tableBody")
    getJsonTable("categories").then(categories =>{
        console.log(categories);
        categories.forEach(async category => {
            let taxNumber = numberRegex(category.tax.toString());
            let categoryName = category.name;
            let categoryRegex = categoryName.replace(/[^a-z0-9 ]/gi, '');
            let canDelete = category.candelete;
            let row = table.insertRow();
            let code = row.insertCell();
            code.innerHTML = category.code;
            let name = row.insertCell();
            name.innerHTML = categoryRegex;
            let tax = row.insertCell();
            tax.innerHTML = taxNumber + "%";
            let deleteButton = row.insertCell();
            deleteButton.innerHTML = `<button class='labels' type='submit' id='deleteButton' onclick='deleteRow(` + JSON.stringify(category.code) + `, "categories", ` + canDelete + `)'><i class="fa-solid fa-trash"></i></button>`;
        });
    });
}

function validateCategory(name, tax){

    if(!verifyName(name)){
        alert("The category name must be a minimum of 4 and a maximum of 25 characters");
        return false;
    }
    if(!verifyTaxNumber(tax)){
        return false;
    }

    return true
}