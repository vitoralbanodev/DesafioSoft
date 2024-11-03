import axios from "axios";

class Global {
  static defineRouteURL(table) {
    return "http://localhost/routes/" + table + ".php";
  }

  static getJsonTable(table) {
    var url = this.defineRouteURL(table);
    var response = axios
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

  static updateTable(value, code) {
    var url = this.defineRouteURL("products");
    fetch(url, {
      headers: { "Content-Type": "application/json" },
      method: "PATCH",
      body: JSON.stringify({
        value: value,
        code: code,
      }),
    });
  }
}

export default Global;
