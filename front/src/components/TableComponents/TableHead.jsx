function TableHead(props) {
  return (
    <>
      <thead>
        <tr key="columns">
          {props.columns.map((column, index) => (
            <th key={index}>{column}</th>
          ))}
          {props.none ? "" : <th></th>}
        </tr>
      </thead>
    </>
  );
}

export default TableHead;
