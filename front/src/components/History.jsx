import { useEffect } from "react";
import Table from "./TableComponents/Table";

export default History = () => (
  <>
    <Table
      style="soloTable"
      route="orders"
      columns={["CODE", "PRODUCTS BOUGHT", "TOTAL TAX", "TOTAL PRICE", "DATE"]}
      params={["code", "quantity", "tax", "total", "purchase_date"]}
      view
    />
  </>
);
