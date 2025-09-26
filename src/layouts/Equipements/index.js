import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

// Import the equipment data
import equipmentTableData from "layouts/Equipements/data/equipmentTableData";
import brandsTableData from "layouts/Equipements/data/brandsTableData";
import equipmentModelsTableData from "layouts/Equipements/data/equipmentModelsTableData";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`equipment-tabpanel-${index}`}
      aria-labelledby={`equipment-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}
TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};
function Equipment() {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);

  // Get data for all equipment types
  const equipmentData = equipmentTableData();
  const brandsData = brandsTableData();
  const modelsData = equipmentModelsTableData();

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Navigation handlers
  const handleAddEquipment = () => {
    navigate("/equipments/add");
  };

  const handleAddBrand = () => {
    navigate("/brands/add");
  };

  const handleAddModel = () => {
    navigate("/equipment-models/add");
  };

  const tabsConfig = [
    {
      label: "Equipment",
      icon: "precision_manufacturing",
      count: equipmentData.equipmentCount,
      data: equipmentData,
      addHandler: handleAddEquipment,
      addButtonText: "Add Equipment",
      bgColor: "info",
      description: "Manage all fire safety equipment installed at various sites",
    },
    {
      label: "Equipment Models",
      icon: "category",
      count: modelsData.modelsCount,
      data: modelsData,
      addHandler: handleAddModel,
      addButtonText: "Add Model",
      bgColor: "primary",
      description: "Manage equipment model specifications and categories",
    },
    {
      label: "Brands",
      icon: "business",
      count: brandsData.brandsCount,
      data: brandsData,
      addHandler: handleAddBrand,
      addButtonText: "Add Brand",
      bgColor: "success",
      description: "Manage equipment manufacturers and brand information",
    },
  ];

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          {/* Header Card */}
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="dark"
                borderRadius="lg"
                coloredShadow="dark"
              >
                <MDBox display="flex" alignItems="center" justifyContent="space-between">
                  <MDBox>
                    <MDTypography variant="h4" color="white" fontWeight="bold">
                      Equipment Management System
                    </MDTypography>
                    <MDTypography variant="body2" color="white" opacity={0.8} mt={0.5}>
                      Comprehensive fire safety equipment, models, and brands management
                    </MDTypography>
                  </MDBox>
                  <MDBox display="flex" alignItems="center">
                    <Icon sx={{ color: "white", fontSize: "3rem" }}>security</Icon>
                  </MDBox>
                </MDBox>
              </MDBox>
            </Card>
          </Grid>

          {/* Statistics Cards */}
          <Grid item xs={12}>
            <Grid container spacing={3}>
              {tabsConfig.map((config, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Card>
                    <MDBox
                      p={3}
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      variant="gradient"
                      bgColor={config.bgColor}
                      borderRadius="lg"
                      coloredShadow={config.bgColor}
                    >
                      <MDBox>
                        <MDTypography variant="h6" color="white" fontWeight="medium">
                          {config.label}
                        </MDTypography>
                        <MDTypography variant="h3" color="white" fontWeight="bold" mt={1}>
                          {config.count || 0}
                        </MDTypography>
                        <MDTypography variant="caption" color="white" opacity={0.8}>
                          Total {config.label.toLowerCase()}
                        </MDTypography>
                      </MDBox>
                      <MDBox>
                        <Icon sx={{ color: "white", fontSize: "2.5rem" }}>{config.icon}</Icon>
                      </MDBox>
                    </MDBox>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Main Content with Tabs */}
          <Grid item xs={12}>
            <Card>
              <MDBox sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                  value={tabValue}
                  onChange={handleTabChange}
                  aria-label="equipment management tabs"
                  sx={{ px: 3, pt: 2 }}
                >
                  {tabsConfig.map((config, index) => (
                    <Tab
                      key={index}
                      icon={<Icon>{config.icon}</Icon>}
                      iconPosition="start"
                      label={
                        <MDBox display="flex" alignItems="center" gap={1}>
                          <MDTypography variant="button" fontWeight="medium">
                            {config.label}
                          </MDTypography>
                          <MDBox
                            sx={{
                              backgroundColor:
                                config.bgColor === "info"
                                  ? "#1976d2"
                                  : config.bgColor === "primary"
                                  ? "#7b1fa2"
                                  : "#2e7d32",
                              color: "white",
                              borderRadius: "50%",
                              width: 20,
                              height: 20,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "0.75rem",
                            }}
                          >
                            {config.count || 0}
                          </MDBox>
                        </MDBox>
                      }
                      sx={{
                        textTransform: "none",
                        minHeight: "auto",
                        py: 1.5,
                      }}
                    />
                  ))}
                </Tabs>
              </MDBox>

              {tabsConfig.map((config, index) => (
                <TabPanel key={index} value={tabValue} index={index}>
                  {/* Tab Header */}
                  <MDBox
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={3}
                    p={2}
                    sx={{
                      backgroundColor: `${config.bgColor}.main`,
                      borderRadius: "lg",
                      background: `linear-gradient(45deg, var(--mdc-theme-${config.bgColor}) 30%, var(--mdc-theme-${config.bgColor}-dark) 90%)`,
                    }}
                  >
                    <MDBox>
                      <MDTypography variant="h5" color="white" fontWeight="bold">
                        {config.label} Management
                      </MDTypography>
                      <MDTypography variant="body2" color="white" opacity={0.9} mt={0.5}>
                        {config.description}
                      </MDTypography>
                    </MDBox>
                    <MDButton
                      variant="contained"
                      color="light"
                      size="medium"
                      onClick={config.addHandler}
                      startIcon={<Icon>add</Icon>}
                      sx={{
                        boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow: "0 6px 12px rgba(0,0,0,0.3)",
                        },
                      }}
                    >
                      {config.addButtonText}
                    </MDButton>
                  </MDBox>

                  {/* Table Content */}
                  {config.data.loading ? (
                    <MDBox p={6} textAlign="center">
                      <Icon sx={{ fontSize: "3rem", color: "text.secondary", mb: 2 }}>
                        hourglass_empty
                      </Icon>
                      <MDTypography variant="h6" color="text.secondary">
                        Loading {config.label.toLowerCase()}...
                      </MDTypography>
                    </MDBox>
                  ) : config.data.rows && config.data.rows.length > 0 ? (
                    <DataTable
                      table={{
                        columns: config.data.columns,
                        rows: config.data.rows,
                      }}
                      isSorted={true}
                      entriesPerPage={{
                        defaultValue: 10,
                        entries: [5, 10, 25, 50],
                      }}
                      showTotalEntries={true}
                      noEndBorder
                      canSearch={true}
                    />
                  ) : (
                    <MDBox p={6} textAlign="center">
                      <Icon sx={{ fontSize: "4rem", color: "text.secondary", mb: 2 }}>
                        {config.icon}
                      </Icon>
                      <MDTypography variant="h5" color="text.secondary" mb={1}>
                        No {config.label} Found
                      </MDTypography>
                      <MDTypography variant="body2" color="text.secondary" mb={3}>
                        Start by adding your first {config.label.toLowerCase()} to get started.
                      </MDTypography>
                      <MDButton
                        variant="gradient"
                        color={config.bgColor}
                        onClick={config.addHandler}
                        startIcon={<Icon>add</Icon>}
                      >
                        {config.addButtonText}
                      </MDButton>
                    </MDBox>
                  )}
                </TabPanel>
              ))}
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default Equipment;
