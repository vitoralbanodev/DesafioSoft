import axios from "axios";
import { useEffect, useState } from "react";
import { Button } from "../Button";
import Global from "../Global";
import { TrashSimple } from "@phosphor-icons/react";
import Modal from "../Modal";
import Swal from "sweetalert2";
import styleButton from "../../css/Button.css";

function Tablebody(props) {
  const url = "http://localhost/routes/" + props.route + ".php";
  const [data, setData] = useState([]);

  useEffect(() => {
    if (props.none) {
      Global.getJsonTableCondition(props.route, "oi.order_code", props.code)
        .then((res) => setData(res.data))
        .catch((error) => console.log(error));
    } else {
      Global.getJsonTable(props.route)
        .then((res) => setData(res.data))
        .catch((error) => console.log(error));
    }
  }, [props.fetchTable]);

  function handleDelete(rowCode, catCode, prodCode, validate) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      background: "fffcf3",
      showCancelButton: true,
      confirmButtonColor: "#e280b3",
      cancelButtonColor: "#5a2744",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        handleConfirmed(rowCode, catCode, prodCode, validate);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          title: "Cancelled",
          text: "This item will not be deleted!",
          icon: "error",
          background: "fffcf3",
          confirmButtonColor: "#5a2744",
        });
      }
    });
  }

  function handleConfirmed(rowCode, catCode, prodCode, validate) {
    
    if (validate || validate == null) {
      deleteRow(rowCode, catCode, prodCode);
    } else
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "It was not possible to delete this item! \nPlease verify if it is not linked with another table.",
        background: "fffcf3",
        confirmButtonColor: "#5a2744",
      });
  }

  async function deleteRow(rowCode, catCode, prodCode) {
    if (prodCode) {
      const value = await Global.amountValue(prodCode, rowCode);
      Global.updateTable("products", "amount = " + value, prodCode);
    }

    axios
      .delete(url, {
        headers: { "Content-Type": "application/json" },
        data: JSON.stringify({
          rowCode: rowCode,
          auxCode: catCode,
        }),
      })
      .then(async (res) => {
        if (res.data.success) {
          await Swal.fire({
            title: "Deleted!",
            text: "This item file has been deleted.",
            icon: "success",
            background: "fffcf3",
            confirmButtonColor: "#5a2744",
          });
          window.location.reload();
        }
      });
  }

  function key(obj, path) {
    return path.split(".").reduce((acc, part) => acc && acc[part], obj);
  }

  return (
    <>
      <tbody>
        {data.map((data, index) => (
          <tr key={index}>
            {props.params.map((param, cod) => (
              <td key={cod}>{key(data, param)}</td>
            ))}
            {!props.none ? (
              <td>
                {!props.view ? (
                  <Button
                    className="labels"
                    type="submit"
                    id="deleteButton"
                    content={<TrashSimple size={28} />}
                    onClick={() =>
                      handleDelete(
                        data.code,
                        data.category_code ? data.category_code : null,
                        data.product_code ? data.product_code : null,
                        data.candelete != null ? data.candelete : null
                      )
                    }
                  />
                ) : (
                  <Modal code={data.code} />
                )}
              </td>
            ) : (
              ""
            )}
          </tr>
        ))}
      </tbody>
    </>
  );
}

export default Tablebody;
