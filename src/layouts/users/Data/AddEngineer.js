import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import apiClient from "layouts/authentication/services/axiosInterceptor";

function AddEngineer() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    email: "",
    phone: "",
    isActive: true,
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCodeGeneration = () => {
    // Auto-generate code based on name if name is provided
    if (formData.name) {
      const code =
        formData.name
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase())
          .join("") + Math.floor(Math.random() * 1000);

      setFormData((prev) => ({
        ...prev,
        code: code,
      }));
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    // Basic phone validation - adjust regex based on your requirements
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/\s|-/g, ""));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validation
    if (formData.email && !validateEmail(formData.email)) {
      alert("Please enter a valid email address");
      setLoading(false);
      return;
    }

    if (formData.phone && !validatePhone(formData.phone)) {
      alert("Please enter a valid phone number");
      setLoading(false);
      return;
    }

    try {
      await apiClient.post("/Engineers", {
        ...formData,
        // Remove empty strings and set to null
        phone: formData.phone || null,
      });
      navigate("/engineers"); // Adjust route as needed
    } catch (error) {
      console.error("Error creating engineer:", error);
      // Add proper error handling/notification here
      if (error.response?.status === 409) {
        alert("Engineer with this email or code already exists");
      } else {
        alert("Error creating engineer. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/users"); // Navigate back to the Users page where EngineersTable is displayed
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
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
              >
                <MDTypography variant="h6" color="white">
                  Add New Engineer
                </MDTypography>
              </MDBox>
              <MDBox p={3}>
                <form onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
                    {/* Name */}
                    <Grid item xs={12} md={6}>
                      <MDInput
                        type="text"
                        name="name"
                        label="Engineer Name"
                        value={formData.name}
                        onChange={handleInputChange}
                        fullWidth
                        required
                      />
                    </Grid>

                    {/* Code */}
                    <Grid item xs={12} md={6}>
                      <MDBox display="flex" gap={1}>
                        <MDInput
                          type="text"
                          name="code"
                          label="Engineer Code"
                          value={formData.code}
                          onChange={handleInputChange}
                          fullWidth
                          required
                        />
                        <MDButton
                          variant="outlined"
                          color="warning"
                          size="small"
                          onClick={handleCodeGeneration}
                          sx={{ whiteSpace: "nowrap" }}
                        >
                          Generate
                        </MDButton>
                      </MDBox>
                    </Grid>

                    {/* Email */}
                    <Grid item xs={12} md={6}>
                      <MDInput
                        type="email"
                        name="email"
                        label="Email Address"
                        value={formData.email}
                        onChange={handleInputChange}
                        fullWidth
                        required
                      />
                    </Grid>

                    {/* Phone */}
                    <Grid item xs={12} md={6}>
                      <MDInput
                        type="tel"
                        name="phone"
                        label="Phone Number"
                        value={formData.phone}
                        onChange={handleInputChange}
                        fullWidth
                        placeholder="+1234567890"
                      />
                    </Grid>

                    {/* Active Status */}
                    <Grid item xs={12} md={6}>
                      <FormControlLabel
                        control={
                          <Switch
                            name="isActive"
                            checked={formData.isActive}
                            onChange={handleInputChange}
                            color="success"
                          />
                        }
                        label="Active Engineer"
                      />
                    </Grid>

                    {/* Additional Information Section */}
                    <Grid item xs={12}>
                      <MDTypography variant="h6" gutterBottom>
                        Additional Information
                      </MDTypography>
                    </Grid>

                    {/* Notes or Specializations */}
                    <Grid item xs={12}>
                      <TextField
                        name="specializations"
                        label="Specializations / Areas of Expertise"
                        fullWidth
                        multiline
                        rows={3}
                        placeholder="e.g., Fire Safety Systems, HVAC, Electrical Systems, etc."
                        helperText="Optional: List the engineer's areas of expertise"
                      />
                    </Grid>

                    {/* Certifications */}
                    <Grid item xs={12}>
                      <TextField
                        name="certifications"
                        label="Certifications"
                        fullWidth
                        multiline
                        rows={2}
                        placeholder="e.g., PE License, NICET Certification, etc."
                        helperText="Optional: List relevant certifications"
                      />
                    </Grid>

                    {/* Action Buttons */}
                    <Grid item xs={12}>
                      <MDBox display="flex" justifyContent="flex-end" gap={2} mt={2}>
                        <MDButton
                          variant="outlined"
                          color="secondary"
                          onClick={handleCancel}
                          disabled={loading}
                        >
                          Cancel
                        </MDButton>
                        <MDButton
                          type="submit"
                          variant="gradient"
                          color="warning"
                          disabled={loading}
                        >
                          {loading ? "Creating..." : "Create Engineer"}
                        </MDButton>
                      </MDBox>
                    </Grid>
                  </Grid>
                </form>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default AddEngineer;
