import { InputText } from "./InputText";
import { Button } from "./Button";
import { useState } from "react";
import Table from "./TableComponents/Table";
import Global from "./Global";
import Swal from "sweetalert2";

import style from "../css/Form.module.css";

export default function Category() {
  const [post, setPost] = useState({
    name: "",
    tax: 0,
  });
  const [fetchTable, setFetchTable] = useState(false);

  function handleChange(e) {
    if (e.target.name == "name") {
      let categoryNameRegex = e.target.value.replace(/[^a-zA-Z]/g, "");
      e.target.value = categoryNameRegex;
    }

    if (e.target.name == "tax") {
      let categoryTaxRegex = e.target.value.replace(/[^\d.]/g, "");
      e.target.value = categoryTaxRegex;
    }

    setPost({ ...post, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    Global.create("categories", post).then((data) => {
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
          <h1>Create a new category!</h1>
          <InputText
            type="text"
            name="name"
            placeholder="Category Name"
            minlength="4"
            maxlength="25"
            onChange={handleChange}
            required
          />
          <InputText
            type="number"
            name="tax"
            placeholder="Tax"
            min="0"
            max="100"
            maxlength="3"
            onChange={handleChange}
            required
          />
          <Button type="submit" id="addButton" content="Add Category" />
        </section>
      </form>
      <Table
        style="tableComponent"
        route="categories"
        columns={["CODE", "NAME", "TAX"]}
        params={["code", "name", "tax"]}
        fetchTable={fetchTable}
      />
    </>
  );
}
