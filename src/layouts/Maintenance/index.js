import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  Grid,
  Box,
  Typography,
  Button,
  Chip,
  IconButton,
  Tooltip,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  CircularProgress,
  Snackbar,
  FormHelperText,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Badge,
  InputAdornment,
} from "@mui/material";
import PropTypes from "prop-types";
import {
  Add as AddIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Business as BusinessIcon,
  Assignment as AssignmentIcon,
  Build as BuildIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Close as CloseIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Schedule as ScheduleIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon,
  CalendarMonth as CalendarIcon,
  AttachMoney as MoneyIcon,
  ErrorOutline as ErrorIcon,
  AccessTime as TimeIcon,
  MoreVert as MoreIcon,
} from "@mui/icons-material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DataTable from "examples/Tables/DataTable";
import TestEngineerDialog from "./data/TestEngineerDialog";
// Import the data table files
import sitesTableData from "./data/siteTableData";
import maintenanceTableData from "./data/maintenanceTableData";
import contractsTableData from "./data/contractTableData";

// IMPORTANT: Import the Engineer Assignment Dialog
import EngineerAssignmentDialog from "./data/EngineerAssignmentDialog";

// Import service functions
import {
  fetchAllSites,
  addSite,
  updateSite,
  deleteSite,
  validateSiteData,
  handleSiteError,
  searchSites,
  fetchAllMaintenances,
  addMaintenance,
  updateMaintenance,
  deleteMaintenance,
  markMaintenanceCompleted,
  validateMaintenanceData,
  handleMaintenanceError,
  searchMaintenances,
  getMaintenanceStatistics,
  fetchAllContracts,
  addContract,
  updateContract,
  deleteContract,
  validateContractData,
  handleContractError,
  searchContracts,
  getContractStatistics,
} from "./service/maintenanceService";

