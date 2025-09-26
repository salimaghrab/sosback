/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

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

function AddProject() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    // Project basic info
    name: "",
    location: "",
    systems: [],
    status: "active",

    // Client info
    clientName: "",
    clientPhone: "",
    clientLocation: "",

    // Inspection Report
    inspectionDate: "",
    technicianName: "",
    technicianPhone: "",
    frequency: "",
    noOfVisit: 1,

    // System classes as select options
    fireAlarmSystem: "",
    sprinklerSystem: "",
    ventilationSystem: "",
    dryChemicalSystem: "",
    centralBatterySystem: "",
    fanControlPanel: "",
    fan: "",
    cylinder: "",
  });

  const [errors, setErrors] = useState({});

  // System types for selection
  const systemTypes = ["Fire Alarm", "Sprinkler", "Ventilation", "Dry Chemical", "Central Battery"];

  const statusOptions = [
    { value: "active", label: "Active" },
    { value: "maintenance", label: "Maintenance" },
    { value: "completed", label: "Completed" },
    { value: "inactive", label: "Inactive" },
  ];

  const frequencyOptions = ["Weekly", "Monthly", "Quarterly", "Semi-annually", "Annually"];

  // Fire Alarm System options
  const fireAlarmOptions = [
    "Conventional Fire Alarm Panel",
    "Addressable Fire Alarm Panel",
    "Wireless Fire Alarm System",
    "Voice Evacuation System",
    "Fire Detection and Alarm System",
  ];

  // Sprinkler System options
  const sprinklerOptions = [
    "Wet Pipe Sprinkler System",
    "Dry Pipe Sprinkler System",
    "Pre-action Sprinkler System",
    "Deluge Sprinkler System",
    "Water Mist System",
  ];

  // Ventilation System options
  const ventilationOptions = [
    "Natural Ventilation System",
    "Mechanical Ventilation System",
    "Smoke Exhaust System",
    "Pressurization System",
    "HVAC System",
  ];

  // Dry Chemical System options
  const dryChemicalOptions = [
    "ABC Dry Chemical System",
    "BC Dry Chemical System",
    "Purple K Dry Chemical System",
    "Class D Dry Chemical System",
    "Clean Agent System",
  ];

  // Central Battery System options
  const centralBatteryOptions = [
    "Central Battery Emergency Lighting",
    "Self-contained Emergency Lighting",
    "Maintained Emergency Lighting",
    "Non-maintained Emergency Lighting",
    "Sustained Emergency Lighting",
  ];

  // Fan Control Panel options
  const fanControlPanelOptions = [
    "Manual Fan Control Panel",
    "Automatic Fan Control Panel",
    "Fire-linked Fan Control Panel",
    "Variable Speed Fan Control",
    "Zone-based Fan Control Panel",
  ];

  // Fan options
  const fanOptions = ["Centrifugal Fan", "Axial Fan", "Mixed Flow Fan", "Jet Fan", "Roof Fan"];

  // Cylinder options
  const cylinderOptions = [
    "CO2 Cylinder",
    "Dry Chemical Cylinder",
    "Clean Agent Cylinder",
    "Water Mist Cylinder",
    "Foam Cylinder",
  ];

  const handleInputChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });

    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: "",
      });
    }
  };

  const handleSystemsChange = (event) => {
    const value = event.target.value;
    setFormData({
      ...formData,
      systems: typeof value === "string" ? value.split(",") : value,
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Project name is required";
    }
    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }
    if (!formData.clientName.trim()) {
      newErrors.clientName = "Client name is required";
    }
    if (!formData.clientPhone.trim()) {
      newErrors.clientPhone = "Client phone is required";
    }
    if (!formData.technicianName.trim()) {
      newErrors.technicianName = "Technician name is required";
    }
    if (formData.systems.length === 0) {
      newErrors.systems = "At least one system must be selected";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (validateForm()) {
      console.log("Project submitted:", formData);
      navigate("/projects");
    }
  };

  const handleCancel = () => {
    navigate("/projects");
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6} justifyContent="center">
          <Grid item xs={12} lg={10}>
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
                  <Icon sx={{ color: "white", mr: 1 }}>business</Icon>
                  <MDTypography variant="h6" color="white">
                    Add New Project
                  </MDTypography>
                </MDBox>
                <MDButton
                  variant="gradient"
                  color="light"
                  size="small"
                  onClick={handleCancel}
                  startIcon={<Icon>arrow_back</Icon>}
                >
                  Back to Projects
                </MDButton>
              </MDBox>

              <MDBox pt={4} pb={3} px={3}>
                <form onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
                    {/* Project Basic Information */}
                    <Grid item xs={12}>
                      <MDTypography variant="h5" fontWeight="medium" mb={3}>
                        Project Information
                      </MDTypography>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <MDInput
                        type="text"
                        label="Project Name"
                        value={formData.name}
                        onChange={handleInputChange("name")}
                        fullWidth
                        error={!!errors.name}
                        helperText={errors.name}
                        required
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <MDInput
                        type="text"
                        label="Location"
                        value={formData.location}
                        onChange={handleInputChange("location")}
                        fullWidth
                        error={!!errors.location}
                        helperText={errors.location}
                        required
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth error={!!errors.systems}>
                        <InputLabel>Systems</InputLabel>
                        <Select
                          multiple
                          value={formData.systems}
                          onChange={handleSystemsChange}
                          label="Systems"
                          renderValue={(selected) => (
                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                              {selected.map((value) => (
                                <Chip key={value} label={value} size="small" />
                              ))}
                            </Box>
                          )}
                        >
                          {systemTypes.map((system) => (
                            <MenuItem key={system} value={system}>
                              {system}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.systems && (
                          <MDTypography variant="caption" color="error" sx={{ mt: 0.5 }}>
                            {errors.systems}
                          </MDTypography>
                        )}
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <InputLabel>Status</InputLabel>
                        <Select
                          value={formData.status}
                          onChange={handleInputChange("status")}
                          label="Status"
                        >
                          {statusOptions.map((status) => (
                            <MenuItem key={status.value} value={status.value}>
                              {status.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    {/* Client Information */}
                    <Grid item xs={12}>
                      <MDTypography variant="h5" fontWeight="medium" mb={3} mt={4}>
                        Client Information
                      </MDTypography>
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <MDInput
                        type="text"
                        label="Client Name"
                        value={formData.clientName}
                        onChange={handleInputChange("clientName")}
                        fullWidth
                        error={!!errors.clientName}
                        helperText={errors.clientName}
                        required
                      />
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <MDInput
                        type="tel"
                        label="Client Phone"
                        value={formData.clientPhone}
                        onChange={handleInputChange("clientPhone")}
                        fullWidth
                        error={!!errors.clientPhone}
                        helperText={errors.clientPhone}
                        required
                      />
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <MDInput
                        type="text"
                        label="Client Location"
                        value={formData.clientLocation}
                        onChange={handleInputChange("clientLocation")}
                        fullWidth
                      />
                    </Grid>

                    {/* Inspection Information */}
                    <Grid item xs={12}>
                      <MDTypography variant="h5" fontWeight="medium" mb={3} mt={4}>
                        Inspection Information
                      </MDTypography>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <MDInput
                        type="date"
                        label="Inspection Date"
                        value={formData.inspectionDate}
                        onChange={handleInputChange("inspectionDate")}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <InputLabel>Frequency</InputLabel>
                        <Select
                          value={formData.frequency}
                          onChange={handleInputChange("frequency")}
                          label="Frequency"
                        >
                          {frequencyOptions.map((freq) => (
                            <MenuItem key={freq} value={freq}>
                              {freq}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <MDInput
                        type="text"
                        label="Technician Name"
                        value={formData.technicianName}
                        onChange={handleInputChange("technicianName")}
                        fullWidth
                        error={!!errors.technicianName}
                        helperText={errors.technicianName}
                        required
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <MDInput
                        type="tel"
                        label="Technician Phone"
                        value={formData.technicianPhone}
                        onChange={handleInputChange("technicianPhone")}
                        fullWidth
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <MDInput
                        type="number"
                        label="Number of Visits"
                        value={formData.noOfVisit}
                        onChange={handleInputChange("noOfVisit")}
                        fullWidth
                        inputProps={{ min: 1 }}
                      />
                    </Grid>

                    {/* System Class Selections */}
                    <Grid item xs={12}>
                      <MDTypography variant="h5" fontWeight="medium" mb={3} mt={4}>
                        System Classes Configuration
                      </MDTypography>
                    </Grid>

                    {/* Show system class dropdowns based on selected systems */}
                    {formData.systems.includes("Fire Alarm") && (
                      <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                          <InputLabel>Fire Alarm System Type</InputLabel>
                          <Select
                            value={formData.fireAlarmSystem}
                            onChange={handleInputChange("fireAlarmSystem")}
                            label="Fire Alarm System Type"
                          >
                            {fireAlarmOptions.map((option) => (
                              <MenuItem key={option} value={option}>
                                {option}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                    )}

                    {formData.systems.includes("Sprinkler") && (
                      <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                          <InputLabel>Sprinkler System Type</InputLabel>
                          <Select
                            value={formData.sprinklerSystem}
                            onChange={handleInputChange("sprinklerSystem")}
                            label="Sprinkler System Type"
                          >
                            {sprinklerOptions.map((option) => (
                              <MenuItem key={option} value={option}>
                                {option}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                    )}

                    {formData.systems.includes("Ventilation") && (
                      <>
                        <Grid item xs={12} md={6}>
                          <FormControl fullWidth>
                            <InputLabel>Ventilation System Type</InputLabel>
                            <Select
                              value={formData.ventilationSystem}
                              onChange={handleInputChange("ventilationSystem")}
                              label="Ventilation System Type"
                            >
                              {ventilationOptions.map((option) => (
                                <MenuItem key={option} value={option}>
                                  {option}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <FormControl fullWidth>
                            <InputLabel>Fan Control Panel Type</InputLabel>
                            <Select
                              value={formData.fanControlPanel}
                              onChange={handleInputChange("fanControlPanel")}
                              label="Fan Control Panel Type"
                            >
                              {fanControlPanelOptions.map((option) => (
                                <MenuItem key={option} value={option}>
                                  {option}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <FormControl fullWidth>
                            <InputLabel>Fan Type</InputLabel>
                            <Select
                              value={formData.fan}
                              onChange={handleInputChange("fan")}
                              label="Fan Type"
                            >
                              {fanOptions.map((option) => (
                                <MenuItem key={option} value={option}>
                                  {option}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                      </>
                    )}

                    {formData.systems.includes("Dry Chemical") && (
                      <>
                        <Grid item xs={12} md={6}>
                          <FormControl fullWidth>
                            <InputLabel>Dry Chemical System Type</InputLabel>
                            <Select
                              value={formData.dryChemicalSystem}
                              onChange={handleInputChange("dryChemicalSystem")}
                              label="Dry Chemical System Type"
                            >
                              {dryChemicalOptions.map((option) => (
                                <MenuItem key={option} value={option}>
                                  {option}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <FormControl fullWidth>
                            <InputLabel>Cylinder Type</InputLabel>
                            <Select
                              value={formData.cylinder}
                              onChange={handleInputChange("cylinder")}
                              label="Cylinder Type"
                            >
                              {cylinderOptions.map((option) => (
                                <MenuItem key={option} value={option}>
                                  {option}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                      </>
                    )}

                    {formData.systems.includes("Central Battery") && (
                      <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                          <InputLabel>Central Battery System Type</InputLabel>
                          <Select
                            value={formData.centralBatterySystem}
                            onChange={handleInputChange("centralBatterySystem")}
                            label="Central Battery System Type"
                          >
                            {centralBatteryOptions.map((option) => (
                              <MenuItem key={option} value={option}>
                                {option}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                    )}

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
                          startIcon={<Icon>save</Icon>}
                        >
                          Add Project
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

export default AddProject;
