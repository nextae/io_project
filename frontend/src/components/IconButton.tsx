import styles from "./IconButton.module.css";

import {
  ButtonHTMLAttributes,
  ForwardedRef,
  forwardRef,
  ReactElement,
  SVGAttributes,
} from "react";

export interface IconButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactElement<SVGAttributes<SVGElement>>;
  badge?: boolean;
}

/**
 * An icon button component. It supports the same props as a regular button, but
 * also supports an `icon` prop to display an icon. Additionally, it supports a
 * `badge` prop to display a badge. The `icon` prop should be an SVG element.
 */
export const IconButton = forwardRef(
  (
    { icon, badge, ...props }: IconButtonProps,
    ref: ForwardedRef<HTMLButtonElement>
  ) => (
    <button
      {...props}
      className={`${styles.iconButton} ${badge ? styles.badge : ""}`}
      ref={ref}
    >
      {icon}
    </button>
  )
);

export const iconButtonClass = styles.iconButton;
