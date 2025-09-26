import React, { useEffect, useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDBadge from "components/MDBadge";
import MDButton from "components/MDButton";
import Icon from "@mui/material/Icon";
import Switch from "@mui/material/Switch";

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

// Component to display user name + email
function Utilisateur({ nom, email }) {
  return (
    <MDBox display="flex" flexDirection="column" lineHeight={1}>
      <MDTypography variant="button" fontWeight="medium" color="text">
        {nom}
      </MDTypography>
      <MDTypography variant="caption" color="text">
        {email}
      </MDTypography>
    </MDBox>
  );
}

Utilisateur.propTypes = {
  nom: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
};

function UtilisateurTable() {
  const [rows, setRows] = useState([]);
  const [usersData, setUsersData] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const columns = [
    { Header: "utilisateur", accessor: "utilisateur", width: "35%", align: "left" },
    { Header: "rôle", accessor: "role", align: "center" },
    { Header: "approuvé", accessor: "status", align: "center" },
    { Header: "action", accessor: "action", align: "center" },
  ];

  const fetchUsers = async () => {
    try {
      const response = await apiClient.get("/User/all");
      const users = response.data || [];
      const usersWithApproval = users.map((user) => ({
        ...user,
        approved: user.approved === undefined ? true : user.approved,
      }));
      setUsersData(usersWithApproval);
    } catch (error) {
      console.error("Erreur lors du fetch des utilisateurs:", error);
    }
  };

  const handleDeleteClick = (id) => {
    setUserToDelete(id);
    setConfirmDelete(true);
  };

  const handleDelete = async () => {
    try {
      await apiClient.delete(`/User/delete/${userToDelete}`);
      await fetchUsers(); // Refresh the data
      setConfirmDelete(false);
      setUserToDelete(null);
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    }
  };

  const handleCloseDialog = () => {
    setConfirmDelete(false);
    setUserToDelete(null);
  };

  const handleToggleApproval = async (id) => {
    try {
      await axios.post(`https://localhost:7248/api/User/toggle-approval/${id}`);
      setUsersData((prev) =>
        prev.map((user) => (user.id === id ? { ...user, approved: !user.approved } : user))
      );
    } catch (error) {
      console.error("Erreur lors du basculement de l'approbation:", error);
    }
  };

  const formatRows = (users) =>
    users.map((user) => {
      const employeeName = user.employee?.name || "N/A";
      return {
        utilisateur: <Utilisateur nom={employeeName} email={user.email} />,
        role: (
          <MDBadge
            badgeContent={user.role}
            color={user.role === "Admin" ? "success" : "dark"}
            variant="gradient"
            size="sm"
          />
        ),
        status: (
          <MDBox display="flex" alignItems="center" justifyContent="center">
            <Switch
              checked={user.approved === true}
              onChange={() => handleToggleApproval(user.id)}
              color="success"
            />
            <MDTypography variant="caption" color="text" fontWeight="medium" ml={1}>
              {user.approved ? "Approuvé" : "Non approuvé"}
            </MDTypography>
          </MDBox>
        ),
        action: (
          <MDButton
            variant="text"
            color="error"
            size="small"
            onClick={() => handleDeleteClick(user.id)}
          >
            <Icon fontSize="small">delete</Icon>
          </MDButton>
        ),
      };
    });

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    setRows(formatRows(usersData));
  }, [usersData]);

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
        <DialogTitle id="alert-dialog-title">{"Confirmer la suppression"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action ne peut pas être
            annulée.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Annuler
          </Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </MDBox>
  );
}

export default UtilisateurTable;
