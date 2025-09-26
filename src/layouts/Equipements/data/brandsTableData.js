import { useState, useEffect } from "react";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDBadge from "components/MDBadge";
import MDButton from "components/MDButton";
import Icon from "@mui/material/Icon";
import Chip from "@mui/material/Chip";
import PropTypes from "prop-types";
import { formatDate } from "../service/equipment";
import axios from "axios";
import apiClient from "layouts/authentication/services/axiosInterceptor";

export default function brandsTableData() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBrands = async () => {
      try {
        const response = await apiClient.get("/Brands");
        console.log("Brands API Response:", response.data); // Debug log
        setBrands(response.data);
      } catch (error) {
        console.error("Error loading brands:", error);
        setBrands([]);
      } finally {
        setLoading(false);
      }
    };

    loadBrands();
  }, []);

  // Brand Name Component
  const BrandName = ({ name, category, notes }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDBox ml={0} lineHeight={1}>
        <MDTypography display="block" variant="button" fontWeight="medium">
          {name || "Unknown Brand"}
        </MDTypography>
        <MDTypography variant="caption" color="text">
          {category || "Uncategorized"}
        </MDTypography>
        {notes && (
          <MDTypography variant="caption" color="text" display="block">
            {notes.length > 50 ? `${notes.substring(0, 50)}...` : notes}
          </MDTypography>
        )}
      </MDBox>
    </MDBox>
  );

  BrandName.propTypes = {
    name: PropTypes.string,
    category: PropTypes.string,
    notes: PropTypes.string,
  };

  // Status Component
  const Status = ({ isActive }) => (
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

  // Category Component
  const CategoryChip = ({ category }) => (
    <Chip label={category || "Uncategorized"} size="small" variant="outlined" color="primary" />
  );

  CategoryChip.propTypes = {
    category: PropTypes.string,
  };

  // Convert brand data to table rows
  const brandRows = brands.map((brand) => ({
    brand: <BrandName name={brand.name} category={brand.category} notes={brand.notes} />,
    category: <CategoryChip category={brand.category} />,
    status: <Status isActive={brand.isActive} />,
    createdAt: (
      <MDTypography variant="caption" color="text" fontWeight="medium">
        {formatDate(brand.createdAt)}
      </MDTypography>
    ),
    updatedAt: (
      <MDTypography variant="caption" color="text" fontWeight="medium">
        {formatDate(brand.updatedAt)}
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
      { Header: "Brand", accessor: "brand", width: "30%", align: "left" },
      { Header: "Category", accessor: "category", width: "20%", align: "center" },
      { Header: "Status", accessor: "status", width: "15%", align: "center" },
      { Header: "Created", accessor: "createdAt", width: "15%", align: "center" },
      { Header: "Updated", accessor: "updatedAt", width: "15%", align: "center" },
      { Header: "Actions", accessor: "action", width: "15%", align: "center" },
    ],
    rows: brandRows,
    loading,
    brandsCount: brands.length,
  };
}
