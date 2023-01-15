import styles from "./LoadingIndicator.module.css";
import { IoReloadCircleOutline } from "react-icons/io5";

/**
 * A component that displays a spinning loading indicator.
 */
export const LoadingIndicator = () => (
  <div className={styles.loadingIndicator}>
    <IoReloadCircleOutline className={styles.loadingIndicatorSpinner} />
  </div>
);

/**
 * A component to display a loading overlay. If the `isPending` prop is true, the overlay will be
 * displayed. Otherwise, nothing will be displayed.
 */
export const LoadingOverlay = (props: { isPending: boolean }) => (
  <div
    className={`${styles.loadingIndicatorOverlay} ${
      props.isPending ? styles.visible : ""
    }`}
  >
    <LoadingIndicator />
  </div>
);
