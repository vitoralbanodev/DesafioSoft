import style from "../../css/Table.module.css";
import TableHead from "./TableHead";
import TableBody from "./TableBody";
import { CartInputs } from "../CartInputs";

const Table = (props) => {
  return (
    <>
      <div
        id={props.none ? `${style["detailDiv"]}` : ""}
        className={`${style[props.style]}`}
      >
        <div className={style.tableDiv}>
          <table className={style.genericTable}>
            <TableHead columns={props.columns} none={props.none} />
            <TableBody
              fetchTable={props.fetchTable}
              route={props.route}
              params={props.params}
              code={props.code}
              view={props.view}
              none={props.none}
            />
          </table>
        </div>
        {props.cart ? (
          <CartInputs taxValue={props.cart[0]} totalValue={props.cart[1]} />
        ) : (
          ""
        )}
      </div>
    </>
  );
};

export default Table;
