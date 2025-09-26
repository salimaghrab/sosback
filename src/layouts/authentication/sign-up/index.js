import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import BasicLayout from "../components/BasicLayout";

// Authentication service
import { register, getDepartments } from "../services/authService";
// Images
import bgImage from "assets/images/backgroundfireimage.jpg";

function Cover() {
  const [formData, setFormData] = useState({
    // User credentials
    email: "",
    password: "",
    confirmPassword: "",
    role: "User",

    // Entity type
    entityType: "",

    // Common entity fields
    name: "",
    code: "",
    email_entity: "",
    phone: "",

    // Employee specific
    nationality: "",
    departmentId: "",

    // Engineer specific
    specializations: "",

    // Client specific
    address: "",
    companyName: "",
  });

  const [departments, setDepartments] = useState([]);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingDepartments, setLoadingDepartments] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  // Load departments for employee registration
  useEffect(() => {
    if (formData.entityType === "employee") {
      loadDepartments();
    }
  }, [formData.entityType]);

  const loadDepartments = async () => {
    setLoadingDepartments(true);
    try {
      const departmentList = await getDepartments();
      setDepartments(departmentList);
    } catch (error) {
      console.error("Error loading departments:", error);
      setError("Error loading departments");
    } finally {
      setLoadingDepartments(false);
    }
  };

  const handleInputChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });

    // Reset entity-specific fields when type changes
    if (field === "entityType") {
      setFormData((prev) => ({
        ...prev,
        [field]: event.target.value,
        // Reset entity-specific fields
        nationality: "",
        departmentId: "",
        specializations: "",
        address: "",
        companyName: "",
        code: "",
        email_entity: "",
        phone: "",
      }));
    }
  };

  const validateForm = () => {
    // Basic validation
    if (!formData.email || !formData.password || !formData.confirmPassword) {
      return "All required fields must be filled";
    }

    if (formData.password !== formData.confirmPassword) {
      return "Passwords do not match";
    }

    if (formData.password.length < 6) {
      return "Password must be at least 6 characters long";
    }

    if (!formData.entityType) {
      return "Please select an entity type";
    }

    if (!formData.name) {
      return "Name is required";
    }

    // Entity-specific validation
    switch (formData.entityType) {
      case "employee":
        if (!formData.nationality || !formData.departmentId) {
          return "Nationality and department are required for employees";
        }
        break;
      case "engineer":
        if (!formData.code) {
          return "Code is required for engineers";
        }
        break;
      case "client":
        if (!formData.code) {
          return "Code is required for clients";
        }
        break;
    }

    if (!agreeTerms) {
      return "You must agree to the terms and conditions";
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submission started"); // Debug log

    setError("");
    setSuccess("");

    // Validate form
    const validationError = validateForm();
    if (validationError) {
      console.log("Validation failed:", validationError); // Debug log
      setError(validationError);
      return;
    }

    console.log("Form validation passed"); // Debug log
    setLoading(true);

    try {
      const registrationData = {
        // User account data
        email: formData.email,
        password: formData.password,
        role: formData.role,
        entityType: formData.entityType,

        // Entity data
        entityData: {
          name: formData.name,
          ...(formData.code && { code: formData.code }),
          ...(formData.email_entity && { email: formData.email_entity }),
          ...(formData.phone && { phone: formData.phone }),

          // Employee specific
          ...(formData.entityType === "employee" && {
            nationality: formData.nationality,
            departmentId: formData.departmentId,
          }),

          // Engineer specific
          ...(formData.entityType === "engineer" && {
            specializations: formData.specializations,
          }),

          // Client specific
          ...(formData.entityType === "client" && {
            address: formData.address,
            companyName: formData.companyName,
          }),
        },
      };

      console.log("Calling register function with data:", registrationData); // Debug log

      const response = await register(registrationData);

      console.log("Registration successful:", response); // Debug log

      setSuccess(
        "Registration successful! Your account is pending administrator approval. You will receive a confirmation email."
      );

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/authentication/sign-in");
      }, 3000);
    } catch (error) {
      console.error("Registration error in component:", error);
      setError(typeof error === "string" ? error : "Error during registration");
    } finally {
      setLoading(false);
    }
  };

  const renderEntitySpecificFields = () => {
    switch (formData.entityType) {
      case "employee":
        return (
          <>
            <MDBox mb={2}>
              <MDInput
                type="text"
                label="Nationality *"
                variant="standard"
                fullWidth
                value={formData.nationality}
                onChange={handleInputChange("nationality")}
                disabled={loading}
                required
              />
            </MDBox>

            <MDBox mb={2}>
              <FormControl fullWidth variant="standard">
                <InputLabel id="department-label">Department *</InputLabel>
                <Select
                  labelId="department-label"
                  value={formData.departmentId}
                  onChange={handleInputChange("departmentId")}
                  disabled={loading || loadingDepartments}
                  required
                >
                  <MenuItem value="">Select a department</MenuItem>
                  {departments.map((dept) => (
                    <MenuItem key={dept.id} value={dept.id}>
                      {dept.typeDepartment}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </MDBox>
          </>
        );

      case "engineer":
        return (
          <>
            <MDBox mb={2}>
              <MDInput
                type="text"
                label="Engineer Code *"
                variant="standard"
                fullWidth
                value={formData.code}
                onChange={handleInputChange("code")}
                disabled={loading}
                required
              />
            </MDBox>

            <MDBox mb={2}>
              <MDInput
                type="email"
                label="Professional Email"
                variant="standard"
                fullWidth
                value={formData.email_entity}
                onChange={handleInputChange("email_entity")}
                disabled={loading}
              />
            </MDBox>

            <MDBox mb={2}>
              <MDInput
                type="text"
                label="Phone"
                variant="standard"
                fullWidth
                value={formData.phone}
                onChange={handleInputChange("phone")}
                disabled={loading}
              />
            </MDBox>

            <MDBox mb={2}>
              <MDInput
                type="text"
                label="Specializations"
                variant="standard"
                fullWidth
                value={formData.specializations}
                onChange={handleInputChange("specializations")}
                disabled={loading}
                placeholder="e.g. Electricity, Plumbing, HVAC"
              />
            </MDBox>
          </>
        );

      case "client":
        return (
          <>
            <MDBox mb={2}>
              <MDInput
                type="text"
                label="Client Code *"
                variant="standard"
                fullWidth
                value={formData.code}
                onChange={handleInputChange("code")}
                disabled={loading}
                required
              />
            </MDBox>

            <MDBox mb={2}>
              <MDInput
                type="email"
                label="Email"
                variant="standard"
                fullWidth
                value={formData.email_entity}
                onChange={handleInputChange("email_entity")}
                disabled={loading}
              />
            </MDBox>

            <MDBox mb={2}>
              <MDInput
                type="text"
                label="Phone"
                variant="standard"
                fullWidth
                value={formData.phone}
                onChange={handleInputChange("phone")}
                disabled={loading}
              />
            </MDBox>

            <MDBox mb={2}>
              <MDInput
                type="text"
                label="Address"
                variant="standard"
                fullWidth
                value={formData.address}
                onChange={handleInputChange("address")}
                disabled={loading}
              />
            </MDBox>

            <MDBox mb={2}>
              <MDInput
                type="text"
                label="Company Name"
                variant="standard"
                fullWidth
                value={formData.companyName}
                onChange={handleInputChange("companyName")}
                disabled={loading}
              />
            </MDBox>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <BasicLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="success"
          mx={2}
          mt={-3}
          p={3}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Join Us
          </MDTypography>
          <MDTypography display="block" variant="button" color="white" my={1}>
            Create your account and professional profile
          </MDTypography>
        </MDBox>

        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form" onSubmit={handleSubmit}>
            {error && (
              <MDBox mb={2}>
                <Alert severity="error">{error}</Alert>
              </MDBox>
            )}

            {success && (
              <MDBox mb={2}>
                <Alert severity="success">{success}</Alert>
              </MDBox>
            )}

            {/* Account Information Section */}
            <MDTypography variant="h6" fontWeight="medium" color="info" mb={2}>
              Account Information
            </MDTypography>

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <MDBox mb={2}>
                  <MDInput
                    type="email"
                    label="Login Email *"
                    variant="standard"
                    fullWidth
                    value={formData.email}
                    onChange={handleInputChange("email")}
                    disabled={loading}
                    required
                  />
                </MDBox>
              </Grid>

              <Grid item xs={12} md={6}>
                <MDBox mb={2}>
                  <FormControl fullWidth variant="standard">
                    <InputLabel id="role-label">Role *</InputLabel>
                    <Select
                      labelId="role-label"
                      value={formData.role}
                      onChange={handleInputChange("role")}
                      disabled={loading}
                      required
                    >
                      <MenuItem value="User">User</MenuItem>
                      <MenuItem value="Admin">Administrator</MenuItem>
                      <MenuItem value="Manager">Manager</MenuItem>
                      <MenuItem value="Supervisor">Supervisor</MenuItem>
                    </Select>
                  </FormControl>
                </MDBox>
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <MDBox mb={2}>
                  <MDInput
                    type="password"
                    label="Password *"
                    variant="standard"
                    fullWidth
                    value={formData.password}
                    onChange={handleInputChange("password")}
                    disabled={loading}
                    required
                  />
                </MDBox>
              </Grid>

              <Grid item xs={12} md={6}>
                <MDBox mb={2}>
                  <MDInput
                    type="password"
                    label="Confirm Password *"
                    variant="standard"
                    fullWidth
                    value={formData.confirmPassword}
                    onChange={handleInputChange("confirmPassword")}
                    disabled={loading}
                    required
                  />
                </MDBox>
              </Grid>
            </Grid>

            {/* Entity Type Selection */}
            <MDTypography variant="h6" fontWeight="medium" color="info" mb={2} mt={3}>
              Profile Type
            </MDTypography>

            <MDBox mb={2}>
              <FormControl fullWidth variant="standard">
                <InputLabel id="entity-type-label">Profile Type *</InputLabel>
                <Select
                  labelId="entity-type-label"
                  value={formData.entityType}
                  onChange={handleInputChange("entityType")}
                  disabled={loading}
                  required
                >
                  <MenuItem value="">Select a type</MenuItem>
                  <MenuItem value="employee">Employee</MenuItem>
                  <MenuItem value="engineer">Engineer</MenuItem>
                  <MenuItem value="client">Client</MenuItem>
                </Select>
              </FormControl>
            </MDBox>

            {/* Common Entity Fields */}
            {formData.entityType && (
              <>
                <MDTypography variant="h6" fontWeight="medium" color="info" mb={2} mt={3}>
                  Personal Information
                </MDTypography>

                <MDBox mb={2}>
                  <MDInput
                    type="text"
                    label="Full Name *"
                    variant="standard"
                    fullWidth
                    value={formData.name}
                    onChange={handleInputChange("name")}
                    disabled={loading}
                    required
                  />
                </MDBox>

                {/* Entity-specific fields */}
                {renderEntitySpecificFields()}
              </>
            )}

            {/* Terms and Conditions */}
            <MDBox display="flex" alignItems="center" ml={-1} mt={3}>
              <Checkbox
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                disabled={loading}
              />
              <MDTypography
                variant="button"
                fontWeight="regular"
                color="text"
                sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
                onClick={() => setAgreeTerms(!agreeTerms)}
              >
                &nbsp;&nbsp;I agree to the&nbsp;
              </MDTypography>
              <MDTypography
                component="a"
                href="#"
                variant="button"
                fontWeight="bold"
                color="info"
                textGradient
              >
                Terms and Conditions
              </MDTypography>
            </MDBox>

            <MDBox mt={4} mb={1}>
              <MDButton
                variant="gradient"
                color="info"
                fullWidth
                type="submit"
                disabled={loading || loadingDepartments}
              >
                {loading ? (
                  <>
                    <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                    Registering...
                  </>
                ) : (
                  "Sign Up"
                )}
              </MDButton>
            </MDBox>

            <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                Already have an account?{" "}
                <MDTypography
                  component={Link}
                  to="/authentication/sign-in"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                >
                  Sign In
                </MDTypography>
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default Cover;
