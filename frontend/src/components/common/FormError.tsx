import { IoAlertCircleOutline } from "react-icons/io5";

export const FormError = ({ error }: { error?: string | null }) => {
  if (error)
    return (
      <div className="formError">
        <IoAlertCircleOutline /> {error}
      </div>
    );
  return null;
};
