import "../css/Button.css";

export function Button(props) {
  return (
    <button
      type={props.type}
      className={props.className}
      id={props.id}
      onClick={props.onClick}
    >
      {props.content}
    </button>
  );
}
