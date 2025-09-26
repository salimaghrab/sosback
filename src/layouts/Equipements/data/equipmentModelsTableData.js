import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDBadge from "components/MDBadge";
import MDButton from "components/MDButton";
import Icon from "@mui/material/Icon";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import PropTypes from "prop-types";
import { formatDate, fetchAllEquipmentModels, deleteEquipmentModel } from "../service/equipment";

export default function equipmentModelsTableData() {
  const navigate = useNavigate();
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, model: null });
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    loadModels();
  }, []);

  const loadModels = async () => {
    try {
      setLoading(true);
      const data = await fetchAllEquipmentModels();
      setModels(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading equipment models:", error);
      setModels([]);
      showNotification("Failed to load equipment models", "error");
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, severity = "success") => {
    setNotification({ open: true, message, severity });
  };

  const handleCloseNotification = () => {
    setNotification({ open: false, message: "", severity: "success" });
  };

  const handleDeleteClick = (model) => {
    setDeleteDialog({ open: true, model });
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, model: null });
  };

  const handleDeleteConfirm = async () => {
    const { model } = deleteDialog;
    if (!model) return;

    try {
      const success = await deleteEquipmentModel(model.id);

      if (success) {
        setModels((prevModels) => prevModels.filter((m) => m.id !== model.id));
        showNotification(`Equipment model "${model.modelName}" deleted successfully`, "success");
      } else {
        showNotification("Failed to delete equipment model", "error");
      }
    } catch (error) {
      console.error("Error deleting equipment model:", error);

      // Handle specific error messages from the service
      if (error.message.includes("being used by existing equipment")) {
        showNotification(
          "Cannot delete: This model is currently being used by existing equipment",
          "error"
        );
      } else if (error.message.includes("not found")) {
        showNotification("Equipment model not found", "error");
        // Refresh the list in case it was already deleted
        loadModels();
      } else {
        showNotification(error.message || "Failed to delete equipment model", "error");
      }
    } finally {
      setDeleteDialog({ open: false, model: null });
    }
  };

  const handleEdit = (id) => {
    navigate(`/equipment-models/edit/${id}`);
  };

  const handleView = (id) => {
    navigate(`/equipment-models/view/${id}`);
  };

  const handleAdd = () => {
    navigate("/equipment-models/add");
  };

  // Model Name Component
  const ModelName = ({ modelName, brand, category, subCategory }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDBox ml={0} lineHeight={1}>
        <MDTypography display="block" variant="button" fontWeight="medium">
          {modelName || "Unknown Model"}
        </MDTypography>
        <MDTypography variant="caption" color="text">
          {brand?.name || "Unknown Brand"} - {category || "Unknown Category"}
        </MDTypography>
        {subCategory && (
          <MDTypography variant="caption" color="text" display="block">
            {subCategory}
          </MDTypography>
        )}
      </MDBox>
    </MDBox>
  );

  ModelName.propTypes = {
    modelName: PropTypes.string,
    brand: PropTypes.object,
    category: PropTypes.string,
    subCategory: PropTypes.string,
  };

  // System Type Component
  const SystemTypeChip = ({ systemType }) => {
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
        case "hybrid":
          return "secondary";
        default:
          return "default";
      }
    };

    return (
      <Chip
        label={systemType || "Unknown"}
        size="small"
        variant="filled"
        color={getSystemTypeColor(systemType)}
      />
    );
  };

  SystemTypeChip.propTypes = {
    systemType: PropTypes.string,
  };

  // Specifications Component
  const Specifications = ({ specifications, description }) => (
    <MDBox lineHeight={1}>
      {description && (
        <MDTypography variant="caption" color="text" fontWeight="medium" display="block">
          {description.length > 40 ? `${description.substring(0, 40)}...` : description}
        </MDTypography>
      )}
      {specifications && (
        <MDTypography variant="caption" color="text" display="block" mt={0.5}>
          {specifications.length > 50 ? `${specifications.substring(0, 50)}...` : specifications}
        </MDTypography>
      )}
      {!description && !specifications && (
        <MDTypography variant="caption" color="text" fontStyle="italic">
          No description
        </MDTypography>
      )}
    </MDBox>
  );

  Specifications.propTypes = {
    specifications: PropTypes.string,
    description: PropTypes.string,
  };

  // Maintenance Info Component
  const MaintenanceInfo = ({ maintenanceRequirements, recommendedMaintenanceInterval }) => {
    const getFrequencyLabel = (days) => {
      switch (days) {
        case 30:
          return "Monthly";
        case 90:
          return "Quarterly";
        case 180:
          return "Semi-annually";
        case 365:
          return "Annually";
        default:
          return days ? `Every ${days} days` : "Not specified";
      }
    };

    return (
      <MDBox lineHeight={1}>
        <MDTypography variant="caption" color="text" fontWeight="medium" display="block">
          {getFrequencyLabel(recommendedMaintenanceInterval)}
        </MDTypography>
        {maintenanceRequirements && (
          <MDTypography variant="caption" color="text" display="block" mt={0.5}>
            {maintenanceRequirements.length > 40
              ? `${maintenanceRequirements.substring(0, 40)}...`
              : maintenanceRequirements}
          </MDTypography>
        )}
      </MDBox>
    );
  };

  MaintenanceInfo.propTypes = {
    maintenanceRequirements: PropTypes.string,
    recommendedMaintenanceInterval: PropTypes.number,
  };

  // Convert model data to table rows
  const modelRows = models.map((model) => ({
    model: (
      <ModelName
        modelName={model.modelName}
        brand={model.brand}
        category={model.category}
        subCategory={model.subCategory}
      />
    ),
    brand: (
      <MDTypography variant="caption" color="text" fontWeight="medium">
        {model.brand?.name || "Unknown"}
      </MDTypography>
    ),
    systemType: <SystemTypeChip systemType={model.systemType} />,
    category: (
      <Chip label={model.category || "Unknown"} size="small" variant="outlined" color="primary" />
    ),
    specifications: (
      <Specifications specifications={model.specifications} description={model.description} />
    ),
    maintenance: (
      <MaintenanceInfo
        maintenanceRequirements={model.maintenanceRequirements}
        recommendedMaintenanceInterval={model.recommendedMaintenanceInterval}
      />
    ),
    createdAt: (
      <MDTypography variant="caption" color="text" fontWeight="medium">
        {formatDate(model.createdAt)}
      </MDTypography>
    ),
    action: (
      <MDBox display="flex" alignItems="center" gap={0.5}>
        <MDButton
          variant="text"
          color="info"
          size="small"
          title="View Details"
          onClick={() => handleView(model.id)}
        >
          <Icon fontSize="small">visibility</Icon>
        </MDButton>
        <MDButton
          variant="text"
          color="warning"
          size="small"
          title="Edit"
          onClick={() => handleEdit(model.id)}
        >
          <Icon fontSize="small">edit</Icon>
        </MDButton>
        <MDButton
          variant="text"
          color="error"
          size="small"
          title="Delete"
          onClick={() => handleDeleteClick(model)}
        >
          <Icon fontSize="small">delete</Icon>
        </MDButton>
      </MDBox>
    ),
  }));

  return {
    columns: [
      { Header: "Model", accessor: "model", width: "25%", align: "left" },
      { Header: "Brand", accessor: "brand", width: "12%", align: "left" },
      { Header: "System", accessor: "systemType", width: "12%", align: "center" },
      { Header: "Category", accessor: "category", width: "12%", align: "center" },
      { Header: "Specifications", accessor: "specifications", width: "20%", align: "left" },
      { Header: "Maintenance", accessor: "maintenance", width: "15%", align: "left" },
      { Header: "Created", accessor: "createdAt", width: "10%", align: "center" },
      { Header: "Actions", accessor: "action", width: "12%", align: "center" },
    ],
    rows: modelRows,
    loading,
    modelsCount: models.length,
    handleAdd,

    // Delete Dialog Component
    DeleteDialog: () => (
      <Dialog
        open={deleteDialog.open}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete the equipment model &ldquo;
            {deleteDialog.model?.modelName}&ldquo;? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <MDButton onClick={handleDeleteCancel} color="secondary">
            Cancel
          </MDButton>
          <MDButton onClick={handleDeleteConfirm} color="error" variant="gradient">
            Delete
          </MDButton>
        </DialogActions>
      </Dialog>
    ),

    // Notification Component
    NotificationSnackbar: () => (
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    ),
  };
}
