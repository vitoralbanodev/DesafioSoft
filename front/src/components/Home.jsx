import { useEffect, useState } from "react";
import { InputText } from "./InputText";
import { Select } from "./Select";
import { Button } from "./Button";
import Table from "./TableComponents/Table";
import axios from "axios";
import Global from "./Global";

import style from "../css/Form.module.css";

export default function Home() {
  const [post, setPost] = useState({
    product: "",
    amount: "",
    tax: "",
    price: "",
    total: "",
  });
  const [addedItem, setAddItem] = useState("");

  async function handleSelectChange(e) {
    handleChange(e);
    Global.getJsonTableCondition("products", "products.code", e.target.value)
      .then((res) => {
        handleDataSet("tax", res.data[0].tax);
        return res;
      })
      .then((res) => {
        handleDataSet("price", res.data[0].price);
      })
      .catch((error) => console.log(error));
  }

  function handleChange(e) {
    handleDataSet(e.target.name, e.target.value);
  }

  function handleDataSet(key, value) {
    setPost((post) => ({ ...post, [key]: value }));
  }

  async function verifyStock(code, amountData) {
    var boolean = false;
    await Global.getJsonTableCondition("products", "products.code", code).then(
      (productList) => {
        let data = productList.data[0];
        if (parseInt(data.amount) >= amountData) {
          let value = data.amount - amountData;
          boolean = true;
          Global.updateTable("amount = " + value, code);
        }
      }
    );
    return boolean;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const value = post.amount * post.price;
    handleDataSet("total", value);
    if (post.product != "") {
      if (post.amount <= 0) {
        alert("The amount value can't be less than or equal to zero.");
        return;
      }
      if (await verifyStock(post.product, post.amount)) {
        axios
          .post("http://localhost/routes/cart.php", post)
          .then((response) => {
            if (response.status != 200) {
              throw new Error("Error on internal request to server");
            }
            return response.data;
          })
          .then((data) => {
            console.log("data ->", data);
            if (data.success) {
              console.log("data ->", data);
              setAddItem(data);
              alert(data.message);
            } else alert(data.message);
            return data;
          })
          .catch((error) => {
            alert("Something went wrong: " + error.message);
          });
        // alert(
        //   "A new product has been added successfully to your shopping cart!"
        // );
      } else
        alert(
          "Sorry, it appears this product is out of stock or doesn't have the desired quantity available."
        );
    } else alert("Please, select a product to add to you shopping cart.");
  }

  return (
    <>
      <form
        className={style.formClass}
        autoComplete="off"
        onSubmit={handleSubmit}
      >
        <section>
          <h1>Here you can buy what you want!</h1>
          <Select
            name="product"
            id="productSelect"
            route="products"
            label="Products"
            onChange={handleSelectChange}
            required
          />
          <InputText
            type="number"
            name="amount"
            placeholder="Amount"
            label="Products"
            min="0"
            onChange={handleChange}
            required
          />
          <InputText
            type="number"
            name="tax"
            placeholder="Tax"
            label="Tax"
            min="0"
            max="100"
            maxlength="3"
            value={post.tax}
            disabled
            required
          />
          <InputText
            type="number"
            name="price"
            placeholder="Unit Price"
            label="Unit Price"
            min="0"
            value={post.price}
            disabled
            required
          />
          <Button type="submit" id="addButton" content="Add Product" />
        </section>
      </form>
      <Table
        style="tableComponent"
        route="cart"
        columns={["PRODUCT", "AMOUNT", "UNIT PRICE", "TOTAL"]}
        params={["name", "amount", "price", "total"]}
        dataTable={addedItem}
      />
    </>
  );
}
