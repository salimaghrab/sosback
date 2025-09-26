// Create this as a separate test component to verify the dialog works
// File: TestEngineerDialog.js

import React, { useState } from "react";
import { Button, Box } from "@mui/material";
import EngineerAssignmentDialog from "./EngineerAssignmentDialog";
const TestEngineerDialog = () => {
  const [dialogOpen, setDialogOpen] = useState(false);

  // Mock maintenance data
  const mockMaintenance = {
    id: "test-maintenance-id",
    contractNumber: "TEST-001",
    equipmentModel: "Test Equipment",
    scheduledDate: "2024-01-15T10:00:00Z",
    maintenanceType: "Preventive",
    status: "Scheduled",
    minimumEngineersRequired: 2,
  };

  const handleOpenDialog = () => {
    console.log("Opening dialog...");
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    console.log("Closing dialog...");
    setDialogOpen(false);
  };

  const handleAssignmentComplete = () => {
    console.log("Assignment completed!");
    setDialogOpen(false);
  };

  return (
    <Box p={3}>
      <Button variant="contained" onClick={handleOpenDialog} size="large">
        Test Engineer Assignment Dialog
      </Button>

      <EngineerAssignmentDialog
        open={dialogOpen}
        maintenance={mockMaintenance}
        onClose={handleCloseDialog}
        onAssignmentComplete={handleAssignmentComplete}
      />
    </Box>
  );
};

export default TestEngineerDialog;
