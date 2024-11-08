import axios from "axios";
import Swal from "sweetalert2";

class Global {
  static defineRouteURL(table) {
    return "http://localhost/routes/" + table + ".php";
  }

  static async getJsonTable(table) {
    var url = this.defineRouteURL(table);
    var response = await axios
      .get(url)
      .then((res) => res)
      .catch((error) => console.log(error));

    return response ? response : [];
  }

  static getJsonTableCondition(table, column, condition) {
    var url = this.defineRouteURL(table);
    var response = axios.post(url, {
      data: {
        table: table,
        column: column,
        condition: condition,
      },
    });

    return response ? response : [];
  }

  static async updateTable(table, value, code) {
    var url = this.defineRouteURL(table);
    await fetch(url, {
      headers: { "Content-Type": "application/json" },
      method: "PATCH",
      body: JSON.stringify({
        value: value,
        code: code,
      }),
    });
  }

  static create(table, post) {
    var url = this.defineRouteURL(table);
    const response = axios
      .post(url, post)
      .then((response) => {
        if (response.status != 200) {
          throw new Error("Error on internal request to server");
        }
        return response.data;
      })
      .catch((error) => {
        console.log("Something went wrong: " + error.message);
      });
    return response;
  }
  
  static async deleteAll(table) {
    const url = this.defineRouteURL(table);
    await this.getJsonTable(table).then((res) => res.data).then((data) => {
      data.forEach(async (product) => {
        let prodCode = product.product_code;
        const value = await Global.amountValue(prodCode, product.code);
        await Global.updateTable("products", "amount = " + value, prodCode);
      })
    })
    const response = await axios.delete(url).then((res) => res);
    return response;
  }

  static async amountValue(productCode, cartCode) {
    const amountProducts = await this.getJsonTableCondition(
      "products",
      "products.code",
      productCode
    ).then((product) => product.data[0].amount);

    const amountCart = await this.getJsonTableCondition(
      "cart",
      "cart.code",
      cartCode
    ).then((product) => product.data[0].amount);

    return amountProducts + amountCart;
  }

  static numberRegex(string) {
    return string.replace(/[^0-9,.]/g, "");
  }

  static verifyNumbers(number) {
    var boolean = true;
    if (number.constructor === Array) {
      number.forEach((data) => {
        if (data == "" || isNaN(data)) boolean = false;
      });
    } else {
      boolean = !number == "" && !isNaN(number);
    }

    return boolean;
  }

  static verifyTaxNumber(tax) {
    const taxNumber = parseInt(tax);
    if (taxNumber < 0) {
      Swal.fire({
        title: "Oops...",
        text: "The tax amount can't be a negative number.",
        icon: "error",
        background: "fffcf3",
        confirmButtonColor: "#5a2744",
      });
      return false;
    }
    if (taxNumber > 100) {
      Swal.fire({
        title: "Oops...",
        text: "The tax amount can't exceed 100.",
        icon: "error",
        background: "fffcf3",
        confirmButtonColor: "#5a2744",
      });
      return false;
    }

    return true;
  }

  static getDate() {
    var datete = new Date();
    var hours = `${datete.getHours()}:${datete.getMinutes()}:${datete.getSeconds()}`;
    return `${datete.getFullYear()}-${datete.getMonth()}-${datete.getDate()} ${hours}`;
  }
}

export default Global;
