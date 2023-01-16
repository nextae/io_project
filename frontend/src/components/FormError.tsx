import styles from "./FormError.module.css";

import { IoAlertCircleOutline } from "react-icons/io5";

/**
 * A component to display an error message. If the `error` prop is a string,
 * it will be displayed. Otherwise, nothing will be displayed. If the `full`
 * prop is true, the error message will cover the parent element.
 */
export const FormError = ({ error, full }: { error?: string | null, full?: boolean }) => {
  if (error)
    return (
      <div className={`${styles.formError} ${full ? styles.full : ""}`}>
        <IoAlertCircleOutline /> {error}
      </div>
    );
  return null;
};
