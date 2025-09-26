// Créez un nouveau composant AutoLogout.js
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "layouts/authentication/services/authService";

function AutoLogout() {
  const navigate = useNavigate();

  useEffect(() => {
    const performLogout = () => {
      const success = logout();
      if (success) {
        console.log("✅ Déconnexion réussie");
        navigate("/");
      } else {
        console.error("❌ Erreur lors de la déconnexion");
      }
    };

    performLogout();
  }, [navigate]);

  return null; // Ne rend rien
}
export default AutoLogout;
