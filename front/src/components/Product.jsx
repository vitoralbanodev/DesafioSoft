import { Button } from "./Button";
import { InputText } from "./InputText";
import Table from "./TableComponents/Table";

import style from "../css/Form.module.css";
import { Select } from "./Select";
import { useState } from "react";
import axios from "axios";

export default function Product() {
  const [post, setPost] = useState({
    category: 0,
    name: "",
    amount: 0,
    price: 0,
  });

  function handleChange(e) {
    console.log(e.target.value);
    setPost({ ...post, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    axios
      .post("http://localhost/routes/products.php", post)
      .then((response) => {
        if (response.status != 200) {
          throw new Error("Error on internal request to server");
        }
        return response.data;
      })
      .then((data) => {
        if (data.success) alert(data.message);
        else alert(data.message);
      })
      .catch((error) => {
        alert("Something went wrong: " + error.message);
      });
  }
  return (
    <>
      <form
        className={style.formClass}
        autoComplete="off"
        onSubmit={handleSubmit}
      >
        <section>
          <h1>Create a new product!</h1>
          <Select
            name="category"
            id="productSelect"
            route="categories"
            onChange={handleChange}
            required
          />
          <InputText
            type="text"
            name="name"
            placeholder="Product Name"
            minlength="4"
            maxlength="25"
            onChange={handleChange}
            required
          />
          <InputText
            type="number"
            name="amount"
            placeholder="Amount"
            min="1"
            onChange={handleChange}
            required
          />
          <InputText
            type="number"
            name="price"
            placeholder="Unit Price"
            min="1"
            step=".01"
            onChange={handleChange}
            required
          />
          <Button type="submit" id="addButton" content="Add Product" />
        </section>
      </form>
      <Table
        style="tableComponent"
        route="products"
        columns={["CODE", "PRODUCT", "AMOUNT", "UNIT PRICE", "CATEGORY"]}
        params={["code", "name", "amount", "price", "category_name"]}
      />
    </>
  );
}
