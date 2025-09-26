import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import apiClient from "layouts/authentication/services/axiosInterceptor";

function AddAccount() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [linkEmployee, setLinkEmployee] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "",
    employeeId: "",
  });

  // Available roles - adjust these based on your system
  const availableRoles = [
    "Admin",
    "FINANCE",
    "OPERATIONS",
    "SITE ENGINEER",
    "PLANNER",
    "TECHNICIAN",
    "Developper",
  ];

  // Fetch employees without user accounts
  const fetchAvailableEmployees = async () => {
    try {
      const response = await apiClient.get("/User/employees-sans-compte");
      setEmployees(response.data || []);
    } catch (error) {
      console.error("Error fetching available employees:", error);
      setError("Failed to fetch available employees");
    }
  };

  useEffect(() => {
    if (linkEmployee) {
      fetchAvailableEmployees();
    }
  }, [linkEmployee]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear any existing error/success messages
    if (error) setError("");
    if (success) setSuccess("");
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleLinkEmployeeChange = (event) => {
    setLinkEmployee(event.target.checked);
    if (!event.target.checked) {
      // Clear employee selection if unchecked
      setFormData((prev) => ({
        ...prev,
        employeeId: "",
      }));
    } else {
      // Fetch available employees when checked
      fetchAvailableEmployees();
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    // Basic password validation - adjust as needed
    return password.length >= 6;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Validation
    if (!formData.email || !formData.password || !formData.role) {
      setError("Please fill in all required fields");
      setLoading(false);
      return;
    }

    if (linkEmployee && !formData.employeeId) {
      setError("Please select an employee to link with this user account");
      setLoading(false);
      return;
    }

    if (!validateEmail(formData.email)) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    if (!validatePassword(formData.password)) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        email: formData.email,
        password: formData.password,
        role: formData.role,
        employeeId: linkEmployee ? formData.employeeId : null,
      };

      await apiClient.post("/User/register", payload);

      setSuccess("User account created successfully!");

      // Reset form
      setFormData({
        email: "",
        password: "",
        role: "",
        employeeId: "",
      });
      setLinkEmployee(false);

      // Redirect after success (optional)
      setTimeout(() => {
        navigate("/users"); // Adjust route as needed
      }, 2000);
    } catch (error) {
      console.error("Error creating user account:", error);

      let errorMessage = "Failed to create user account";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data) {
        if (typeof error.response.data === "string") {
          errorMessage = error.response.data;
        } else if (error.response.data.errors) {
          // Handle validation errors
          const errors = Object.values(error.response.data.errors).flat();
          errorMessage = errors.join(", ");
        }
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/users"); // Adjust route as needed
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6} justifyContent="center">
          <Grid item xs={12} lg={8}>
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
              >
                <MDTypography variant="h6" color="white">
                  Add New User Account
                </MDTypography>
              </MDBox>

              <MDBox pt={4} pb={3} px={3}>
                {error && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                  </Alert>
                )}

                {success && (
                  <Alert severity="success" sx={{ mb: 2 }}>
                    {success}
                  </Alert>
                )}

                <form onSubmit={handleSubmit}>
                  <MDBox mb={3}>
                    <Grid container spacing={3}>
                      {/* Email */}
                      <Grid item xs={12} md={6}>
                        <MDInput
                          type="email"
                          label="Email Address"
                          fullWidth
                          required
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          placeholder="user@example.com"
                        />
                      </Grid>

                      {/* Password */}
                      <Grid item xs={12} md={6}>
                        <MDInput
                          type={showPassword ? "text" : "password"}
                          label="Password"
                          fullWidth
                          required
                          value={formData.password}
                          onChange={(e) => handleInputChange("password", e.target.value)}
                          placeholder="Enter password (min. 6 characters)"
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  aria-label="toggle password visibility"
                                  onClick={handleClickShowPassword}
                                  edge="end"
                                  size="small"
                                >
                                  {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>

                      {/* Role Selection */}
                      <Grid item xs={12} md={6}>
                        <FormControl fullWidth required>
                          <InputLabel id="role-select-label">Select Role</InputLabel>
                          <Select
                            labelId="role-select-label"
                            value={formData.role}
                            label="Select Role"
                            onChange={(e) => handleInputChange("role", e.target.value)}
                          >
                            {availableRoles.map((role) => (
                              <MenuItem key={role} value={role}>
                                {role}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>

                      {/* Link Employee Checkbox */}
                      <Grid item xs={12} md={6}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={linkEmployee}
                              onChange={handleLinkEmployeeChange}
                              color="info"
                            />
                          }
                          label="Link to an existing employee"
                        />
                      </Grid>

                      {/* Employee Selection - Only show if linking is enabled */}
                      {linkEmployee && (
                        <Grid item xs={12}>
                          <FormControl fullWidth required={linkEmployee}>
                            <InputLabel id="employee-select-label">Select Employee</InputLabel>
                            <Select
                              labelId="employee-select-label"
                              value={formData.employeeId}
                              label="Select Employee"
                              onChange={(e) => handleInputChange("employeeId", e.target.value)}
                            >
                              {employees.map((employee) => (
                                <MenuItem key={employee.id} value={employee.id}>
                                  {employee.name} -{" "}
                                  {employee.department?.typeDepartment || "No Department"} (
                                  {employee.nationality})
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                          {employees.length === 0 && (
                            <Alert severity="warning" sx={{ mt: 1 }}>
                              No employees available for linking. All employees already have user
                              accounts or no employees exist.
                            </Alert>
                          )}
                        </Grid>
                      )}
                    </Grid>
                  </MDBox>

                  {/* Action Buttons */}
                  <MDBox mt={4} mb={1} display="flex" justifyContent="space-between">
                    <MDButton
                      variant="outlined"
                      color="secondary"
                      onClick={handleCancel}
                      disabled={loading}
                    >
                      Cancel
                    </MDButton>

                    <MDButton variant="gradient" color="info" type="submit" disabled={loading}>
                      {loading ? "Creating..." : "Create User Account"}
                    </MDButton>
                  </MDBox>
                </form>

                {/* Info Box */}
                <MDBox mt={3}>
                  <Alert severity="info">
                    <strong>User Account Creation Info:</strong>
                    <br />
                    • Password must be at least 6 characters long
                    <br />
                    • Email must be unique in the system
                    <br />
                    • Linking to an employee is optional - users can exist without being linked to
                    employees
                    <br />
                    • Only employees without existing user accounts can be selected for linking
                    <br />• New accounts may require approval by admin
                  </Alert>
                </MDBox>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default AddAccount;
