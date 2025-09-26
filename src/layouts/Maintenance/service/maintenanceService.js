import apiClient from "layouts/authentication/services/axiosInterceptor";

// API URLs (base URL /api/ is already configured in apiClient)
const SITE_API_URL = "/Site";
const MAINTENANCE_API_URL = "/Maintenances";
const CONTRACT_API_URL = "/Contract";

// ========================
// SITE SERVICES
// ========================

/**
 * Fetch all sites
 * @returns {Promise<Array>} Array of site objects
 */
export const fetchAllSites = async () => {
  try {
    const response = await apiClient.get(`${SITE_API_URL}`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des sites :", error);
    throw error;
  }
};

/**
 * Fetch a site by ID
 * @param {string} id - Site ID (GUID)
 * @returns {Promise<Object>} Site object
 */
export const fetchSiteById = async (id) => {
  try {
    const response = await apiClient.get(`${SITE_API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la récupération du site ${id} :`, error);
    throw error;
  }
};

/**
 * Add a new site
 * @param {Object} site - Site data object
 * @param {string} site.siteName - Name of the site (required, max 255 chars)
 * @param {string} site.clientName - Client name (required, max 255 chars)
 * @param {string} site.location - Site location (required, max 255 chars)
 * @returns {Promise<Object>} Created site object
 */
export const addSite = async (site) => {
  try {
    // Validate required fields
    if (!site.siteName || !site.clientName || !site.location) {
      throw new Error("Les champs siteName, clientName et location sont obligatoires");
    }

    // Validate field lengths
    if (site.siteName.length > 255) {
      throw new Error("Le nom du site ne peut pas dépasser 255 caractères");
    }
    if (site.clientName.length > 255) {
      throw new Error("Le nom du client ne peut pas dépasser 255 caractères");
    }
    if (site.location.length > 255) {
      throw new Error("La localisation ne peut pas dépasser 255 caractères");
    }

    const response = await apiClient.post(`${SITE_API_URL}`, site);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de l'ajout du site :", error);
    throw error;
  }
};

/**
 * Update an existing site
 * @param {string} id - Site ID (GUID)
 * @param {Object} site - Updated site data
 * @returns {Promise<Object>} Updated site object
 */
export const updateSite = async (id, site) => {
  try {
    if (!id) {
      throw new Error("L'ID du site est requis pour la mise à jour");
    }

    // Validate field lengths if provided
    if (site.siteName && site.siteName.length > 255) {
      throw new Error("Le nom du site ne peut pas dépasser 255 caractères");
    }
    if (site.clientName && site.clientName.length > 255) {
      throw new Error("Le nom du client ne peut pas dépasser 255 caractères");
    }
    if (site.location && site.location.length > 255) {
      throw new Error("La localisation ne peut pas dépasser 255 caractères");
    }

    const response = await apiClient.put(`${SITE_API_URL}/${id}`, site);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la modification du site ${id} :`, error);
    throw error;
  }
};

/**
 * Delete a site
 * @param {string} id - Site ID (GUID)
 * @returns {Promise<void>} No content on success
 */
export const deleteSite = async (id) => {
  try {
    if (!id) {
      throw new Error("L'ID du site est requis pour la suppression");
    }

    const response = await apiClient.delete(`${SITE_API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la suppression du site ${id} :`, error);
    throw error;
  }
};

// ========================
// CONTRACT SERVICES
// ========================

/**
 * Fetch all contracts
 * @returns {Promise<Array>} Array of contract objects
 */
export const fetchAllContracts = async () => {
  try {
    const response = await apiClient.get(`${CONTRACT_API_URL}`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des contrats :", error);
    throw error;
  }
};

/**
 * Fetch a contract by ID
 * @param {string} id - Contract ID (GUID)
 * @returns {Promise<Object>} Contract object
 */
export const fetchContractById = async (id) => {
  try {
    const response = await apiClient.get(`${CONTRACT_API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la récupération du contrat ${id} :`, error);
    throw error;
  }
};

/**
 * Add a new contract
 * @param {Object} contract - Contract data object
 * @param {string} contract.contractNumber - Contract number (required, max 100 chars)
 * @param {string} contract.siteId - Site ID (required, GUID)
 * @param {string} contract.responsibleEngineerId - Engineer ID (required, GUID)
 * @param {string} contract.startDate - Start date (required, ISO format)
 * @param {string} contract.endDate - End date (required, ISO format)
 * @param {number} contract.durationYears - Duration in years (required)
 * @param {string} contract.status - Status (optional, defaults to "Active")
 * @param {number} contract.contractValue - Contract value (optional)
 * @param {string} contract.currency - Currency (optional, defaults to "QAR")
 * @returns {Promise<Object>} Created contract object
 */
export const addContract = async (contract) => {
  try {
    // Validate required fields
    if (
      !contract.contractNumber ||
      !contract.siteId ||
      !contract.responsibleEngineerId ||
      !contract.startDate ||
      !contract.endDate ||
      !contract.durationYears
    ) {
      throw new Error(
        "Les champs contractNumber, siteId, responsibleEngineerId, startDate, endDate et durationYears sont obligatoires"
      );
    }

    // Validate field lengths
    if (contract.contractNumber.length > 100) {
      throw new Error("Le numéro de contrat ne peut pas dépasser 100 caractères");
    }

    // Validate dates
    if (!isValidDate(contract.startDate)) {
      throw new Error("La date de début doit être au format ISO valide");
    }
    if (!isValidDate(contract.endDate)) {
      throw new Error("La date de fin doit être au format ISO valide");
    }

    // Validate date logic
    if (new Date(contract.endDate) <= new Date(contract.startDate)) {
      throw new Error("La date de fin doit être postérieure à la date de début");
    }

    const response = await apiClient.post(`${CONTRACT_API_URL}`, contract);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de l'ajout du contrat :", error);
    throw error;
  }
};

/**
 * Update an existing contract
 * @param {string} id - Contract ID (GUID)
 * @param {Object} contract - Updated contract data
 * @returns {Promise<Object>} Updated contract object
 */
export const updateContract = async (id, contract) => {
  try {
    if (!id) {
      throw new Error("L'ID du contrat est requis pour la mise à jour");
    }

    // Validate field lengths if provided
    if (contract.contractNumber && contract.contractNumber.length > 100) {
      throw new Error("Le numéro de contrat ne peut pas dépasser 100 caractères");
    }

    // Validate dates if provided
    if (contract.startDate && !isValidDate(contract.startDate)) {
      throw new Error("La date de début doit être au format ISO valide");
    }
    if (contract.endDate && !isValidDate(contract.endDate)) {
      throw new Error("La date de fin doit être au format ISO valide");
    }

    // Validate date logic if both dates are provided
    if (contract.startDate && contract.endDate) {
      if (new Date(contract.endDate) <= new Date(contract.startDate)) {
        throw new Error("La date de fin doit être postérieure à la date de début");
      }
    }

    const response = await apiClient.put(`${CONTRACT_API_URL}/${id}`, contract);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la modification du contrat ${id} :`, error);
    throw error;
  }
};

/**
 * Delete a contract
 * @param {string} id - Contract ID (GUID)
 * @returns {Promise<void>} No content on success
 */
export const deleteContract = async (id) => {
  try {
    if (!id) {
      throw new Error("L'ID du contrat est requis pour la suppression");
    }

    const response = await apiClient.delete(`${CONTRACT_API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la suppression du contrat ${id} :`, error);
    throw error;
  }
};

// ========================
// MAINTENANCE SERVICES
// ========================

/**
 * Fetch all maintenances
 * @returns {Promise<Array>} Array of maintenance objects
 */
export const fetchAllMaintenances = async () => {
  try {
    const response = await apiClient.get(`${MAINTENANCE_API_URL}`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des maintenances :", error);
    throw error;
  }
};

/**
 * Add a new maintenance
 * @param {Object} maintenance - Maintenance data object
 * @returns {Promise<Object>} Created maintenance object
 */
export const addMaintenance = async (maintenance) => {
  try {
    // Validate required fields
    if (
      !maintenance.contractId ||
      !maintenance.scheduledDate ||
      !maintenance.engineer ||
      !maintenance.status ||
      !maintenance.period
    ) {
      throw new Error(
        "Les champs contractId, scheduledDate, engineer, status et period sont obligatoires"
      );
    }

    // Validate status
    const validStatuses = ["Scheduled", "Completed", "Renewal"];
    if (!validStatuses.includes(maintenance.status)) {
      throw new Error("Le statut doit être 'Scheduled', 'Completed' ou 'Renewal'");
    }

    // Validate dates
    if (maintenance.scheduledDate && !isValidDate(maintenance.scheduledDate)) {
      throw new Error("La date prévue doit être au format ISO valide");
    }

    if (maintenance.completedDate && !isValidDate(maintenance.completedDate)) {
      throw new Error("La date de completion doit être au format ISO valide");
    }

    const response = await apiClient.post(`${MAINTENANCE_API_URL}`, maintenance);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de l'ajout de la maintenance :", error);
    throw error;
  }
};

/**
 * Update an existing maintenance
 * @param {string} id - Maintenance ID (GUID)
 * @param {Object} maintenance - Updated maintenance data
 * @returns {Promise<Object>} Updated maintenance object
 */
export const updateMaintenance = async (id, maintenance) => {
  try {
    if (!id) {
      throw new Error("L'ID de la maintenance est requis pour la mise à jour");
    }

    // Validate status if provided
    if (maintenance.status) {
      const validStatuses = ["Scheduled", "Completed", "Renewal"];
      if (!validStatuses.includes(maintenance.status)) {
        throw new Error("Le statut doit être 'Scheduled', 'Completed' ou 'Renewal'");
      }
    }

    // Validate dates if provided
    if (maintenance.scheduledDate && !isValidDate(maintenance.scheduledDate)) {
      throw new Error("La date prévue doit être au format ISO valide");
    }

    if (maintenance.completedDate && !isValidDate(maintenance.completedDate)) {
      throw new Error("La date de completion doit être au format ISO valide");
    }

    const response = await apiClient.put(`${MAINTENANCE_API_URL}/${id}`, maintenance);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la modification de la maintenance ${id} :`, error);
    throw error;
  }
};

/**
 * Delete a maintenance
 * @param {string} id - Maintenance ID (GUID)
 * @returns {Promise<void>} No content on success
 */
export const deleteMaintenance = async (id) => {
  try {
    if (!id) {
      throw new Error("L'ID de la maintenance est requis pour la suppression");
    }

    const response = await apiClient.delete(`${MAINTENANCE_API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la suppression de la maintenance ${id} :`, error);
    throw error;
  }
};

/**
 * Mark maintenance as completed
 * @param {string} id - Maintenance ID (GUID)
 * @param {string} completedDate - Completion date in ISO format (optional, defaults to now)
 * @returns {Promise<Object>} Updated maintenance object
 */
export const markMaintenanceCompleted = async (id, completedDate = null) => {
  try {
    const updateData = {
      status: "Completed",
      completedDate: completedDate || new Date().toISOString(),
    };

    return await updateMaintenance(id, updateData);
  } catch (error) {
    console.error(`Erreur lors de la completion de la maintenance ${id} :`, error);
    throw error;
  }
};

// ========================
// VALIDATION AND UTILITY FUNCTIONS
// ========================

/**
 * Validate if a string is a valid date
 * @param {string} dateString - Date string to validate
 * @returns {boolean} True if valid date
 */
const isValidDate = (dateString) => {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};

/**
 * Validate contract data before submission
 * @param {Object} contractData - Contract data to validate
 * @returns {Object} Validation result with isValid boolean and errors array
 */
export const validateContractData = (contractData) => {
  const errors = [];

  // Required fields validation
  if (!contractData.contractNumber || contractData.contractNumber.trim() === "") {
    errors.push("Le numéro de contrat est obligatoire");
  }
  if (!contractData.siteId || contractData.siteId.trim() === "") {
    errors.push("Le site est obligatoire");
  }
  if (!contractData.responsibleEngineerId || contractData.responsibleEngineerId.trim() === "") {
    errors.push("L'ingénieur responsable est obligatoire");
  }
  if (!contractData.startDate || contractData.startDate.trim() === "") {
    errors.push("La date de début est obligatoire");
  }
  if (!contractData.endDate || contractData.endDate.trim() === "") {
    errors.push("La date de fin est obligatoire");
  }
  if (!contractData.durationYears || contractData.durationYears <= 0) {
    errors.push("La durée en années est obligatoire et doit être positive");
  }

  // Length validation
  if (contractData.contractNumber && contractData.contractNumber.length > 100) {
    errors.push("Le numéro de contrat ne peut pas dépasser 100 caractères");
  }

  // Date validation
  if (contractData.startDate && !isValidDate(contractData.startDate)) {
    errors.push("La date de début doit être une date valide");
  }

  if (contractData.endDate && !isValidDate(contractData.endDate)) {
    errors.push("La date de fin doit être une date valide");
  }

  // Logic validation
  if (contractData.startDate && contractData.endDate) {
    const startDate = new Date(contractData.startDate);
    const endDate = new Date(contractData.endDate);
    if (endDate <= startDate) {
      errors.push("La date de fin doit être postérieure à la date de début");
    }
  }

  // Status validation
  if (contractData.status) {
    const validStatuses = ["Active", "Expired", "Renewal", "Terminated"];
    if (!validStatuses.includes(contractData.status)) {
      errors.push("Le statut doit être 'Active', 'Expired', 'Renewal' ou 'Terminated'");
    }
  }

  // Contract value validation
  if (contractData.contractValue !== undefined && contractData.contractValue < 0) {
    errors.push("La valeur du contrat ne peut pas être négative");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate maintenance data before submission
 * @param {Object} maintenanceData - Maintenance data to validate
 * @returns {Object} Validation result with isValid boolean and errors array
 */
export const validateMaintenanceData = (maintenanceData) => {
  const errors = [];

  // Required fields validation
  if (!maintenanceData.contractId || maintenanceData.contractId.trim() === "") {
    errors.push("L'ID du contrat est obligatoire");
  }
  if (!maintenanceData.scheduledDate || maintenanceData.scheduledDate.trim() === "") {
    errors.push("La date prévue est obligatoire");
  }
  if (!maintenanceData.engineer || maintenanceData.engineer.trim() === "") {
    errors.push("Le nom de l'ingénieur est obligatoire");
  }
  if (!maintenanceData.status || maintenanceData.status.trim() === "") {
    errors.push("Le statut est obligatoire");
  }
  if (!maintenanceData.period || maintenanceData.period.trim() === "") {
    errors.push("La période est obligatoire");
  }

  // Status validation
  const validStatuses = ["Scheduled", "Completed", "Renewal"];
  if (maintenanceData.status && !validStatuses.includes(maintenanceData.status)) {
    errors.push("Le statut doit être 'Scheduled', 'Completed' ou 'Renewal'");
  }

  // Date validation
  if (maintenanceData.scheduledDate && !isValidDate(maintenanceData.scheduledDate)) {
    errors.push("La date prévue doit être une date valide");
  }

  if (maintenanceData.completedDate && !isValidDate(maintenanceData.completedDate)) {
    errors.push("La date de completion doit être une date valide");
  }

  // Logic validation
  if (maintenanceData.scheduledDate && maintenanceData.completedDate) {
    const scheduled = new Date(maintenanceData.scheduledDate);
    const completed = new Date(maintenanceData.completedDate);
    if (completed < scheduled) {
      errors.push("La date de completion ne peut pas être antérieure à la date prévue");
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate site data before submission
 * @param {Object} siteData - Site data to validate
 * @returns {Object} Validation result with isValid boolean and errors array
 */
export const validateSiteData = (siteData) => {
  const errors = [];

  // Required fields validation
  if (!siteData.siteName || siteData.siteName.trim() === "") {
    errors.push("Le nom du site est obligatoire");
  }
  if (!siteData.clientName || siteData.clientName.trim() === "") {
    errors.push("Le nom du client est obligatoire");
  }
  if (!siteData.location || siteData.location.trim() === "") {
    errors.push("La localisation est obligatoire");
  }

  // Length validation
  if (siteData.siteName && siteData.siteName.length > 255) {
    errors.push("Le nom du site ne peut pas dépasser 255 caractères");
  }
  if (siteData.clientName && siteData.clientName.length > 255) {
    errors.push("Le nom du client ne peut pas dépasser 255 caractères");
  }
  if (siteData.location && siteData.location.length > 255) {
    errors.push("La localisation ne peut pas dépasser 255 caractères");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// ========================
// SEARCH AND FILTER FUNCTIONS
// ========================

/**
 * Search and filter contracts
 * @param {Array} contracts - Array of contracts to search
 * @param {string} searchTerm - Search term
 * @returns {Array} Filtered contracts
 */
export const searchContracts = (contracts, searchTerm) => {
  if (!searchTerm || !Array.isArray(contracts)) return contracts;

  const term = searchTerm.toLowerCase().trim();
  return contracts.filter(
    (contract) =>
      contract.contractNumber?.toLowerCase().includes(term) ||
      contract.status?.toLowerCase().includes(term) ||
      contract.currency?.toLowerCase().includes(term)
  );
};

/**
 * Search and filter maintenances
 * @param {Array} maintenances - Array of maintenances to search
 * @param {string} searchTerm - Search term
 * @returns {Array} Filtered maintenances
 */
export const searchMaintenances = (maintenances, searchTerm) => {
  if (!searchTerm || !Array.isArray(maintenances)) return maintenances;

  const term = searchTerm.toLowerCase().trim();
  return maintenances.filter(
    (maintenance) =>
      maintenance.engineer?.toLowerCase().includes(term) ||
      maintenance.status?.toLowerCase().includes(term) ||
      maintenance.period?.toLowerCase().includes(term) ||
      maintenance.remarks?.toLowerCase().includes(term)
  );
};

/**
 * Search and filter sites
 * @param {Array} sites - Array of sites to search
 * @param {string} searchTerm - Search term
 * @returns {Array} Filtered sites
 */
export const searchSites = (sites, searchTerm) => {
  if (!searchTerm || !Array.isArray(sites)) return sites;

  const term = searchTerm.toLowerCase().trim();
  return sites.filter(
    (site) =>
      site.siteName?.toLowerCase().includes(term) ||
      site.clientName?.toLowerCase().includes(term) ||
      site.location?.toLowerCase().includes(term)
  );
};

// ========================
// STATISTICS FUNCTIONS
// ========================

/**
 * Get maintenance statistics
 * @param {Array} maintenances - Array of maintenances
 * @returns {Object} Statistics object
 */
export const getMaintenanceStatistics = (maintenances) => {
  if (!Array.isArray(maintenances)) {
    return {
      total: 0,
      completed: 0,
      scheduled: 0,
      overdue: 0,
      renewal: 0,
    };
  }

  const now = new Date();
  const completed = maintenances.filter((m) => m.status === "Completed");
  const scheduled = maintenances.filter((m) => m.status === "Scheduled");
  const overdue = maintenances.filter(
    (m) => m.status === "Scheduled" && new Date(m.scheduledDate) < now
  );
  const renewal = maintenances.filter((m) => m.status === "Renewal");

  return {
    total: maintenances.length,
    completed: completed.length,
    scheduled: scheduled.length,
    overdue: overdue.length,
    renewal: renewal.length,
  };
};

/**
 * Get contract statistics
 * @param {Array} contracts - Array of contracts
 * @returns {Object} Statistics object
 */
export const getContractStatistics = (contracts) => {
  if (!Array.isArray(contracts)) {
    return {
      total: 0,
      active: 0,
      expired: 0,
      nearingExpiry: 0,
      totalValue: 0,
    };
  }

  const now = new Date();
  const active = contracts.filter((c) => c.status === "Active");
  const expired = contracts.filter((c) => c.status === "Expired" || new Date(c.endDate) < now);
  const nearingExpiry = contracts.filter((c) => {
    const endDate = new Date(c.endDate);
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    return endDate <= thirtyDaysFromNow && endDate > now;
  });

  const totalValue = contracts.reduce((sum, contract) => {
    return sum + (contract.contractValue || 0);
  }, 0);

  return {
    total: contracts.length,
    active: active.length,
    expired: expired.length,
    nearingExpiry: nearingExpiry.length,
    totalValue,
  };
};

// ========================
// ERROR HANDLING UTILITIES
// ========================

/**
 * Handle API errors with user-friendly messages
 * @param {Error} error - The error object
 * @returns {string} User-friendly error message
 */
export const handleSiteError = (error) => {
  if (!error) return "Une erreur inconnue s'est produite";

  // Network errors
  if (error.code === "NETWORK_ERROR" || !error.response) {
    return "Erreur de connexion. Veuillez vérifier votre connexion internet.";
  }

  // HTTP status errors
  const status = error.response?.status;
  switch (status) {
    case 400:
      return "Données invalides. Veuillez vérifier les informations saisies.";
    case 401:
      return "Non autorisé. Veuillez vous reconnecter.";
    case 403:
      return "Accès refusé. Vous n'avez pas les permissions nécessaires.";
    case 404:
      return "Ressource non trouvée.";
    case 409:
      return "Conflit de données. Cette ressource existe peut-être déjà.";
    case 500:
      return "Erreur serveur. Veuillez réessayer plus tard.";
    default:
      return error.message || "Une erreur s'est produite lors de l'opération.";
  }
};

/**
 * Handle maintenance API errors with user-friendly messages
 * @param {Error} error - The error object
 * @returns {string} User-friendly error message
 */
export const handleMaintenanceError = (error) => {
  return handleSiteError(error); // Use the same error handling logic
};

/**
 * Handle contract API errors with user-friendly messages
 * @param {Error} error - The error object
 * @returns {string} User-friendly error message
 */
export const handleContractError = (error) => {
  return handleSiteError(error); // Use the same error handling logic
};
