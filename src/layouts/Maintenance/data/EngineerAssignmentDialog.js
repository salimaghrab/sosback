import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Alert,
  AlertTitle,
  Autocomplete,
  CircularProgress,
  Card,
  CardContent,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Person as PersonIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
} from "@mui/icons-material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import {
  engineerAssignmentService,
  ENGINEER_ROLES,
  ROLE_COLORS,
  engineerService,
} from "../service/servicem";

const EngineerAssignmentDialog = ({ open, onClose, maintenance, onAssignmentComplete }) => {
  const [selectedEngineers, setSelectedEngineers] = useState([]);
  const [minimumRequired, setMinimumRequired] = useState(2);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [allEngineers, setAllEngineers] = useState([]);
  const [assignedEngineers, setAssignedEngineers] = useState([]);

  useEffect(() => {
    if (open && maintenance) {
      loadData();
    }
  }, [open, maintenance]);

  const loadData = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log("Loading data for maintenance:", maintenance.id);

      // Load all engineers
      const engineers = await engineerService.fetchAll();
      console.log("Loaded engineers:", engineers.length);
      setAllEngineers(engineers);

      // Load currently assigned engineers
      try {
        const assigned = await engineerAssignmentService.getAssignedEngineers(maintenance.id);
        console.log("Currently assigned engineers:", assigned);
        setAssignedEngineers(assigned);

        if (assigned && assigned.length > 0) {
          // Map assigned engineers to the format expected by the form
          setSelectedEngineers(
            assigned.map((eng) => ({
              engineerId: eng.id,
              name: eng.name,
              role: eng.role || ENGINEER_ROLES.ASSIGNED,
              notes: eng.notes || "",
            }))
          );
        } else {
          // Initialize with minimum required empty slots
          initializeEmptyEngineers();
        }
      } catch (assignedError) {
        console.warn("Could not load assigned engineers:", assignedError);
        setAssignedEngineers([]);
        initializeEmptyEngineers();
      }

      setMinimumRequired(maintenance.minimumEngineersRequired || 2);
    } catch (error) {
      console.error("Error loading data:", error);
      setError(`Error loading data: ${error.message}`);
      initializeEmptyEngineers();
    } finally {
      setLoading(false);
    }
  };

  const initializeEmptyEngineers = () => {
    const minimumSlots = Math.max(minimumRequired, 2);
    const emptyEngineers = Array(minimumSlots)
      .fill(null)
      .map(() => ({
        engineerId: "",
        name: "",
        role: ENGINEER_ROLES.ASSIGNED,
        notes: "",
      }));
    setSelectedEngineers(emptyEngineers);
  };

  const addEngineer = () => {
    setSelectedEngineers((prev) => [
      ...prev,
      {
        engineerId: "",
        name: "",
        role: ENGINEER_ROLES.ASSIGNED,
        notes: "",
      },
    ]);
  };

  const removeEngineer = (index) => {
    if (selectedEngineers.length > minimumRequired) {
      setSelectedEngineers((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const updateEngineer = (index, field, value) => {
    setSelectedEngineers((prev) =>
      prev.map((eng, i) => (i === index ? { ...eng, [field]: value } : eng))
    );
  };

  const selectEngineerFromDropdown = (index, selectedEngineer) => {
    if (selectedEngineer) {
      updateEngineer(index, "engineerId", selectedEngineer.id);
      updateEngineer(index, "name", selectedEngineer.name);
    } else {
      updateEngineer(index, "engineerId", "");
      updateEngineer(index, "name", "");
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);

    try {
      // Filter out empty engineer slots
      const validEngineers = selectedEngineers.filter((eng) => eng.engineerId);

      console.log("Saving engineers:", validEngineers);

      // Validate minimum engineers
      if (validEngineers.length < minimumRequired) {
        throw new Error(
          `Minimum ${minimumRequired} engineers required. You have selected ${validEngineers.length}.`
        );
      }

      // Check for duplicates
      const engineerIds = validEngineers.map((eng) => eng.engineerId);
      const uniqueIds = new Set(engineerIds);
      if (uniqueIds.size !== engineerIds.length) {
        throw new Error("Duplicate engineer assignments are not allowed");
      }

      // Call the backend API
      const result = await engineerAssignmentService.assignEngineersToMaintenance(
        maintenance.id,
        validEngineers,
        minimumRequired
      );

      console.log("Assignment result:", result);

      // Show success message
      if (result.message) {
        console.log("Success:", result.message);
      }

      // Close dialog and refresh
      onAssignmentComplete && onAssignmentComplete();
      onClose();
    } catch (error) {
      console.error("Error assigning engineers:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getValidationStatus = () => {
    const currentCount = selectedEngineers.filter((eng) => eng.engineerId).length;

    if (currentCount < minimumRequired) {
      return {
        type: "error",
        message: `Need ${minimumRequired - currentCount} more engineer(s)`,
        icon: <ErrorIcon />,
      };
    } else if (currentCount === minimumRequired) {
      return {
        type: "success",
        message: "Minimum requirement met",
        icon: <CheckCircleIcon />,
      };
    } else {
      return {
        type: "info",
        message: `${currentCount - minimumRequired} engineer(s) above minimum`,
        icon: <CheckCircleIcon />,
      };
    }
  };

  const getAvailableEngineersForDropdown = (currentIndex) => {
    const selectedIds = selectedEngineers
      .map((eng, index) => (index !== currentIndex ? eng.engineerId : null))
      .filter(Boolean);

    return allEngineers.filter((eng) => eng.isActive !== false && !selectedIds.includes(eng.id));
  };

  const validationStatus = getValidationStatus();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { minHeight: "600px" },
      }}
    >
      <DialogTitle>
        <MDBox display="flex" alignItems="center" justifyContent="space-between">
          <MDBox>
            <MDTypography variant="h5" fontWeight="medium">
              Assign Engineers to Maintenance
            </MDTypography>
            <MDTypography variant="caption" color="text">
              {maintenance?.contractNumber || "Contract"} -{" "}
              {maintenance?.equipmentModel || "Equipment"}
            </MDTypography>
          </MDBox>
          <Chip
            icon={validationStatus.icon}
            label={validationStatus.message}
            color={validationStatus.type}
            variant="outlined"
          />
        </MDBox>
      </DialogTitle>

      <DialogContent>
        {loading && (
          <MDBox display="flex" justifyContent="center" p={3}>
            <CircularProgress />
            <MDTypography variant="body2" sx={{ ml: 2 }}>
              Loading engineers...
            </MDTypography>
          </MDBox>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            <AlertTitle>Error</AlertTitle>
            {error}
          </Alert>
        )}

        {!loading && (
          <MDBox>
            {/* Maintenance Info */}
            <Card sx={{ mb: 3, bgcolor: "grey.50" }}>
              <CardContent>
                <MDTypography variant="h6" fontWeight="medium" gutterBottom>
                  Maintenance Details
                </MDTypography>
                <MDBox display="flex" flexDirection="column" gap={1}>
                  <MDTypography variant="body2">
                    <strong>Scheduled Date:</strong>{" "}
                    {maintenance?.scheduledDate
                      ? new Date(maintenance.scheduledDate).toLocaleDateString()
                      : "Not set"}
                  </MDTypography>
                  <MDTypography variant="body2">
                    <strong>Type:</strong> {maintenance?.maintenanceType || "Not specified"}
                  </MDTypography>
                  <MDTypography variant="body2">
                    <strong>Status:</strong> {maintenance?.status || "Unknown"}
                  </MDTypography>
                  <MDTypography variant="body2">
                    <strong>Currently Assigned:</strong> {assignedEngineers.length} engineer(s)
                  </MDTypography>
                </MDBox>
              </CardContent>
            </Card>

            {/* Minimum Engineers Setting */}
            <MDBox mb={3}>
              <FormControl size="small" sx={{ minWidth: 200 }}>
                <InputLabel>Minimum Engineers Required</InputLabel>
                <Select
                  value={minimumRequired}
                  label="Minimum Engineers Required"
                  onChange={(e) => {
                    const newMin = e.target.value;
                    setMinimumRequired(newMin);
                    // Ensure we have at least the minimum number of slots
                    if (selectedEngineers.length < newMin) {
                      const additionalSlots = newMin - selectedEngineers.length;
                      const newSlots = Array(additionalSlots)
                        .fill(null)
                        .map(() => ({
                          engineerId: "",
                          name: "",
                          role: ENGINEER_ROLES.ASSIGNED,
                          notes: "",
                        }));
                      setSelectedEngineers((prev) => [...prev, ...newSlots]);
                    }
                  }}
                >
                  {[2, 3, 4, 5, 6].map((num) => (
                    <MenuItem key={num} value={num}>
                      {num} Engineers
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </MDBox>

            {/* Engineer Assignment List */}
            <MDBox>
              <MDBox display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <MDTypography variant="h6" fontWeight="medium">
                  Engineer Assignments
                </MDTypography>
                <MDButton
                  variant="outlined"
                  color="primary"
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={addEngineer}
                >
                  Add Engineer
                </MDButton>
              </MDBox>

              {selectedEngineers.length === 0 ? (
                <Alert severity="warning">
                  <AlertTitle>No Engineers Assigned</AlertTitle>
                  Please add at least {minimumRequired} engineers to this maintenance.
                </Alert>
              ) : (
                selectedEngineers.map((engineer, index) => (
                  <Card key={index} sx={{ mb: 2, border: "1px solid", borderColor: "grey.300" }}>
                    <CardContent>
                      <MDBox display="flex" alignItems="center" gap={2}>
                        <PersonIcon color="primary" />

                        {/* Engineer Selection */}
                        <Autocomplete
                          size="small"
                          sx={{ minWidth: 250 }}
                          options={getAvailableEngineersForDropdown(index)}
                          getOptionLabel={(option) =>
                            `${option.name} ${option.code ? `(${option.code})` : ""}`
                          }
                          value={allEngineers.find((eng) => eng.id === engineer.engineerId) || null}
                          onChange={(event, newValue) =>
                            selectEngineerFromDropdown(index, newValue)
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Select Engineer"
                              placeholder="Choose an engineer"
                              required
                            />
                          )}
                          renderOption={(props, option) => (
                            <Box component="li" {...props}>
                              <Box>
                                <Typography variant="body2" fontWeight="medium">
                                  {option.name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {option.code && `${option.code} - `}
                                  {option.specializations || option.email || "Engineer"}
                                </Typography>
                              </Box>
                            </Box>
                          )}
                        />

                        {/* Role Selection */}
                        <FormControl size="small" sx={{ minWidth: 120 }}>
                          <InputLabel>Role</InputLabel>
                          <Select
                            value={engineer.role}
                            label="Role"
                            onChange={(e) => updateEngineer(index, "role", e.target.value)}
                          >
                            {Object.values(ENGINEER_ROLES).map((role) => (
                              <MenuItem key={role} value={role}>
                                <Chip
                                  label={role}
                                  size="small"
                                  color={ROLE_COLORS[role] || "default"}
                                  variant="outlined"
                                />
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>

                        {/* Remove Button */}
                        <Tooltip
                          title={
                            selectedEngineers.length <= minimumRequired
                              ? `Cannot remove - minimum ${minimumRequired} required`
                              : "Remove Engineer"
                          }
                        >
                          <span>
                            <IconButton
                              color="error"
                              size="small"
                              onClick={() => removeEngineer(index)}
                              disabled={selectedEngineers.length <= minimumRequired}
                            >
                              <RemoveIcon />
                            </IconButton>
                          </span>
                        </Tooltip>
                      </MDBox>

                      {/* Notes Field */}
                      <TextField
                        fullWidth
                        size="small"
                        label="Notes (Optional)"
                        value={engineer.notes}
                        onChange={(e) => updateEngineer(index, "notes", e.target.value)}
                        sx={{ mt: 2 }}
                        placeholder="Any specific notes for this engineer assignment..."
                      />
                    </CardContent>
                  </Card>
                ))
              )}
            </MDBox>

            {/* Available Engineers Info */}
            {allEngineers.length > 0 && (
              <MDBox mt={3}>
                <MDTypography variant="h6" fontWeight="medium" gutterBottom>
                  Available Engineers ({allEngineers.filter((eng) => eng.isActive !== false).length}
                  )
                </MDTypography>
                <MDBox display="flex" flexWrap="wrap" gap={1}>
                  {allEngineers
                    .filter((eng) => eng.isActive !== false)
                    .slice(0, 10)
                    .map((engineer) => (
                      <Chip
                        key={engineer.id}
                        label={`${engineer.name} ${engineer.code ? `(${engineer.code})` : ""}`}
                        size="small"
                        variant="outlined"
                        color="info"
                      />
                    ))}
                  {allEngineers.filter((eng) => eng.isActive !== false).length > 10 && (
                    <Chip
                      label={`+${
                        allEngineers.filter((eng) => eng.isActive !== false).length - 10
                      } more`}
                      size="small"
                      variant="outlined"
                    />
                  )}
                </MDBox>
              </MDBox>
            )}
          </MDBox>
        )}
      </DialogContent>

      <DialogActions>
        <MDBox display="flex" gap={1} p={1}>
          <MDButton variant="outlined" color="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </MDButton>
          <MDButton
            variant="gradient"
            color="primary"
            onClick={handleSave}
            disabled={
              loading || selectedEngineers.filter((eng) => eng.engineerId).length < minimumRequired
            }
          >
            {loading ? "Assigning..." : "Assign Engineers"}
          </MDButton>
        </MDBox>
      </DialogActions>
    </Dialog>
  );
};

// PropTypes validation
EngineerAssignmentDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  maintenance: PropTypes.shape({
    id: PropTypes.string,
    contractNumber: PropTypes.string,
    equipmentModel: PropTypes.string,
    scheduledDate: PropTypes.string,
    maintenanceType: PropTypes.string,
    status: PropTypes.string,
    minimumEngineersRequired: PropTypes.number,
  }),
  onAssignmentComplete: PropTypes.func,
};

// Default props
EngineerAssignmentDialog.defaultProps = {
  maintenance: null,
  onAssignmentComplete: null,
};

export default EngineerAssignmentDialog;
