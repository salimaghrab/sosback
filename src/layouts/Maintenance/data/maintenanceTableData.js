// Add this debug version to your maintenanceTableData.js to see what's happening

import { useState, useEffect } from "react";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDBadge from "components/MDBadge";
import MDButton from "components/MDButton";
import Icon from "@mui/material/Icon";
import Chip from "@mui/material/Chip";
import Tooltip from "@mui/material/Tooltip";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import PropTypes from "prop-types";
import { formatDate } from "layouts/Equipements/service/equipment";
import {
  fetchAllMaintenances,
  fetchAllContracts,
  fetchAllSites,
  handleMaintenanceError,
  engineerAssignmentService,
  completeMaintenanceWithValidation,
  ROLE_COLORS,
} from "../service/servicem";
import EngineerAssignmentDialog from "./EngineerAssignmentDialog";

export default function maintenanceTableData() {
  const [maintenances, setMaintenances] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assignmentDialog, setAssignmentDialog] = useState({
    open: false,
    maintenance: null,
  });

  // ADD DEBUG LOGS
  console.log("maintenanceTableData: Current dialog state:", assignmentDialog);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [maintenancesResponse, contractsResponse, sitesResponse] = await Promise.all([
          fetchAllMaintenances(),
          fetchAllContracts(),
          fetchAllSites(),
        ]);
        console.log("Maintenances API Response:", maintenancesResponse);
        setMaintenances(maintenancesResponse || []);
        setContracts(contractsResponse || []);
        setSites(sitesResponse || []);
      } catch (error) {
        console.error("Error loading maintenances:", handleMaintenanceError(error));
        setMaintenances([]);
        setContracts([]);
        setSites([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Function to refresh maintenance data
  const refreshMaintenances = async () => {
    try {
      const maintenancesResponse = await fetchAllMaintenances();
      setMaintenances(maintenancesResponse || []);
    } catch (error) {
      console.error("Error refreshing maintenances:", error);
    }
  };

  // Handle assignment dialog - ADD MORE DEBUG LOGS
  const openAssignmentDialog = (maintenance) => {
    console.log("🔥 openAssignmentDialog called with:", maintenance);
    setAssignmentDialog({
      open: true,
      maintenance: maintenance,
    });
    console.log("🔥 Dialog state should now be open");
  };

  const handleAssignmentDialogClose = () => {
    console.log("🔥 handleAssignmentDialogClose called");
    setAssignmentDialog({ open: false, maintenance: null });
  };

  const handleAssignmentComplete = async () => {
    console.log("🔥 handleAssignmentComplete called");
    await refreshMaintenances();
    handleAssignmentDialogClose();
  };

  // Test button component to verify the function works
  const TestButton = ({ maintenance }) => (
    <MDButton
      variant="contained"
      color="primary"
      size="small"
      onClick={() => {
        console.log("🔥 Test button clicked for maintenance:", maintenance.id);
        openAssignmentDialog(maintenance);
      }}
    >
      TEST DIALOG
    </MDButton>
  );

  TestButton.propTypes = {
    maintenance: PropTypes.object.isRequired,
  };

  // Maintenance Info Component
  const MaintenanceInfo = ({ maintenance }) => {
    const contract = contracts.find((c) => c.id === maintenance.contractId);
    const site = contract ? sites.find((s) => s.id === contract.siteId) : null;

    return (
      <MDBox display="flex" alignItems="center" lineHeight={1}>
        <MDBox ml={0} lineHeight={1}>
          <MDTypography display="block" variant="button" fontWeight="medium">
            {maintenance.contractNumber || contract?.contractNumber || "Unknown Contract"}
          </MDTypography>
          <MDTypography variant="caption" color="text">
            {maintenance.siteName || site?.siteName || "Unknown Site"}
          </MDTypography>
          <MDTypography variant="caption" color="text" display="block">
            Equipment: {maintenance.equipmentModel} ({maintenance.equipmentSerial})
          </MDTypography>
          {maintenance.period && (
            <MDTypography variant="caption" color="info" display="block" fontWeight="medium">
              Period: {maintenance.period}
            </MDTypography>
          )}
        </MDBox>
      </MDBox>
    );
  };

  MaintenanceInfo.propTypes = {
    maintenance: PropTypes.object.isRequired,
  };

  // Enhanced Engineer Assignment Component
  const EngineerAssignment = ({ maintenance }) => {
    const [assignedEngineers, setAssignedEngineers] = useState([]);
    const [validation, setValidation] = useState(null);
    const [loadingEngineers, setLoadingEngineers] = useState(false);

    useEffect(() => {
      loadEngineerData();
    }, [maintenance.id]);

    const loadEngineerData = async () => {
      if (!maintenance.id) return;

      setLoadingEngineers(true);
      try {
        const [engineers, validationResult] = await Promise.all([
          engineerAssignmentService.getAssignedEngineers(maintenance.id),
          engineerAssignmentService.validateMaintenanceEngineers(maintenance.id),
        ]);
        setAssignedEngineers(engineers);
        setValidation(validationResult);
      } catch (error) {
        console.error("Error loading engineer data:", error);
        setAssignedEngineers([]);
        setValidation({ isValid: false, validationErrors: ["Unable to load engineer data"] });
      } finally {
        setLoadingEngineers(false);
      }
    };

    if (loadingEngineers) {
      return (
        <MDBox display="flex" alignItems="center" justifyContent="center">
          <Icon fontSize="small">hourglass_empty</Icon>
        </MDBox>
      );
    }

    const hasValidAssignment =
      validation?.isValid &&
      assignedEngineers.length >= (maintenance.minimumEngineersRequired || 2);
    const statusColor = hasValidAssignment ? "success" : "error";
    const statusIcon = hasValidAssignment ? "check_circle" : "warning";

    return (
      <MDBox>
        <MDBox display="flex" alignItems="center" gap={1} mb={1}>
          <Tooltip
            title={hasValidAssignment ? "Engineers properly assigned" : "Needs engineer assignment"}
          >
            <Icon fontSize="small" color={statusColor}>
              {statusIcon}
            </Icon>
          </Tooltip>

          {assignedEngineers.length > 0 ? (
            <AvatarGroup
              max={3}
              sx={{ "& .MuiAvatar-root": { width: 24, height: 24, fontSize: "0.75rem" } }}
            >
              {assignedEngineers.map((engineer, index) => (
                <Tooltip key={engineer.id} title={`${engineer.name} (${engineer.role})`}>
                  <Avatar sx={{ bgcolor: ROLE_COLORS[engineer.role] || "grey.500" }}>
                    {engineer.name.charAt(0)}
                  </Avatar>
                </Tooltip>
              ))}
            </AvatarGroup>
          ) : (
            <MDTypography variant="caption" color="error">
              No engineers assigned
            </MDTypography>
          )}
        </MDBox>

        <MDBox display="flex" gap={0.5} alignItems="center">
          <Chip
            label={`${assignedEngineers.length}/${maintenance.minimumEngineersRequired || 2}`}
            size="small"
            color={hasValidAssignment ? "success" : "error"}
            variant="outlined"
          />
          {/* UPDATED: Add both buttons for testing */}
          <Tooltip title="Assign Engineers">
            <MDButton
              variant="text"
              color="primary"
              size="small"
              onClick={() => {
                console.log("🔥 Assignment button clicked for:", maintenance.id);
                openAssignmentDialog(maintenance);
              }}
            >
              <Icon fontSize="small">person_add</Icon>
            </MDButton>
          </Tooltip>
          {/* Add test button */}
          <TestButton maintenance={maintenance} />
        </MDBox>
      </MDBox>
    );
  };

  EngineerAssignment.propTypes = {
    maintenance: PropTypes.object.isRequired,
  };

  // Status Component
  const Status = ({ status, scheduledDate, completedDate }) => {
    const isOverdue = !completedDate && new Date(scheduledDate) < new Date();

    const getStatusColor = () => {
      if (isOverdue) return "error";
      switch (status?.toLowerCase()) {
        case "completed":
          return "success";
        case "inprogress":
        case "in progress":
          return "warning";
        case "scheduled":
          return "info";
        case "cancelled":
          return "secondary";
        default:
          return "info";
      }
    };

    const getStatusText = () => {
      if (isOverdue) return "Overdue";
      return status || "Unknown";
    };

    return (
      <MDBox ml={-1}>
        <MDBadge
          badgeContent={getStatusText()}
          color={getStatusColor()}
          variant="gradient"
          size="sm"
        />
      </MDBox>
    );
  };

  Status.propTypes = {
    status: PropTypes.string,
    scheduledDate: PropTypes.string,
    completedDate: PropTypes.string,
  };

  // Date Info Component
  const DateInfo = ({ scheduledDate, completedDate }) => {
    const daysDifference =
      completedDate && scheduledDate
        ? Math.ceil((new Date(completedDate) - new Date(scheduledDate)) / (1000 * 60 * 60 * 24))
        : null;

    return (
      <MDBox textAlign="center">
        <MDTypography variant="caption" color="text" fontWeight="medium">
          Scheduled: {formatDate(scheduledDate)}
        </MDTypography>
        {completedDate && (
          <>
            <MDTypography variant="caption" color="success" display="block" fontWeight="medium">
              Completed: {formatDate(completedDate)}
            </MDTypography>
            {daysDifference !== null && (
              <MDTypography variant="caption" color="info" display="block" fontSize="0.7rem">
                ({daysDifference > 0 ? `+${daysDifference}` : daysDifference} days)
              </MDTypography>
            )}
          </>
        )}
        {!completedDate && (
          <MDTypography variant="caption" color="secondary" display="block">
            Not completed
          </MDTypography>
        )}
      </MDBox>
    );
  };

  DateInfo.propTypes = {
    scheduledDate: PropTypes.string,
    completedDate: PropTypes.string,
  };

  // Contract Warning Component
  const ContractWarning = ({ contractId }) => {
    const contract = contracts.find((c) => c.id === contractId);
    if (!contract) return null;

    const isExpiringSoon =
      new Date(contract.endDate) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    if (isExpiringSoon) {
      return (
        <Chip
          label="Contract expiring soon"
          size="small"
          color="warning"
          variant="outlined"
          icon={<Icon fontSize="small">warning</Icon>}
        />
      );
    }

    return null;
  };

  ContractWarning.propTypes = {
    contractId: PropTypes.string,
  };

  // Simplified Actions Component
  const Actions = ({ maintenance, onView, onEdit, onDelete, onMarkCompleted }) => {
    const [loadingComplete, setLoadingComplete] = useState(false);

    const handleMarkCompleted = async () => {
      setLoadingComplete(true);
      try {
        const validation = await engineerAssignmentService.validateMaintenanceEngineers(
          maintenance.id
        );

        if (!validation.isValid) {
          alert(`Cannot complete maintenance: ${validation.validationErrors.join(", ")}`);
          return;
        }

        await completeMaintenanceWithValidation(maintenance.id, {
          completedDate: new Date().toISOString(),
          completionNotes: "Completed via table action",
        });

        await refreshMaintenances();
      } catch (error) {
        console.error("Error completing maintenance:", error);
        alert(`Error completing maintenance: ${error.message}`);
      } finally {
        setLoadingComplete(false);
      }
    };

    return (
      <MDBox display="flex" alignItems="center" gap={0.5}>
        <Tooltip title="View Details">
          <MDButton variant="text" color="info" size="small" onClick={() => onView(maintenance)}>
            <Icon fontSize="small">visibility</Icon>
          </MDButton>
        </Tooltip>

        <Tooltip title="Edit">
          <MDButton variant="text" color="warning" size="small" onClick={() => onEdit(maintenance)}>
            <Icon fontSize="small">edit</Icon>
          </MDButton>
        </Tooltip>

        {maintenance.status !== "Completed" && (
          <Tooltip title="Mark as Completed">
            <MDButton
              variant="text"
              color="success"
              size="small"
              onClick={handleMarkCompleted}
              disabled={loadingComplete}
            >
              <Icon fontSize="small">{loadingComplete ? "hourglass_empty" : "check_circle"}</Icon>
            </MDButton>
          </Tooltip>
        )}

        <Tooltip title="Delete">
          <MDButton
            variant="text"
            color="error"
            size="small"
            onClick={() => onDelete(maintenance.id)}
          >
            <Icon fontSize="small">delete</Icon>
          </MDButton>
        </Tooltip>
      </MDBox>
    );
  };

  Actions.propTypes = {
    maintenance: PropTypes.object.isRequired,
    onView: PropTypes.func,
    onEdit: PropTypes.func,
    onDelete: PropTypes.func,
    onMarkCompleted: PropTypes.func,
  };

  // Convert maintenance data to table rows
  const maintenanceRows = maintenances.map((maintenance) => {
    const contract = contracts.find((c) => c.id === maintenance.contractId);

    return {
      maintenance: <MaintenanceInfo maintenance={maintenance} />,
      contract: (
        <MDBox>
          <MDTypography variant="caption" color="text" fontWeight="medium">
            {maintenance.contractNumber || contract?.contractNumber || "Unknown Contract"}
          </MDTypography>
          <ContractWarning contractId={maintenance.contractId} />
        </MDBox>
      ),
      engineers: <EngineerAssignment maintenance={maintenance} />,
      dates: (
        <DateInfo
          scheduledDate={maintenance.scheduledDate}
          completedDate={maintenance.completedDate}
        />
      ),
      status: (
        <Status
          status={maintenance.status}
          scheduledDate={maintenance.scheduledDate}
          completedDate={maintenance.completedDate}
        />
      ),
      period: (
        <MDBox textAlign="center">
          <Chip
            label={maintenance.period || "N/A"}
            size="small"
            variant="outlined"
            color="primary"
          />
        </MDBox>
      ),
      remarks: (
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {maintenance.remarks
            ? maintenance.remarks.length > 30
              ? `${maintenance.remarks.substring(0, 30)}...`
              : maintenance.remarks
            : "No remarks"}
        </MDTypography>
      ),
      createdAt: (
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {formatDate(maintenance.createdAt)}
        </MDTypography>
      ),
      action: (
        <Actions
          maintenance={maintenance}
          onView={() => console.log("View maintenance:", maintenance.id)}
          onEdit={() => console.log("Edit maintenance:", maintenance.id)}
          onDelete={() => console.log("Delete maintenance:", maintenance.id)}
          onMarkCompleted={() => console.log("Mark completed:", maintenance.id)}
        />
      ),
    };
  });

  // DEBUG: Log what we're returning
  console.log("🔥 maintenanceTableData returning dialog state:", {
    open: assignmentDialog.open,
    maintenance: assignmentDialog.maintenance?.id,
  });

  return {
    columns: [
      { Header: "Maintenance", accessor: "maintenance", width: "20%", align: "left" },
      { Header: "Contract", accessor: "contract", width: "15%", align: "left" },
      { Header: "Engineers", accessor: "engineers", width: "15%", align: "center" },
      { Header: "Dates", accessor: "dates", width: "15%", align: "center" },
      { Header: "Status", accessor: "status", width: "10%", align: "center" },
      { Header: "Period", accessor: "period", width: "8%", align: "center" },
      { Header: "Remarks", accessor: "remarks", width: "10%", align: "left" },
      { Header: "Created", accessor: "createdAt", width: "7%", align: "center" },
      { Header: "Actions", accessor: "action", width: "15%", align: "center" },
    ],
    rows: maintenanceRows,
    loading,
    maintenancesCount: maintenances.length,
    overdue: maintenances.filter((m) => !m.completedDate && new Date(m.scheduledDate) < new Date())
      .length,
    completed: maintenances.filter((m) => m.status === "Completed").length,
    scheduled: maintenances.filter((m) => m.status === "Scheduled").length,

    // IMPORTANT: Return dialog state and handlers
    assignmentDialog,
    openAssignmentDialog,
    handleAssignmentDialogClose,
    handleAssignmentComplete,
    refreshData: refreshMaintenances,
  };
}
