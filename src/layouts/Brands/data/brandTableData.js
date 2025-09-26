import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDButton from "components/MDButton";
import Icon from "@mui/material/Icon";
import Tooltip from "@mui/material/Tooltip";
import PropTypes from "prop-types";

/**
 * brandTableData(brands, helpers)
 * - brands: array of brand objects from API
 * - helpers: { navigate, refresh }  (optional)
 */
export default function brandTableData(brands = [], helpers = {}) {
  const { navigate, refresh } = helpers;

  const getActiveChip = (isActive) =>
    isActive ? (
      <MDTypography variant="button" color="success" fontWeight="medium">
        Active
      </MDTypography>
    ) : (
      <MDTypography variant="button" color="text" fontWeight="regular">
        Inactive
      </MDTypography>
    );

  const RowsActions = ({ brand }) => (
    <MDBox display="flex" gap={1}>
      <Tooltip title="View">
        <MDButton
          variant="text"
          color="info"
          size="small"
          iconOnly
          onClick={() => navigate?.(`/brands/details/${brand.id}`)}
        >
          <Icon>visibility</Icon>
        </MDButton>
      </Tooltip>
      <Tooltip title="Edit">
        <MDButton
          variant="text"
          color="warning"
          size="small"
          iconOnly
          onClick={() => navigate?.(`/brands/edit/${brand.id}`)}
        >
          <Icon>edit</Icon>
        </MDButton>
      </Tooltip>
      <Tooltip title="Delete">
        <MDButton
          variant="text"
          color="error"
          size="small"
          iconOnly
          onClick={async () => {
            if (!confirm("Delete this brand?")) return;
            try {
              // optional: call API if helpers provided
              if (helpers.deleteBrand) {
                await helpers.deleteBrand(brand.id);
                refresh?.();
              } else {
                console.warn("deleteBrand helper not provided");
              }
            } catch (err) {
              console.error("Delete brand failed", err);
            }
          }}
        >
          <Icon>delete</Icon>
        </MDButton>
      </Tooltip>
    </MDBox>
  );

  RowsActions.propTypes = {
    brand: PropTypes.object.isRequired,
  };

  const rows = brands.map((b) => {
    const createdAt = b.createdAt ? new Date(b.createdAt).toLocaleString() : "-";
    const notes = b.notes
      ? b.notes.length > 80
        ? b.notes.substring(0, 80) + "..."
        : b.notes
      : "-";
    const modelsCount = Array.isArray(b.models) ? b.models.length : 0;

    return {
      name: (
        <MDBox display="flex" alignItems="center" lineHeight={1}>
          <MDAvatar name={b.name} />
          <MDBox ml={2} lineHeight={1}>
            <MDTypography display="block" variant="button" fontWeight="medium">
              {b.name}
            </MDTypography>
            <MDTypography variant="caption" color="text">
              {b.category || "—"}
            </MDTypography>
          </MDBox>
        </MDBox>
      ),
      category: b.category || "-",
      active: <MDBox>{getActiveChip(b.isActive)}</MDBox>,
      models: <MDTypography variant="caption">{modelsCount} model(s)</MDTypography>,
      notes: <MDTypography variant="caption">{notes}</MDTypography>,
      createdAt,
      actions: <RowsActions brand={b} />,
      // raw fields for sorting/search
      _raw: {
        name: b.name,
        category: b.category,
        isActive: b.isActive,
        createdAt: b.createdAt,
      },
    };
  });

  return {
    columns: [
      { Header: "Name", accessor: "name", width: "28%" },
      { Header: "Category", accessor: "category", width: "18%" },
      { Header: "Active", accessor: "active", align: "center", width: "8%" },
      { Header: "Models", accessor: "models", align: "center", width: "10%" },
      { Header: "Notes", accessor: "notes", width: "20%" },
      { Header: "Created", accessor: "createdAt", align: "center", width: "10%" },
      { Header: "Actions", accessor: "actions", align: "center", width: "6%" },
    ],
    rows,
  };
}
