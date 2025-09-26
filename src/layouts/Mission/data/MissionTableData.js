import { useMemo } from "react";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import Icon from "@mui/material/Icon";
import Chip from "@mui/material/Chip";

export default function missionsTableData() {
  const columns = useMemo(
    () => [
      { Header: "Mission", accessor: "mission", width: "25%", align: "left" },
      { Header: "Technician", accessor: "technician", align: "left" },
      { Header: "Project / Client", accessor: "project", align: "left" },
      { Header: "Scheduled", accessor: "scheduled", align: "center" },
      { Header: "Systems", accessor: "systems", align: "left" },
      { Header: "Status", accessor: "status", align: "center" },
      { Header: "Priority", accessor: "priority", align: "center" },
      { Header: "Actions", accessor: "actions", align: "center" },
    ],
    []
  );

  const rows = useMemo(
    () => [
      {
        mission: (
          <MDBox lineHeight={1}>
            <MDTypography display="block" variant="button" fontWeight="medium">
              Monthly Fire Safety Check
            </MDTypography>
            <MDTypography variant="caption" color="text" display="block">
              Routine Inspection – Downtown Office Building
            </MDTypography>
          </MDBox>
        ),
        technician: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            Sarah Johnson (HVAC Specialist)
          </MDTypography>
        ),
        project: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            XYZ Corporation – Shopping Mall Complex
          </MDTypography>
        ),
        scheduled: (
          <MDBox textAlign="center">
            <MDTypography variant="button" fontWeight="medium">
              Dec 12, 2024 – 02:00 PM
            </MDTypography>
            <MDTypography variant="caption" color="text" display="block">
              Est: 2 hours
            </MDTypography>
          </MDBox>
        ),
        systems: (
          <MDBox>
            <Chip label="Ventilation" size="small" sx={{ mr: 0.5 }} />
            <Chip label="HVAC" size="small" sx={{ mr: 0.5 }} />
          </MDBox>
        ),
        status: <Chip label="In Progress" color="success" size="small" />,
        priority: <Chip label="Critical" color="error" size="small" />,
        actions: (
          <MDBox display="flex" alignItems="center">
            <MDButton variant="text" color="info" size="small">
              <Icon>visibility</Icon>
            </MDButton>
            <MDButton variant="text" color="warning" size="small">
              <Icon>pause</Icon>
            </MDButton>
            <MDButton variant="text" color="success" size="small">
              <Icon>check_circle</Icon>
            </MDButton>
          </MDBox>
        ),
      },
      {
        mission: (
          <MDBox lineHeight={1}>
            <MDTypography display="block" variant="button" fontWeight="medium">
              Quarterly Safety Audit
            </MDTypography>
            <MDTypography variant="caption" color="text" display="block">
              Routine Inspection – Industrial Warehouse
            </MDTypography>
          </MDBox>
        ),
        technician: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            Mike Wilson (Safety Systems Expert)
          </MDTypography>
        ),
        project: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            DEF Industries – Industrial Warehouse
          </MDTypography>
        ),
        scheduled: (
          <MDBox textAlign="center">
            <MDTypography variant="button" fontWeight="medium">
              Dec 18, 2024 – 08:00 AM
            </MDTypography>
            <MDTypography variant="caption" color="text" display="block">
              Est: 6 hours
            </MDTypography>
          </MDBox>
        ),
        systems: (
          <MDBox>
            <Chip label="Sprinkler" size="small" sx={{ mr: 0.5 }} />
            <Chip label="Emergency Lighting" size="small" sx={{ mr: 0.5 }} />
            <Chip label="Ventilation" size="small" sx={{ mr: 0.5 }} />
          </MDBox>
        ),
        status: <Chip label="Scheduled" color="info" size="small" />,
        priority: <Chip label="High" color="warning" size="small" />,
        actions: (
          <MDBox display="flex" alignItems="center">
            <MDButton variant="text" color="info" size="small">
              <Icon>edit</Icon>
            </MDButton>
            <MDButton variant="text" color="success" size="small">
              <Icon>start</Icon>
            </MDButton>
            <MDButton variant="text" color="error" size="small">
              <Icon>cancel</Icon>
            </MDButton>
          </MDBox>
        ),
      },
      {
        mission: (
          <MDBox lineHeight={1}>
            <MDTypography display="block" variant="button" fontWeight="medium">
              Follow-up Dry Chemical System
            </MDTypography>
            <MDTypography variant="caption" color="text" display="block">
              Follow-up Inspection – Manufacturing Plant
            </MDTypography>
          </MDBox>
        ),
        technician: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            John Smith (Fire & Safety Specialist)
          </MDTypography>
        ),
        project: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            GHI Manufacturing – Manufacturing Plant
          </MDTypography>
        ),
        scheduled: (
          <MDBox textAlign="center">
            <MDTypography variant="button" fontWeight="medium">
              Dec 20, 2024 – 10:00 AM
            </MDTypography>
            <MDTypography variant="caption" color="text" display="block">
              Est: 3 hours
            </MDTypography>
          </MDBox>
        ),
        systems: (
          <MDBox>
            <Chip label="Dry Chemical" size="small" sx={{ mr: 0.5 }} />
            <Chip label="Central Battery" size="small" sx={{ mr: 0.5 }} />
          </MDBox>
        ),
        status: <Chip label="Completed" color="success" size="small" />,
        priority: <Chip label="Medium" color="info" size="small" />,
        actions: (
          <MDBox display="flex" alignItems="center">
            <MDButton variant="text" color="info" size="small">
              <Icon>visibility</Icon>
            </MDButton>
            <MDButton variant="text" color="secondary" size="small">
              <Icon>description</Icon>
            </MDButton>
          </MDBox>
        ),
      },
    ],
    []
  );

  return { columns, rows };
}
