import styles from "./Button.module.css";
import {
  ButtonHTMLAttributes,
  ForwardedRef,
  forwardRef,
  ReactNode,
} from "react";
import { LoadingIndicator } from "./LoadingIndicator";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  kind?: "primary" | "danger";
  pending?: boolean;
};

/**
 * A button component. It supports the same props as a regular button, but
 * also supports a `kind` prop to change the style of the button.
 * It also supports a `pending` prop to show a loading indicator.
 */
export const Button = forwardRef(
  (
    { children, pending, kind, ...props }: ButtonProps,
    ref: ForwardedRef<HTMLButtonElement>
  ) => (
    <button
      {...props}
      ref={ref}
      className={[
        styles.button,
        kind ? styles[kind] : "",
        pending ? styles.busy : "",
      ].join(" ")}
      disabled={pending || props.disabled}
    >
      <div className={styles.content}>{children}</div>
      {pending ? (
        <div className={styles.overlay}>
          <LoadingIndicator />
        </div>
      ) : null}
    </button>
  )
);
