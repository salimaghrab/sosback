import apiClient from "layouts/authentication/services/axiosInterceptor";

// API Endpoints (using relative paths since baseURL is configured in apiClient)
const EQUIPMENT_ENDPOINT = "/Equipment";
const EQUIPMENT_MODEL_ENDPOINT = "/EquipmentModel";
const BRANDS_ENDPOINT = "/Brands";

// ====================================
// 🔹 EQUIPMENT SERVICES
// ====================================

export const fetchAllEquipments = async () => {
  try {
    const response = await apiClient.get(EQUIPMENT_ENDPOINT);
    return response.data;
  } catch (error) {
    console.error("Error fetching equipment:", error);
    throw error;
  }
};

export const fetchEquipmentById = async (id) => {
  try {
    const response = await apiClient.get(`${EQUIPMENT_ENDPOINT}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching equipment ${id}:`, error);
    throw error;
  }
};

export const fetchEquipmentsBySite = async (siteId) => {
  try {
    const response = await apiClient.get(`${EQUIPMENT_ENDPOINT}/site/${siteId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching equipment for site ${siteId}:`, error);
    throw error;
  }
};

export const fetchEquipmentForContract = async (siteId) => {
  try {
    const response = await apiClient.get(`${EQUIPMENT_ENDPOINT}/site/${siteId}/for-contract`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching equipment for contract at site ${siteId}:`, error);
    throw error;
  }
};

export const fetchEquipmentsByModel = async (equipmentModelId) => {
  try {
    const response = await apiClient.get(`${EQUIPMENT_ENDPOINT}/model/${equipmentModelId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching equipment by model ${equipmentModelId}:`, error);
    throw error;
  }
};

export const fetchEquipmentsByCategory = async (category) => {
  try {
    const response = await apiClient.get(`${EQUIPMENT_ENDPOINT}/search/category/${category}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching equipment by category ${category}:`, error);
    throw error;
  }
};

export const fetchEquipmentsByStatus = async (status) => {
  try {
    const response = await apiClient.get(`${EQUIPMENT_ENDPOINT}/search/status/${status}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching equipment by status ${status}:`, error);
    throw error;
  }
};

export const fetchEquipmentsBySystemType = async (systemType) => {
  try {
    const response = await apiClient.get(`${EQUIPMENT_ENDPOINT}/search/systemtype/${systemType}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching equipment by system type ${systemType}:`, error);
    throw error;
  }
};

export const addEquipment = async (equipment) => {
  try {
    const response = await apiClient.post(EQUIPMENT_ENDPOINT, equipment);
    return response.data;
  } catch (error) {
    console.error("Error adding equipment:", error);
    throw error;
  }
};

export const updateEquipment = async (id, equipment) => {
  try {
    const response = await apiClient.put(`${EQUIPMENT_ENDPOINT}/${id}`, equipment);
    return response.status >= 200 && response.status < 300;
  } catch (error) {
    console.error(`Error updating equipment ${id}:`, error);
    throw error;
  }
};

export const deleteEquipment = async (id) => {
  try {
    const response = await apiClient.delete(`${EQUIPMENT_ENDPOINT}/${id}`);
    return response.status >= 200 && response.status < 300;
  } catch (error) {
    console.error(`Error deleting equipment ${id}:`, error);
    throw error;
  }
};

// ====================================
// 🔹 EQUIPMENT MODEL SERVICES
// ====================================

export const fetchAllEquipmentModels = async () => {
  try {
    const response = await apiClient.get(`${EQUIPMENT_MODEL_ENDPOINT}/all`);
    return response.data || [];
  } catch (error) {
    console.error("Error fetching equipment models:", error);
    return [];
  }
};

export const fetchEquipmentModelById = async (id) => {
  try {
    const response = await apiClient.get(`${EQUIPMENT_MODEL_ENDPOINT}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching equipment model ${id}:`, error);
    if (error.response?.status === 404) {
      return null;
    }
    throw new Error(
      `Failed to fetch equipment model: ${error.response?.data?.message || error.message}`
    );
  }
};

export const fetchEquipmentModelsByBrand = async (brandId) => {
  try {
    const response = await apiClient.get(`${EQUIPMENT_MODEL_ENDPOINT}/brand/${brandId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching equipment models by brand ${brandId}:`, error);
    throw error;
  }
};

export const fetchEquipmentModelsByCategory = async (category) => {
  try {
    const response = await apiClient.get(`${EQUIPMENT_MODEL_ENDPOINT}/category/${category}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching equipment models by category ${category}:`, error);
    throw error;
  }
};

export const addEquipmentModel = async (model) => {
  try {
    const response = await apiClient.post(`${EQUIPMENT_MODEL_ENDPOINT}/add`, model);
    return response.data;
  } catch (error) {
    console.error("Error adding equipment model:", error);

    if (error.response?.status === 400) {
      const errorMessage =
        error.response.data?.message || error.response.data || "Invalid model data";
      throw new Error(errorMessage);
    }

    throw new Error(
      `Failed to add equipment model: ${error.response?.data?.message || error.message}`
    );
  }
};

export const updateEquipmentModel = async (id, model) => {
  try {
    const response = await apiClient.put(`${EQUIPMENT_MODEL_ENDPOINT}/${id}`, model);
    return response.data;
  } catch (error) {
    console.error(`Error updating equipment model ${id}:`, error);

    if (error.response?.status === 400) {
      const errorMessage =
        error.response.data?.message || error.response.data || "Invalid model data";
      throw new Error(errorMessage);
    }

    if (error.response?.status === 404) {
      throw new Error("Equipment model not found");
    }

    throw new Error(
      `Failed to update equipment model: ${error.response?.data?.message || error.message}`
    );
  }
};

export const deleteEquipmentModel = async (id) => {
  try {
    const response = await apiClient.delete(`${EQUIPMENT_MODEL_ENDPOINT}/delete/${id}`);
    return response.status >= 200 && response.status < 300;
  } catch (error) {
    console.error(`Error deleting equipment model ${id}:`, error);

    if (error.response?.status === 404) {
      throw new Error("Equipment model not found");
    }

    if (error.response?.status === 400) {
      throw new Error(error.response.data?.message || "Cannot delete equipment model");
    }

    return false;
  }
};

export const updateMaintenanceFrequency = async (id, frequency, frequencyDays) => {
  try {
    const response = await apiClient.put(
      `${EQUIPMENT_MODEL_ENDPOINT}/${id}/maintenance-frequency`,
      {
        Frequency: frequency,
        FrequencyDays: frequencyDays,
      }
    );
    return response.status >= 200 && response.status < 300;
  } catch (error) {
    console.error(`Error updating maintenance frequency for model ${id}:`, error);

    if (error.response?.status === 404) {
      throw new Error("Equipment model not found");
    }

    throw new Error(
      `Failed to update maintenance frequency: ${error.response?.data?.message || error.message}`
    );
  }
};

// ====================================
// 🔹 BRAND SERVICES
// ====================================

export const fetchAllBrands = async () => {
  try {
    const response = await apiClient.get(BRANDS_ENDPOINT);
    return response.data || [];
  } catch (error) {
    console.error("Error fetching brands:", error);
    return [];
  }
};

export const fetchBrandById = async (id) => {
  try {
    const response = await apiClient.get(`${BRANDS_ENDPOINT}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching brand ${id}:`, error);
    if (error.response?.status === 404) {
      return null;
    }
    throw new Error(`Failed to fetch brand: ${error.response?.data?.message || error.message}`);
  }
};

export const addBrand = async (brand) => {
  try {
    const response = await apiClient.post(BRANDS_ENDPOINT, brand);
    return response.data;
  } catch (error) {
    console.error("Error adding brand:", error);

    if (error.response?.status === 400) {
      const errorMessage =
        error.response.data?.message || error.response.data || "Invalid brand data";
      throw new Error(errorMessage);
    }

    throw new Error(`Failed to add brand: ${error.response?.data?.message || error.message}`);
  }
};

// ====================================
// 🔹 UTILITY FUNCTIONS
// ====================================

export const getEquipmentStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case "active":
      return "success";
    case "faulty":
      return "error";
    case "maintenance":
      return "warning";
    case "decommissioned":
      return "secondary";
    default:
      return "info";
  }
};

export const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case "active":
      return "success";
    case "critical":
    case "expired":
    case "faulty":
      return "error";
    case "maintenance":
      return "warning";
    case "inactive":
    case "decommissioned":
      return "secondary";
    default:
      return "info";
  }
};

export const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  try {
    return new Date(dateString).toLocaleDateString("en-GB");
  } catch (error) {
    return "Invalid Date";
  }
};

export const formatEquipmentData = (equipment, type = "equipment") => {
  if (!equipment) return null;

  return {
    ...equipment,
    type: type,
    displayName:
      equipment.name ||
      equipment.modelName ||
      equipment.model ||
      `${type.toUpperCase()}-${equipment.id?.substring(0, 8)}`,
    formattedId: `${type.toUpperCase()}-${equipment.id?.substring(0, 8)}` || "N/A",
  };
};

// ====================================
// 🔹 VALIDATION HELPERS
// ====================================

export const validateEquipment = (equipment) => {
  const errors = [];

  if (!equipment.serialNumber?.trim()) {
    errors.push("Serial number is required");
  }

  if (!equipment.siteId) {
    errors.push("Site ID is required");
  }

  if (!equipment.equipmentModelId) {
    errors.push("Equipment model is required");
  }

  return errors;
};

export const validateEquipmentModel = (model) => {
  const errors = [];

  if (!model.modelName?.trim()) {
    errors.push("Model name is required");
  }

  if (!model.brandId) {
    errors.push("Brand is required");
  }

  if (!model.category?.trim()) {
    errors.push("Category is required");
  }

  return errors;
};

export const validateBrand = (brand) => {
  const errors = [];

  if (!brand.name?.trim()) {
    errors.push("Brand name is required");
  }

  return errors;
};

// ====================================
// 🔹 SEARCH AND FILTER HELPERS
// ====================================

export const searchEquipment = (equipments, searchTerm) => {
  if (!searchTerm) return equipments;

  const term = searchTerm.toLowerCase();
  return equipments.filter(
    (equipment) =>
      equipment.serialNumber?.toLowerCase().includes(term) ||
      equipment.location?.toLowerCase().includes(term) ||
      equipment.equipmentModel?.modelName?.toLowerCase().includes(term) ||
      equipment.equipmentModel?.brand?.name?.toLowerCase().includes(term)
  );
};

export const filterEquipmentByStatus = (equipments, status) => {
  if (!status || status === "all") return equipments;
  return equipments.filter((equipment) => equipment.status?.toLowerCase() === status.toLowerCase());
};

export const filterEquipmentByCategory = (equipments, category) => {
  if (!category || category === "all") return equipments;
  return equipments.filter(
    (equipment) => equipment.equipmentModel?.category?.toLowerCase() === category.toLowerCase()
  );
};

// ====================================
// 🔹 DATA TRANSFORMATION HELPERS
// ====================================

export const transformEquipmentForTable = (equipments) => {
  return equipments.map((equipment) => ({
    id: equipment.id,
    serialNumber: equipment.serialNumber || "N/A",
    location: equipment.location || "N/A",
    modelName: equipment.equipmentModel?.modelName || "Unknown",
    brandName: equipment.equipmentModel?.brand?.name || "Unknown",
    category: equipment.equipmentModel?.category || "Unknown",
    systemType: equipment.equipmentModel?.systemType || "Unknown",
    status: equipment.status || "Unknown",
    installationDate: formatDate(equipment.installationDate),
    lastMaintenanceDate: formatDate(equipment.lastMaintenanceDate),
    statusColor: getEquipmentStatusColor(equipment.status),
  }));
};

export const transformEquipmentModelsForTable = (models) => {
  return models.map((model) => ({
    id: model.id,
    modelName: model.modelName || "N/A",
    brandName: model.brand?.name || "Unknown",
    category: model.category || "N/A",
    systemType: model.systemType || "N/A",
    maintenanceFrequency: model.maintenanceFrequency || "N/A",
    maintenanceFrequencyDays: model.maintenanceFrequencyDays || 0,
    specifications: model.specifications || "N/A",
  }));
};

export const transformBrandsForTable = (brands) => {
  return brands.map((brand) => ({
    id: brand.id,
    name: brand.name || "N/A",
    description: brand.description || "N/A",
    website: brand.website || "N/A",
    contactEmail: brand.contactEmail || "N/A",
  }));
};

// Export default object with all functions
export default {
  // Equipment
  fetchAllEquipments,
  fetchEquipmentById,
  fetchEquipmentsBySite,
  fetchEquipmentForContract,
  fetchEquipmentsByModel,
  fetchEquipmentsByCategory,
  fetchEquipmentsByStatus,
  fetchEquipmentsBySystemType,
  addEquipment,
  updateEquipment,
  deleteEquipment,

  // Equipment Models
  fetchAllEquipmentModels,
  fetchEquipmentModelById,
  fetchEquipmentModelsByBrand,
  fetchEquipmentModelsByCategory,
  addEquipmentModel,
  updateEquipmentModel,
  deleteEquipmentModel,
  updateMaintenanceFrequency,

  // Brands
  fetchAllBrands,
  fetchBrandById,
  addBrand,

  // Utilities
  getEquipmentStatusColor,
  getStatusColor,
  formatDate,
  formatEquipmentData,

  // Validation
  validateEquipment,
  validateEquipmentModel,
  validateBrand,

  // Search & Filter
  searchEquipment,
  filterEquipmentByStatus,
  filterEquipmentByCategory,

  // Transformers
  transformEquipmentForTable,
  transformEquipmentModelsForTable,
  transformBrandsForTable,
};
