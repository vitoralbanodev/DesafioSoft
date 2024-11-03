import style from "../../css/Table.module.css";
import TableHead from "./TableHead";
import TableBody from "./TableBody";

const Table = (props) => {
  return (
    <>
      <div className={`${style[props.style]}`}>
        <div className={style.tableDiv}>
          <table className={style.genericTable}>
            <TableHead columns={props.columns} />
            <TableBody
              dataTable={props.dataTable}
              route={props.route}
              params={props.params}
            />
          </table>
        </div>
      </div>
    </>
  );
};

export default Table;
