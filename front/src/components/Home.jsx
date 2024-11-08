import { useEffect, useState } from "react";
import { InputText } from "./InputText";
import { Select } from "./Select";
import { Button } from "./Button";
import Table from "./TableComponents/Table";
import Global from "./Global";
import Swal from "sweetalert2";

import style from "../css/Form.module.css";

export default function Home() {
  const [post, setPost] = useState({
    product: "",
    amount: "",
    tax: "",
    price: "",
    total: "",
  });
  const [fetchTable, setFetchTable] = useState(false);
  const [priceLabel, setPriceLabel] = useState({
    taxValue: "",
    totalValue: "",
  });

  useEffect(() => {
    async function fecthData() {
      await Global.getJsonTable("cart").then((res) => {
        let totalTax = 0;
        let totalPrice = 0;
        res.data.forEach((data) => {
          let taxValue = calculateTax(data.tax, data.price) * data.amount;
          totalTax += taxValue;
          totalPrice += parseFloat(data.total);
        });
        handleSetLabel("taxValue", totalTax.toFixed(2));
        handleSetLabel("totalValue", totalPrice);
      });
    }

    function handleSetLabel(key, value) {
      setPriceLabel((priceLabel) => ({ ...priceLabel, [key]: value }));
    }

    fecthData();

    setPost({
      product: "",
      amount: "",
      tax: "",
      price: "",
      total: "",
    });
  }, [fetchTable]);

  function calculateTax(tax, priceAux) {
    return ((tax ? tax : post.tax) / 100) * priceAux;
  }

  async function handleSelectChange(e) {
    handleDataSet("product", e.target.value);
    Global.getJsonTableCondition("products", "products.code", e.target.value)
      .then((res) => {
        let tax = parseInt(res.data[0].tax);
        let price = res.data[0].price;
        handleDataSet("tax", tax);
        handleDataSet("price", price);
        handleTotalChange(null, price, tax);
      })
      .catch((error) => console.log(error));
  }

  function handleAmountChange(e) {
    handleDataSet("amount", e.target.value);
    handleTotalChange(e.target.value);
  }

  function handleTotalChange(amount, price, tax) {
    let priceAux = price ? price : post.price;
    const value =
      (amount ? amount : post.amount) * priceAux + calculateTax(tax, priceAux);
    handleDataSet("total", value);
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
          Global.updateTable("products", "amount = " + value, code);
        }
      }
    );
    return boolean;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (post.product != "") {
      if (post.amount <= 0) {
        Swal.fire({
          title: "Oops...",
          text: "The amount value can't be less than or equal to zero.",
          icon: "error",
          background: "fffcf3",
          confirmButtonColor: "#5a2744",
        });
        return;
      }
      if (await verifyStock(post.product, post.amount)) {
        await Global.create("cart", post).then((data) => {
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
      } else
        Swal.fire({
          title: "Oops...",
          text: "Sorry, it appears this product is out of stock or doesn't have the desired quantity available.",
          icon: "error",
          background: "fffcf3",
          confirmButtonColor: "#5a2744",
        });
    } else
      Swal.fire({
        title: "Oops...",
        text: "Please, select a product to add to you shopping cart.",
        icon: "info",
        background: "fffcf3",
        confirmButtonColor: "#5a2744",
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
          <h1>Here you can buy what you want!</h1>
          <Select
            name="product"
            id="productSelect"
            route="products"
            label="Products"
            value={post.product}
            onChange={handleSelectChange}
            required
          />
          <InputText
            type="number"
            name="amount"
            placeholder="Amount"
            label="Products"
            min="0"
            value={post.amount}
            onChange={handleAmountChange}
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
        fetchTable={fetchTable}
        cart={[priceLabel.taxValue, priceLabel.totalValue]}
      />
    </>
  );
}
