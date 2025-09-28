import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDBadge from "components/MDBadge";
import MDButton from "components/MDButton";
import Icon from "@mui/material/Icon";
import PropTypes from "prop-types";
import { formatDate } from "layouts/Equipements/service/equipment";
import { fetchAllContracts, fetchAllSites } from "../service/servicem";
import { handleContractError } from "../service/maintenanceService";
export default function contractsTableData({ onEditContract, onDeleteContract, onViewContract }) {
  const navigate = useNavigate();

  // Add contract navigation handler
  const handleAddContract = () => {
    navigate("/contracts/add");
  };
  const [contracts, setContracts] = useState([]);
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [contractsResponse, sitesResponse] = await Promise.all([
          fetchAllContracts(),
          fetchAllSites(),
        ]);
        console.log("Contracts API Response:", contractsResponse);
        setContracts(contractsResponse);
        setSites(sitesResponse);
      } catch (error) {
        console.error("Error loading contracts:", handleContractError(error));
        setContracts([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Contract Info Component
  const ContractInfo = ({ contractNumber, siteId, responsibleEngineer }) => {
    const site = sites.find((s) => s.id === siteId);
    const engineerName =
      typeof responsibleEngineer === "object"
        ? responsibleEngineer?.name || "Unassigned"
        : responsibleEngineer || "Unassigned";

    return (
      <MDBox display="flex" alignItems="center" lineHeight={1}>
        <MDBox ml={0} lineHeight={1}>
          <MDTypography display="block" variant="button" fontWeight="medium">
            {contractNumber || "Unknown Contract"}
          </MDTypography>
          <MDTypography variant="caption" color="text">
            {site?.siteName || "Unknown Site"}
          </MDTypography>
          <MDTypography variant="caption" color="text" display="block">
            Engineer:{" "}
            {engineerName.length > 30 ? `${engineerName.substring(0, 30)}...` : engineerName}
          </MDTypography>
        </MDBox>
      </MDBox>
    );
  };

  ContractInfo.propTypes = {
    contractNumber: PropTypes.string,
    siteId: PropTypes.string,
    responsibleEngineer: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  };

  // Status Component
  const Status = ({ status }) => {
    const getStatusColor = (status) => {
      switch (status?.toLowerCase()) {
        case "active":
          return "success";
        case "expired":
          return "error";
        case "renewal":
          return "warning";
        case "terminated":
        case "suspended":
          return "secondary";
        case "pending":
          return "info";
        default:
          return "info";
      }
    };

    return (
      <MDBox ml={-1}>
        <MDBadge
          badgeContent={status || "Unknown"}
          color={getStatusColor(status)}
          variant="gradient"
          size="sm"
        />
      </MDBox>
    );
  };

  Status.propTypes = {
    status: PropTypes.string,
  };

  // Contract Value Component
  const ContractValue = ({ contractValue, currency }) => (
    <MDBox textAlign="center">
      <MDTypography
        variant="caption"
        color="text"
        fontWeight="medium"
        sx={{ fontFamily: "monospace" }}
      >
        {contractValue ? `${contractValue.toLocaleString()} ${currency || "QAR"}` : "N/A"}
      </MDTypography>
    </MDBox>
  );

  ContractValue.propTypes = {
    contractValue: PropTypes.number,
    currency: PropTypes.string,
  };

  // Duration Component
  const Duration = ({ durationYears, startDate, endDate }) => (
    <MDBox textAlign="center">
      <MDTypography variant="caption" color="text" fontWeight="medium">
        {durationYears} year{durationYears !== 1 ? "s" : ""}
      </MDTypography>
      <MDTypography variant="caption" color="text" display="block" fontSize="0.7rem">
        {formatDate(startDate)} - {formatDate(endDate)}
      </MDTypography>
    </MDBox>
  );

  Duration.propTypes = {
    durationYears: PropTypes.number,
    startDate: PropTypes.string,
    endDate: PropTypes.string,
  };

  // Expiration Warning Component
  const ExpirationWarning = ({ endDate }) => {
    const isExpiringSoon = new Date(endDate) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    const isExpired = new Date(endDate) < new Date();

    if (isExpired) {
      return (
        <MDBox display="flex" alignItems="center" gap={0.5}>
          <MDTypography variant="caption" color="error" fontWeight="medium">
            {formatDate(endDate)}
          </MDTypography>
          <Icon fontSize="small" color="error">
            warning
          </Icon>
        </MDBox>
      );
    }

    if (isExpiringSoon) {
      return (
        <MDBox display="flex" alignItems="center" gap={0.5}>
          <MDTypography variant="caption" color="warning" fontWeight="medium">
            {formatDate(endDate)}
          </MDTypography>
          <Icon fontSize="small" color="warning">
            schedule
          </Icon>
        </MDBox>
      );
    }

    return (
      <MDTypography variant="caption" color="text" fontWeight="medium">
        {formatDate(endDate)}
      </MDTypography>
    );
  };

  ExpirationWarning.propTypes = {
    endDate: PropTypes.string,
  };

  // Table Header with Add Navigation Button
  const TableHeader = () => (
    <MDBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
      <MDBox>
        <MDTypography variant="h6" fontWeight="medium">
          Maintenance Contracts ({contracts.length})
        </MDTypography>
        <MDTypography variant="caption" color="text">
          Manage your maintenance contracts and equipment
        </MDTypography>
        {/* Contract statistics */}
        <MDBox display="flex" gap={2} mt={1}>
          <MDTypography variant="caption" color="success" fontWeight="medium">
            Active: {contracts.filter((c) => c.status?.toLowerCase() === "active").length}
          </MDTypography>
          <MDTypography variant="caption" color="warning" fontWeight="medium">
            Expiring Soon:{" "}
            {
              contracts.filter((c) => {
                const endDate = new Date(c.endDate);
                const now = new Date();
                const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
                return endDate <= thirtyDaysFromNow && endDate >= now;
              }).length
            }
          </MDTypography>
          <MDTypography variant="caption" color="error" fontWeight="medium">
            Expired: {contracts.filter((c) => new Date(c.endDate) < new Date()).length}
          </MDTypography>
        </MDBox>
      </MDBox>

      {/* Navigation to Add Contract Page */}
      <MDBox display="flex" alignItems="center" gap={1}>
        {/* Optional: Export button */}
        <MDButton
          variant="outlined"
          color="info"
          size="small"
          startIcon={<Icon>file_download</Icon>}
          sx={{ mr: 1 }}
          onClick={() => {
            // Export functionality
            console.log("Export contracts");
          }}
        >
          Export
        </MDButton>

        {/* Main Add Contract Navigation Button */}
        <MDButton
          variant="gradient"
          color="success"
          size="medium"
          onClick={handleAddContract}
          startIcon={<Icon>add</Icon>}
          sx={{
            boxShadow: 3,
            color: "white",
            "&:hover": {
              boxShadow: 6,
              transform: "translateY(-1px)",
            },
            transition: "all 0.2s ease-in-out",
          }}
        >
          New Contract
        </MDButton>
      </MDBox>
    </MDBox>
  );

  // Quick Action Floating Button (Optional)
  const QuickActions = () => (
    <MDBox
      position="fixed"
      bottom={24}
      right={24}
      zIndex={1000}
      display="flex"
      flexDirection="column"
      gap={1}
    >
      <MDButton
        variant="gradient"
        color="success"
        size="large"
        onClick={handleAddContract}
        sx={{
          borderRadius: "50%",
          minWidth: 56,
          width: 56,
          height: 56,
          boxShadow: 6,
          "&:hover": {
            boxShadow: 8,
            transform: "scale(1.1)",
          },
          transition: "all 0.2s ease-in-out",
        }}
        title="Add New Contract"
      >
        <Icon fontSize="large">add</Icon>
      </MDButton>
    </MDBox>
  );

  // Convert contract data to table rows
  const contractRows = contracts.map((contract) => ({
    contract: (
      <ContractInfo
        contractNumber={contract.contractNumber}
        siteId={contract.siteId}
        responsibleEngineer={contract.responsibleEngineer}
      />
    ),
    site: (
      <MDTypography variant="caption" color="text" fontWeight="medium">
        {sites.find((s) => s.id === contract.siteId)?.siteName || "Unknown Site"}
      </MDTypography>
    ),
    value: <ContractValue contractValue={contract.contractValue} currency={contract.currency} />,
    duration: (
      <Duration
        durationYears={contract.durationYears}
        startDate={contract.startDate}
        endDate={contract.endDate}
      />
    ),
    status: <Status status={contract.status} />,
    endDate: <ExpirationWarning endDate={contract.endDate} />,
    createdAt: (
      <MDTypography variant="caption" color="text" fontWeight="medium">
        {formatDate(contract.createdAt)}
      </MDTypography>
    ),
    action: (
      <MDBox display="flex" alignItems="center" gap={0.5}>
        <MDButton
          variant="text"
          color="info"
          size="small"
          title="View Details"
          onClick={() => onViewContract && onViewContract(contract)}
        >
          <Icon fontSize="small">visibility</Icon>
        </MDButton>
        <MDButton
          variant="text"
          color="warning"
          size="small"
          title="Edit Contract"
          onClick={() => onEditContract && onEditContract(contract)}
        >
          <Icon fontSize="small">edit</Icon>
        </MDButton>
        <MDButton
          variant="text"
          color="error"
          size="small"
          title="Delete Contract"
          onClick={() => onDeleteContract && onDeleteContract(contract.id)}
        >
          <Icon fontSize="small">delete</Icon>
        </MDButton>
      </MDBox>
    ),
  }));

  return {
    columns: [
      { Header: "Contract", accessor: "contract", width: "25%", align: "left" },
      { Header: "Site", accessor: "site", width: "15%", align: "left" },
      { Header: "Value", accessor: "value", width: "15%", align: "center" },
      { Header: "Duration", accessor: "duration", width: "15%", align: "center" },
      { Header: "Status", accessor: "status", width: "10%", align: "center" },
      { Header: "End Date", accessor: "endDate", width: "12%", align: "center" },
      { Header: "Created", accessor: "createdAt", width: "8%", align: "center" },
      { Header: "Actions", accessor: "action", width: "10%", align: "center" },
    ],
    rows: contractRows,
    loading,
    contractsCount: contracts.length,
    TableHeader, // Header with navigation button
    QuickActions, // Optional floating action button
    handleAddContract, // Export the navigation function

    // Function to refresh data
    refreshData: async () => {
      setLoading(true);
      try {
        const [contractsResponse, sitesResponse] = await Promise.all([
          fetchAllContracts(),
          fetchAllSites(),
        ]);
        setContracts(contractsResponse);
        setSites(sitesResponse);
      } catch (error) {
        console.error("Error refreshing contracts:", handleContractError(error));
      } finally {
        setLoading(false);
      }
    },
  };
}
