export const ProfilePicturePlaceholder = ({ name }: { name: string }) => {
  const hash = name
    .split("")
    .reduce((acc, char) => ((acc << 5) - acc + char.charCodeAt(0)) | 0, 0);
  const hue = hash % 360;
  const color = `hsl(${hue}, 30%, 50%)`;

  return (
    <div
      className="profilePicturePlaceholder cover"
      style={{ background: color }}
    >
      <span>{name[0] || "?"}</span>
    </div>
  );
};
