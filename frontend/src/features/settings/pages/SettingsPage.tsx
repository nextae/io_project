import { IconButton } from "@/components/IconButton";
import { useDocumentTitle } from "@/lib/utils";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { Invitations } from "../components/Invitations";
import { UserInfo } from "../components/UserInfo";
import styles from "../style.module.css";

export const SettingsPage = () => {
  useDocumentTitle("Account");
  const navigate = useNavigate();

  return (
    <div className={styles.settings}>
      <header className="header">
        <div className="imgText">
          <IconButton
            icon={<IoArrowBack />}
            onClick={() => navigate(-1)}
            title="Go back"
          />
          <h4>Account</h4>
        </div>
      </header>
      <main>
        <UserInfo />
        <Invitations />
      </main>
    </div>
  );
};
