// Updated AddEquipment component with corrected form handling and proper integration

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { addEquipment, fetchAllEquipmentModels } from "../service/equipment";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
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

function AddEquipment() {
  const navigate = useNavigate();
  const [equipmentModels, setEquipmentModels] = useState([]);
  const [formData, setFormData] = useState({
    equipmentModelId: "",
    serialNumber: "",
    location: "",
    quantity: 1,
    status: "Active",
    backupAvailable: false,
    emergencyStickerUpdated: false,
    hasOMManual: false,
    hasZoneChart: false,
    installationDate: "",
    lastMaintenanceDate: "",
    nextMaintenanceDate: "",
  });
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Status options based on your Equipment class
  const statusOptions = ["Active", "Faulty", "Decommissioned"];

  useEffect(() => {
    loadEquipmentModels();
  }, []);

  const loadEquipmentModels = async () => {
    try {
      setDataLoading(true);
      const modelsResponse = await fetchAllEquipmentModels();
      setEquipmentModels(modelsResponse || []);
    } catch (error) {
      console.error("Error loading equipment models:", error);
      setError("Failed to load equipment models. Please refresh the page.");
    } finally {
      setDataLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when user starts typing
    if (error) {
      setError("");
    }
  };

  const handleModelChange = (e) => {
    const selectedModelId = e.target.value;
    const selectedModel = equipmentModels.find((model) => model.id === selectedModelId);

    setFormData((prev) => ({
      ...prev,
      equipmentModelId: selectedModelId,
      // Auto-calculate next maintenance date if installation date and model are selected
      ...(prev.installationDate &&
        selectedModel?.recommendedMaintenanceInterval && {
          nextMaintenanceDate: calculateNextMaintenanceDate(
            prev.installationDate,
            selectedModel.recommendedMaintenanceInterval
          ),
        }),
    }));
  };

  const handleInstallationDateChange = (e) => {
    const installationDate = e.target.value;
    const selectedModel = equipmentModels.find((model) => model.id === formData.equipmentModelId);

    setFormData((prev) => ({
      ...prev,
      installationDate,
      // Auto-calculate next maintenance date
      ...(selectedModel?.recommendedMaintenanceInterval && {
        nextMaintenanceDate: calculateNextMaintenanceDate(
          installationDate,
          selectedModel.recommendedMaintenanceInterval
        ),
      }),
    }));
  };

  const calculateNextMaintenanceDate = (installationDate, intervalDays) => {
    if (!installationDate || !intervalDays) return "";

    const installation = new Date(installationDate);
    const nextMaintenance = new Date(installation);
    nextMaintenance.setDate(installation.getDate() + intervalDays);
    return nextMaintenance.toISOString().split("T")[0];
  };

  const validateForm = () => {
    if (!formData.equipmentModelId) {
      setError("Please select an equipment model.");
      return false;
    }
    if (!formData.location.trim()) {
      setError("Location is required.");
      return false;
    }
    if (formData.quantity < 1) {
      setError("Quantity must be at least 1.");
      return false;
    }
    if (!formData.status) {
      setError("Please select a status.");
      return false;
    }

    // Validate that selected ID is a valid GUID
    const guidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!guidRegex.test(formData.equipmentModelId)) {
      setError("Invalid equipment model selection. Please refresh and try again.");
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
      // Prepare data according to your Equipment class structure
      const submitData = {
        equipmentModelId: formData.equipmentModelId,
        serialNumber: formData.serialNumber.trim() || null,
        location: formData.location.trim(),
        status: formData.status,
        quantity: parseInt(formData.quantity, 10),
        backupAvailable: formData.backupAvailable,
        emergencyStickerUpdated: formData.emergencyStickerUpdated,
        hasOMManual: formData.hasOMManual,
        hasZoneChart: formData.hasZoneChart,
        installationDate: formData.installationDate
          ? new Date(formData.installationDate).toISOString()
          : null,
        lastMaintenanceDate: formData.lastMaintenanceDate
          ? new Date(formData.lastMaintenanceDate).toISOString()
          : null,
        nextMaintenanceDate: formData.nextMaintenanceDate
          ? new Date(formData.nextMaintenanceDate).toISOString()
          : null,
      };

      console.log("Submitting equipment data:", submitData);

      const result = await addEquipment(submitData);
      console.log("Equipment created successfully:", result);

      setSuccess("Equipment created successfully!");

      // Navigate back after a short delay
      setTimeout(() => {
        navigate("/equipment");
      }, 1500);
    } catch (error) {
      console.error("Error creating equipment:", error);

      // Use the error message from our improved service function
      setError(error.message || "Failed to create equipment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/equipment");
  };

  if (dataLoading) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox
          pt={6}
          pb={3}
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="60vh"
        >
          <MDBox textAlign="center">
            <CircularProgress size={60} />
            <MDTypography variant="h6" color="text" mt={2}>
              Loading equipment models...
            </MDTypography>
          </MDBox>
        </MDBox>
      </DashboardLayout>
    );
  }

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
                bgColor="primary"
                borderRadius="lg"
                coloredShadow="primary"
              >
                <MDTypography variant="h6" color="white">
                  Add New Equipment
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
                    {/* Equipment Model Selection */}
                    <Grid item xs={12}>
                      <FormControl fullWidth disabled={loading}>
                        <InputLabel>Equipment Model *</InputLabel>
                        <Select
                          name="equipmentModelId"
                          value={formData.equipmentModelId}
                          onChange={handleModelChange}
                          required
                          label="Equipment Model *"
                        >
                          {equipmentModels.length === 0 ? (
                            <MenuItem disabled>No equipment models available</MenuItem>
                          ) : (
                            equipmentModels.map((model) => (
                              <MenuItem key={model.id} value={model.id}>
                                {model.brand?.name || "Unknown Brand"} - {model.modelName} (
                                {model.category})
                              </MenuItem>
                            ))
                          )}
                        </Select>
                      </FormControl>
                    </Grid>

                    {/* Serial Number */}
                    <Grid item xs={12} md={6}>
                      <MDInput
                        type="text"
                        name="serialNumber"
                        label="Serial Number"
                        value={formData.serialNumber}
                        onChange={handleInputChange}
                        fullWidth
                        disabled={loading}
                      />
                    </Grid>

                    {/* Location */}
                    <Grid item xs={12} md={6}>
                      <MDInput
                        type="text"
                        name="location"
                        label="Location *"
                        value={formData.location}
                        onChange={handleInputChange}
                        fullWidth
                        required
                        disabled={loading}
                      />
                    </Grid>

                    {/* Quantity */}
                    <Grid item xs={12} md={6}>
                      <MDInput
                        type="number"
                        name="quantity"
                        label="Quantity *"
                        value={formData.quantity}
                        onChange={handleInputChange}
                        fullWidth
                        inputProps={{ min: 1 }}
                        disabled={loading}
                        required
                      />
                    </Grid>

                    {/* Status */}
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth disabled={loading}>
                        <InputLabel>Status *</InputLabel>
                        <Select
                          name="status"
                          value={formData.status}
                          onChange={handleInputChange}
                          required
                          label="Status *"
                        >
                          {statusOptions.map((status) => (
                            <MenuItem key={status} value={status}>
                              {status}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    {/* Installation Date */}
                    <Grid item xs={12} md={6}>
                      <MDInput
                        type="date"
                        name="installationDate"
                        label="Installation Date"
                        value={formData.installationDate}
                        onChange={handleInstallationDateChange}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        disabled={loading}
                      />
                    </Grid>

                    {/* Last Maintenance Date */}
                    <Grid item xs={12} md={6}>
                      <MDInput
                        type="date"
                        name="lastMaintenanceDate"
                        label="Last Maintenance Date"
                        value={formData.lastMaintenanceDate}
                        onChange={handleInputChange}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        disabled={loading}
                      />
                    </Grid>

                    {/* Next Maintenance Date */}
                    <Grid item xs={12} md={6}>
                      <MDInput
                        type="date"
                        name="nextMaintenanceDate"
                        label="Next Maintenance Date"
                        value={formData.nextMaintenanceDate}
                        onChange={handleInputChange}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        disabled={loading}
                      />
                    </Grid>

                    {/* Boolean Fields - First Column */}
                    <Grid item xs={12} md={6}>
                      <MDBox display="flex" flexDirection="column" gap={2}>
                        <FormControlLabel
                          control={
                            <Switch
                              name="backupAvailable"
                              checked={formData.backupAvailable}
                              onChange={handleInputChange}
                              color="success"
                              disabled={loading}
                            />
                          }
                          label="Backup Available"
                        />
                        <FormControlLabel
                          control={
                            <Switch
                              name="emergencyStickerUpdated"
                              checked={formData.emergencyStickerUpdated}
                              onChange={handleInputChange}
                              color="success"
                              disabled={loading}
                            />
                          }
                          label="Emergency Sticker Updated"
                        />
                      </MDBox>
                    </Grid>

                    {/* Boolean Fields - Second Column */}
                    <Grid item xs={12} md={6}>
                      <MDBox display="flex" flexDirection="column" gap={2}>
                        <FormControlLabel
                          control={
                            <Switch
                              name="hasOMManual"
                              checked={formData.hasOMManual}
                              onChange={handleInputChange}
                              color="info"
                              disabled={loading}
                            />
                          }
                          label="Has O&M Manual"
                        />
                        <FormControlLabel
                          control={
                            <Switch
                              name="hasZoneChart"
                              checked={formData.hasZoneChart}
                              onChange={handleInputChange}
                              color="info"
                              disabled={loading}
                            />
                          }
                          label="Has Zone Chart"
                        />
                      </MDBox>
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
                          color="primary"
                          disabled={loading}
                          startIcon={loading ? <CircularProgress size={20} /> : null}
                        >
                          {loading ? "Creating..." : "Create Equipment"}
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

export default AddEquipment;
