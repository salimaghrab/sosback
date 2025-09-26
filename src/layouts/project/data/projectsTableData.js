import { useMemo } from "react";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDProgress from "components/MDProgress";
import Icon from "@mui/material/Icon";

export default function projectsTableData() {
  // Always call hooks at the top level - never inside conditions
  const columns = useMemo(
    () => [
      { Header: "Project", accessor: "project", width: "30%", align: "left" },
      { Header: "Location", accessor: "location", align: "left" },
      { Header: "Systems", accessor: "systems", align: "left" },
      { Header: "Status", accessor: "status", align: "center" },
      { Header: "Client", accessor: "client", align: "left" },
      { Header: "Actions", accessor: "actions", align: "center" },
    ],
    []
  );

  const rows = useMemo(
    () => [
      {
        project: (
          <MDBox display="flex" alignItems="center" lineHeight={1}>
            <MDBox ml={2} lineHeight={1}>
              <MDTypography display="block" variant="button" fontWeight="medium">
                Sample Project 1
              </MDTypography>
              <MDTypography variant="caption">Fire Safety System</MDTypography>
            </MDBox>
          </MDBox>
        ),
        location: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            Downtown Office Building
          </MDTypography>
        ),
        systems: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            Fire Alarm, Sprinkler
          </MDTypography>
        ),
        status: (
          <MDBox ml={-1}>
            <MDProgress color="success" variant="gradient" value={100} />
          </MDBox>
        ),
        client: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            ABC Company
          </MDTypography>
        ),
        actions: (
          <MDBox display="flex" alignItems="center">
            <MDButton variant="text" color="info" size="small">
              <Icon>edit</Icon>
            </MDButton>
            <MDButton variant="text" color="error" size="small">
              <Icon>delete</Icon>
            </MDButton>
          </MDBox>
        ),
      },
      {
        project: (
          <MDBox display="flex" alignItems="center" lineHeight={1}>
            <MDBox ml={2} lineHeight={1}>
              <MDTypography display="block" variant="button" fontWeight="medium">
                Sample Project 2
              </MDTypography>
              <MDTypography variant="caption">Ventilation System</MDTypography>
            </MDBox>
          </MDBox>
        ),
        location: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            Shopping Mall
          </MDTypography>
        ),
        systems: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            Ventilation, Emergency Lighting
          </MDTypography>
        ),
        status: (
          <MDBox ml={-1}>
            <MDProgress color="info" variant="gradient" value={60} />
          </MDBox>
        ),
        client: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            XYZ Corporation
          </MDTypography>
        ),
        actions: (
          <MDBox display="flex" alignItems="center">
            <MDButton variant="text" color="info" size="small">
              <Icon>edit</Icon>
            </MDButton>
            <MDButton variant="text" color="error" size="small">
              <Icon>delete</Icon>
            </MDButton>
          </MDBox>
        ),
      },
    ],
    []
  );

  return { columns, rows };
}
