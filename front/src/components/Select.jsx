import { useEffect, useState } from "react";
import styles from "../css/Input.module.css";
import axios from "axios";

export function Select(props) {
  const url = "http://localhost/routes/" + props.route + ".php";
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get(url)
      .then((res) => setData(res.data))
      .catch((error) => console.log(error));
  }, []);
  return (
    <select
      className={styles.select}
      name={props.name}
      onChange={props.onChange}
      defaultValue=""
      required={props.required}
    >
      <option disabled value="" hidden>
        Select an option
      </option>
      {data.map((category, index) => (
        <option key={index} value={category.code}>
          {category.name}
        </option>
      ))}
    </select>
  );
}
