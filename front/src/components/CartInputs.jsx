import axios from "axios";
import styles from "../css/Input.module.css";
import { Button } from "./Button";
import Global from "./Global";
import Swal from "sweetalert2";

export function CartInputs(props) {
  async function handleFinishCart() {
    await Global.getJsonTable("cart").then(async (response) => {
      let productList = response.data;
      if (productList.length > 0) {
        if (window.confirm("Are you sure you want to finish your purchase?")) {
          var total = props.totalValue;
          var taxTotal = props.taxValue;
          var order = await createOrder(total, taxTotal, productList.length);
          productList.forEach((product) => {
            createOrderItem(product, order);
          });

          await Global.deleteAll("cart");
          Swal.fire({
            title: "Success!",
            text: "Your order has been placed successfully!",
            icon: "success",
            background: "fffcf3",
            confirmButtonColor: "#5a2744",
          });
        }
      } else
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "There is no items on your shopping cart.",
          background: "fffcf3",
          confirmButtonColor: "#5a2744",
        });
    });
  }

  async function createOrder(total, tax, qtd) {
    let date = Global.getDate();
    var url = Global.defineRouteURL("orders");
    var response = await axios
      .post(url, {
        data: {
          total: total,
          tax: tax,
          quantity: qtd,
          date: date,
        },
      })
      .then((response) => {
        if (!response.status == 200) {
          throw new Error("Error on internal request to server");
        }
        return response.data;
      })
      .then((data) => data.order.code)
      .catch((error) => {
        console.log("Something went wrong: " + error.message);
      });

    return response;
  }

  async function createOrderItem(product, orderCode) {
    var url = Global.defineRouteURL("order_item");

    await axios
      .post(url, {
        data: {
          code: product.product_code,
          tax: product.tax,
          price: product.total,
          amount: product.amount,
          order_code: orderCode,
        },
      })
      .then((response) => {
        if (!response.status == 200) {
          throw new Error("Error on internal request to server");
        }
        return response.data;
      });
  }

  async function handleCancelCart() {
    await Global.getJsonTable("cart").then(async (response) => {
      let productList = response.data;
      if (productList.length > 0) {
        Swal.fire({
          title: "Are you sure you want to clear your cart?",
          text: "You won't be able to revert this!",
          icon: "warning",
          background: "fffcf3",
          showCancelButton: true,
          confirmButtonColor: "#e280b3",
          cancelButtonColor: "#5a2744",
          confirmButtonText: "Yes, clear it!",
          cancelButtonText: "No, cancel!",
          reverseButtons: true,
        }).then((result) => {
          if (result.isConfirmed) {
            handleConfirmed();
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            Swal.fire({
              title: "Cancelled",
              text: "The cart will not be cleared!",
              icon: "error",
              background: "fffcf3",
              confirmButtonColor: "#5a2744",
            });
          }
        });
      } else
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "There is no items on your shopping cart.",
          background: "fffcf3",
          confirmButtonColor: "#5a2744",
        });
    });
  }

  async function handleConfirmed() {
    await Global.deleteAll("cart").then(async (res) => {
      await Swal.fire({
        title: "Success!",
        text: res.data.message,
        icon: "success",
        background: "fffcf3",
        confirmButtonColor: "#5a2744",
      });
      window.location.reload();
    });
  }

  return (
    <>
      <div className={styles.labels}>
        <label className={styles.label} htmlFor="tax">
          Tax:
          <input
            className={styles.labelInput}
            type="text"
            name="tax"
            placeholder="0"
            value={props.taxValue + "$"}
            disabled
          />
        </label>
        <label className={styles.label} htmlFor="total">
          Total:
          <input
            className={styles.labelInput}
            type="text"
            name="total"
            placeholder="0"
            value={props.totalValue + "$"}
            disabled
          />
        </label>
        <div className={styles.buttons}>
          <Button
            type="submit"
            id="finishButton"
            content="Finish"
            onClick={handleFinishCart.bind()}
          />
          <Button
            type="submit"
            id="cancelButton"
            content="Cancel"
            onClick={handleCancelCart.bind()}
          />
        </div>
      </div>
    </>
  );
}
