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
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

// Services
import {
  fetchAllMaintenances,
  fetchAllSites,
  handleMaintenanceError,
} from "layouts/Maintenance/service/maintenanceService";

// Create utility functions locally since they don't exist in the service
const utils = {
  formatDate(dateString) {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US");
  },

  formatDateTime(dateString) {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("en-US");
  },

  daysUntil(dateString) {
    if (!dateString) return null;
    const targetDate = new Date(dateString);
    const today = new Date();
    const diffTime = targetDate - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  },

  isOverdue(scheduledDate, status) {
    if (status === "Completed" || !scheduledDate) return false;
    return new Date(scheduledDate) < new Date();
  },

  getStatusColor(status) {
    const statusColors = {
      Scheduled: "info",
      InProgress: "warning",
      Completed: "success",
      Cancelled: "secondary",
      Overdue: "error",
      Active: "success",
      Expired: "error",
      Pending: "warning",
    };
    return statusColors[status] || "info";
  },
};

// Engineer roles constants
const ENGINEER_ROLES = {
  PRIMARY: "Primary",
  SECONDARY: "Secondary",
  SUPERVISOR: "Supervisor",
  ASSIGNED: "Assigned",
};

const ROLE_COLORS = {
  [ENGINEER_ROLES.PRIMARY]: "primary",
  [ENGINEER_ROLES.SECONDARY]: "info",
  [ENGINEER_ROLES.SUPERVISOR]: "warning",
  [ENGINEER_ROLES.ASSIGNED]: "secondary",
};

// Mock engineer service since it doesn't exist in your service file
const engineerService = {
  async fetchAll() {
    // Return mock engineers for now - you'll need to implement this in your actual service
    return [
      { id: 1, name: "John Smith", isActive: true, email: "john@example.com" },
      { id: 2, name: "Sarah Johnson", isActive: true, email: "sarah@example.com" },
      { id: 3, name: "Mike Wilson", isActive: true, email: "mike@example.com" },
      { id: 4, name: "Ahmed Al-Rashid", isActive: true, email: "ahmed@example.com" },
    ];
  },
};

// Mock engineer assignment service
const engineerAssignmentService = {
  async getAssignedEngineers(maintenanceId) {
    // Mock implementation - replace with actual API call
    return [];
  },

  async getAvailableEngineers(maintenanceDate) {
    return await engineerService.fetchAll();
  },

  async assignEngineersToMaintenance(maintenanceId, engineers, minimumRequired = 2) {
    // Mock implementation - you'll need to implement the actual API call
    console.log("Assigning engineers:", { maintenanceId, engineers, minimumRequired });
    return { success: true, message: "Engineers assigned successfully" };
  },

  async validateMaintenanceEngineers(maintenanceId) {
    const assignedEngineers = await this.getAssignedEngineers(maintenanceId);
    const minimumRequired = 2;

    return {
      isValid: assignedEngineers.length >= minimumRequired,
      requiredEngineers: minimumRequired,
      assignedEngineers: assignedEngineers.length,
      validationErrors:
        assignedEngineers.length < minimumRequired
          ? [`Need ${minimumRequired - assignedEngineers.length} more engineer(s)`]
          : [],
    };
  },
};

// Mock complete maintenance function
const completeMaintenanceWithValidation = async (maintenanceId, completionData) => {
  // First validate engineers
  const validation = await engineerAssignmentService.validateMaintenanceEngineers(maintenanceId);

  if (!validation.isValid) {
    throw new Error(`Cannot complete maintenance: ${validation.validationErrors.join(", ")}`);
  }

  // Mock completion - replace with actual API call
  console.log("Completing maintenance:", { maintenanceId, completionData });
  return { success: true, message: "Maintenance completed successfully" };
};

