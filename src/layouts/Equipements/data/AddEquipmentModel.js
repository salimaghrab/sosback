import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { addEquipmentModel } from "../service/equipment";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import apiClient from "layouts/authentication/services/axiosInterceptor";

function AddEquipmentModel() {
  const navigate = useNavigate();
  const [brands, setBrands] = useState([]);
  const [formData, setFormData] = useState({
    brandId: "",
    modelName: "",
    systemType: "",
    category: "",
    subCategory: "",
    description: "",
    specifications: "",
    maintenanceRequirements: "",
    recommendedMaintenanceInterval: 90,
  });
  const [loading, setLoading] = useState(false);
  const [brandsLoading, setBrandsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // System Type options
  const systemTypes = ["Addressable", "Conventional", "Wireless", "Pre-engineered", "Hybrid"];

  // Category options
  const categories = ["FACP", "Detector", "Suppression", "Notification", "Monitoring", "Control"];

  // Frequency options with their corresponding day values
  const frequencyOptions = [
    { label: "Monthly", value: 30 },
    { label: "Quarterly", value: 90 },
    { label: "Semi-annually", value: 180 },
    { label: "Annually", value: 365 },
  ];

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      setBrandsLoading(true);
      const response = await apiClient.get("/Brands");
      setBrands(response.data.filter((brand) => brand.isActive));
    } catch (error) {
      console.error("Error fetching brands:", error);
      setError("Failed to load brands. Please refresh the page.");
    } finally {
      setBrandsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (error) {
      setError("");
    }
  };

  const validateForm = () => {
    if (!formData.brandId) {
      setError("Please select a brand.");
      return false;
    }
    if (!formData.modelName.trim()) {
      setError("Model name is required.");
      return false;
    }
    if (formData.modelName.trim().length < 2) {
      setError("Model name must be at least 2 characters long.");
      return false;
    }
    if (!formData.systemType) {
      setError("Please select a system type.");
      return false;
    }
    if (!formData.category) {
      setError("Please select a category.");
      return false;
    }
    if (formData.recommendedMaintenanceInterval < 1) {
      setError("Please select a maintenance frequency.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Prepare data according to your API model structure
      const submitData = {
        brandId: formData.brandId,
        modelName: formData.modelName.trim(),
        systemType: formData.systemType,
        category: formData.category,
        subCategory: formData.subCategory.trim() || null,
        description: formData.description.trim() || null,
        specifications: formData.specifications.trim() || null,
        maintenanceRequirements: formData.maintenanceRequirements.trim() || null,
        recommendedMaintenanceInterval: parseInt(formData.recommendedMaintenanceInterval),
      };

      console.log("Submitting equipment model data:", submitData);

      const result = await addEquipmentModel(submitData);
      console.log("Add result:", result);

      setSuccess("Equipment model created successfully!");

      // Navigate back after a short delay
      setTimeout(() => {
        navigate("/equipment-models");
      }, 1500);
    } catch (error) {
      console.error("Error creating equipment model:", error);

      // Handle different types of errors based on the service implementation
      if (error.message) {
        // This handles errors thrown by the service with custom messages
        setError(error.message);
      } else if (error.response?.status === 400) {
        // Handle validation errors from API
        const errorData = error.response.data;
        if (typeof errorData === "string") {
          setError(errorData);
        } else if (errorData.message) {
          setError(errorData.message);
        } else if (errorData.errors) {
          // Handle validation errors object
          const errorMessages = Object.values(errorData.errors).flat();
          setError(errorMessages.join(", "));
        } else {
          setError("Invalid model data. Please check all required fields.");
        }
      } else if (error.response?.status === 409) {
        setError("A model with this name already exists for the selected brand.");
      } else if (error.response?.status >= 500) {
        setError("Server error occurred. Please try again later.");
      } else {
        setError("Failed to create equipment model. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/equipment-models");
  };

  const handleReset = () => {
    setFormData({
      brandId: "",
      modelName: "",
      systemType: "",
      category: "",
      subCategory: "",
      description: "",
      specifications: "",
      maintenanceRequirements: "",
      recommendedMaintenanceInterval: 90,
    });
    setError("");
    setSuccess("");
  };

  const isFormDirty = () => {
    return (
      formData.brandId !== "" ||
      formData.modelName !== "" ||
      formData.systemType !== "" ||
      formData.category !== "" ||
      formData.subCategory !== "" ||
      formData.description !== "" ||
      formData.specifications !== "" ||
      formData.maintenanceRequirements !== "" ||
      formData.recommendedMaintenanceInterval !== 90
    );
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
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  Add New Equipment Model
                </MDTypography>
                <MDTypography variant="body2" color="white" opacity={0.8} mt={0.5}>
                  Create a new equipment model with specifications and maintenance requirements
                </MDTypography>
              </MDBox>
              <MDBox p={3}>
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
                  <Grid container spacing={3}>
                    {/* Brand Selection */}
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth disabled={brandsLoading || loading}>
                        <InputLabel>Brand *</InputLabel>
                        <Select
                          name="brandId"
                          value={formData.brandId}
                          onChange={handleInputChange}
                          required
                        >
                          {brandsLoading ? (
                            <MenuItem disabled>
                              <CircularProgress size={20} sx={{ mr: 1 }} />
                              Loading brands...
                            </MenuItem>
                          ) : brands.length === 0 ? (
                            <MenuItem disabled>No active brands available</MenuItem>
                          ) : (
                            brands.map((brand) => (
                              <MenuItem key={brand.id} value={brand.id}>
                                {brand.name} - {brand.category}
                              </MenuItem>
                            ))
                          )}
                        </Select>
                      </FormControl>
                    </Grid>

                    {/* Model Name */}
                    <Grid item xs={12} md={6}>
                      <MDInput
                        type="text"
                        name="modelName"
                        label="Model Name *"
                        value={formData.modelName}
                        onChange={handleInputChange}
                        fullWidth
                        required
                        disabled={loading}
                        inputProps={{
                          minLength: 2,
                          maxLength: 100,
                        }}
                      />
                    </Grid>

                    {/* System Type */}
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth disabled={loading}>
                        <InputLabel>System Type *</InputLabel>
                        <Select
                          name="systemType"
                          value={formData.systemType}
                          onChange={handleInputChange}
                          required
                        >
                          {systemTypes.map((type) => (
                            <MenuItem key={type} value={type}>
                              {type}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    {/* Category */}
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth disabled={loading}>
                        <InputLabel>Category *</InputLabel>
                        <Select
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          required
                        >
                          {categories.map((category) => (
                            <MenuItem key={category} value={category}>
                              {category}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    {/* Sub Category */}
                    <Grid item xs={12} md={6}>
                      <MDInput
                        type="text"
                        name="subCategory"
                        label="Sub Category"
                        value={formData.subCategory}
                        onChange={handleInputChange}
                        fullWidth
                        disabled={loading}
                        inputProps={{
                          maxLength: 50,
                        }}
                      />
                    </Grid>

                    {/* Maintenance Frequency */}
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth disabled={loading}>
                        <InputLabel>Maintenance Frequency *</InputLabel>
                        <Select
                          name="recommendedMaintenanceInterval"
                          value={formData.recommendedMaintenanceInterval}
                          onChange={handleInputChange}
                          required
                        >
                          {frequencyOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    {/* Description */}
                    <Grid item xs={12}>
                      <TextField
                        name="description"
                        label="Description"
                        value={formData.description}
                        onChange={handleInputChange}
                        fullWidth
                        multiline
                        rows={3}
                        disabled={loading}
                        placeholder="Enter equipment model description..."
                        inputProps={{
                          maxLength: 500,
                        }}
                      />
                    </Grid>

                    {/* Specifications */}
                    <Grid item xs={12}>
                      <TextField
                        name="specifications"
                        label="Specifications"
                        value={formData.specifications}
                        onChange={handleInputChange}
                        fullWidth
                        multiline
                        rows={3}
                        disabled={loading}
                        placeholder="Enter technical specifications..."
                        inputProps={{
                          maxLength: 1000,
                        }}
                      />
                    </Grid>

                    {/* Maintenance Requirements */}
                    <Grid item xs={12}>
                      <TextField
                        name="maintenanceRequirements"
                        label="Maintenance Requirements"
                        value={formData.maintenanceRequirements}
                        onChange={handleInputChange}
                        fullWidth
                        multiline
                        rows={3}
                        disabled={loading}
                        placeholder="Enter maintenance requirements..."
                        inputProps={{
                          maxLength: 1000,
                        }}
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
                        {isFormDirty() && (
                          <MDButton
                            variant="outlined"
                            color="warning"
                            onClick={handleReset}
                            disabled={loading}
                          >
                            Reset Form
                          </MDButton>
                        )}
                        <MDButton
                          type="submit"
                          variant="gradient"
                          color="info"
                          disabled={loading || brandsLoading}
                          startIcon={loading ? <CircularProgress size={20} /> : null}
                        >
                          {loading ? "Creating..." : "Create Equipment Model"}
                        </MDButton>
                      </MDBox>
                    </Grid>

                    {/* Helper Text */}
                    <Grid item xs={12}>
                      <MDBox mt={1}>
                        <MDTypography variant="caption" color="text">
                          Fields marked with * are required. The model name must be unique for each
                          brand.
                        </MDTypography>
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

export default AddEquipmentModel;
