import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Tooltip from "@mui/material/Tooltip";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

import { fetchAllBrands } from "./service/brandService";
import brandTableData from "./data/brandTableData";

function Brands() {
  const navigate = useNavigate();
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterActive, setFilterActive] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadBrands();
  }, []);

  const loadBrands = async () => {
    try {
      setLoading(true);
      const data = await fetchAllBrands();
      // Expecting an array of brand objects
      setBrands(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erreur lors du chargement des brands:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBrand = () => navigate("/brands/add");
  const handleRefresh = () => loadBrands();

  // Optionally apply small client-side filters before passing to brandTableData
  const filtered = brands
    .filter((b) => {
      if (filterActive === "active") return b.isActive === true;
      if (filterActive === "inactive") return b.isActive === false;
      return true;
    })
    .filter((b) => {
      if (!searchTerm) return true;
      const t = searchTerm.toLowerCase();
      return (
        (b.name || "").toLowerCase().includes(t) ||
        (b.category || "").toLowerCase().includes(t) ||
        (b.notes || "").toLowerCase().includes(t)
      );
    });

  const tableData = brandTableData(filtered, { navigate, refresh: loadBrands });

  if (loading) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox
          pt={6}
          pb={3}
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="50vh"
        >
          <MDTypography variant="h4" color="text">
            Loading brands...
          </MDTypography>
        </MDBox>
      </DashboardLayout>
    );
  }

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
                bgColor="primary"
                borderRadius="lg"
                coloredShadow="primary"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <MDBox display="flex" alignItems="center">
                  <Icon sx={{ color: "white", mr: 1 }}>branding_watermark</Icon>
                  <MDTypography variant="h6" color="white">
                    Brands
                  </MDTypography>
                </MDBox>

                <MDBox display="flex" gap={1}>
                  <MDButton
                    variant="gradient"
                    color="light"
                    size="small"
                    onClick={handleRefresh}
                    startIcon={<Icon>refresh</Icon>}
                  >
                    Refresh
                  </MDButton>
                  <MDButton
                    variant="gradient"
                    color="light"
                    size="small"
                    onClick={handleAddBrand}
                    startIcon={<Icon>add</Icon>}
                  >
                    New Brand
                  </MDButton>
                </MDBox>
              </MDBox>

              <MDBox p={3}>
                <MDBox display="flex" gap={1} mb={2} alignItems="center">
                  <MDTypography>Filter:</MDTypography>
                  <Chip
                    label="All"
                    onClick={() => setFilterActive("all")}
                    clickable
                    variant={filterActive === "all" ? "filled" : "outlined"}
                  />
                  <Chip
                    label="Active"
                    onClick={() => setFilterActive("active")}
                    clickable
                    variant={filterActive === "active" ? "filled" : "outlined"}
                  />
                  <Chip
                    label="Inactive"
                    onClick={() => setFilterActive("inactive")}
                    clickable
                    variant={filterActive === "inactive" ? "filled" : "outlined"}
                  />
                  <MDBox flexGrow={1} />
                  <input
                    placeholder="Search name / category / notes"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #ddd" }}
                  />
                </MDBox>

                <DataTable
                  table={tableData}
                  isSorted={true}
                  entriesPerPage={{ defaultValue: 10, entries: [5, 10, 15] }}
                  showTotalEntries={true}
                  noEndBorder
                  canSearch={false}
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Brands;
