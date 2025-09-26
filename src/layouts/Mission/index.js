// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

// Data
import missionsTableData from "./data/MissionTableData";
function Missions() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    status: "all",
    priority: "all",
    technician: "all",
    frequency: "all",
  });

  // Get table data
  const { columns, rows } = missionsTableData();

  // Sample statistics for dashboard cards
  const missionStats = {
    total: 24,
    scheduled: 8,
    inProgress: 3,
    completed: 10,
    cancelled: 3,
    overdue: 2,
  };

  const handlePlanMission = () => {
    navigate("/missions/plan");
  };

  const handleFilterChange = (filterType) => (event) => {
    setFilters({
      ...filters,
      [filterType]: event.target.value,
    });
    // In a real application, you would filter the data here
  };

  // Filter options
  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "scheduled", label: "Scheduled" },
    { value: "in-progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
    { value: "overdue", label: "Overdue" },
  ];

  const priorityOptions = [
    { value: "all", label: "All Priorities" },
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
    { value: "critical", label: "Critical" },
  ];

  const technicianOptions = [
    { value: "all", label: "All Technicians" },
    { value: "john-smith", label: "John Smith" },
    { value: "sarah-johnson", label: "Sarah Johnson" },
    { value: "mike-wilson", label: "Mike Wilson" },
  ];

  const frequencyOptions = [
    { value: "all", label: "All Frequencies" },
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" },
    { value: "quarterly", label: "Quarterly" },
    { value: "semi-annually", label: "Semi-annually" },
    { value: "annually", label: "Annually" },
  ];

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          {/* Statistics Cards */}
          <Grid item xs={12}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={2}>
                <Card>
                  <MDBox p={2} textAlign="center">
                    <MDBox display="flex" justifyContent="center" alignItems="center" mb={1}>
                      <Icon fontSize="large" color="info">
                        assignment
                      </Icon>
                    </MDBox>
                    <MDTypography variant="h4" fontWeight="bold" color="info">
                      {missionStats.total}
                    </MDTypography>
                    <MDTypography variant="button" color="text">
                      Total Missions
                    </MDTypography>
                  </MDBox>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={2}>
                <Card>
                  <MDBox p={2} textAlign="center">
                    <MDBox display="flex" justifyContent="center" alignItems="center" mb={1}>
                      <Icon fontSize="large" color="warning">
                        schedule
                      </Icon>
                    </MDBox>
                    <MDTypography variant="h4" fontWeight="bold" color="warning">
                      {missionStats.scheduled}
                    </MDTypography>
                    <MDTypography variant="button" color="text">
                      Scheduled
                    </MDTypography>
                  </MDBox>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={2}>
                <Card>
                  <MDBox p={2} textAlign="center">
                    <MDBox display="flex" justifyContent="center" alignItems="center" mb={1}>
                      <Icon fontSize="large" color="primary">
                        play_circle_filled
                      </Icon>
                    </MDBox>
                    <MDTypography variant="h4" fontWeight="bold" color="primary">
                      {missionStats.inProgress}
                    </MDTypography>
                    <MDTypography variant="button" color="text">
                      In Progress
                    </MDTypography>
                  </MDBox>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={2}>
                <Card>
                  <MDBox p={2} textAlign="center">
                    <MDBox display="flex" justifyContent="center" alignItems="center" mb={1}>
                      <Icon fontSize="large" color="success">
                        check_circle
                      </Icon>
                    </MDBox>
                    <MDTypography variant="h4" fontWeight="bold" color="success">
                      {missionStats.completed}
                    </MDTypography>
                    <MDTypography variant="button" color="text">
                      Completed
                    </MDTypography>
                  </MDBox>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={2}>
                <Card>
                  <MDBox p={2} textAlign="center">
                    <MDBox display="flex" justifyContent="center" alignItems="center" mb={1}>
                      <Icon fontSize="large" color="error">
                        cancel
                      </Icon>
                    </MDBox>
                    <MDTypography variant="h4" fontWeight="bold" color="error">
                      {missionStats.cancelled}
                    </MDTypography>
                    <MDTypography variant="button" color="text">
                      Cancelled
                    </MDTypography>
                  </MDBox>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={2}>
                <Card>
                  <MDBox p={2} textAlign="center">
                    <MDBox display="flex" justifyContent="center" alignItems="center" mb={1}>
                      <Icon fontSize="large" color="error">
                        warning
                      </Icon>
                    </MDBox>
                    <MDTypography variant="h4" fontWeight="bold" color="error">
                      {missionStats.overdue}
                    </MDTypography>
                    <MDTypography variant="button" color="text">
                      Overdue
                    </MDTypography>
                  </MDBox>
                </Card>
              </Grid>
            </Grid>
          </Grid>

          {/* Filters Section */}
          <Grid item xs={12}>
            <Card>
              <MDBox p={3}>
                <MDTypography variant="h6" fontWeight="medium" mb={2}>
                  Filters
                </MDTypography>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={6} md={2.5}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Status</InputLabel>
                      <Select
                        value={filters.status}
                        onChange={handleFilterChange("status")}
                        label="Status"
                      >
                        {statusOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6} md={2.5}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Priority</InputLabel>
                      <Select
                        value={filters.priority}
                        onChange={handleFilterChange("priority")}
                        label="Priority"
                      >
                        {priorityOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6} md={2.5}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Technician</InputLabel>
                      <Select
                        value={filters.technician}
                        onChange={handleFilterChange("technician")}
                        label="Technician"
                      >
                        {technicianOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6} md={2.5}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Frequency</InputLabel>
                      <Select
                        value={filters.frequency}
                        onChange={handleFilterChange("frequency")}
                        label="Frequency"
                      >
                        {frequencyOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={12} md={2}>
                    <MDButton
                      variant="outlined"
                      color="secondary"
                      size="small"
                      fullWidth
                      onClick={() =>
                        setFilters({
                          status: "all",
                          priority: "all",
                          technician: "all",
                          frequency: "all",
                        })
                      }
                    >
                      Clear Filters
                    </MDButton>
                  </Grid>
                </Grid>
              </MDBox>
            </Card>
          </Grid>

          {/* Quick Actions */}
          <Grid item xs={12}>
            <Card>
              <MDBox p={3}>
                <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <MDTypography variant="h6" fontWeight="medium">
                    Quick Actions
                  </MDTypography>
                </MDBox>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={3}>
                    <MDButton
                      variant="gradient"
                      color="info"
                      fullWidth
                      startIcon={<Icon>add_task</Icon>}
                      onClick={handlePlanMission}
                    >
                      Plan New Mission
                    </MDButton>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <MDButton
                      variant="outlined"
                      color="warning"
                      fullWidth
                      startIcon={<Icon>schedule</Icon>}
                    >
                      View Schedule
                    </MDButton>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <MDButton
                      variant="outlined"
                      color="success"
                      fullWidth
                      startIcon={<Icon>assessment</Icon>}
                    >
                      Generate Report
                    </MDButton>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <MDButton
                      variant="outlined"
                      color="secondary"
                      fullWidth
                      startIcon={<Icon>people</Icon>}
                    >
                      Technician Status
                    </MDButton>
                  </Grid>
                </Grid>
              </MDBox>
            </Card>
          </Grid>

          {/* Missions Table */}
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
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <MDBox display="flex" alignItems="center">
                  <Icon sx={{ color: "white", mr: 1 }}>assignment</Icon>
                  <MDTypography variant="h6" color="white">
                    Missions Management
                  </MDTypography>
                </MDBox>
                <MDButton
                  variant="gradient"
                  color="light"
                  size="small"
                  onClick={handlePlanMission}
                  startIcon={<Icon>add_task</Icon>}
                >
                  Plan Mission
                </MDButton>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns, rows }}
                  isSorted={true}
                  entriesPerPage={{ defaultValue: 10, entries: [5, 10, 15, 20, 25] }}
                  showTotalEntries={true}
                  noEndBorder
                  canSearch={true}
                />
              </MDBox>
            </Card>
          </Grid>

          {/* Recent Activity */}
          <Grid item xs={12} lg={6}>
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
                  Recent Completions
                </MDTypography>
              </MDBox>
              <MDBox pt={3} px={2}>
                {[
                  {
                    mission: "Fire Alarm Monthly Check",
                    technician: "John Smith",
                    date: "Dec 10, 2024",
                    client: "ABC Company",
                  },
                  {
                    mission: "Sprinkler System Inspection",
                    technician: "Sarah Johnson",
                    date: "Dec 09, 2024",
                    client: "XYZ Corp",
                  },
                  {
                    mission: "Emergency Lighting Test",
                    technician: "Mike Wilson",
                    date: "Dec 08, 2024",
                    client: "DEF Industries",
                  },
                ].map((activity, index) => (
                  <MDBox key={index} mb={2} pb={1}>
                    <MDBox display="flex" alignItems="center" mb={1}>
                      <Icon color="success" sx={{ mr: 1 }}>
                        check_circle
                      </Icon>
                      <MDTypography variant="button" fontWeight="medium">
                        {activity.mission}
                      </MDTypography>
                    </MDBox>
                    <MDTypography variant="caption" color="text">
                      Completed by {activity.technician} on {activity.date}
                    </MDTypography>
                    <MDTypography variant="caption" color="text" display="block">
                      Client: {activity.client}
                    </MDTypography>
                    {index < 2 && <Box sx={{ borderBottom: 1, borderColor: "divider", mt: 1 }} />}
                  </MDBox>
                ))}
              </MDBox>
            </Card>
          </Grid>

          {/* Upcoming Missions */}
          <Grid item xs={12} lg={6}>
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
                  Upcoming This Week
                </MDTypography>
              </MDBox>
              <MDBox pt={3} px={2}>
                {[
                  {
                    mission: "Quarterly Safety Audit",
                    technician: "Mike Wilson",
                    date: "Dec 18, 2024",
                    time: "08:00 AM",
                    priority: "High",
                  },
                  {
                    mission: "HVAC Maintenance Check",
                    technician: "Sarah Johnson",
                    date: "Dec 19, 2024",
                    time: "10:00 AM",
                    priority: "Medium",
                  },
                  {
                    mission: "Fire System Follow-up",
                    technician: "John Smith",
                    date: "Dec 20, 2024",
                    time: "09:00 AM",
                    priority: "Low",
                  },
                ].map((upcoming, index) => (
                  <MDBox key={index} mb={2} pb={1}>
                    <MDBox display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                      <MDBox display="flex" alignItems="center">
                        <Icon color="warning" sx={{ mr: 1 }}>
                          schedule
                        </Icon>
                        <MDTypography variant="button" fontWeight="medium">
                          {upcoming.mission}
                        </MDTypography>
                      </MDBox>
                      <Chip
                        label={upcoming.priority}
                        size="small"
                        color={
                          upcoming.priority === "High"
                            ? "error"
                            : upcoming.priority === "Medium"
                            ? "warning"
                            : "success"
                        }
                      />
                    </MDBox>
                    <MDTypography variant="caption" color="text">
                      {upcoming.technician} • {upcoming.date} at {upcoming.time}
                    </MDTypography>
                    {index < 2 && <Box sx={{ borderBottom: 1, borderColor: "divider", mt: 1 }} />}
                  </MDBox>
                ))}
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default Missions;
