import { useState, useEffect } from "react";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDBadge from "components/MDBadge";
import MDButton from "components/MDButton";
import Icon from "@mui/material/Icon";
import Chip from "@mui/material/Chip";
import PropTypes from "prop-types";
import { formatDate, fetchAllEquipments, deleteEquipment } from "../service/equipment";

export default function equipmentTableData() {
  const [equipments, setEquipments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEquipments = async () => {
      try {
        const data = await fetchAllEquipments();
        setEquipments(data);
      } catch (error) {
        console.error("Error loading equipment:", error);
        setEquipments([]);
      } finally {
        setLoading(false);
      }
    };

    loadEquipments();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this equipment?")) {
      try {
        const success = await deleteEquipment(id);
        if (success) {
          setEquipments((prevEquipments) =>
            prevEquipments.filter((equipment) => equipment.id !== id)
          );
        } else {
          alert("Failed to delete equipment. Please try again.");
        }
      } catch (error) {
        console.error("Error deleting equipment:", error);
        alert("Failed to delete equipment. Please try again.");
      }
    }
  };

  const handleEdit = (id) => {
    // Navigate to edit form
    window.location.href = `/equipment/edit/${id}`;
  };

  const handleView = (id) => {
    // Navigate to details view
    window.location.href = `/equipment/view/${id}`;
  };

  // Equipment Info Component
  const EquipmentInfo = ({ equipment }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDBox ml={0} lineHeight={1}>
        <MDTypography display="block" variant="button" fontWeight="medium">
          {equipment.equipmentModel?.modelName || "Unknown Model"}
        </MDTypography>
        <MDTypography variant="caption" color="text">
          {equipment.equipmentModel?.brand?.name || "Unknown Brand"}
        </MDTypography>
        <MDTypography variant="caption" color="text" display="block">
          Serial: {equipment.serialNumber || "N/A"}
        </MDTypography>
      </MDBox>
    </MDBox>
  );

  EquipmentInfo.propTypes = {
    equipment: PropTypes.object.isRequired,
  };

  // Location Component
  const LocationInfo = ({ location, quantity }) => (
    <MDBox lineHeight={1}>
      <MDTypography variant="caption" color="text" fontWeight="medium" display="block">
        {location || "Not specified"}
      </MDTypography>
      <MDTypography variant="caption" color="text" display="block">
        Qty: {quantity}
      </MDTypography>
    </MDBox>
  );

  LocationInfo.propTypes = {
    location: PropTypes.string,
    quantity: PropTypes.number.isRequired,
  };

  // Status Component
  const StatusBadge = ({ status }) => {
    const getStatusColor = (status) => {
      switch (status?.toLowerCase()) {
        case "active":
          return "success";
        case "faulty":
          return "error";
        case "decommissioned":
          return "secondary";
        default:
          return "info";
      }
    };

    return (
      <MDBadge
        badgeContent={status || "Unknown"}
        color={getStatusColor(status)}
        variant="gradient"
        size="sm"
      />
    );
  };

  StatusBadge.propTypes = {
    status: PropTypes.string,
  };

  // System Type Component
  const SystemTypeChip = ({ systemType, category }) => {
    const getSystemTypeColor = (type) => {
      switch (type?.toLowerCase()) {
        case "addressable":
          return "success";
        case "conventional":
          return "info";
        case "wireless":
          return "warning";
        case "pre-engineered":
          return "primary";
        default:
          return "secondary";
      }
    };

    return (
      <MDBox lineHeight={1}>
        <Chip
          label={systemType || "Unknown"}
          size="small"
          variant="filled"
          color={getSystemTypeColor(systemType)}
        />
        {category && (
          <MDTypography variant="caption" color="text" display="block" mt={0.5}>
            {category}
          </MDTypography>
        )}
      </MDBox>
    );
  };

  SystemTypeChip.propTypes = {
    systemType: PropTypes.string,
    category: PropTypes.string,
  };

  // Features Component
  const FeaturesList = ({ equipment }) => {
    const features = [];
    if (equipment.backupAvailable) features.push("Backup");
    if (equipment.emergencyStickerUpdated) features.push("Emergency Sticker");
    if (equipment.hasOMManual) features.push("O&M Manual");
    if (equipment.hasZoneChart) features.push("Zone Chart");

    return (
      <MDBox display="flex" flexDirection="column" gap={0.2}>
        {features.length > 0 ? (
          features
            .slice(0, 2)
            .map((feature, index) => (
              <Chip
                key={index}
                label={feature}
                size="small"
                variant="outlined"
                color="primary"
                sx={{ fontSize: "0.7rem", height: "16px" }}
              />
            ))
        ) : (
          <MDTypography variant="caption" color="text">
            No features
          </MDTypography>
        )}
        {features.length > 2 && (
          <MDTypography variant="caption" color="text">
            +{features.length - 2} more
          </MDTypography>
        )}
      </MDBox>
    );
  };

  FeaturesList.propTypes = {
    equipment: PropTypes.object.isRequired,
  };

  // Maintenance Info Component
  const MaintenanceInfo = ({ lastMaintenanceDate, nextMaintenanceDate }) => {
    const isOverdue = nextMaintenanceDate && new Date(nextMaintenanceDate) < new Date();

    return (
      <MDBox lineHeight={1}>
        <MDTypography
          variant="caption"
          color={isOverdue ? "error" : "text"}
          fontWeight="medium"
          display="block"
        >
          Next: {nextMaintenanceDate ? formatDate(nextMaintenanceDate) : "Not scheduled"}
        </MDTypography>
        <MDTypography variant="caption" color="text" display="block">
          Last: {lastMaintenanceDate ? formatDate(lastMaintenanceDate) : "Never"}
        </MDTypography>
        {isOverdue && (
          <Chip
            label="Overdue"
            size="small"
            color="error"
            variant="filled"
            sx={{ fontSize: "0.7rem", height: "16px", mt: 0.5 }}
          />
        )}
      </MDBox>
    );
  };

  MaintenanceInfo.propTypes = {
    lastMaintenanceDate: PropTypes.string,
    nextMaintenanceDate: PropTypes.string,
  };

  // Convert equipment data to table rows
  const equipmentRows = equipments.map((equipment) => ({
    equipment: <EquipmentInfo equipment={equipment} />,
    location: <LocationInfo location={equipment.location} quantity={equipment.quantity} />,
    status: <StatusBadge status={equipment.status} />,
    systemType: (
      <SystemTypeChip
        systemType={equipment.equipmentModel?.systemType}
        category={equipment.equipmentModel?.category}
      />
    ),
    features: <FeaturesList equipment={equipment} />,
    maintenance: (
      <MaintenanceInfo
        lastMaintenanceDate={equipment.lastMaintenanceDate}
        nextMaintenanceDate={equipment.nextMaintenanceDate}
      />
    ),
    installationDate: (
      <MDTypography variant="caption" color="text" fontWeight="medium">
        {formatDate(equipment.installationDate)}
      </MDTypography>
    ),
    action: (
      <MDBox display="flex" alignItems="center" gap={0.5}>
        <MDButton
          variant="text"
          color="info"
          size="small"
          title="View Details"
          onClick={() => handleView(equipment.id)}
        >
          <Icon fontSize="small">visibility</Icon>
        </MDButton>
        <MDButton
          variant="text"
          color="warning"
          size="small"
          title="Edit"
          onClick={() => handleEdit(equipment.id)}
        >
          <Icon fontSize="small">edit</Icon>
        </MDButton>
        <MDButton
          variant="text"
          color="error"
          size="small"
          title="Delete"
          onClick={() => handleDelete(equipment.id)}
        >
          <Icon fontSize="small">delete</Icon>
        </MDButton>
      </MDBox>
    ),
  }));

  return {
    columns: [
      { Header: "Equipment", accessor: "equipment", width: "20%", align: "left" },
      { Header: "Location", accessor: "location", width: "12%", align: "left" },
      { Header: "Status", accessor: "status", width: "10%", align: "center" },
      { Header: "System Type", accessor: "systemType", width: "13%", align: "center" },
      { Header: "Features", accessor: "features", width: "12%", align: "left" },
      { Header: "Maintenance", accessor: "maintenance", width: "15%", align: "left" },
      { Header: "Installation", accessor: "installationDate", width: "10%", align: "center" },
      { Header: "Actions", accessor: "action", width: "12%", align: "center" },
    ],
    rows: equipmentRows,
    loading,
    equipmentCount: equipments.length,
  };
}
