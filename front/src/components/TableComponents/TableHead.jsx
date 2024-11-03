function TableHead(props) {
  console.log("teste")
  return (
    <>
      <thead>
        <tr key="columns">
          {props.columns.map((column, index) => (
            <th key={index}>{column}</th>
          ))}
          <th></th>
        </tr>
      </thead>
    </>
  );
}

export default TableHead;
