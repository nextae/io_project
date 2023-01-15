import styles from "./DropdownMenu.module.css";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";

export interface DropdownMenuProps {
  children: React.ReactNode;
  trigger: React.ReactNode;
}

/**
 * Displays a dropdown menu when the trigger is clicked.
 * Menu items are passed as children using the DropdownMenuItem component.
 */
export const DropdownMenu = ({ children, trigger }: DropdownMenuProps) => (
  <DropdownMenuPrimitive.Root>
    <DropdownMenuPrimitive.Trigger asChild>
      {trigger}
    </DropdownMenuPrimitive.Trigger>
    <DropdownMenuPrimitive.Content className={styles.content} sideOffset={5}>
      {children}
      <DropdownMenuPrimitive.Arrow className={styles.arrow} />
    </DropdownMenuPrimitive.Content>
  </DropdownMenuPrimitive.Root>
);

/**
 * A menu item with an icon for use in a DropdownMenu.
 */
export const DropdownMenuItem = ({
  icon,
  children,
  ...props
}: {
  icon?: React.ReactNode;
  children: React.ReactNode;
} & DropdownMenuPrimitive.DropdownMenuItemProps) => (
  <DropdownMenuPrimitive.Item {...props} className={styles.item}>
    {icon}
    {children}
  </DropdownMenuPrimitive.Item>
);
