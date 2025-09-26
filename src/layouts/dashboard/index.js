import { useState, useEffect } from "react";
import PropTypes from "prop-types";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";

// Data
import reportsBarChartData from "layouts/dashboard/data/reportsBarChartData";
import reportsLineChartData from "layouts/dashboard/data/reportsLineChartData";

// Dashboard components
import Projects from "layouts/dashboard/components/Projects";
import OrdersOverview from "layouts/dashboard/components/OrdersOverview";
import MaintenanceCalendar from "layouts/Maintenance/MaintenanceCalendar";
// Services
import {
  fetchAllMaintenances,
  fetchAllContracts,
  fetchAllSites,
} from "layouts/Maintenance/service/servicem";

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`dashboard-tabpanel-${index}`}
      aria-labelledby={`dashboard-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  value: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
};

function Dashboard() {
  const { sales, tasks } = reportsLineChartData;

  // State for maintenance data
  const [maintenances, setMaintenances] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [sites, setSites] = useState([]);
  const [loadingMaintenance, setLoadingMaintenance] = useState(true);

  // State for tabs
  const [activeTab, setActiveTab] = useState(0);

  // Load maintenance data
  useEffect(() => {
    const loadMaintenanceData = async () => {
      try {
        const [maintenancesResponse, contractsResponse, sitesResponse] = await Promise.all([
          fetchAllMaintenances(),
          fetchAllContracts(),
          fetchAllSites(),
        ]);

        setMaintenances(maintenancesResponse || []);
        setContracts(contractsResponse || []);
        setSites(sitesResponse || []);
      } catch (error) {
        console.error("Error loading maintenance data:", error);
        setMaintenances([]);
        setContracts([]);
        setSites([]);
      } finally {
        setLoadingMaintenance(false);
      }
    };

    loadMaintenanceData();
  }, []);

  // Calculate maintenance statistics
  const maintenanceStats = {
    total: maintenances.length,
    completed: maintenances.filter((m) => m.status === "Completed").length,
    scheduled: maintenances.filter((m) => m.status === "Scheduled").length,
    overdue: maintenances.filter((m) => !m.completedDate && new Date(m.scheduledDate) < new Date())
      .length,
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        {/* Statistics Cards */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="error"
                icon="security"
                title="Active Contracts"
                count={contracts.filter((c) => c.status === "Active").length}
                percentage={{
                  color: "success",
                  amount: "+12%",
                  label: "than last month",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="warning"
                icon="engineering"
                title="Total Maintenances"
                count={maintenanceStats.total}
                percentage={{
                  color: maintenanceStats.overdue > 0 ? "error" : "success",
                  amount: maintenanceStats.overdue > 0 ? `${maintenanceStats.overdue}` : "0",
                  label: maintenanceStats.overdue > 0 ? "overdue items" : "overdue items",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon="verified"
                title="Completed"
                count={maintenanceStats.completed}
                percentage={{
                  color: "success",
                  amount:
                    maintenanceStats.total > 0
                      ? `${Math.round(
                          (maintenanceStats.completed / maintenanceStats.total) * 100
                        )}%`
                      : "0%",
                  label: "completion rate",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="info"
                icon="schedule"
                title="Scheduled"
                count={maintenanceStats.scheduled}
                percentage={{
                  color: maintenanceStats.overdue > 0 ? "error" : "info",
                  amount: maintenanceStats.overdue,
                  label: "overdue items",
                }}
              />
            </MDBox>
          </Grid>
        </Grid>

        {/* Main Content with Tabs */}
        <MDBox mt={4.5}>
          <Card>
            <MDBox p={3}>
              <MDTypography variant="h5" fontWeight="medium" gutterBottom>
                Maintenance Dashboard
              </MDTypography>

              {/* Tabs Navigation */}
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                indicatorColor="primary"
                textColor="primary"
                sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}
              >
                <Tab
                  label="Overview"
                  icon={
                    <span className="material-icons" style={{ fontSize: "20px" }}>
                      dashboard
                    </span>
                  }
                  iconPosition="start"
                />
                <Tab
                  label="Calendar View"
                  icon={
                    <span className="material-icons" style={{ fontSize: "20px" }}>
                      calendar_today
                    </span>
                  }
                  iconPosition="start"
                />
                <Tab
                  label="Analytics"
                  icon={
                    <span className="material-icons" style={{ fontSize: "20px" }}>
                      analytics
                    </span>
                  }
                  iconPosition="start"
                />
              </Tabs>

              {/* Tab Panel 0: Overview */}
              <TabPanel value={activeTab} index={0}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6} lg={4}>
                    <MDBox mb={3}>
                      <ReportsBarChart
                        color="error"
                        title="Monthly Maintenances"
                        description="Maintenance activities by month"
                        date="updated 1 hour ago"
                        chart={reportsBarChartData}
                      />
                    </MDBox>
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <MDBox mb={3}>
                      <ReportsLineChart
                        color="warning"
                        title="Maintenance Trends"
                        description={
                          <>
                            (<strong>+{maintenanceStats.completed}</strong>) maintenances completed
                            this month.
                          </>
                        }
                        date="updated 30 min ago"
                        chart={sales}
                      />
                    </MDBox>
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <MDBox mb={3}>
                      <ReportsLineChart
                        color="success"
                        title="Compliance Rate"
                        description="Maintenance Schedule Compliance"
                        date="updated today"
                        chart={tasks}
                      />
                    </MDBox>
                  </Grid>
                  <Grid item xs={12} lg={8}>
                    <Projects />
                  </Grid>
                  <Grid item xs={12} lg={4}>
                    <OrdersOverview />
                  </Grid>
                </Grid>
              </TabPanel>

              {/* Tab Panel 1: Calendar View */}
              <TabPanel value={activeTab} index={1}>
                {loadingMaintenance ? (
                  <MDBox
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    minHeight="400px"
                  >
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                  </MDBox>
                ) : (
                  <MaintenanceCalendar
                    maintenances={maintenances}
                    contracts={contracts}
                    sites={sites}
                  />
                )}
              </TabPanel>

              {/* Tab Panel 2: Analytics */}
              <TabPanel value={activeTab} index={2}>
                <Grid container spacing={3}>
                  {/* Maintenance Status Distribution */}
                  <Grid item xs={12} md={6}>
                    <Card>
                      <CardContent>
                        <MDTypography variant="h6" gutterBottom>
                          Maintenance Status Distribution
                        </MDTypography>
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <MDBox
                              textAlign="center"
                              p={2}
                              bgcolor="success.light"
                              borderRadius="8px"
                            >
                              <MDTypography variant="h4" color="success.main" fontWeight="bold">
                                {maintenanceStats.completed}
                              </MDTypography>
                              <MDTypography variant="caption" color="text.secondary">
                                Completed
                              </MDTypography>
                            </MDBox>
                          </Grid>
                          <Grid item xs={6}>
                            <MDBox textAlign="center" p={2} bgcolor="info.light" borderRadius="8px">
                              <MDTypography variant="h4" color="info.main" fontWeight="bold">
                                {maintenanceStats.scheduled}
                              </MDTypography>
                              <MDTypography variant="caption" color="text.secondary">
                                Scheduled
                              </MDTypography>
                            </MDBox>
                          </Grid>
                          <Grid item xs={6}>
                            <MDBox
                              textAlign="center"
                              p={2}
                              bgcolor="warning.light"
                              borderRadius="8px"
                            >
                              <MDTypography variant="h4" color="warning.main" fontWeight="bold">
                                {
                                  maintenances.filter(
                                    (m) => m.status === "InProgress" || m.status === "In Progress"
                                  ).length
                                }
                              </MDTypography>
                              <MDTypography variant="caption" color="text.secondary">
                                In Progress
                              </MDTypography>
                            </MDBox>
                          </Grid>
                          <Grid item xs={6}>
                            <MDBox
                              textAlign="center"
                              p={2}
                              bgcolor="error.light"
                              borderRadius="8px"
                            >
                              <MDTypography variant="h4" color="error.main" fontWeight="bold">
                                {maintenanceStats.overdue}
                              </MDTypography>
                              <MDTypography variant="caption" color="text.secondary">
                                Overdue
                              </MDTypography>
                            </MDBox>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Recent Maintenance Activities */}
                  <Grid item xs={12} md={6}>
                    <Card>
                      <CardContent>
                        <MDTypography variant="h6" gutterBottom>
                          Recent Activities
                        </MDTypography>
                        <MDBox sx={{ maxHeight: 300, overflowY: "auto" }}>
                          {maintenances
                            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                            .slice(0, 5)
                            .map((maintenance) => {
                              const site = sites.find((s) => {
                                const contract = contracts.find(
                                  (c) => c.id === maintenance.contractId
                                );
                                return contract && s.id === contract.siteId;
                              });

                              return (
                                <MDBox
                                  key={maintenance.id}
                                  p={2}
                                  mb={2}
                                  bgcolor="grey.50"
                                  borderRadius="8px"
                                >
                                  <MDBox
                                    display="flex"
                                    justifyContent="space-between"
                                    alignItems="flex-start"
                                  >
                                    <MDBox>
                                      <MDTypography variant="button" fontWeight="medium">
                                        {maintenance.equipmentModel} - {maintenance.equipmentSerial}
                                      </MDTypography>
                                      <MDTypography
                                        variant="caption"
                                        color="text.secondary"
                                        display="block"
                                      >
                                        {site?.siteName || "Unknown Site"}
                                      </MDTypography>
                                      <MDTypography
                                        variant="caption"
                                        color="info.main"
                                        display="block"
                                      >
                                        {new Date(maintenance.scheduledDate).toLocaleDateString()}
                                      </MDTypography>
                                    </MDBox>
                                    <MDBox>
                                      <span
                                        style={{
                                          padding: "4px 8px",
                                          borderRadius: "12px",
                                          fontSize: "0.75rem",
                                          fontWeight: "bold",
                                          backgroundColor:
                                            maintenance.status === "Completed"
                                              ? "#4caf50"
                                              : maintenance.status === "Scheduled"
                                              ? "#2196f3"
                                              : maintenance.status === "InProgress" ||
                                                maintenance.status === "In Progress"
                                              ? "#ff9800"
                                              : "#f44336",
                                          color: "white",
                                        }}
                                      >
                                        {maintenance.status}
                                      </span>
                                    </MDBox>
                                  </MDBox>
                                </MDBox>
                              );
                            })}
                          {maintenances.length === 0 && (
                            <MDTypography
                              variant="body2"
                              color="text.secondary"
                              textAlign="center"
                              py={4}
                            >
                              No maintenance activities found
                            </MDTypography>
                          )}
                        </MDBox>
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Performance Metrics */}
                  <Grid item xs={12}>
                    <Card>
                      <CardContent>
                        <MDTypography variant="h6" gutterBottom>
                          Performance Metrics
                        </MDTypography>
                        <Grid container spacing={3}>
                          <Grid item xs={12} md={3}>
                            <MDBox textAlign="center">
                              <MDTypography variant="h5" color="success.main" fontWeight="bold">
                                {maintenanceStats.total > 0
                                  ? Math.round(
                                      (maintenanceStats.completed / maintenanceStats.total) * 100
                                    )
                                  : 0}
                                %
                              </MDTypography>
                              <MDTypography variant="caption" color="text.secondary">
                                Completion Rate
                              </MDTypography>
                            </MDBox>
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <MDBox textAlign="center">
                              <MDTypography variant="h5" color="info.main" fontWeight="bold">
                                {contracts.filter((c) => c.status === "Active").length}
                              </MDTypography>
                              <MDTypography variant="caption" color="text.secondary">
                                Active Contracts
                              </MDTypography>
                            </MDBox>
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <MDBox textAlign="center">
                              <MDTypography variant="h5" color="warning.main" fontWeight="bold">
                                {sites.length}
                              </MDTypography>
                              <MDTypography variant="caption" color="text.secondary">
                                Total Sites
                              </MDTypography>
                            </MDBox>
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <MDBox textAlign="center">
                              <MDTypography
                                variant="h5"
                                color={maintenanceStats.overdue > 0 ? "error.main" : "success.main"}
                                fontWeight="bold"
                              >
                                {maintenanceStats.overdue > 0
                                  ? Math.round(
                                      (maintenanceStats.overdue / maintenanceStats.total) * 100
                                    )
                                  : 0}
                                %
                              </MDTypography>
                              <MDTypography variant="caption" color="text.secondary">
                                Overdue Rate
                              </MDTypography>
                            </MDBox>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </TabPanel>
            </MDBox>
          </Card>
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;
