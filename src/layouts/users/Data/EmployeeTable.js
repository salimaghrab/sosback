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

// Employee cell component
function EmployeeCell({ image, name }) {
  return (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDAvatar src={image ? `data:image/jpeg;base64,${image}` : undefined} name={name} size="sm" />
      <MDBox ml={2} lineHeight={1}>
        <MDTypography display="block" variant="button" fontWeight="medium">
          {name}
        </MDTypography>
      </MDBox>
    </MDBox>
  );
}

EmployeeCell.propTypes = {
  image: PropTypes.string,
  name: PropTypes.string,
};

function EmployeeTable() {
  const [rows, setRows] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);

  const columns = [
    { Header: "Employee", accessor: "employee", width: "35%", align: "left" },
    { Header: "Nationality", accessor: "nationality", align: "center" },
    { Header: "Department", accessor: "department", align: "center" },
    { Header: "Role", accessor: "role", align: "center" },
    { Header: "Action", accessor: "action", align: "center" },
  ];

  const fetchEmployees = async () => {
    try {
      const response = await apiClient.get("/Employee/all");
      const employees = response.data || [];

      const formattedRows = employees.map((e) => ({
        employee: <EmployeeCell image={e.image} name={e.name} />,
        nationality: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            {e.nationality || "N/A"}
          </MDTypography>
        ),
        department: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            {e.department?.typeDepartment || "N/A"}
          </MDTypography>
        ),
        role: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            {e.user?.role || "N/A"}
          </MDTypography>
        ),
        action: (
          <MDBox display="flex" justifyContent="center">
            <Link to={`/employees/${e.id}`} style={{ marginRight: "8px" }}>
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
      console.error("Error fetching employees:", error);
    }
  };

  const handleDeleteClick = (id) => {
    setEmployeeToDelete(id);
    setConfirmDelete(true);
  };

  const handleDelete = async () => {
    try {
      await apiClient.delete(`/Employee/delete/${employeeToDelete}`);
      await fetchEmployees();
      setConfirmDelete(false);
      setEmployeeToDelete(null);
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  const handleCloseDialog = () => {
    setConfirmDelete(false);
    setEmployeeToDelete(null);
  };

  useEffect(() => {
    fetchEmployees();
  }, []); // No need to disable eslint if you install eslint-plugin-react-hooks

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
            Are you sure you want to delete this employee? This action cannot be undone.
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

export default EmployeeTable;
