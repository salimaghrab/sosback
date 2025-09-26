// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Icon from "@mui/material/Icon";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import Divider from "@mui/material/Divider";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

function MissionPlanning() {
  const navigate = useNavigate();

  const [missionData, setMissionData] = useState({
    // Mission basic info
    missionName: "",
    technicianId: "",
    technicianName: "",
    projectId: "",
    clientName: "",
    location: "",
    scheduledDate: "",
    scheduledTime: "",
    estimatedDuration: "",

    // Mission details
    systemGroups: [],
    frequency: "",
    missionType: "routine", // routine, emergency, follow-up
    priority: "medium", // low, medium, high, critical

    // Checklist items - will be populated based on selected systems
    checklist: {},

    // Additional info
    notes: "",
    requiredTools: [],
    safetyRequirements: [],
  });

  const [errors, setErrors] = useState({});

  // Sample projects data (in real app, this would come from API)
  const projects = [
    {
      id: "proj-1",
      name: "Downtown Office Building",
      client: "ABC Company",
      location: "123 Main St, Downtown",
      systems: ["Fire Alarm", "Sprinkler", "Emergency Lighting"],
    },
    {
      id: "proj-2",
      name: "Shopping Mall Complex",
      client: "XYZ Corporation",
      location: "456 Mall Ave, Shopping District",
      systems: ["Ventilation", "Fire Alarm", "Dry Chemical"],
    },
    {
      id: "proj-3",
      name: "Industrial Warehouse",
      client: "DEF Industries",
      location: "789 Industrial Blvd",
      systems: ["Sprinkler", "Central Battery", "Ventilation"],
    },
  ];

  // Sample technicians
  const technicians = [
    { id: "tech-1", name: "John Smith", specialties: ["Fire Alarm", "Sprinkler"] },
    { id: "tech-2", name: "Sarah Johnson", specialties: ["Ventilation", "Emergency Lighting"] },
    { id: "tech-3", name: "Mike Wilson", specialties: ["Dry Chemical", "Central Battery"] },
  ];

  const frequencyOptions = ["Monthly", "Quarterly", "Semi-annually", "Annually"];
  const missionTypeOptions = [
    { value: "routine", label: "Routine Inspection" },
    { value: "maintenance", label: "Maintenance" },
    { value: "emergency", label: "Emergency Check" },
    { value: "follow-up", label: "Follow-up Inspection" },
    { value: "installation", label: "Installation Check" },
  ];

  const priorityOptions = [
    { value: "low", label: "Low", color: "success" },
    { value: "medium", label: "Medium", color: "info" },
    { value: "high", label: "High", color: "warning" },
    { value: "critical", label: "Critical", color: "error" },
  ];

  // System-specific checklists
  const systemChecklists = {
    "Fire Alarm": [
      "Check control panel functionality",
      "Test smoke detectors",
      "Verify alarm sounders",
      "Check battery backup",
      "Test manual call points",
      "Verify zone indications",
      "Check wiring connections",
      "Test communication links",
    ],
    Sprinkler: [
      "Check water pressure",
      "Inspect sprinkler heads",
      "Test valve operations",
      "Check pump functionality",
      "Verify water flow alarms",
      "Inspect pipes for leaks",
      "Test pressure switches",
      "Check tank water levels",
    ],
    Ventilation: [
      "Check fan operations",
      "Inspect ductwork",
      "Test control systems",
      "Verify airflow rates",
      "Check filter conditions",
      "Test emergency controls",
      "Inspect dampers",
      "Check motor conditions",
    ],
    "Emergency Lighting": [
      "Test emergency lights",
      "Check battery backup",
      "Verify duration test",
      "Inspect exit signs",
      "Check charging systems",
      "Test manual switches",
      "Verify illumination levels",
      "Check wiring integrity",
    ],
    "Dry Chemical": [
      "Check cylinder pressure",
      "Inspect discharge nozzles",
      "Test detection system",
      "Verify manual releases",
      "Check piping integrity",
      "Test control panel",
      "Inspect agent storage",
      "Verify system weights",
    ],
    "Central Battery": [
      "Test battery capacity",
      "Check charging system",
      "Verify circuit integrity",
      "Test emergency switching",
      "Check load distribution",
      "Inspect battery terminals",
      "Test monitoring system",
      "Verify backup duration",
    ],
  };

  const requiredToolsOptions = [
    "Multimeter",
    "Pressure Gauge",
    "Flow Meter",
    "Smoke Tester",
    "Battery Tester",
    "Torque Wrench",
    "Oscilloscope",
    "Insulation Tester",
    "Ladder",
    "Safety Harness",
    "Hard Hat",
    "Safety Glasses",
  ];

  const safetyRequirementsOptions = [
    "Hard Hat Required",
    "Safety Glasses Required",
    "Steel Toe Boots",
    "High Visibility Vest",
    "Fall Protection",
    "Confined Space Entry",
    "Hot Work Permit",
    "Lock Out Tag Out",
    "Gas Detection Required",
  ];

  const handleInputChange = (field) => (event) => {
    const value = event.target.value;

    if (field === "projectId") {
      const selectedProject = projects.find((p) => p.id === value);
      if (selectedProject) {
        setMissionData({
          ...missionData,
          [field]: value,
          clientName: selectedProject.client,
          location: selectedProject.location,
          systemGroups: [],
          checklist: {},
        });
      }
    } else if (field === "technicianId") {
      const selectedTechnician = technicians.find((t) => t.id === value);
      if (selectedTechnician) {
        setMissionData({
          ...missionData,
          [field]: value,
          technicianName: selectedTechnician.name,
        });
      }
    } else {
      setMissionData({
        ...missionData,
        [field]: value,
      });
    }

    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: "",
      });
    }
  };

  const handleSystemGroupsChange = (event) => {
    const value = event.target.value;
    const selectedSystems = typeof value === "string" ? value.split(",") : value;

    // Generate checklist based on selected systems
    const newChecklist = {};
    selectedSystems.forEach((system) => {
      if (systemChecklists[system]) {
        newChecklist[system] = systemChecklists[system].map((item) => ({
          task: item,
          completed: false,
          notes: "",
        }));
      }
    });

    setMissionData({
      ...missionData,
      systemGroups: selectedSystems,
      checklist: newChecklist,
    });
  };

  const handleChecklistChange = (system, taskIndex, field, value) => {
    const updatedChecklist = { ...missionData.checklist };
    updatedChecklist[system][taskIndex][field] = value;

    setMissionData({
      ...missionData,
      checklist: updatedChecklist,
    });
  };

  const handleArrayFieldChange = (field) => (event) => {
    const value = event.target.value;
    setMissionData({
      ...missionData,
      [field]: typeof value === "string" ? value.split(",") : value,
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!missionData.missionName.trim()) {
      newErrors.missionName = "Mission name is required";
    }
    if (!missionData.technicianId) {
      newErrors.technicianId = "Technician must be selected";
    }
    if (!missionData.projectId) {
      newErrors.projectId = "Project must be selected";
    }
    if (!missionData.scheduledDate) {
      newErrors.scheduledDate = "Scheduled date is required";
    }
    if (!missionData.frequency) {
      newErrors.frequency = "Frequency must be selected";
    }
    if (missionData.systemGroups.length === 0) {
      newErrors.systemGroups = "At least one system group must be selected";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (validateForm()) {
      console.log("Mission planned:", missionData);
      // Here you would typically save to database
      navigate("/missions"); // Navigate to missions list
    }
  };

  const handleCancel = () => {
    navigate("/missions");
  };

  const selectedProject = projects.find((p) => p.id === missionData.projectId);
  const availableSystems = selectedProject ? selectedProject.systems : [];

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6} justifyContent="center">
          <Grid item xs={12} lg={11}>
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
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <MDBox display="flex" alignItems="center">
                  <Icon sx={{ color: "white", mr: 1 }}>schedule</Icon>
                  <MDTypography variant="h6" color="white">
                    Plan Technician Mission
                  </MDTypography>
                </MDBox>
                <MDButton
                  variant="gradient"
                  color="light"
                  size="small"
                  onClick={handleCancel}
                  startIcon={<Icon>arrow_back</Icon>}
                >
                  Back to Missions
                </MDButton>
              </MDBox>

              <MDBox pt={4} pb={3} px={3}>
                <form onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
                    {/* Mission Basic Information */}
                    <Grid item xs={12}>
                      <MDTypography variant="h5" fontWeight="medium" mb={3}>
                        Mission Information
                      </MDTypography>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <MDInput
                        type="text"
                        label="Mission Name"
                        value={missionData.missionName}
                        onChange={handleInputChange("missionName")}
                        fullWidth
                        error={!!errors.missionName}
                        helperText={errors.missionName}
                        required
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth error={!!errors.technicianId}>
                        <InputLabel>Assign Technician</InputLabel>
                        <Select
                          value={missionData.technicianId}
                          onChange={handleInputChange("technicianId")}
                          label="Assign Technician"
                          required
                        >
                          {technicians.map((tech) => (
                            <MenuItem key={tech.id} value={tech.id}>
                              <Box>
                                <MDTypography variant="button" fontWeight="medium">
                                  {tech.name}
                                </MDTypography>
                                <MDTypography variant="caption" color="text" display="block">
                                  Specialties: {tech.specialties.join(", ")}
                                </MDTypography>
                              </Box>
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.technicianId && (
                          <MDTypography variant="caption" color="error" sx={{ mt: 0.5 }}>
                            {errors.technicianId}
                          </MDTypography>
                        )}
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth error={!!errors.projectId}>
                        <InputLabel>Select Project</InputLabel>
                        <Select
                          value={missionData.projectId}
                          onChange={handleInputChange("projectId")}
                          label="Select Project"
                          required
                        >
                          {projects.map((project) => (
                            <MenuItem key={project.id} value={project.id}>
                              <Box>
                                <MDTypography variant="button" fontWeight="medium">
                                  {project.name}
                                </MDTypography>
                                <MDTypography variant="caption" color="text" display="block">
                                  Client: {project.client} | Location: {project.location}
                                </MDTypography>
                              </Box>
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.projectId && (
                          <MDTypography variant="caption" color="error" sx={{ mt: 0.5 }}>
                            {errors.projectId}
                          </MDTypography>
                        )}
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <InputLabel>Mission Type</InputLabel>
                        <Select
                          value={missionData.missionType}
                          onChange={handleInputChange("missionType")}
                          label="Mission Type"
                        >
                          {missionTypeOptions.map((type) => (
                            <MenuItem key={type.value} value={type.value}>
                              {type.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    {/* Project Details (Auto-filled) */}
                    {selectedProject && (
                      <>
                        <Grid item xs={12}>
                          <Divider sx={{ my: 2 }} />
                          <MDTypography variant="h6" fontWeight="medium" mb={2}>
                            Project Details
                          </MDTypography>
                        </Grid>

                        <Grid item xs={12} md={4}>
                          <MDInput
                            type="text"
                            label="Client Name"
                            value={missionData.clientName}
                            fullWidth
                            disabled
                          />
                        </Grid>

                        <Grid item xs={12} md={8}>
                          <MDInput
                            type="text"
                            label="Location"
                            value={missionData.location}
                            fullWidth
                            disabled
                          />
                        </Grid>
                      </>
                    )}

                    {/* Scheduling */}
                    <Grid item xs={12}>
                      <Divider sx={{ my: 2 }} />
                      <MDTypography variant="h5" fontWeight="medium" mb={3}>
                        Scheduling
                      </MDTypography>
                    </Grid>

                    <Grid item xs={12} md={3}>
                      <MDInput
                        type="date"
                        label="Scheduled Date"
                        value={missionData.scheduledDate}
                        onChange={handleInputChange("scheduledDate")}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        error={!!errors.scheduledDate}
                        helperText={errors.scheduledDate}
                        required
                      />
                    </Grid>

                    <Grid item xs={12} md={3}>
                      <MDInput
                        type="time"
                        label="Scheduled Time"
                        value={missionData.scheduledTime}
                        onChange={handleInputChange("scheduledTime")}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>

                    <Grid item xs={12} md={3}>
                      <FormControl fullWidth error={!!errors.frequency}>
                        <InputLabel>Frequency</InputLabel>
                        <Select
                          value={missionData.frequency}
                          onChange={handleInputChange("frequency")}
                          label="Frequency"
                          required
                        >
                          {frequencyOptions.map((freq) => (
                            <MenuItem key={freq} value={freq}>
                              {freq}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.frequency && (
                          <MDTypography variant="caption" color="error" sx={{ mt: 0.5 }}>
                            {errors.frequency}
                          </MDTypography>
                        )}
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} md={3}>
                      <FormControl fullWidth>
                        <InputLabel>Priority</InputLabel>
                        <Select
                          value={missionData.priority}
                          onChange={handleInputChange("priority")}
                          label="Priority"
                        >
                          {priorityOptions.map((priority) => (
                            <MenuItem key={priority.value} value={priority.value}>
                              <Chip
                                label={priority.label}
                                color={priority.color}
                                size="small"
                                variant="outlined"
                              />
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <MDInput
                        type="number"
                        label="Estimated Duration (hours)"
                        value={missionData.estimatedDuration}
                        onChange={handleInputChange("estimatedDuration")}
                        fullWidth
                        inputProps={{ min: 0.5, step: 0.5 }}
                      />
                    </Grid>

                    {/* System Groups Selection */}
                    {availableSystems.length > 0 && (
                      <>
                        <Grid item xs={12}>
                          <Divider sx={{ my: 2 }} />
                          <MDTypography variant="h5" fontWeight="medium" mb={3}>
                            System Groups to Check
                          </MDTypography>
                        </Grid>

                        <Grid item xs={12}>
                          <FormControl fullWidth error={!!errors.systemGroups}>
                            <InputLabel>Select System Groups</InputLabel>
                            <Select
                              multiple
                              value={missionData.systemGroups}
                              onChange={handleSystemGroupsChange}
                              label="Select System Groups"
                              renderValue={(selected) => (
                                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                                  {selected.map((value) => (
                                    <Chip key={value} label={value} size="small" />
                                  ))}
                                </Box>
                              )}
                            >
                              {availableSystems.map((system) => (
                                <MenuItem key={system} value={system}>
                                  {system}
                                </MenuItem>
                              ))}
                            </Select>
                            {errors.systemGroups && (
                              <MDTypography variant="caption" color="error" sx={{ mt: 0.5 }}>
                                {errors.systemGroups}
                              </MDTypography>
                            )}
                          </FormControl>
                        </Grid>
                      </>
                    )}

                    {/* Checklist Section */}
                    {Object.keys(missionData.checklist).length > 0 && (
                      <>
                        <Grid item xs={12}>
                          <Divider sx={{ my: 2 }} />
                          <MDTypography variant="h5" fontWeight="medium" mb={3}>
                            Mission Checklist
                          </MDTypography>
                        </Grid>

                        {Object.entries(missionData.checklist).map(([system, tasks]) => (
                          <Grid item xs={12} key={system}>
                            <Card variant="outlined" sx={{ mb: 2 }}>
                              <MDBox p={3}>
                                <MDTypography variant="h6" fontWeight="medium" mb={2}>
                                  {system} System Checks
                                </MDTypography>
                                <FormGroup>
                                  {tasks.map((task, index) => (
                                    <Box key={index} sx={{ mb: 2 }}>
                                      <FormControlLabel
                                        control={
                                          <Checkbox
                                            checked={task.completed}
                                            onChange={(e) =>
                                              handleChecklistChange(
                                                system,
                                                index,
                                                "completed",
                                                e.target.checked
                                              )
                                            }
                                          />
                                        }
                                        label={task.task}
                                      />
                                      <MDInput
                                        type="text"
                                        label="Notes (optional)"
                                        value={task.notes}
                                        onChange={(e) =>
                                          handleChecklistChange(
                                            system,
                                            index,
                                            "notes",
                                            e.target.value
                                          )
                                        }
                                        fullWidth
                                        size="small"
                                        sx={{ mt: 1, ml: 4 }}
                                      />
                                    </Box>
                                  ))}
                                </FormGroup>
                              </MDBox>
                            </Card>
                          </Grid>
                        ))}
                      </>
                    )}

                    {/* Required Tools and Safety */}
                    <Grid item xs={12}>
                      <Divider sx={{ my: 2 }} />
                      <MDTypography variant="h5" fontWeight="medium" mb={3}>
                        Requirements
                      </MDTypography>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <InputLabel>Required Tools</InputLabel>
                        <Select
                          multiple
                          value={missionData.requiredTools}
                          onChange={handleArrayFieldChange("requiredTools")}
                          label="Required Tools"
                          renderValue={(selected) => (
                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                              {selected.map((value) => (
                                <Chip key={value} label={value} size="small" />
                              ))}
                            </Box>
                          )}
                        >
                          {requiredToolsOptions.map((tool) => (
                            <MenuItem key={tool} value={tool}>
                              {tool}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <InputLabel>Safety Requirements</InputLabel>
                        <Select
                          multiple
                          value={missionData.safetyRequirements}
                          onChange={handleArrayFieldChange("safetyRequirements")}
                          label="Safety Requirements"
                          renderValue={(selected) => (
                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                              {selected.map((value) => (
                                <Chip key={value} label={value} size="small" color="warning" />
                              ))}
                            </Box>
                          )}
                        >
                          {safetyRequirementsOptions.map((requirement) => (
                            <MenuItem key={requirement} value={requirement}>
                              {requirement}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    {/* Additional Notes */}
                    <Grid item xs={12}>
                      <MDInput
                        multiline
                        rows={3}
                        label="Additional Notes"
                        value={missionData.notes}
                        onChange={handleInputChange("notes")}
                        fullWidth
                        placeholder="Any special instructions or notes for the technician..."
                      />
                    </Grid>

                    {/* Action Buttons */}
                    <Grid item xs={12}>
                      <MDBox display="flex" justifyContent="flex-end" mt={4} gap={2}>
                        <MDButton
                          variant="outlined"
                          color="secondary"
                          onClick={handleCancel}
                          startIcon={<Icon>cancel</Icon>}
                        >
                          Cancel
                        </MDButton>
                        <MDButton
                          variant="gradient"
                          color="info"
                          type="submit"
                          startIcon={<Icon>schedule</Icon>}
                        >
                          Plan Mission
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
      <Footer />
    </DashboardLayout>
  );
}

export default MissionPlanning;
