import { QrScanner } from "@yudiel/react-qr-scanner";
import { useNavigate } from "react-router-dom";
const Scanner = () => {
  const navigate = useNavigate();

  const handleDecode = (result) => {
    const url = new URL(result);
    const path = url.pathname;

    const parameters = path.split("/");

    if (url.hostname !== window.location.hostname) return;

    const table_id = parameters[2];
    navigate("/scan/" + table_id);
  };

  const handleError = (error) => {
    console.error("QR code scanning error:", error?.message);
  };

  return <QrScanner onDecode={handleDecode} onError={handleError} />;
};
export default Scanner;
