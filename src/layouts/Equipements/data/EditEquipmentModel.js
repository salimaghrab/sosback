import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { updateEquipmentModel, fetchEquipmentModelById } from "../service/equipment";

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
import Skeleton from "@mui/material/Skeleton";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import apiClient from "layouts/authentication/services/axiosInterceptor";

function EditEquipmentModel() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [brands, setBrands] = useState([]);
  const [formData, setFormData] = useState({
    id: "",
    brandId: "",
    modelName: "",
    systemType: "",
    category: "",
    subCategory: "",
    description: "",
    specifications: "",
    maintenanceRequirements: "",
    recommendedMaintenanceInterval: 90,
    maintenanceFrequency: "",
    maintenanceFrequencyDays: 90,
    createdAt: "",
    updatedAt: "",
  });
  const [originalData, setOriginalData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
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
    if (id) {
      loadEquipmentModelData();
    }
  }, [id]);

  const loadEquipmentModelData = async () => {
    try {
      setDataLoading(true);
      setError("");

      // Load both equipment model data and brands in parallel
      const [modelData, brandsData] = await Promise.all([
        fetchEquipmentModelById(id),
        apiClient.get("/Brands"),
      ]);

      if (!modelData) {
        setError("Equipment model not found");
        setTimeout(() => navigate("/equipment-models"), 2000);
        return;
      }

      const formattedData = {
        ...modelData,
        // Ensure all fields have proper fallback values
        modelName: modelData.modelName || "",
        systemType: modelData.systemType || "",
        category: modelData.category || "",
        subCategory: modelData.subCategory || "",
        description: modelData.description || "",
        specifications: modelData.specifications || "",
        maintenanceRequirements: modelData.maintenanceRequirements || "",
        recommendedMaintenanceInterval: modelData.recommendedMaintenanceInterval || 90,
        maintenanceFrequency: modelData.maintenanceFrequency || "Quarterly",
        maintenanceFrequencyDays: modelData.maintenanceFrequencyDays || 90,
      };

      setFormData(formattedData);
      setOriginalData(formattedData);
      setBrands(brandsData.data?.filter((brand) => brand.isActive) || []);
    } catch (error) {
      console.error("Error loading equipment model data:", error);
      setError("Failed to load equipment model data. Please try again.");
    } finally {
      setDataLoading(false);
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

  const handleMaintenanceIntervalChange = (e) => {
    const intervalDays = parseInt(e.target.value);
    const frequencyLabel = getFrequencyLabel(intervalDays);

    setFormData((prev) => ({
      ...prev,
      recommendedMaintenanceInterval: intervalDays,
      maintenanceFrequency: frequencyLabel,
      maintenanceFrequencyDays: intervalDays,
    }));
  };

  const getFrequencyLabel = (days) => {
    switch (days) {
      case 30:
        return "Monthly";
      case 90:
        return "Quarterly";
      case 180:
        return "Semi-annually";
      case 365:
        return "Annually";
      default:
        return "Custom";
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

  const hasChanges = () => {
    if (!originalData) return false;

    const fieldsToCompare = [
      "brandId",
      "modelName",
      "systemType",
      "category",
      "subCategory",
      "description",
      "specifications",
      "maintenanceRequirements",
      "recommendedMaintenanceInterval",
    ];

    return fieldsToCompare.some((field) => {
      const originalValue = originalData[field];
      const currentValue = formData[field];

      // Handle null/empty string comparison
      if (!originalValue && !currentValue) return false;
      if (originalValue !== currentValue) return true;

      return false;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!hasChanges()) {
      setError("No changes detected. Please modify at least one field.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Prepare data for update
      const updateData = {
        id: formData.id,
        brandId: formData.brandId,
        modelName: formData.modelName.trim(),
        systemType: formData.systemType,
        category: formData.category,
        subCategory: formData.subCategory.trim() || null,
        description: formData.description.trim() || null,
        specifications: formData.specifications.trim() || null,
        maintenanceRequirements: formData.maintenanceRequirements.trim() || null,
        recommendedMaintenanceInterval: parseInt(formData.recommendedMaintenanceInterval),
        maintenanceFrequency: formData.maintenanceFrequency,
        maintenanceFrequencyDays: parseInt(formData.maintenanceFrequencyDays),
        createdAt: formData.createdAt,
        updatedAt: formData.updatedAt, // Will be updated by backend
      };

      console.log("Updating equipment model with data:", updateData);

      const result = await updateEquipmentModel(id, updateData);

      if (result) {
        setSuccess("Equipment model updated successfully!");
        setTimeout(() => {
          navigate("/equipment-models");
        }, 1500);
      } else {
        setError("Failed to update equipment model. Please try again.");
      }
    } catch (error) {
      console.error("Error updating equipment model:", error);
      setError(error.message || "Failed to update equipment model. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/equipment-models");
  };

  const handleReset = () => {
    if (originalData) {
      setFormData({ ...originalData });
      setError("");
      setSuccess("");
    }
  };

  if (dataLoading) {
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
                    Loading Equipment Model Data...
                  </MDTypography>
                </MDBox>
                <MDBox p={3}>
                  <Grid container spacing={3}>
                    {[...Array(8)].map((_, index) => (
                      <Grid item xs={12} md={6} key={index}>
                        <Skeleton variant="rectangular" height={56} />
                      </Grid>
                    ))}
                  </Grid>
                </MDBox>
              </Card>
            </Grid>
          </Grid>
        </MDBox>
      </DashboardLayout>
    );
  }

  const selectedBrand = brands.find((brand) => brand.id === formData.brandId);

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
                  Edit Equipment Model
                  {formData.modelName && (
                    <MDTypography variant="body2" color="white" opacity={0.8} mt={0.5}>
                      {selectedBrand?.name} - {formData.modelName}
                    </MDTypography>
                  )}
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
                      <FormControl fullWidth disabled={loading}>
                        <InputLabel>Brand *</InputLabel>
                        <Select
                          name="brandId"
                          value={formData.brandId}
                          onChange={handleInputChange}
                          required
                        >
                          {brands.length === 0 ? (
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
                      />
                    </Grid>

                    {/* Maintenance Frequency */}
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth disabled={loading}>
                        <InputLabel>Maintenance Frequency *</InputLabel>
                        <Select
                          name="recommendedMaintenanceInterval"
                          value={formData.recommendedMaintenanceInterval}
                          onChange={handleMaintenanceIntervalChange}
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
                          variant="outlined"
                          color="warning"
                          onClick={handleReset}
                          disabled={loading || !hasChanges()}
                        >
                          Reset Changes
                        </MDButton>
                        <MDButton
                          type="submit"
                          variant="gradient"
                          color="info"
                          disabled={loading || !hasChanges()}
                          startIcon={loading ? <CircularProgress size={20} /> : null}
                        >
                          {loading ? "Updating..." : "Update Equipment Model"}
                        </MDButton>
                      </MDBox>
                    </Grid>

                    {/* Information Display */}
                    {formData.createdAt && (
                      <Grid item xs={12}>
                        <MDBox mt={2} p={2} sx={{ backgroundColor: "#f5f5f5", borderRadius: 1 }}>
                          <MDTypography variant="caption" color="text">
                            Created: {new Date(formData.createdAt).toLocaleString()}
                          </MDTypography>
                          {formData.updatedAt && formData.updatedAt !== formData.createdAt && (
                            <MDTypography variant="caption" color="text" display="block">
                              Last Updated: {new Date(formData.updatedAt).toLocaleString()}
                            </MDTypography>
                          )}
                          <MDTypography variant="caption" color="text" display="block">
                            Maintenance: {formData.maintenanceFrequency} (
                            {formData.maintenanceFrequencyDays} days)
                          </MDTypography>
                        </MDBox>
                      </Grid>
                    )}
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

export default EditEquipmentModel;
