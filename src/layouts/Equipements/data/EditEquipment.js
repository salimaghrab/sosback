import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { updateEquipment, fetchEquipmentById, fetchAllEquipmentModels } from "../service/equipment";

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
import Skeleton from "@mui/material/Skeleton";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

function EditEquipment() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [equipmentModels, setEquipmentModels] = useState([]);
  const [formData, setFormData] = useState({
    id: "",
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
    createdAt: "",
    updatedAt: "",
  });
  const [originalData, setOriginalData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const statusOptions = ["Active", "Faulty", "Decommissioned"];

  useEffect(() => {
    if (id) {
      loadEquipmentData();
    }
  }, [id]);

  const loadEquipmentData = async () => {
    try {
      setDataLoading(true);
      setError("");

      // Load both equipment data and equipment models in parallel
      const [equipmentData, modelsData] = await Promise.all([
        fetchEquipmentById(id),
        fetchAllEquipmentModels(),
      ]);

      if (!equipmentData) {
        setError("Equipment not found");
        setTimeout(() => navigate("/equipment"), 2000);
        return;
      }

      // Convert dates to input format (YYYY-MM-DD)
      const formatDateForInput = (dateString) => {
        if (!dateString) return "";
        return new Date(dateString).toISOString().split("T")[0];
      };

      const formattedData = {
        ...equipmentData,
        installationDate: formatDateForInput(equipmentData.installationDate),
        lastMaintenanceDate: formatDateForInput(equipmentData.lastMaintenanceDate),
        nextMaintenanceDate: formatDateForInput(equipmentData.nextMaintenanceDate),
        serialNumber: equipmentData.serialNumber || "",
        location: equipmentData.location || "",
        status: equipmentData.status || "Active",
      };

      setFormData(formattedData);
      setOriginalData(formattedData);
      setEquipmentModels(modelsData || []);
    } catch (error) {
      console.error("Error loading equipment data:", error);
      setError("Failed to load equipment data. Please try again.");
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
    setFormData((prev) => ({
      ...prev,
      equipmentModelId: selectedModelId,
    }));
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

    return true;
  };

  const hasChanges = () => {
    if (!originalData) return false;

    const fieldsToCompare = [
      "equipmentModelId",
      "serialNumber",
      "location",
      "quantity",
      "status",
      "backupAvailable",
      "emergencyStickerUpdated",
      "hasOMManual",
      "hasZoneChart",
      "installationDate",
      "lastMaintenanceDate",
      "nextMaintenanceDate",
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
        createdAt: formData.createdAt,
        updatedAt: new Date().toISOString(), // Will be set by the backend but include for completeness
      };

      console.log("Updating equipment with data:", updateData);

      const success = await updateEquipment(id, updateData);

      if (success) {
        setSuccess("Equipment updated successfully!");
        setTimeout(() => {
          navigate("/equipment");
        }, 1500);
      } else {
        setError("Failed to update equipment. Please try again.");
      }
    } catch (error) {
      console.error("Error updating equipment:", error);
      setError(error.message || "Failed to update equipment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/equipment");
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
                    Loading Equipment Data...
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

  const selectedModel = equipmentModels.find((model) => model.id === formData.equipmentModelId);

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
                  Edit Equipment
                  {selectedModel && (
                    <MDTypography variant="body2" color="white" opacity={0.8} mt={0.5}>
                      {selectedModel.brand?.name} - {selectedModel.modelName}
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
                        onChange={handleInputChange}
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
                          {loading ? "Updating..." : "Update Equipment"}
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

export default EditEquipment;
