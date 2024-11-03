import styles from "../css/Input.module.css";

export function InputText(props) {
  return (
    <input
      className={styles.input}
      type={props.type}
      name={props.name}
      placeholder={props.placeholder}
      value={props.value}
      onChange={props.onChange}
      min={props.min}
      max={props.max}
      minLength={props.minlength}
      maxLength={props.maxlength}
      step={props.step}
      disabled={props.disabled}
      required={props.required}
    />
  );
}
