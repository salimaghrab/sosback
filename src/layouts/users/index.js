// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

// React Router
import { useNavigate } from "react-router-dom";

// Import your tables
import UtilisateurTable from "../users/Data/UtilisateurTable";
import EmployeeTable from "../users/Data/EmployeeTable";
import EngineersTable from "../users/Data/EngineersTable"; // Add this import

function Users() {
  const navigate = useNavigate();

  const handleAddAccount = () => {
    navigate("/add-account"); // Replace with your actual route for adding accounts
  };

  const handleAddEmployee = () => {
    navigate("/add-employee"); // Replace with your actual route for adding employees
  };

  const handleAddEngineer = () => {
    navigate("/add-engineer"); // Add route for adding engineers
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          {/* Utilisateur Table */}
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <MDTypography variant="h6" color="white">
                  Account Management
                </MDTypography>
                <MDButton
                  variant="contained"
                  color="white"
                  size="small"
                  onClick={handleAddAccount}
                  sx={{
                    color: "info.main",
                    fontWeight: "bold",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                    },
                  }}
                >
                  <Icon sx={{ mr: 1 }}>add</Icon>
                  Add New Account
                </MDButton>
              </MDBox>
              <MDBox p={3}>
                <UtilisateurTable />
              </MDBox>
            </Card>
          </Grid>

          {/* Employee Table */}
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="success"
                borderRadius="lg"
                coloredShadow="success"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <MDTypography variant="h6" color="white">
                  Employee Management
                </MDTypography>
                <MDButton
                  variant="contained"
                  color="white"
                  size="small"
                  onClick={handleAddEmployee}
                  sx={{
                    color: "success.main",
                    fontWeight: "bold",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                    },
                  }}
                >
                  <Icon sx={{ mr: 1 }}>add</Icon>
                  Add New Employee
                </MDButton>
              </MDBox>
              <MDBox p={3}>
                <EmployeeTable />
              </MDBox>
            </Card>
          </Grid>

          {/* Engineers Table */}
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="warning"
                borderRadius="lg"
                coloredShadow="warning"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <MDTypography variant="h6" color="white">
                  Engineers Management
                </MDTypography>
                <MDButton
                  variant="contained"
                  color="white"
                  size="small"
                  onClick={handleAddEngineer}
                  sx={{
                    color: "warning.main",
                    fontWeight: "bold",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                    },
                  }}
                >
                  <Icon sx={{ mr: 1 }}>add</Icon>
                  Add New Engineer
                </MDButton>
              </MDBox>
              <MDBox p={3}>
                <EngineersTable />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default Users;
