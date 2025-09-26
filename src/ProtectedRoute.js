import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";

const ProtectedRoute = ({ children, requiredRoles = [] }) => {
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    let userRole = localStorage.getItem("role");

    // Handle cases where role might be saved as JSON
    try {
      const parsed = JSON.parse(userRole);
      if (Array.isArray(parsed)) userRole = parsed[0];
      else if (typeof parsed === "string") userRole = parsed;
    } catch {
      // keep string
    }

    if (!token || (requiredRoles.length > 0 && !requiredRoles.includes(userRole))) {
      setIsAuthorized(false);
    } else {
      setIsAuthorized(true);
    }

    setIsChecking(false);
  }, [requiredRoles, location.pathname]);

  if (isChecking) return <div>Chargement...</div>;

  if (!isAuthorized) {
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(0,0,0,0.6)",
          color: "white",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 9999,
          flexDirection: "column",
        }}
      >
        <h1>🚫 Access denied</h1>
        <p>you do not have access to this page .</p>
      </div>
    );
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  requiredRoles: PropTypes.arrayOf(PropTypes.string),
};

export default ProtectedRoute;
