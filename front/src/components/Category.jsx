import { InputText } from "./InputText";
import { Button } from "./Button";
import Table from "./TableComponents/Table";
import axios from "axios";

import style from "../css/Form.module.css";
import { useState } from "react";

export default function Category() {
  const [post, setPost] = useState({
    name: "",
    tax: 0,
  });
  const [addedItem, setAddItem] = useState("");

  function handleChange(e) {
    setPost({ ...post, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const response = await axios
      .post("http://localhost/routes/categories.php", post)
      .then((response) => {
        if (response.status != 200) {
          throw new Error("Error on internal request to server");
        }
        return response.data;
      })
      .then((data) => {
        if (data.success) alert(data.message);
        else alert(data.message);
        return data;
      })
      .catch((error) => {
        alert("Something went wrong: " + error.message);
      });
    setAddItem(response);
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
        datatable={addedItem}
      />
    </>
  );
}
