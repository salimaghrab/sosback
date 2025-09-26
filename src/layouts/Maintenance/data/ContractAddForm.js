import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Grid,
  Box,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  CircularProgress,
  Divider,
  Paper,
  Checkbox,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  IconButton,
  Collapse,
  Radio,
  RadioGroup,
} from "@mui/material";
import {
  Business as BusinessIcon,
  DateRange as DateRangeIcon,
  AttachMoney as MoneyIcon,
  Save as SaveIcon,
  Assignment as AssignmentIcon,
  Build as BuildIcon,
  Remove as RemoveIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import { v4 as uuidv4 } from "uuid";

import { siteService, engineerService, equipmentService } from "../service/servicem";
import ContractService from "../service/contractService";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";

const ContractAddForm = () => {
  const [contractService] = useState(() => new ContractService());

  const [formData, setFormData] = useState({
    contractNumber: "",
    siteId: "",
    createNewSite: false,
    newSiteId: "",
    newSiteName: "",
    newSiteClientName: "",
    newSiteLocation: "",
    responsibleEngineerId: "",
    startDate: "",
    endDate: "",
    contractValue: "",
    currency: "QAR",
    status: "Active",
    generateMaintenance: true,
  });

  const [sites, setSites] = useState([]);
  const [engineers, setEngineers] = useState([]);
  const [allEquipments, setAllEquipments] = useState([]);
  const [availableEquipments, setAvailableEquipments] = useState([]);
  const [selectedEquipments, setSelectedEquipments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [equipmentExpanded, setEquipmentExpanded] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    setAvailableEquipments(allEquipments.filter((eq) => eq.status !== "Inactive"));
  }, [allEquipments]);

  const loadInitialData = async () => {
    try {
      setDataLoading(true);
      setErrors({});

      const [sitesData, engineersData, equipmentsData, contractNumberData] =
        await Promise.allSettled([
          siteService.fetchAll(),
          engineerService.fetchAll(),
          equipmentService.fetchAll(),
          contractService.generateContractNumber(),
        ]);

      if (sitesData.status === "fulfilled") {
        setSites(sitesData.value || []);
      } else {
        console.error("Error loading sites:", sitesData.reason);
        setErrors((prev) => ({ ...prev, sites: "Failed to load sites" }));
      }

      if (engineersData.status === "fulfilled") {
        const activeEngineers = (engineersData.value || []).filter((eng) => eng.isActive !== false);
        setEngineers(activeEngineers);
      } else {
        console.error("Error loading engineers:", engineersData.reason);
        setErrors((prev) => ({ ...prev, engineers: "Failed to load engineers" }));
      }

      if (equipmentsData.status === "fulfilled") {
        setAllEquipments(equipmentsData.value || []);
      } else {
        console.error("Error loading equipments:", equipmentsData.reason);
        setErrors((prev) => ({ ...prev, equipments: "Failed to load equipments" }));
      }

      if (contractNumberData.status === "fulfilled") {
        setFormData((prev) => ({
          ...prev,
          contractNumber:
            contractNumberData.value?.contractNumber ||
            `CON-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`,
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          contractNumber: `CON-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`,
        }));
      }
    } catch (error) {
      console.error("Error loading initial data:", error);
      setErrors({ general: "Failed to load initial data. Please refresh and try again." });
    } finally {
      setDataLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    let sanitizedValue = value;
    if (["newSiteName", "newSiteClientName", "newSiteLocation"].includes(field)) {
      sanitizedValue = value
        .trim()
        .replace(/[^a-zA-Z0-9\s\-,.]/g, "")
        .substring(0, 100);
    }
    setFormData((prev) => ({ ...prev, [field]: sanitizedValue }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSiteChange = (value) => {
    if (value === "new") {
      const newSiteId = uuidv4(); // This generates a new GUID
      setFormData((prev) => ({
        ...prev,
        siteId: "",
        createNewSite: true,
        newSiteId, // Store the generated ID
        newSiteName: "",
        newSiteClientName: "",
        newSiteLocation: "",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        siteId: value,
        createNewSite: false,
        newSiteId: "",
        newSiteName: "",
        newSiteClientName: "",
        newSiteLocation: "",
      }));
    }
  };

  const handleEquipmentSelect = (equipment, selected) => {
    if (selected) {
      if (!selectedEquipments.some((item) => item.equipmentId === equipment.id)) {
        setSelectedEquipments((prev) => [
          ...prev,
          {
            equipmentId: equipment.id,
            serialNumber: equipment.serialNumber || "N/A",
            modelName: equipment.equipmentModel?.modelName || "Unknown Model",
            location: equipment.location || "N/A",
            notes: "",
          },
        ]);
      }
    } else {
      setSelectedEquipments((prev) => prev.filter((item) => item.equipmentId !== equipment.id));
    }
  };

  const handleEquipmentNotes = (equipmentId, notes) => {
    setSelectedEquipments((prev) =>
      prev.map((item) =>
        item.equipmentId === equipmentId ? { ...item, notes: notes.trim() } : item
      )
    );
  };

  const validateForm = () => {
    const newErrors = {};

    if (formData.createNewSite) {
      if (!formData.newSiteName?.trim()) newErrors.newSiteName = "Site name is required";
      if (!formData.newSiteClientName?.trim())
        newErrors.newSiteClientName = "Client name is required";
      if (!formData.newSiteLocation?.trim()) newErrors.newSiteLocation = "Location is required";
      if (!formData.newSiteId) newErrors.newSiteId = "Site ID is required";
    } else {
      if (!formData.siteId) newErrors.siteId = "Please select a site";
    }

    if (!formData.startDate) newErrors.startDate = "Start date is required";
    if (!formData.endDate) newErrors.endDate = "End date is required";
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (start >= end) {
        newErrors.endDate = "End date must be after start date";
      }
    }

    if (!formData.contractValue || parseFloat(formData.contractValue) <= 0) {
      newErrors.contractValue = "Valid contract value greater than 0 is required";
    }

    if (formData.generateMaintenance && selectedEquipments.length === 0) {
      newErrors.equipment = "At least one equipment must be selected to generate maintenance";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (formData.generateMaintenance && selectedEquipments.length === 0) {
      const confirm = window.confirm(
        "No equipment selected but maintenance generation is enabled. Continue without equipment? Maintenance will be generated when equipment is added later."
      );
      if (!confirm) return;
    }

    setLoading(true);
    setErrors({});
    setSuccessMessage("");

    try {
      const equipmentData = selectedEquipments.map((eq) => ({
        equipmentId: eq.equipmentId,
        notes: eq.notes || "",
      }));

      console.log("Submitting contract with:", {
        formData: { ...formData },
        equipmentCount: equipmentData.length,
        generateMaintenance: formData.generateMaintenance,
      });

      const result = await contractService.createContractWithEquipments(
        formData,
        equipmentData,
        formData.generateMaintenance
      );

      let message = `Contract "${
        result.contract.contractNumber || result.contractNumber
      }" created successfully!`;
      if (result.equipmentResults?.length > 0) {
        message += ` ${result.equipmentResults.length} equipment(s) added.`;
      }
      if (result.maintenanceGenerated) {
        message += ` Maintenance schedule generated (${
          result.maintenanceResult?.maintenanceCount || 0
        } records).`;
      }
      if (result.equipmentErrors?.length > 0) {
        message += ` Warning: ${result.equipmentErrors.length} equipment(s) failed to add.`;
      }
      if (result.maintenanceError) {
        message += ` Maintenance warning: ${result.maintenanceError}`;
      }

      setSuccessMessage(message);

      // Reset form
      resetForm();

      // Refresh data
      setTimeout(() => {
        loadInitialData();
      }, 1000);

      setTimeout(() => setSuccessMessage(""), 10000);
    } catch (error) {
      console.error("Error creating contract:", error);
      setErrors({
        general:
          error.message || "Failed to create contract. Please check your input and try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    const newContractNumber = `CON-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`;
    setFormData({
      contractNumber: newContractNumber,
      siteId: "",
      createNewSite: false,
      newSiteId: "",
      newSiteName: "",
      newSiteClientName: "",
      newSiteLocation: "",
      responsibleEngineerId: "",
      startDate: "",
      endDate: "",
      contractValue: "",
      currency: "QAR",
      status: "Active",
      generateMaintenance: true,
    });
    setSelectedEquipments([]);
  };

  const refreshData = async () => {
    await loadInitialData();
    resetForm();
  };

  // Calculate showNewSiteFields directly from formData
  const showNewSiteFields = formData.createNewSite;

  if (dataLoading) {
    return (
      <Box
        sx={{
          maxWidth: 1200,
          mx: "auto",
          p: 3,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 400,
        }}
      >
        <CircularProgress size={40} />
        <Typography sx={{ ml: 2 }}>Loading form data...</Typography>
      </Box>
    );
  }

  return (
    <DashboardLayout>
      <Box sx={{ maxWidth: 1200, mx: "auto", p: 3 }}>
        <Paper sx={{ p: 3, mb: 3, bgcolor: "primary.main", color: "white" }}>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center" gap={2}>
              <AssignmentIcon fontSize="large" />
              <Box>
                <Typography variant="h5" fontWeight="bold">
                  New Maintenance Contract
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Create contract with equipment and automatic maintenance scheduling
                </Typography>
              </Box>
            </Box>
            <IconButton
              onClick={refreshData}
              sx={{ color: "white" }}
              disabled={dataLoading || loading}
            >
              <RefreshIcon />
            </IconButton>
          </Box>
        </Paper>

        {errors.general && (
          <Alert
            severity="error"
            sx={{ mb: 3 }}
            onClose={() => setErrors((prev) => ({ ...prev, general: "" }))}
          >
            {errors.general}
          </Alert>
        )}

        {successMessage && (
          <Alert
            severity="success"
            sx={{ mb: 3 }}
            icon={<CheckCircleIcon />}
            action={
              <IconButton size="small" onClick={() => setSuccessMessage("")}>
                <RemoveIcon />
              </IconButton>
            }
          >
            {successMessage}
          </Alert>
        )}

        {(errors.sites || errors.engineers || errors.equipments) && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            <Typography variant="body2" fontWeight="bold">
              Some data failed to load:
            </Typography>
            {errors.sites && <Typography variant="body2">• Sites: {errors.sites}</Typography>}
            {errors.engineers && (
              <Typography variant="body2">• Engineers: {errors.engineers}</Typography>
            )}
            {errors.equipments && (
              <Typography variant="body2">• Equipment: {errors.equipments}</Typography>
            )}
            <Button size="small" onClick={refreshData} sx={{ mt: 1 }}>
              Retry Loading
            </Button>
          </Alert>
        )}

        <Card>
          <CardContent sx={{ p: 4 }}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    <AssignmentIcon color="primary" />
                    Contract Details
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Contract Number"
                    value={formData.contractNumber}
                    disabled
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={formData.status}
                      onChange={(e) => handleInputChange("status", e.target.value)}
                      label="Status"
                    >
                      <MenuItem value="Active">Active</MenuItem>
                      <MenuItem value="Pending">Pending</MenuItem>
                      <MenuItem value="Suspended">Suspended</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.generateMaintenance}
                        onChange={(e) => handleInputChange("generateMaintenance", e.target.checked)}
                      />
                    }
                    label={
                      <Box>
                        <Typography variant="body1">Generate Maintenance Schedule</Typography>
                        <Typography variant="caption" color="text.secondary">
                          Automatically create maintenance tasks for selected equipment
                        </Typography>
                      </Box>
                    }
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ display: "flex", alignItems: "center", gap: 1, mt: 2 }}
                  >
                    <BusinessIcon color="primary" />
                    Site Information
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>

                <Grid item xs={12}>
                  <RadioGroup
                    row
                    value={formData.createNewSite ? "new" : "existing"}
                    onChange={(e) => handleSiteChange(e.target.value)}
                  >
                    <FormControlLabel
                      value="existing"
                      control={<Radio />}
                      label="Select Existing Site"
                    />
                    <FormControlLabel value="new" control={<Radio />} label="Create New Site" />
                  </RadioGroup>
                </Grid>

                {!showNewSiteFields && (
                  <Grid item xs={12}>
                    <FormControl fullWidth error={Boolean(errors.siteId)}>
                      <InputLabel>Site</InputLabel>
                      <Select
                        value={formData.siteId}
                        onChange={(e) => handleInputChange("siteId", e.target.value)}
                        label="Site"
                      >
                        <MenuItem value="">
                          <em>Select a site</em>
                        </MenuItem>
                        {sites.map((site) => (
                          <MenuItem key={site.id} value={site.id}>
                            {site.siteName} - {site.clientName} ({site.location})
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.siteId && (
                        <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                          {errors.siteId}
                        </Typography>
                      )}
                    </FormControl>
                  </Grid>
                )}

                {showNewSiteFields && (
                  <>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="Site Name"
                        value={formData.newSiteName}
                        onChange={(e) => handleInputChange("newSiteName", e.target.value)}
                        error={Boolean(errors.newSiteName)}
                        helperText={errors.newSiteName}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="Client Name"
                        value={formData.newSiteClientName}
                        onChange={(e) => handleInputChange("newSiteClientName", e.target.value)}
                        error={Boolean(errors.newSiteClientName)}
                        helperText={errors.newSiteClientName}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="Location"
                        value={formData.newSiteLocation}
                        onChange={(e) => handleInputChange("newSiteLocation", e.target.value)}
                        error={Boolean(errors.newSiteLocation)}
                        helperText={errors.newSiteLocation}
                        required
                      />
                    </Grid>
                  </>
                )}

                <Grid item xs={12}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ display: "flex", alignItems: "center", gap: 1, mt: 2 }}
                  >
                    <BuildIcon color="primary" />
                    Equipment Selection
                    <Chip
                      label={`${selectedEquipments.length} selected`}
                      color="primary"
                      size="small"
                    />
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  {errors.equipment && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                      {errors.equipment}
                    </Alert>
                  )}
                </Grid>

                <Grid item xs={12}>
                  <Button
                    variant="outlined"
                    startIcon={equipmentExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    onClick={() => setEquipmentExpanded(!equipmentExpanded)}
                    disabled={availableEquipments.length === 0}
                    fullWidth
                    sx={{ mb: 2 }}
                  >
                    {equipmentExpanded ? "Hide" : "Show"} Available Equipment (
                    {availableEquipments.length})
                  </Button>

                  <Collapse in={equipmentExpanded}>
                    <Paper
                      variant="outlined"
                      sx={{ p: 2, mb: 2, maxHeight: 300, overflow: "auto" }}
                    >
                      {availableEquipments.length === 0 ? (
                        <Typography variant="body2" color="text.secondary">
                          No equipment available. Please add equipment to the system first.
                        </Typography>
                      ) : (
                        <List dense>
                          {availableEquipments.map((equipment) => {
                            const isSelected = selectedEquipments.some(
                              (selected) => selected.equipmentId === equipment.id
                            );
                            return (
                              <ListItem key={equipment.id} sx={{ borderBottom: "1px solid #eee" }}>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={isSelected}
                                      onChange={(e) =>
                                        handleEquipmentSelect(equipment, e.target.checked)
                                      }
                                    />
                                  }
                                  label={
                                    <Box sx={{ flexGrow: 1 }}>
                                      <Typography variant="subtitle2" fontWeight="medium">
                                        {equipment.equipmentModel?.modelName || "Unknown Model"}
                                      </Typography>
                                      <Typography variant="body2" color="text.secondary">
                                        Serial: {equipment.serialNumber || "N/A"} | Location:{" "}
                                        {equipment.location || "N/A"}
                                        {equipment.status && ` | Status: ${equipment.status}`}
                                      </Typography>
                                    </Box>
                                  }
                                />
                              </ListItem>
                            );
                          })}
                        </List>
                      )}
                    </Paper>
                  </Collapse>

                  {selectedEquipments.length > 0 && (
                    <Paper variant="outlined" sx={{ p: 2 }}>
                      <Typography variant="subtitle1" gutterBottom>
                        Selected Equipment ({selectedEquipments.length})
                      </Typography>
                      <List dense>
                        {selectedEquipments.map((equipment) => (
                          <ListItem key={equipment.equipmentId} divider>
                            <ListItemText
                              primary={equipment.modelName}
                              secondary={`Serial: ${equipment.serialNumber} | Location: ${equipment.location}`}
                            />
                            <ListItemSecondaryAction>
                              <TextField
                                size="small"
                                placeholder="Notes (optional)"
                                value={equipment.notes}
                                onChange={(e) =>
                                  handleEquipmentNotes(equipment.equipmentId, e.target.value)
                                }
                                sx={{ width: 200, mr: 1 }}
                              />
                              <IconButton
                                edge="end"
                                onClick={() =>
                                  handleEquipmentSelect({ id: equipment.equipmentId }, false)
                                }
                              >
                                <RemoveIcon />
                              </IconButton>
                            </ListItemSecondaryAction>
                          </ListItem>
                        ))}
                      </List>
                    </Paper>
                  )}
                </Grid>

                <Grid item xs={12}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ display: "flex", alignItems: "center", gap: 1, mt: 2 }}
                  >
                    <DateRangeIcon color="primary" />
                    Assignment & Duration
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Responsible Engineer</InputLabel>
                    <Select
                      value={formData.responsibleEngineerId}
                      onChange={(e) => handleInputChange("responsibleEngineerId", e.target.value)}
                      label="Responsible Engineer"
                    >
                      <MenuItem value="">
                        <em>Not assigned</em>
                      </MenuItem>
                      {engineers.map((engineer) => (
                        <MenuItem key={engineer.id} value={engineer.id}>
                          <Box>
                            <Typography>{engineer.name}</Typography>
                            {engineer.specializations && (
                              <Typography variant="caption" color="text.secondary">
                                {engineer.specializations}
                              </Typography>
                            )}
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Start Date"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleInputChange("startDate", e.target.value)}
                    error={Boolean(errors.startDate)}
                    helperText={errors.startDate}
                    InputLabelProps={{ shrink: true }}
                    required
                    inputProps={{ min: new Date().toISOString().split("T")[0] }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="End Date"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleInputChange("endDate", e.target.value)}
                    error={Boolean(errors.endDate)}
                    helperText={errors.endDate}
                    InputLabelProps={{ shrink: true }}
                    required
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ display: "flex", alignItems: "center", gap: 1, mt: 2 }}
                  >
                    <MoneyIcon color="primary" />
                    Financial Details
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>

                <Grid item xs={12} md={8}>
                  <TextField
                    fullWidth
                    label="Contract Value"
                    type="number"
                    value={formData.contractValue}
                    onChange={(e) => handleInputChange("contractValue", e.target.value)}
                    error={Boolean(errors.contractValue)}
                    helperText={errors.contractValue}
                    required
                    inputProps={{ min: 0.01, step: 0.01 }}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <InputLabel>Currency</InputLabel>
                    <Select
                      value={formData.currency}
                      onChange={(e) => handleInputChange("currency", e.target.value)}
                      label="Currency"
                    >
                      <MenuItem value="QAR">QAR</MenuItem>
                      <MenuItem value="USD">USD</MenuItem>
                      <MenuItem value="EUR">EUR</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <Box sx={{ mt: 3, display: "flex", gap: 2, justifyContent: "flex-end" }}>
                    <Button variant="outlined" size="large" onClick={resetForm} disabled={loading}>
                      Reset Form
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      startIcon={
                        loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />
                      }
                      disabled={loading}
                      sx={{ minWidth: 200 }}
                    >
                      {loading ? "Creating Contract..." : "Create Contract"}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Box>
    </DashboardLayout>
  );
};

export default ContractAddForm;
