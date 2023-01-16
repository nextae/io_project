import styles from "./ProfilePicture.module.css";

/**
 * Displays a placeholder profile picture with the first letter of the name.
 * Color is generated from the name.
 */
export const ProfilePicturePlaceholder = ({ name }: { name: string }) => {
  const hash = name
    .split("")
    .reduce((acc, char) => ((acc << 5) - acc + char.charCodeAt(0)) | 0, 0);
  const hue = hash % 360;
  const color = `hsl(${hue}, 30%, 50%)`;

  return (
    <div
      className={styles.profilePicture}
      style={{ background: color }}
      role="img"
    >
      <span>{name[0] || "?"}</span>
    </div>
  );
};
