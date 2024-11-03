import axios from "axios";
import { useEffect, useState } from "react";
import { Button } from "../Button";
// import Global from "../Global";

// import style from "../../css/Category.module.css";

function Tablebody(props) {
  const url = "http://localhost/routes/" + props.route + ".php";
  const [data, setData] = useState([]);
  const [addedItem, setAddItem] = useState("");
  // if(props.dataTable != '') setAddItem(props.dataTable)
  console.log("prosp -> ", props);
  useEffect(() => {
    axios
      .get(url)
      .then((res) => setData(res.data))
      .catch((error) => console.log(error));
  }, [addedItem]);

  function handleDelete(rowCode, code, validate) {
    if (window.confirm("Are you sure you want to remove this?")) {
      if (validate || validate == null) deleteRowOnLoad(rowCode, code);
      else
        alert(
          "It was not possible to delete this item! \nPlease verify if it is not linked with another table."
        );
    }
  }

  function deleteRowOnLoad(rowCode, code) {
    axios.delete(url, {
      headers: { "Content-Type": "application/json" },
      data: JSON.stringify({
        rowCode: rowCode,
        auxCode: code,
      }),
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
            <td>
              <Button
                className="labels"
                type="submit"
                id="deleteButton"
                content={<i className="fa-solid fa-trash"></i>}
                onClick={() =>
                  handleDelete(
                    data.code,
                    data.category_code ? data.category_code : null,
                    data.candelete ? data.candelete : null
                  )
                }
              />
            </td>
          </tr>
        ))}
      </tbody>
    </>
  );
}

export default Tablebody;
