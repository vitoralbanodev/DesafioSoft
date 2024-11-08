import { Button } from "./Button";
import { InputText } from "./InputText";
import { Select } from "./Select";
import { useState } from "react";
import Table from "./TableComponents/Table";
import Global from "./Global";
import Swal from "sweetalert2";

import style from "../css/Form.module.css";

export default function Product() {
  const [post, setPost] = useState({
    category: "",
    name: "",
    amount: 0,
    price: 0,
  });
  const [fetchTable, setFetchTable] = useState(false);

  function handleChange(e) {
    console.log(e.target.value);

    if (e.target.name == "name") {
      let categoryNameRegex = e.target.value.replace(/[^a-zA-Z]/g, "");
      e.target.value = categoryNameRegex;
    }

    if (e.target.name == "amount") {
      let categoryTaxRegex = e.target.value.replace(/[^\d.]/g, "");
      e.target.value = categoryTaxRegex;
    }

    if (e.target.name == "price") {
      let categoryTaxRegex = e.target.value.replace(/[^\d.]/g, "");
      e.target.value = categoryTaxRegex;
    }

    setPost({ ...post, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    Global.create("products", post).then((data) => {
      if (data.success) {
        setFetchTable((prev) => !prev);
        Swal.fire({
          title: "Success!",
          text: data.message,
          icon: "success",
          background: "fffcf3",
          confirmButtonColor: "#5a2744",
        });
      } else
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: data.message,
          background: "fffcf3",
          confirmButtonColor: "#5a2744",
        });
      return data;
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
            value={post.category}
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
        fetchTable={fetchTable}
      />
    </>
  );
}
