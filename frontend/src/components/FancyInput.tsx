import styles from "./FancyInput.module.css";
import { InputHTMLAttributes, ReactNode, useId } from "react";

interface FancyInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: ReactNode;
}

/**
 * A styled input component. It supports the same props as a regular input, but
 * also supports a `label` prop to add a label to the input.
 */
export const FancyInput = ({label, ...props}: FancyInputProps) => {
  const inputID = useId();
  return (
    <div className={styles.fancyInput}>
      <input {...props} id={inputID} placeholder=" " />
      <label htmlFor={inputID}>{label}</label>
      <i />
    </div>
  );
};
