import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import apiClient from "layouts/authentication/services/axiosInterceptor";

function AddBrand() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    isActive: true,
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Category options for brands
  const brandCategories = [
    "Fire Safety",
    "Building Systems",
    "Industrial Automation",
    "Fire Detection",
    "Fire Suppression",
    "Security Systems",
    "HVAC Systems",
    "Electrical Systems",
    "Communication Systems",
    "Access Control",
    "Other",
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Brand name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Brand name must be at least 2 characters";
    }

    if (!formData.category) {
      newErrors.category = "Category is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const brandData = {
        name: formData.name.trim(),
        category: formData.category,
        isActive: formData.isActive,
        notes: formData.notes.trim() || null,
      };

      await apiClient.post("/Brands", brandData);

      showSnackbar("Brand added successfully!", "success");

      // Reset form
      setFormData({
        name: "",
        category: "",
        isActive: true,
        notes: "",
      });

      // Navigate back after delay
      setTimeout(() => {
        navigate("/equipment");
      }, 1500);
    } catch (error) {
      console.error("Error adding brand:", error);

      if (
        error.response?.status === 409 ||
        error.response?.data?.message?.includes("already exists")
      ) {
        showSnackbar("A brand with this name already exists", "error");
        setErrors({ name: "Brand name already exists" });
      } else {
        showSnackbar(error.response?.data?.message || "Error adding brand", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/equipment");
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({
      ...prev,
      open: false,
    }));
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6} justifyContent="center">
          <Grid item xs={12} md={8} lg={6}>
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
              >
                <MDTypography variant="h6" color="white">
                  Add New Brand
                </MDTypography>
              </MDBox>

              <MDBox p={3}>
                <form onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
                    {/* Brand Name */}
                    <Grid item xs={12}>
                      <MDInput
                        fullWidth
                        label="Brand Name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        error={!!errors.name}
                        helperText={errors.name}
                        required
                        placeholder="e.g., Honeywell, Johnson Controls"
                      />
                    </Grid>

                    {/* Category */}
                    <Grid item xs={12}>
                      <FormControl fullWidth error={!!errors.category}>
                        <InputLabel id="category-select-label">Category *</InputLabel>
                        <Select
                          labelId="category-select-label"
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          label="Category *"
                          required
                        >
                          {brandCategories.map((category) => (
                            <MenuItem key={category} value={category}>
                              {category}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      {errors.category && (
                        <MDTypography
                          variant="caption"
                          color="error"
                          sx={{ mt: 1, display: "block" }}
                        >
                          {errors.category}
                        </MDTypography>
                      )}
                    </Grid>

                    {/* Is Active Switch */}
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Switch
                            name="isActive"
                            checked={formData.isActive}
                            onChange={handleInputChange}
                            color="success"
                          />
                        }
                        label={
                          <MDBox>
                            <MDTypography variant="body2" fontWeight="medium">
                              Brand Status
                            </MDTypography>
                            <MDTypography variant="caption" color="text.secondary">
                              {formData.isActive
                                ? "Active - Brand can be used for equipment"
                                : "Inactive - Brand will be hidden"}
                            </MDTypography>
                          </MDBox>
                        }
                      />
                    </Grid>

                    {/* Notes */}
                    <Grid item xs={12}>
                      <TextField
                        name="notes"
                        label="Notes (Optional)"
                        value={formData.notes}
                        onChange={handleInputChange}
                        fullWidth
                        multiline
                        rows={3}
                        placeholder="Additional information about this brand..."
                      />
                    </Grid>

                    {/* Action Buttons */}
                    <Grid item xs={12}>
                      <MDBox display="flex" justifyContent="space-between" mt={3}>
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
                          color="success"
                          disabled={loading}
                        >
                          {loading ? "Adding..." : "Add Brand"}
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

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </DashboardLayout>
  );
}

export default AddBrand;