const MaintenanceDashboard = () => {
  const navigate = useNavigate();
  const [selectedSection, setSelectedSection] = useState("sites");
  const [sites, setSites] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [maintenances, setMaintenances] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Store refresh function reference
  const contractsRefreshRef = useRef(null);

  // Dialog states
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [dialogType, setDialogType] = useState("");

  // Form data states
  const [siteFormData, setSiteFormData] = useState({
    siteName: "",
    clientName: "",
    location: "",
  });

  const [maintenanceFormData, setMaintenanceFormData] = useState({
    contractId: "",
    scheduledDate: "",
    engineer: "",
    status: "Scheduled",
    period: "",
    remarks: "",
    completedDate: "",
  });

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Load data on mount
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    await Promise.all([loadSites(), loadContracts(), loadMaintenances()]);
  };

  const loadSites = async () => {
    try {
      setLoading(true);
      const sitesData = await fetchAllSites();
      setSites(sitesData);
    } catch (err) {
      const errorMessage = handleSiteError(err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const loadContracts = async () => {
    try {
      setLoading(true);
      const contractsData = await fetchAllContracts();
      setContracts(contractsData);
    } catch (err) {
      const errorMessage = handleContractError(err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const loadMaintenances = async () => {
    try {
      setLoading(true);
      const maintenancesData = await fetchAllMaintenances();
      setMaintenances(maintenancesData);
    } catch (err) {
      const errorMessage = handleMaintenanceError(err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const closeSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  // Navigation menu items with counts
  const navigationItems = [
    {
      id: "sites",
      label: "Sites",
      icon: BusinessIcon,
      count: sites.length,
      color: "#3b82f6",
      bgColor: "#eff6ff",
    },
    {
      id: "contracts",
      label: "Contracts",
      icon: AssignmentIcon,
      count: contracts.length,
      color: "#10b981",
      bgColor: "#f0fdf4",
      badge: contracts.filter((c) => c.status?.toLowerCase() === "active").length,
      badgeLabel: "active",
    },
    {
      id: "maintenance",
      label: "PPM",
      icon: BuildIcon,
      count: maintenances.length,
      color: "#f59e0b",
      bgColor: "#fef3c7",
      badge: maintenances.filter((m) => !m.completedDate && new Date(m.scheduledDate) < new Date())
        .length,
      badgeLabel: "overdue",
      badgeColor: "error",
    },
  ];

  // Get table data hooks
  const { columns: sitesColumns, rows: sitesRows, loading: sitesLoading } = sitesTableData();

  const handleDeleteContract = async (id) => {
    if (!window.confirm("Are you sure you want to delete this contract?")) return;
    try {
      setLoading(true);
      await deleteContract(id);
      setContracts((prevContracts) => prevContracts.filter((contract) => contract.id !== id));
      showSnackbar("Contract deleted successfully");
      if (contractsRefreshRef.current) contractsRefreshRef.current();
    } catch (err) {
      showSnackbar(handleContractError(err), "error");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (item, type) => {
    setSelectedItem({ ...item, type });
    setDetailsOpen(true);
  };

  const {
    columns: contractsColumns,
    rows: contractsRows,
    loading: contractsLoading,
    handleAddContract,
    refreshData: refreshContractsData,
  } = contractsTableData({
    onEditContract: (contract) => navigate(`/contracts/edit/${contract.id}`),
    onDeleteContract: handleDeleteContract,
    onViewContract: (contract) => handleViewDetails(contract, "contract"),
  });

  useEffect(() => {
    contractsRefreshRef.current = refreshContractsData;
  }, [refreshContractsData]);

  // UPDATED: Get maintenance table data with dialog state
  const {
    columns: maintenanceColumns,
    rows: maintenanceRows,
    loading: maintenanceLoading,
    overdue,
    completed,
    scheduled,
    // Get dialog state and handlers
    assignmentDialog,
    handleAssignmentDialogClose,
    handleAssignmentComplete,
  } = maintenanceTableData();

  // Statistics calculation
  const stats = {
    totalSites: sites.length,
    activeSites: sites.filter((s) => s.isActive !== false).length,
    totalContracts: contracts.length,
    activeContracts: contracts.filter((c) => c.status?.toLowerCase() === "active").length,
    expiredContracts: contracts.filter((c) => new Date(c.endDate) < new Date()).length,
    totalMaintenances: maintenances.length,
    overdueMaintenance: overdue || 0,
    completedMaintenance: completed || 0,
    scheduledMaintenance: scheduled || 0,
  };

  // Quick Stats Card Component
  const QuickStatCard = ({ icon: Icon, label, value, trend, trendLabel, color }) => (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        borderRadius: 2,
        border: "1px solid",
        borderColor: "grey.200",
        background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
        transition: "all 0.3s ease",
        "&:hover": {
          borderColor: color || "primary.main",
          transform: "translateY(-2px)",
          boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
        },
      }}
    >
      <Box display="flex" alignItems="flex-start" justifyContent="space-between">
        <Box>
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: 1.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: color ? `${color}15` : "primary.light",
              }}
            >
              <Icon sx={{ fontSize: 20, color: color || "primary.main" }} />
            </Box>
            <Typography variant="h4" fontWeight="700" color="text.primary">
              {value}
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" fontWeight="500">
            {label}
          </Typography>
          {trend !== undefined && (
            <Box display="flex" alignItems="center" gap={0.5} mt={0.5}>
              <Typography
                variant="caption"
                sx={{
                  color: trend > 0 ? "success.main" : "text.secondary",
                  fontWeight: 600,
                }}
              >
                {trend > 0 ? "+" : ""}
                {trend}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {trendLabel}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Paper>
  );

  QuickStatCard.propTypes = {
    icon: PropTypes.elementType.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    trend: PropTypes.number,
    trendLabel: PropTypes.string,
    color: PropTypes.string,
  };

  // Section Header Component
  const SectionHeader = ({ title, subtitle, onAdd, onRefresh, loading: sectionLoading }) => (
    <Box mb={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Box>
          <Typography variant="h5" fontWeight="600" color="text.primary">
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            {subtitle}
          </Typography>
        </Box>
        <Box display="flex" gap={1}>
          <TextField
            size="small"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              minWidth: 240,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                bgcolor: "background.paper",
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "text.secondary", fontSize: 20 }} />
                </InputAdornment>
              ),
            }}
          />
          <Tooltip title="Refresh data">
            <IconButton
              onClick={onRefresh}
              disabled={sectionLoading}
              sx={{
                border: "1px solid",
                borderColor: "grey.300",
                borderRadius: 2,
                "&:hover": { bgcolor: "grey.50" },
              }}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onAdd}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              color: "white",
              boxShadow: "none",
              px: 3,
              "&:hover": {
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              },
            }}
          >
            Add New
          </Button>
        </Box>
      </Box>
    </Box>
  );

  SectionHeader.propTypes = {
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string.isRequired,
    onAdd: PropTypes.func.isRequired,
    onRefresh: PropTypes.func.isRequired,
    loading: PropTypes.bool,
  };

  // Handle section actions
  const handleAddItem = (type) => {
    if (type === "contracts") {
      navigate("/contracts/add");
      return;
    }
    setDialogType(type);
    setAddDialogOpen(true);
  };

  const handleRefresh = () => {
    switch (selectedSection) {
      case "sites":
        loadSites();
        break;
      case "contracts":
        refreshContractsData ? refreshContractsData() : loadContracts();
        break;
      case "maintenance":
        loadMaintenances();
        break;
      default:
        loadAllData();
    }
  };

  return (
    <DashboardLayout>
      <Box sx={{ display: "flex", height: "100vh", bgcolor: "#f8fafc" }}>
        {/* Sidebar Navigation */}
        <Box
          sx={{
            width: 280,
            bgcolor: "background.paper",
            borderRight: "1px solid",
            borderColor: "grey.200",
            p: 3,
          }}
        >
          <Typography variant="h6" fontWeight="700" color="text.primary" mb={1}>
            Maintenance Hub
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Manage your maintenance operations
          </Typography>

          <List sx={{ p: 0 }}>
            {navigationItems.map((item) => (
              <ListItem key={item.id} disablePadding sx={{ mb: 1 }}>
                <ListItemButton
                  selected={selectedSection === item.id}
                  onClick={() => setSelectedSection(item.id)}
                  sx={{
                    borderRadius: 2,
                    px: 2,
                    py: 1.5,
                    "&.Mui-selected": {
                      bgcolor: item.bgColor,
                      "&:hover": { bgcolor: item.bgColor },
                    },
                    "&:hover": { bgcolor: "grey.50" },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <Badge
                      badgeContent={item.badge}
                      color={item.badgeColor || "primary"}
                      invisible={!item.badge}
                    >
                      <item.icon
                        sx={{
                          fontSize: 22,
                          color: selectedSection === item.id ? item.color : "text.secondary",
                        }}
                      />
                    </Badge>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography
                          variant="body2"
                          fontWeight={selectedSection === item.id ? 600 : 500}
                          color={selectedSection === item.id ? item.color : "text.primary"}
                        >
                          {item.label}
                        </Typography>
                        <Chip
                          label={item.count}
                          size="small"
                          sx={{
                            height: 22,
                            fontSize: "0.75rem",
                            fontWeight: 600,
                            bgcolor: selectedSection === item.id ? item.color : "grey.100",
                            color: selectedSection === item.id ? "white" : "text.secondary",
                          }}
                        />
                      </Box>
                    }
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>

          <Divider sx={{ my: 3 }} />

          {/* Quick Actions */}
          <Typography variant="body2" fontWeight="600" color="text.secondary" mb={2}>
            Quick Actions
          </Typography>
          <Box display="flex" flexDirection="column" gap={1}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<CalendarIcon />}
              sx={{
                justifyContent: "flex-start",
                textTransform: "none",
                borderRadius: 2,
                borderColor: "grey.300",
                color: "text.primary",
                "&:hover": {
                  borderColor: "primary.main",
                  bgcolor: "primary.50",
                },
              }}
              onClick={() => {
                setSelectedSection("maintenance");
                handleAddItem("maintenance");
              }}
            >
              Schedule Maintenance
            </Button>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<AssignmentIcon />}
              sx={{
                justifyContent: "flex-start",
                textTransform: "none",
                borderRadius: 2,
                borderColor: "grey.300",
                color: "text.primary",
                "&:hover": {
                  borderColor: "success.main",
                  bgcolor: "success.50",
                },
              }}
              onClick={() => navigate("/contracts/add")}
            >
              New Contract
            </Button>
          </Box>

          {/* Alerts Section */}
          {(stats.overdueMaintenance > 0 || stats.expiredContracts > 0) && (
            <>
              <Divider sx={{ my: 3 }} />
              <Typography variant="body2" fontWeight="600" color="text.secondary" mb={2}>
                Alerts
              </Typography>
              <Box display="flex" flexDirection="column" gap={1}>
                {stats.overdueMaintenance > 0 && (
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: "error.50",
                      border: "1px solid",
                      borderColor: "error.200",
                    }}
                  >
                    <Box display="flex" alignItems="center" gap={1}>
                      <ErrorIcon sx={{ fontSize: 18, color: "error.main" }} />
                      <Typography variant="caption" color="error.main" fontWeight="600">
                        {stats.overdueMaintenance} overdue maintenance
                      </Typography>
                    </Box>
                  </Box>
                )}
                {stats.expiredContracts > 0 && (
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: "warning.50",
                      border: "1px solid",
                      borderColor: "warning.200",
                    }}
                  >
                    <Box display="flex" alignItems="center" gap={1}>
                      <WarningIcon sx={{ fontSize: 18, color: "warning.main" }} />
                      <Typography variant="caption" color="warning.main" fontWeight="600">
                        {stats.expiredContracts} expired contracts
                      </Typography>
                    </Box>
                  </Box>
                )}
              </Box>
            </>
          )}
        </Box>

        {/* Main Content Area */}
        <Box sx={{ flex: 1, overflow: "auto", p: 4 }}>
          {/* Statistics Grid */}
          <Grid container spacing={2} mb={4}>
            <Grid item xs={12} sm={6} md={3}>
              <QuickStatCard
                icon={BusinessIcon}
                label="Total Sites"
                value={stats.totalSites}
                trend={stats.activeSites}
                trendLabel="active"
                color="#3b82f6"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <QuickStatCard
                icon={AssignmentIcon}
                label="Total Contracts"
                value={stats.totalContracts}
                trend={stats.activeContracts}
                trendLabel="active"
                color="#10b981"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <QuickStatCard
                icon={BuildIcon}
                label="PPM"
                value={stats.totalMaintenances}
                trend={stats.completedMaintenance}
                trendLabel="completed"
                color="#f59e0b"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <QuickStatCard
                icon={CheckCircleIcon}
                label="Completion Rate"
                value={`${
                  stats.totalMaintenances
                    ? Math.round((stats.completedMaintenance / stats.totalMaintenances) * 100)
                    : 0
                }%`}
                color="#8b5cf6"
              />
            </Grid>
          </Grid>

          {/* Content Section */}
          <Paper
            elevation={0}
            sx={{
              borderRadius: 3,
              border: "1px solid",
              borderColor: "grey.200",
              bgcolor: "background.paper",
              overflow: "hidden",
            }}
          >
            <Box sx={{ p: 3 }}>
              {selectedSection === "sites" && (
                <>
                  <SectionHeader
                    title="Sites Management"
                    subtitle="Manage and monitor all maintenance sites"
                    onAdd={() => handleAddItem("sites")}
                    onRefresh={handleRefresh}
                    loading={sitesLoading}
                  />
                  <DataTable
                    table={{ columns: sitesColumns, rows: sitesRows }}
                    isSorted={false}
                    entriesPerPage={false}
                    showTotalEntries={false}
                    noEndBorder
                  />
                </>
              )}

              {selectedSection === "contracts" && (
                <>
                  <SectionHeader
                    title="Contracts Management"
                    subtitle="Track and manage maintenance contracts"
                    onAdd={() => handleAddItem("contracts")}
                    onRefresh={handleRefresh}
                    loading={contractsLoading}
                  />
                  <DataTable
                    table={{ columns: contractsColumns, rows: contractsRows }}
                    isSorted={false}
                    entriesPerPage={false}
                    showTotalEntries={false}
                    noEndBorder
                  />
                </>
              )}

              {selectedSection === "maintenance" && (
                <>
                  <SectionHeader
                    title="Maintenance Schedule"
                    subtitle="Schedule and track maintenance activities"
                    onAdd={() => handleAddItem("maintenance")}
                    onRefresh={handleRefresh}
                    loading={maintenanceLoading}
                  />
                  <DataTable
                    table={{ columns: maintenanceColumns, rows: maintenanceRows }}
                    isSorted={false}
                    entriesPerPage={false}
                    showTotalEntries={false}
                    noEndBorder
                  />
                </>
              )}
            </Box>
          </Paper>
        </Box>
      </Box>

      {/* IMPORTANT: Add the Engineer Assignment Dialog */}
      <EngineerAssignmentDialog
        open={assignmentDialog?.open || false}
        maintenance={assignmentDialog?.maintenance}
        onClose={handleAssignmentDialogClose}
        onAssignmentComplete={handleAssignmentComplete}
      />

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={closeSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
      <TestEngineerDialog />
    </DashboardLayout>
  );
};

export default MaintenanceDashboard;