function Missions() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    status: "all",
    priority: "all",
    technician: "all",
    frequency: "all",
    timeframe: "all", // all, completed, upcoming, overdue
  });

  // State for maintenances data
  const [maintenances, setMaintenances] = useState([]);
  const [filteredMaintenances, setFilteredMaintenances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Engineer assignment dialog state
  const [assignDialog, setAssignDialog] = useState({
    open: false,
    maintenanceId: null,
    maintenanceTitle: "",
    currentEngineers: [],
  });

  // Available engineers
  const [engineers, setEngineers] = useState([]);
  const [selectedEngineers, setSelectedEngineers] = useState([]);
  const [assignmentLoading, setAssignmentLoading] = useState(false);

  // Completion dialog state
  const [completeDialog, setCompleteDialog] = useState({
    open: false,
    maintenanceId: null,
    maintenanceTitle: "",
    completionNotes: "",
  });

  // Statistics
  const [missionStats, setMissionStats] = useState({
    total: 0,
    scheduled: 0,
    inProgress: 0,
    completed: 0,
    cancelled: 0,
    overdue: 0,
  });

  // Load data on component mount
  useEffect(() => {
    loadMaintenances();
    loadEngineers();
  }, []);

  // Filter maintenances when filters change
  useEffect(() => {
    applyFilters();
  }, [maintenances, filters]);

  const loadMaintenances = async () => {
    try {
      setLoading(true);
      const data = await fetchAllMaintenances();

      // Transform the data to match expected structure if needed
      const transformedData = data.map((maintenance) => ({
        id: maintenance.id,
        equipmentModel: maintenance.equipmentModel || maintenance.equipment || "Unknown Equipment",
        equipmentSerial: maintenance.serialNumber || maintenance.equipmentSerial || "N/A",
        equipmentLocation: maintenance.location || maintenance.equipmentLocation || "N/A",
        siteName: maintenance.siteName || maintenance.site || "Unknown Site",
        clientName: maintenance.clientName || maintenance.client || "Unknown Client",
        scheduledDate: maintenance.scheduledDate || maintenance.date,
        completedDate: maintenance.completedDate,
        status: maintenance.status || "Scheduled",
        engineer: maintenance.assignedEngineer || maintenance.engineer || "Unassigned",
        maintenanceType: maintenance.type || maintenance.maintenanceType || "Preventive",
        period: maintenance.period || maintenance.frequency || null,
        contractNumber: maintenance.contractNumber || "N/A",
        remarks: maintenance.remarks || maintenance.notes,
        completionNotes: maintenance.completionNotes,
      }));

      setMaintenances(transformedData);
      calculateStats(transformedData);
      setError(null);
    } catch (err) {
      setError("Failed to load maintenances: " + handleMaintenanceError(err));
      console.error("Error loading maintenances:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadEngineers = async () => {
    try {
      const engineersData = await engineerService.fetchAll();
      setEngineers(engineersData.filter((eng) => eng.isActive !== false));
    } catch (err) {
      console.error("Error loading engineers:", err);
      // Use fallback engineers if service fails
      setEngineers([
        { id: 1, name: "John Smith", isActive: true },
        { id: 2, name: "Sarah Johnson", isActive: true },
        { id: 3, name: "Mike Wilson", isActive: true },
      ]);
    }
  };

  const calculateStats = (data) => {
    const stats = {
      total: data.length,
      scheduled: data.filter((m) => m.status === "Scheduled").length,
      inProgress: data.filter((m) => m.status === "InProgress").length,
      completed: data.filter((m) => m.status === "Completed").length,
      cancelled: data.filter((m) => m.status === "Cancelled").length,
      overdue: data.filter((m) => utils.isOverdue(m.scheduledDate, m.status)).length,
    };
    setMissionStats(stats);
  };

  const applyFilters = () => {
    let filtered = [...maintenances];

    // Status filter
    if (filters.status !== "all") {
      filtered = filtered.filter((m) => m.status.toLowerCase() === filters.status);
    }

    // Engineer filter
    if (filters.technician !== "all") {
      filtered = filtered.filter(
        (m) => m.engineer && m.engineer.toLowerCase().includes(filters.technician.toLowerCase())
      );
    }

    // Priority filter (based on overdue status and upcoming dates)
    if (filters.priority !== "all") {
      const now = new Date();
      const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

      filtered = filtered.filter((m) => {
        const scheduledDate = new Date(m.scheduledDate);
        const isOverdue = utils.isOverdue(m.scheduledDate, m.status);
        const isUpcoming = scheduledDate <= sevenDaysFromNow && scheduledDate >= now;

        switch (filters.priority) {
          case "high":
            return isOverdue;
          case "medium":
            return isUpcoming && !isOverdue;
          case "low":
            return !isOverdue && !isUpcoming;
          default:
            return true;
        }
      });
    }

    // Timeframe filter
    if (filters.timeframe !== "all") {
      const now = new Date();
      const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      filtered = filtered.filter((m) => {
        const scheduledDate = new Date(m.scheduledDate);
        const completedDate = m.completedDate ? new Date(m.completedDate) : null;

        switch (filters.timeframe) {
          case "completed":
            return m.status === "Completed" && completedDate && completedDate >= sevenDaysAgo;
          case "upcoming":
            return m.status === "Scheduled" && scheduledDate <= sevenDaysFromNow;
          case "overdue":
            return utils.isOverdue(m.scheduledDate, m.status);
          default:
            return true;
        }
      });
    }

    setFilteredMaintenances(filtered);
  };

  const handlePlanMission = () => {
    navigate("/missions/plan");
  };

  const handleFilterChange = (filterType) => (event) => {
    setFilters({
      ...filters,
      [filterType]: event.target.value,
    });
  };

  const handleAssignEngineers = async (maintenanceId, maintenanceTitle) => {
    try {
      setAssignmentLoading(true);

      // Get current assigned engineers and available engineers
      const currentEngineers = await engineerAssignmentService.getAssignedEngineers(maintenanceId);
      const maintenance = maintenances.find((m) => m.id === maintenanceId);
      const availableEngineers = await engineerAssignmentService.getAvailableEngineers(
        maintenance.scheduledDate
      );

      setAssignDialog({
        open: true,
        maintenanceId,
        maintenanceTitle,
        currentEngineers,
      });

      // Set currently assigned engineers in selection
      setSelectedEngineers(
        currentEngineers.map((eng) => ({
          engineerId: eng.engineerId || eng.id,
          name: eng.name,
          role: eng.role || ENGINEER_ROLES.ASSIGNED,
          notes: eng.notes || "",
        }))
      );
    } catch (error) {
      console.error("Error loading engineer assignment data:", error);
      setError("Failed to load engineer assignment data");
    } finally {
      setAssignmentLoading(false);
    }
  };

  const handleSaveEngineerAssignment = async () => {
    try {
      setAssignmentLoading(true);

      await engineerAssignmentService.assignEngineersToMaintenance(
        assignDialog.maintenanceId,
        selectedEngineers,
        2 // minimum required engineers
      );

      // Reload maintenances to reflect changes
      await loadMaintenances();

      setAssignDialog({
        open: false,
        maintenanceId: null,
        maintenanceTitle: "",
        currentEngineers: [],
      });
      setSelectedEngineers([]);

      // Show success message or notification here
    } catch (error) {
      console.error("Error assigning engineers:", error);
      setError("Failed to assign engineers: " + error.message);
    } finally {
      setAssignmentLoading(false);
    }
  };

  const handleCompleteMaintenance = (maintenanceId, maintenanceTitle) => {
    setCompleteDialog({
      open: true,
      maintenanceId,
      maintenanceTitle,
      completionNotes: "",
    });
  };

  const handleSaveCompletion = async () => {
    try {
      setAssignmentLoading(true);

      await completeMaintenanceWithValidation(completeDialog.maintenanceId, {
        completedDate: new Date().toISOString(),
        completionNotes: completeDialog.completionNotes,
      });

      // Reload maintenances
      await loadMaintenances();

      setCompleteDialog({
        open: false,
        maintenanceId: null,
        maintenanceTitle: "",
        completionNotes: "",
      });
    } catch (error) {
      console.error("Error completing maintenance:", error);
      setError("Failed to complete maintenance: " + error.message);
    } finally {
      setAssignmentLoading(false);
    }
  };

  const getStatusChip = (status, scheduledDate) => {
    const isOverdue = utils.isOverdue(scheduledDate, status);
    const finalStatus = isOverdue ? "Overdue" : status;
    const color = utils.getStatusColor(finalStatus);

    return (
      <Chip
        label={finalStatus}
        size="small"
        color={color}
        variant={isOverdue ? "filled" : "outlined"}
      />
    );
  };

  const getPriorityChip = (scheduledDate, status) => {
    const now = new Date();
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const scheduledDateObj = new Date(scheduledDate);

    if (utils.isOverdue(scheduledDate, status)) {
      return <Chip label="High" size="small" color="error" />;
    } else if (scheduledDateObj <= sevenDaysFromNow && scheduledDateObj >= now) {
      return <Chip label="Medium" size="small" color="warning" />;
    } else {
      return <Chip label="Low" size="small" color="success" />;
    }
  };

  const getActionButtons = (maintenance) => {
    const actions = [];

    if (maintenance.status === "Scheduled") {
      actions.push(
        <Tooltip title="Assign Engineers" key="assign">
          <IconButton
            size="small"
            color="info"
            onClick={() =>
              handleAssignEngineers(
                maintenance.id,
                `${maintenance.equipmentModel} - ${maintenance.siteName}`
              )
            }
          >
            <Icon>people</Icon>
          </IconButton>
        </Tooltip>
      );

      actions.push(
        <Tooltip title="Complete Maintenance" key="complete">
          <IconButton
            size="small"
            color="success"
            onClick={() =>
              handleCompleteMaintenance(
                maintenance.id,
                `${maintenance.equipmentModel} - ${maintenance.siteName}`
              )
            }
          >
            <Icon>check_circle</Icon>
          </IconButton>
        </Tooltip>
      );
    }

    actions.push(
      <Tooltip title="View Details" key="view">
        <IconButton
          size="small"
          color="primary"
          onClick={() => navigate(`/maintenance/${maintenance.id}`)}
        >
          <Icon>visibility</Icon>
        </IconButton>
      </Tooltip>
    );

    return <Box sx={{ display: "flex", gap: 0.5 }}>{actions}</Box>;
  };

  // Create table data
  const createTableData = () => {
    const columns = [
      { Header: "ID", accessor: "id", width: "5%" },
      { Header: "Equipment", accessor: "equipment", width: "15%" },
      { Header: "Site/Client", accessor: "site", width: "15%" },
      { Header: "Scheduled Date", accessor: "scheduledDate", width: "10%" },
      { Header: "Status", accessor: "status", width: "10%" },
      { Header: "Priority", accessor: "priority", width: "8%" },
      { Header: "Engineer", accessor: "engineer", width: "12%" },
      { Header: "Type/Period", accessor: "type", width: "10%" },
      { Header: "Actions", accessor: "actions", width: "15%" },
    ];

    const rows = filteredMaintenances.map((maintenance) => ({
      id: (
        <MDTypography variant="caption" color="text" fontWeight="medium">
          #{maintenance.id}
        </MDTypography>
      ),
      equipment: (
        <MDBox>
          <MDTypography variant="caption" color="text" fontWeight="medium">
            {maintenance.equipmentModel}
          </MDTypography>
          <MDTypography variant="caption" color="text" display="block">
            SN: {maintenance.equipmentSerial}
          </MDTypography>
          <MDTypography variant="caption" color="secondary" display="block">
            {maintenance.equipmentLocation}
          </MDTypography>
        </MDBox>
      ),
      site: (
        <MDBox>
          <MDTypography variant="caption" color="text" fontWeight="medium">
            {maintenance.siteName}
          </MDTypography>
          <MDTypography variant="caption" color="text" display="block">
            {maintenance.clientName}
          </MDTypography>
        </MDBox>
      ),
      scheduledDate: (
        <MDBox>
          <MDTypography variant="caption" color="text" fontWeight="medium">
            {utils.formatDate(maintenance.scheduledDate)}
          </MDTypography>
          {utils.daysUntil(maintenance.scheduledDate) !== null && (
            <MDTypography variant="caption" color="secondary" display="block">
              {utils.daysUntil(maintenance.scheduledDate) > 0
                ? `${utils.daysUntil(maintenance.scheduledDate)} days`
                : `${Math.abs(utils.daysUntil(maintenance.scheduledDate))} days overdue`}
            </MDTypography>
          )}
        </MDBox>
      ),
      status: getStatusChip(maintenance.status, maintenance.scheduledDate),
      priority: getPriorityChip(maintenance.scheduledDate, maintenance.status),
      engineer: (
        <MDTypography variant="caption" color="text">
          {maintenance.engineer || "Unassigned"}
        </MDTypography>
      ),
      type: (
        <MDBox>
          <MDTypography variant="caption" color="text" fontWeight="medium">
            {maintenance.maintenanceType}
          </MDTypography>
          {maintenance.period && (
            <MDTypography variant="caption" color="secondary" display="block">
              {maintenance.period}
            </MDTypography>
          )}
        </MDBox>
      ),
      actions: getActionButtons(maintenance),
    }));

    return { columns, rows };
  };

  // Filter options
  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "scheduled", label: "Scheduled" },
    { value: "inprogress", label: "In Progress" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
  ];

  const priorityOptions = [
    { value: "all", label: "All Priorities" },
    { value: "high", label: "High (Overdue)" },
    { value: "medium", label: "Medium (Upcoming)" },
    { value: "low", label: "Low (Future)" },
  ];

  const timeframeOptions = [
    { value: "all", label: "All Time" },
    { value: "completed", label: "Completed This Week" },
    { value: "upcoming", label: "Upcoming This Week" },
    { value: "overdue", label: "Overdue" },
  ];

  const technicianOptions = [
    { value: "all", label: "All Technicians" },
    ...engineers.map((eng) => ({
      value: eng.name.toLowerCase(),
      label: eng.name,
    })),
  ];

  if (loading) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox pt={6} pb={3} display="flex" justifyContent="center">
          <CircularProgress />
        </MDBox>
      </DashboardLayout>
    );
  }

  const { columns, rows } = createTableData();

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        {error && (
          <Grid container spacing={3} mb={3}>
            <Grid item xs={12}>
              <Alert severity="error" onClose={() => setError(null)}>
                {error}
              </Alert>
            </Grid>
          </Grid>
        )}

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
                      Total Maintenances
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
                  <Grid item xs={12} sm={6} md={2}>
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

                  <Grid item xs={12} sm={6} md={2}>
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

                  <Grid item xs={12} sm={6} md={2}>
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

                  <Grid item xs={12} sm={6} md={2}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Timeframe</InputLabel>
                      <Select
                        value={filters.timeframe}
                        onChange={handleFilterChange("timeframe")}
                        label="Timeframe"
                      >
                        {timeframeOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6} md={2}>
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
                          timeframe: "all",
                        })
                      }
                    >
                      Clear Filters
                    </MDButton>
                  </Grid>

                  <Grid item xs={12} sm={6} md={2}>
                    <MDButton
                      variant="gradient"
                      color="info"
                      size="small"
                      fullWidth
                      startIcon={<Icon>refresh</Icon>}
                      onClick={loadMaintenances}
                    >
                      Refresh Data
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
                      onClick={() => setFilters({ ...filters, timeframe: "upcoming" })}
                    >
                      View Upcoming
                    </MDButton>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <MDButton
                      variant="outlined"
                      color="success"
                      fullWidth
                      startIcon={<Icon>assessment</Icon>}
                      onClick={() => setFilters({ ...filters, timeframe: "completed" })}
                    >
                      View Completed
                    </MDButton>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <MDButton
                      variant="outlined"
                      color="error"
                      fullWidth
                      startIcon={<Icon>warning</Icon>}
                      onClick={() => setFilters({ ...filters, timeframe: "overdue" })}
                    >
                      View Overdue
                    </MDButton>
                  </Grid>
                </Grid>
              </MDBox>
            </Card>
          </Grid>

          {/* Maintenances Table */}
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
                  <Icon sx={{ color: "white", mr: 1 }}>build</Icon>
                  <MDTypography variant="h6" color="white">
                    Maintenance Management ({filteredMaintenances.length} items)
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
                  entriesPerPage={{ defaultValue: 15, entries: [10, 15, 25, 50] }}
                  showTotalEntries={true}
                  noEndBorder
                  canSearch={true}
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>

        {/* Engineer Assignment Dialog */}
        <Dialog
          open={assignDialog.open}
          onClose={() =>
            !assignmentLoading &&
            setAssignDialog({
              open: false,
              maintenanceId: null,
              maintenanceTitle: "",
              currentEngineers: [],
            })
          }
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            Assign Engineers
            <MDTypography variant="body2" color="text">
              {assignDialog.maintenanceTitle}
            </MDTypography>
          </DialogTitle>
          <DialogContent>
            <MDBox mt={2}>
              <Autocomplete
                multiple
                options={engineers}
                getOptionLabel={(option) => option.name}
                value={selectedEngineers}
                onChange={(event, newValue) => {
                  setSelectedEngineers(
                    newValue.map((eng) => ({
                      engineerId: eng.id,
                      name: eng.name,
                      role: ENGINEER_ROLES.ASSIGNED,
                      notes: "",
                    }))
                  );
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Engineers"
                    placeholder="Choose engineers to assign"
                  />
                )}
                renderTags={(tagValue, getTagProps) =>
                  tagValue.map((option, index) => (
                    <Chip
                      key={option.engineerId || option.id || index}
                      label={option.name}
                      {...getTagProps({ index })}
                      color="primary"
                      size="small"
                    />
                  ))
                }
              />

              {selectedEngineers.length > 0 && (
                <MDBox mt={3}>
                  <MDTypography variant="h6" mb={2}>
                    Engineer Roles & Notes
                  </MDTypography>
                  {selectedEngineers.map((engineer, index) => (
                    <MDBox
                      key={engineer.engineerId}
                      mb={2}
                      p={2}
                      sx={{ border: 1, borderColor: "divider", borderRadius: 1 }}
                    >
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={4}>
                          <MDTypography variant="body2" fontWeight="medium">
                            {engineer.name}
                          </MDTypography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <FormControl fullWidth size="small">
                            <InputLabel>Role</InputLabel>
                            <Select
                              value={engineer.role}
                              onChange={(e) => {
                                const updated = [...selectedEngineers];
                                updated[index].role = e.target.value;
                                setSelectedEngineers(updated);
                              }}
                              label="Role"
                            >
                              {Object.values(ENGINEER_ROLES).map((role) => (
                                <MenuItem key={role} value={role}>
                                  {role}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <TextField
                            fullWidth
                            size="small"
                            label="Notes"
                            value={engineer.notes}
                            onChange={(e) => {
                              const updated = [...selectedEngineers];
                              updated[index].notes = e.target.value;
                              setSelectedEngineers(updated);
                            }}
                          />
                        </Grid>
                      </Grid>
                    </MDBox>
                  ))}
                </MDBox>
              )}

              {selectedEngineers.length < 2 && (
                <Alert severity="warning" sx={{ mt: 2 }}>
                  A minimum of 2 engineers is required for each maintenance.
                </Alert>
              )}
            </MDBox>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() =>
                setAssignDialog({
                  open: false,
                  maintenanceId: null,
                  maintenanceTitle: "",
                  currentEngineers: [],
                })
              }
              disabled={assignmentLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveEngineerAssignment}
              variant="contained"
              disabled={assignmentLoading || selectedEngineers.length < 2}
              startIcon={assignmentLoading ? <CircularProgress size={20} /> : null}
            >
              {assignmentLoading ? "Assigning..." : "Assign Engineers"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Completion Dialog */}
        <Dialog
          open={completeDialog.open}
          onClose={() =>
            !assignmentLoading &&
            setCompleteDialog({
              open: false,
              maintenanceId: null,
              maintenanceTitle: "",
              completionNotes: "",
            })
          }
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            Complete Maintenance
            <MDTypography variant="body2" color="text">
              {completeDialog.maintenanceTitle}
            </MDTypography>
          </DialogTitle>
          <DialogContent>
            <MDBox mt={2}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Completion Notes"
                value={completeDialog.completionNotes}
                onChange={(e) =>
                  setCompleteDialog({
                    ...completeDialog,
                    completionNotes: e.target.value,
                  })
                }
                placeholder="Enter any notes about the maintenance completion..."
              />
              <Alert severity="info" sx={{ mt: 2 }}>
                This will mark the maintenance as completed and validate that the required engineers
                are assigned.
              </Alert>
            </MDBox>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() =>
                setCompleteDialog({
                  open: false,
                  maintenanceId: null,
                  maintenanceTitle: "",
                  completionNotes: "",
                })
              }
              disabled={assignmentLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveCompletion}
              variant="contained"
              color="success"
              disabled={assignmentLoading}
              startIcon={assignmentLoading ? <CircularProgress size={20} /> : null}
            >
              {assignmentLoading ? "Completing..." : "Complete Maintenance"}
            </Button>
          </DialogActions>
        </Dialog>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Missions;
