import Table from "./TableComponents/Table";

export default function History() {
  return (
    <>
      <Table
        style="soloTable"
        route="orders"
        columns={["CODE", "PRODUCTS BOUGHT", "TOTAL TAX", "TOTAL PRICE", "DATE"]}
        params={["code", "quantity", "tax", "total", "purchase_date"]}
      />
    </>
  );
}
