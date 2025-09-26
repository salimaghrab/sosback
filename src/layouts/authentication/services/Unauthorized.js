import React from "react";
import { Typography } from "@mui/material";

const Unauthorized = () => {
  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <Typography variant="h4" color="error">
        🚫 Access Denied
      </Typography>
      <Typography variant="body1">You don t have permission to view this page.</Typography>
    </div>
  );
};

export default Unauthorized;
