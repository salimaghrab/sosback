import { useState, useEffect } from "react";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDBadge from "components/MDBadge";
import MDButton from "components/MDButton";
import Icon from "@mui/material/Icon";
import Chip from "@mui/material/Chip";
import PropTypes from "prop-types";
import { formatDate } from "layouts/Equipements/service/equipment";
import { fetchAllSites, handleSiteError } from "../service/maintenanceService";

export default function sitesTableData() {
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSites = async () => {
      try {
        const response = await fetchAllSites();
        console.log("Sites API Response:", response);
        setSites(response);
      } catch (error) {
        console.error("Error loading sites:", handleSiteError(error));
        setSites([]);
      } finally {
        setLoading(false);
      }
    };

    loadSites();
  }, []);

  // Site Name Component
  const SiteName = ({ siteName, clientName, location }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDBox ml={0} lineHeight={1}>
        <MDTypography display="block" variant="button" fontWeight="medium">
          {siteName || "Unknown Site"}
        </MDTypography>
        <MDTypography variant="caption" color="text">
          {clientName || "Unknown Client"}
        </MDTypography>
        {location && (
          <MDTypography variant="caption" color="text" display="block">
            {location.length > 50 ? `${location.substring(0, 50)}...` : location}
          </MDTypography>
        )}
      </MDBox>
    </MDBox>
  );

  SiteName.propTypes = {
    siteName: PropTypes.string,
    clientName: PropTypes.string,
    location: PropTypes.string,
  };

  // Status Component
  const Status = ({ isActive = true }) => (
    <MDBox ml={-1}>
      <MDBadge
        badgeContent={isActive ? "Active" : "Inactive"}
        color={isActive ? "success" : "secondary"}
        variant="gradient"
        size="sm"
      />
    </MDBox>
  );

  Status.propTypes = {
    isActive: PropTypes.bool,
  };

  // Location Component
  const LocationChip = ({ location }) => (
    <Chip label={location || "Unknown Location"} size="small" variant="outlined" color="primary" />
  );

  LocationChip.propTypes = {
    location: PropTypes.string,
  };

  // Convert site data to table rows
  const siteRows = sites.map((site) => ({
    site: (
      <SiteName siteName={site.siteName} clientName={site.clientName} location={site.location} />
    ),
    client: (
      <MDTypography variant="caption" color="text" fontWeight="medium">
        {site.clientName || "Unknown Client"}
      </MDTypography>
    ),
    location: <LocationChip location={site.location} />,
    status: <Status isActive={site.isActive} />,
    createdAt: (
      <MDTypography variant="caption" color="text" fontWeight="medium">
        {formatDate(site.createdAt)}
      </MDTypography>
    ),
    updatedAt: (
      <MDTypography variant="caption" color="text" fontWeight="medium">
        {formatDate(site.updatedAt)}
      </MDTypography>
    ),
    action: (
      <MDBox display="flex" alignItems="center" gap={0.5}>
        <MDButton variant="text" color="info" size="small" title="View Details">
          <Icon fontSize="small">visibility</Icon>
        </MDButton>
        <MDButton variant="text" color="warning" size="small" title="Edit">
          <Icon fontSize="small">edit</Icon>
        </MDButton>
        <MDButton variant="text" color="error" size="small" title="Delete">
          <Icon fontSize="small">delete</Icon>
        </MDButton>
      </MDBox>
    ),
  }));

  return {
    columns: [
      { Header: "Site", accessor: "site", width: "25%", align: "left" },
      { Header: "Client", accessor: "client", width: "20%", align: "left" },
      { Header: "Location", accessor: "location", width: "20%", align: "center" },
      { Header: "Status", accessor: "status", width: "10%", align: "center" },
      { Header: "Created", accessor: "createdAt", width: "10%", align: "center" },
      { Header: "Updated", accessor: "updatedAt", width: "10%", align: "center" },
      { Header: "Actions", accessor: "action", width: "15%", align: "center" },
    ],
    rows: siteRows,
    loading,
    sitesCount: sites.length,
  };
}
