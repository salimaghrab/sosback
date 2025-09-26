import React, { useEffect, useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDButton from "components/MDButton";
import MDBadge from "components/MDBadge";

// Material UI components for confirmation dialog
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";

// Table Component
import DataTable from "examples/Tables/DataTable";
import apiClient from "layouts/authentication/services/axiosInterceptor";

// Engineer cell component
function EngineerCell({ name, code }) {
  return (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDAvatar name={name} size="sm" />
      <MDBox ml={2} lineHeight={1}>
        <MDTypography display="block" variant="button" fontWeight="medium">
          {name}
        </MDTypography>
        <MDTypography variant="caption" color="text">
          {code}
        </MDTypography>
      </MDBox>
    </MDBox>
  );
}

EngineerCell.propTypes = {
  name: PropTypes.string,
  code: PropTypes.string,
};

function EngineersTable() {
  const [rows, setRows] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [engineerToDelete, setEngineerToDelete] = useState(null);

  const columns = [
    { Header: "Engineer", accessor: "engineer", width: "35%", align: "left" },
    { Header: "Email", accessor: "email", align: "center" },
    { Header: "Phone", accessor: "phone", align: "center" },
    { Header: "Status", accessor: "status", align: "center" },
    { Header: "Action", accessor: "action", align: "center" },
  ];

  const fetchEngineers = async () => {
    try {
      const response = await apiClient.get("/Engineers");
      const engineers = response.data || [];

      const formattedRows = engineers.map((e) => ({
        engineer: <EngineerCell name={e.name} code={e.code} />,
        email: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            {e.email || "N/A"}
          </MDTypography>
        ),
        phone: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            {e.phone || "N/A"}
          </MDTypography>
        ),
        status: (
          <MDBadge
            badgeContent={e.isActive ? "Active" : "Inactive"}
            color={e.isActive ? "success" : "error"}
            variant="gradient"
            size="sm"
          />
        ),
        action: (
          <MDBox display="flex" justifyContent="center">
            <Link to={`/engineers/${e.id}`} style={{ marginRight: "8px" }}>
              <MDTypography
                component="span"
                variant="caption"
                color="info"
                fontWeight="medium"
                style={{ cursor: "pointer" }}
              >
                Edit
              </MDTypography>
            </Link>
            <MDButton
              variant="text"
              color="error"
              size="small"
              onClick={() => handleDeleteClick(e.id)}
            >
              <Icon fontSize="small">delete</Icon>
            </MDButton>
          </MDBox>
        ),
      }));

      setRows(formattedRows);
    } catch (error) {
      console.error("Error fetching engineers:", error);
    }
  };

  const handleDeleteClick = (id) => {
    setEngineerToDelete(id);
    setConfirmDelete(true);
  };

  const handleDelete = async () => {
    try {
      await apiClient.delete(`/Engineers/${engineerToDelete}`);
      await fetchEngineers();
      setConfirmDelete(false);
      setEngineerToDelete(null);
    } catch (error) {
      console.error("Error deleting engineer:", error);
    }
  };

  const handleCloseDialog = () => {
    setConfirmDelete(false);
    setEngineerToDelete(null);
  };

  useEffect(() => {
    fetchEngineers();
  }, []);

  return (
    <MDBox pt={3}>
      <DataTable
        table={{ columns, rows }}
        isSorted={false}
        entriesPerPage={false}
        showTotalEntries={false}
        noEndBorder
      />

      <Dialog
        open={confirmDelete}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this engineer? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </MDBox>
  );
}

export default EngineersTable;
