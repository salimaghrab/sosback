import apiClient from "layouts/authentication/services/axiosInterceptor";

// API URLs (base URL already configured in apiClient)
const ENDPOINTS = {
  SITES: "/Site",
  CONTRACTS: "/Contract",
  MAINTENANCES: "/Maintenances",
  EQUIPMENT: "/Equipment",
  ENGINEERS: "/Engineers",
};

// ============================
// 🏢 SITE SERVICES
// ============================

export const siteService = {
  // Récupérer tous les sites
  async fetchAll() {
    try {
      const response = await apiClient.get(ENDPOINTS.SITES);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des sites :", error);
      throw this.handleError(error);
    }
  },

  // Récupérer un site par ID
  async fetchById(id) {
    try {
      const response = await apiClient.get(`${ENDPOINTS.SITES}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération du site ${id} :`, error);
      throw this.handleError(error);
    }
  },

  // Créer un nouveau site
  async create(siteData) {
    try {
      const response = await apiClient.post(ENDPOINTS.SITES, {
        siteName: siteData.siteName,
        clientName: siteData.clientName,
        location: siteData.location,
        description: siteData.description || "",
        contactPerson: siteData.contactPerson || "",
        phoneNumber: siteData.phoneNumber || "",
        email: siteData.email || "",
        address: siteData.address || "",
        isActive: siteData.isActive !== undefined ? siteData.isActive : true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la création du site :", error);
      throw this.handleError(error);
    }
  },

  // Supprimer un site
  async delete(id) {
    try {
      const response = await apiClient.delete(`${ENDPOINTS.SITES}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la suppression du site ${id} :`, error);
      throw this.handleError(error);
    }
  },

  // Rechercher par nom de client
  async searchByClient(clientName) {
    try {
      const response = await apiClient.get(`${ENDPOINTS.SITES}/search/client/${clientName}`);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la recherche par client :", error);
      throw this.handleError(error);
    }
  },

  handleError(error) {
    if (error.response) {
      return {
        status: error.response.status,
        message: error.response.data.message || error.response.data,
        data: error.response.data,
      };
    }
    return { message: error.message || "Erreur réseau" };
  },
};

// ============================
// 🏗️ EQUIPMENT SERVICES
// ============================

export const equipmentService = {
  // Récupérer tous les équipements
  async fetchAll() {
    try {
      const response = await apiClient.get(ENDPOINTS.EQUIPMENT);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des équipements :", error);
      throw this.handleError(error);
    }
  },

  // Récupérer équipements par site
  async fetchBySite(siteId) {
    try {
      const response = await apiClient.get(`${ENDPOINTS.EQUIPMENT}/site/${siteId}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération des équipements du site ${siteId} :`, error);
      throw this.handleError(error);
    }
  },

  // Créer un nouvel équipement
  async create(equipmentData) {
    try {
      const response = await apiClient.post(ENDPOINTS.EQUIPMENT, {
        siteId: equipmentData.siteId,
        equipmentModelId: equipmentData.equipmentModelId,
        serialNumber: equipmentData.serialNumber,
        location: equipmentData.location,
        quantity: equipmentData.quantity || 1,
        status: equipmentData.status || "Active",
        backupAvailable: equipmentData.backupAvailable || false,
        emergencyStickerUpdated: equipmentData.emergencyStickerUpdated || false,
        hasZoneChart: equipmentData.hasZoneChart || false,
        hasOMManual: equipmentData.hasOMManual || false,
        installationDate: equipmentData.installationDate,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la création de l'équipement :", error);
      throw this.handleError(error);
    }
  },

  handleError: siteService.handleError,
};

// ============================
// 👷 ENGINEER SERVICES
// ============================

export const engineerService = {
  // Récupérer tous les ingénieurs
  async fetchAll() {
    try {
      const response = await apiClient.get(ENDPOINTS.ENGINEERS);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des ingénieurs :", error);
      throw this.handleError(error);
    }
  },

  // Créer un nouvel ingénieur
  async create(engineerData) {
    try {
      const response = await apiClient.post(ENDPOINTS.ENGINEERS, {
        name: engineerData.name,
        email: engineerData.email,
        phone: engineerData.phone || "",
        specialty: engineerData.specialty || "",
        experience: engineerData.experience || 0,
        isActive: engineerData.isActive !== undefined ? engineerData.isActive : true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la création de l'ingénieur :", error);
      throw this.handleError(error);
    }
  },

  handleError: siteService.handleError,
};

// ============================
// 📋 CONTRACT SERVICES
// ============================

export const contractService = {
  // Récupérer tous les contrats
  async fetchAll() {
    try {
      const response = await apiClient.get(ENDPOINTS.CONTRACTS);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des contrats :", error);
      throw this.handleError(error);
    }
  },

  // Récupérer un contrat par ID
  async fetchById(id) {
    try {
      const response = await apiClient.get(`${ENDPOINTS.CONTRACTS}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération du contrat ${id} :`, error);
      throw this.handleError(error);
    }
  },

  // Créer un contrat simple
  async create(contractData) {
    try {
      const response = await apiClient.post(ENDPOINTS.CONTRACTS, {
        siteId: contractData.siteId,
        responsibleEngineerId: contractData.responsibleEngineerId,
        startDate: contractData.startDate,
        endDate: contractData.endDate,
        durationYears: contractData.durationYears || 0,
        status: contractData.status || "Active",
        contractValue: contractData.contractValue,
        currency: contractData.currency || "QAR",
        contractNumber: contractData.contractNumber || null,
      });
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la création du contrat :", error);
      throw this.handleError(error);
    }
  },

  // Créer un contrat avec équipements et génération automatique des maintenances
  async createWithEquipment(contractData, selectedEquipments) {
    try {
      const response = await apiClient.post("/contracts/create-with-equipment", {
        contract: {
          siteId: contractData.siteId,
          responsibleEngineerId: contractData.responsibleEngineerId || null,
          startDate: contractData.startDate,
          endDate: contractData.endDate,
          durationYears: contractData.durationYears || 0,
          status: contractData.status || "Active",
          contractValue: parseFloat(contractData.contractValue),
          currency: contractData.currency || "QAR",
          contractNumber: contractData.contractNumber || null,
        },
        selectedEquipment: selectedEquipments.map((eq) => ({
          equipmentId: eq.equipmentId,
          customMaintenanceFrequency: eq.customMaintenanceFrequency,
          customMaintenanceFrequencyDays: eq.customMaintenanceFrequencyDays,
          notes: eq.notes || "",
        })),
      });
      return response.data;
    } catch (error) {
      console.error("Error creating contract with equipment:", error);
      throw error;
    }
  },

  async getEquipmentForSite(siteId) {
    try {
      const response = await apiClient.get(`/contracts/equipment-for-site/${siteId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching equipment for site ${siteId}:`, error);
      throw error;
    }
  },

  // Récupérer les équipements d'un contrat
  async getEquipments(contractId) {
    try {
      const response = await apiClient.get(`${ENDPOINTS.CONTRACTS}/${contractId}/equipments`);
      return response.data;
    } catch (error) {
      console.error(
        `Erreur lors de la récupération des équipements du contrat ${contractId} :`,
        error
      );
      throw this.handleError(error);
    }
  },

  // Ajouter un équipement à un contrat
  async addEquipment(contractId, equipmentId, generateMaintenances = true, notes = "") {
    try {
      const response = await apiClient.post(
        `${ENDPOINTS.CONTRACTS}/${contractId}/equipments/${equipmentId}`,
        {
          generateMaintenances: generateMaintenances,
          notes: notes,
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de l'ajout de l'équipement au contrat :`, error);
      throw this.handleError(error);
    }
  },

  // Générer le planning de maintenance pour un contrat
  async generateMaintenanceSchedule(contractId) {
    try {
      const response = await apiClient.post(
        `${ENDPOINTS.CONTRACTS}/${contractId}/generate-maintenance-schedule`
      );
      return response.data;
    } catch (error) {
      console.error(`Error generating maintenance schedule for contract ${contractId}:`, error);
      throw error;
    }
  },

  // Régénérer le planning de maintenance
  async regenerateMaintenanceSchedule(contractId) {
    try {
      const response = await apiClient.post(
        `${ENDPOINTS.CONTRACTS}/${contractId}/regenerate-maintenance-schedule`
      );
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la régénération du planning de maintenance :`, error);
      throw this.handleError(error);
    }
  },

  // Récupérer les maintenances d'un contrat
  async getMaintenances(contractId) {
    try {
      const response = await apiClient.get(`/maintenances/contract/${contractId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching maintenances for contract ${contractId}:`, error);
      throw error;
    }
  },

  // Supprimer un contrat
  async delete(id) {
    try {
      const response = await apiClient.delete(`${ENDPOINTS.CONTRACTS}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la suppression du contrat ${id} :`, error);
      throw this.handleError(error);
    }
  },

  // Générer un numéro de contrat
  async generateContractNumber() {
    try {
      const response = await apiClient.get(`${ENDPOINTS.CONTRACTS}/generate-contract-number`);
      return response.data.contractNumber;
    } catch (error) {
      console.error("Erreur lors de la génération du numéro de contrat :", error);
      throw this.handleError(error);
    }
  },

  handleError(error) {
    if (error.response) {
      return {
        status: error.response.status,
        message: error.response.data.message || error.response.data,
        data: error.response.data,
      };
    }
    return { message: error.message || "Network error" };
  },
};

// ============================
// 🔧 MAINTENANCE SERVICES
// ============================

export const maintenanceService = {
  // Récupérer toutes les maintenances
  async fetchAll() {
    try {
      const response = await apiClient.get(ENDPOINTS.MAINTENANCES);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des maintenances :", error);
      throw this.handleError(error);
    }
  },

  // Récupérer maintenances par contrat
  async fetchByContract(contractId) {
    try {
      const response = await apiClient.get(`${ENDPOINTS.MAINTENANCES}/contract/${contractId}`);
      return response.data;
    } catch (error) {
      console.error(
        `Erreur lors de la récupération des maintenances du contrat ${contractId} :`,
        error
      );
      throw this.handleError(error);
    }
  },

  // Récupérer maintenances par équipement
  async fetchByEquipment(equipmentId) {
    try {
      const response = await apiClient.get(`${ENDPOINTS.MAINTENANCES}/equipment/${equipmentId}`);
      return response.data;
    } catch (error) {
      console.error(
        `Erreur lors de la récupération des maintenances de l'équipement ${equipmentId} :`,
        error
      );
      throw this.handleError(error);
    }
  },

  // Récupérer maintenances en retard
  async fetchOverdue() {
    try {
      const response = await apiClient.get(`${ENDPOINTS.MAINTENANCES}/overdue`);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des maintenances en retard :", error);
      throw this.handleError(error);
    }
  },

  // Récupérer maintenances programmées
  async fetchScheduled() {
    try {
      const response = await apiClient.get(`${ENDPOINTS.MAINTENANCES}/scheduled`);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des maintenances programmées :", error);
      throw this.handleError(error);
    }
  },

  // Récupérer maintenances à venir
  async fetchUpcoming(days = 7) {
    try {
      const response = await apiClient.get(`${ENDPOINTS.MAINTENANCES}/upcoming/${days}`);
      return response.data;
    } catch (error) {
      console.error(
        `Erreur lors de la récupération des maintenances à venir (${days} jours) :`,
        error
      );
      throw this.handleError(error);
    }
  },

  // Créer une maintenance manuelle
  async create(maintenanceData) {
    try {
      const response = await apiClient.post(ENDPOINTS.MAINTENANCES, {
        contractId: maintenanceData.contractId,
        equipmentId: maintenanceData.equipmentId,
        scheduledDate: maintenanceData.scheduledDate,
        completedDate: maintenanceData.completedDate || null,
        assignedEngineerId: maintenanceData.assignedEngineerId || null,
        status: maintenanceData.status || "Scheduled",
        maintenanceType: maintenanceData.maintenanceType || "Preventive",
        period: maintenanceData.period || null,
        remarks: maintenanceData.remarks || null,
        completionNotes: maintenanceData.completionNotes || null,
      });
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la création de la maintenance :", error);
      throw this.handleError(error);
    }
  },

  // Compléter une maintenance
  async complete(maintenanceId, completionData) {
    try {
      const response = await apiClient.post(`${ENDPOINTS.MAINTENANCES}/${maintenanceId}/complete`, {
        completedDate: completionData.completedDate || new Date().toISOString(),
        completionNotes: completionData.completionNotes || "",
        assignedEngineerId: completionData.assignedEngineerId || null,
      });
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la completion de la maintenance ${maintenanceId} :`, error);
      throw this.handleError(error);
    }
  },

  // Générer un planning de maintenance
  async generateSchedule(contractId) {
    try {
      const response = await apiClient.post(`${ENDPOINTS.MAINTENANCES}/generate-schedule`, {
        contractId: contractId,
        overwriteExisting: false,
      });
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la génération du planning de maintenance :", error);
      throw this.handleError(error);
    }
  },

  // Récupérer les statistiques du dashboard
  async getDashboardStats() {
    try {
      const response = await apiClient.get(`${ENDPOINTS.MAINTENANCES}/dashboard-stats`);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des statistiques :", error);
      throw this.handleError(error);
    }
  },

  // Mettre à jour le statut de plusieurs maintenances
  async bulkUpdateStatus(maintenanceIds, newStatus, completedDate = null) {
    try {
      const response = await apiClient.post(`${ENDPOINTS.MAINTENANCES}/bulk-update-status`, {
        maintenanceIds: maintenanceIds,
        newStatus: newStatus,
        completedDate: completedDate,
      });
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la mise à jour en lot des maintenances :", error);
      throw this.handleError(error);
    }
  },

  handleError: siteService.handleError,
};

// ============================
// 🧪 FONCTIONS DE TEST
// ============================

export const testFunctions = {
  // Test de création complète : Site -> Équipement -> Contrat -> Maintenances
  async testCompleteWorkflow() {
    console.log("🚀 Début du test du workflow complet...");

    try {
      // 1. Créer un site de test
      console.log("1. Création d'un site de test...");
      const testSite = await siteService.create({
        siteName: "Site Test Automation",
        clientName: "Client Test Corp",
        location: "Doha, Qatar - Zone Industrielle",
        description: "Site de test pour validation automatique",
        contactPerson: "Ahmed Al-Test",
        phoneNumber: "+974 1234 5678",
        email: "test@example.com",
      });
      console.log("✅ Site créé :", testSite);

      // 2. Récupérer les équipements du site (ou en créer si nécessaire)
      console.log("2. Récupération des équipements...");
      let equipments = await equipmentService.fetchBySite(testSite.id);

      if (equipments.length === 0) {
        console.log("Aucun équipement trouvé, création d'équipements de test...");
        console.log(
          "⚠️ Création d'équipements non implémentée dans ce test (nécessite des modèles d'équipement)"
        );
        equipments = [];
      }

      // 3. Récupérer un ingénieur ou en créer un
      console.log("3. Récupération/Création d'un ingénieur...");
      const engineers = await engineerService.fetchAll();
      let testEngineer;

      if (engineers.length === 0) {
        testEngineer = await engineerService.create({
          name: "Ingénieur Test",
          email: "engineer.test@example.com",
          phone: "+974 9876 5432",
          specialty: "Maintenance Préventive",
          experience: 5,
        });
        console.log("✅ Ingénieur créé :", testEngineer);
      } else {
        testEngineer = engineers[0];
        console.log("✅ Ingénieur existant utilisé :", testEngineer);
      }

      // 4. Créer un contrat avec génération automatique des maintenances
      console.log("4. Création d'un contrat...");
      const startDate = new Date();
      const endDate = new Date();
      endDate.setFullYear(startDate.getFullYear() + 2);

      let testContract;

      if (equipments.length > 0) {
        testContract = await contractService.createWithEquipment(
          {
            siteId: testSite.id,
            responsibleEngineerId: testEngineer.id,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            durationYears: 2,
            contractValue: 150000,
            currency: "QAR",
          },
          equipments.slice(0, 2).map((eq) => eq.id),
          true
        );
      } else {
        testContract = await contractService.create({
          siteId: testSite.id,
          responsibleEngineerId: testEngineer.id,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          durationYears: 2,
          contractValue: 150000,
          currency: "QAR",
        });
      }

      console.log("✅ Contrat créé :", testContract);

      // 5. Vérifier les maintenances générées
      console.log("5. Vérification des maintenances générées...");
      const maintenances = await contractService.getMaintenances(testContract.id);
      console.log(`✅ ${maintenances.length} maintenances générées automatiquement`);

      // 6. Créer une maintenance manuelle
      if (equipments.length > 0) {
        console.log("6. Création d'une maintenance manuelle...");
        const manualMaintenance = await maintenanceService.create({
          contractId: testContract.id,
          equipmentId: equipments[0].id,
          scheduledDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          assignedEngineerId: testEngineer.id,
          status: "Scheduled",
          maintenanceType: "Corrective",
          period: "Test Manual",
          remarks: "Maintenance manuelle créée lors du test automatique",
        });
        console.log("✅ Maintenance manuelle créée :", manualMaintenance);
      }

      // 7. Afficher les statistiques
      console.log("7. Récupération des statistiques...");
      const stats = await maintenanceService.getDashboardStats();
      console.log("✅ Statistiques du dashboard :", stats);

      console.log("🎉 Test du workflow complet réussi !");

      return {
        success: true,
        site: testSite,
        contract: testContract,
        engineer: testEngineer,
        maintenances: maintenances,
        stats: stats,
      };
    } catch (error) {
      console.error("❌ Erreur lors du test du workflow :", error);
      return {
        success: false,
        error: error,
      };
    }
  },

  // Test de création de contrat simple
  async testContractCreation() {
    console.log("🧪 Test de création de contrat...");

    try {
      const sites = await siteService.fetchAll();
      const engineers = await engineerService.fetchAll();

      if (sites.length === 0 || engineers.length === 0) {
        throw new Error("Aucun site ou ingénieur disponible pour le test");
      }

      const contractData = {
        siteId: sites[0].id,
        responsibleEngineerId: engineers[0].id,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        contractValue: 75000,
        currency: "QAR",
      };

      const contract = await contractService.create(contractData);
      console.log("✅ Contrat de test créé :", contract);

      return { success: true, contract };
    } catch (error) {
      console.error("❌ Erreur lors du test de création de contrat :", error);
      return { success: false, error };
    }
  },

  // Test de génération de maintenance
  async testMaintenanceGeneration(contractId) {
    console.log(`🧪 Test de génération de maintenance pour le contrat ${contractId}...`);

    try {
      const result = await contractService.generateMaintenanceSchedule(contractId);
      console.log("✅ Planning de maintenance généré :", result);

      const maintenances = await contractService.getMaintenances(contractId);
      console.log(`✅ ${maintenances.length} maintenances trouvées`);

      return { success: true, result, maintenances };
    } catch (error) {
      console.error("❌ Erreur lors de la génération de maintenance :", error);
      return { success: false, error };
    }
  },
};

export const fetchAllMaintenances = async () => {
  try {
    const response = await apiClient.get("/maintenances");
    const maintenances = response.data;

    // Transform the API response to match the expected structure
    return maintenances.map((maintenance) => ({
      id: maintenance.id,
      contractId: maintenance.contractId,
      equipmentId: maintenance.equipmentId,
      scheduledDate: maintenance.scheduledDate,
      completedDate: maintenance.completedDate,
      assignedEngineerId: maintenance.assignedEngineerId,
      status: maintenance.status,
      maintenanceType: maintenance.maintenanceType,
      period: maintenance.period,
      remarks: maintenance.remarks,
      completionNotes: maintenance.completionNotes,
      createdAt: maintenance.createdAt,
      updatedAt: maintenance.updatedAt,
      // Extract nested data for easier access
      engineer: maintenance.assignedEngineer?.name || maintenance.engineer || "Unassigned",
      contractNumber: maintenance.contract?.contractNumber || "Unknown",
      equipmentSerial: maintenance.equipment?.serialNumber || "Unknown",
      equipmentLocation: maintenance.equipment?.location || "Unknown",
      equipmentModel: maintenance.equipment?.equipmentModel?.modelName || "Unknown",
      siteName: maintenance.contract?.site?.siteName || "Unknown Site",
      clientName: maintenance.contract?.site?.clientName || "Unknown Client",
    }));
  } catch (error) {
    console.error("Error fetching maintenances:", error);
    throw error;
  }
};

// Replace fetchAllContracts function
export const fetchAllContracts = async () => {
  try {
    const response = await apiClient.get("/Contract");
    return response.data;
  } catch (error) {
    console.error("Error fetching contracts:", error);
    throw error;
  }
};

export const fetchAllSites = async () => {
  try {
    const response = await apiClient.get("/site");
    return response.data;
  } catch (error) {
    console.error("Error fetching sites:", error);
    throw error;
  }
};

export const handleMaintenanceError = (error) => {
  if (error.response) {
    return `API Error: ${error.response.status} - ${
      error.response.data?.message || error.response.statusText
    }`;
  } else if (error.request) {
    return "Network Error: No response received from server";
  } else {
    return `Error: ${error.message}`;
  }
};

// ============================
// 🔄 FONCTIONS UTILITAIRES
// ============================

export const utils = {
  // Formatter une date pour l'affichage
  formatDate(dateString) {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("fr-FR");
  },

  // Formatter une date avec heure
  formatDateTime(dateString) {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("fr-FR");
  },

  // Calculer les jours jusqu'à une date
  daysUntil(dateString) {
    if (!dateString) return null;
    const targetDate = new Date(dateString);
    const today = new Date();
    const diffTime = targetDate - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  },

  // Vérifier si une maintenance est en retard
  isOverdue(scheduledDate, status) {
    if (status === "Completed" || !scheduledDate) return false;
    return new Date(scheduledDate) < new Date();
  },

  // Obtenir la couleur selon le statut
  getStatusColor(status) {
    const statusColors = {
      Scheduled: "info",
      InProgress: "warning",
      Completed: "success",
      Cancelled: "secondary",
      Overdue: "error",
      Active: "success",
      Expired: "error",
      Pending: "warning",
    };
    return statusColors[status] || "info";
  },
};

// Export par défaut pour compatibilité
export default {
  siteService,
  equipmentService,
  engineerService,
  contractService,
  maintenanceService,
  testFunctions,
  utils,
};
// Replace your existing engineerAssignmentService in servicem.js with this working version
export const engineerAssignmentService = {
  // Get available engineers for a specific maintenance date
  async getAvailableEngineers(maintenanceDate) {
    try {
      const formattedDate = new Date(maintenanceDate).toISOString().split("T")[0];
      const response = await fetch(
        `${ENDPOINTS.MAINTENANCES}/available-engineers?maintenanceDate=${formattedDate}`
      );

      if (!response.ok) {
        // If endpoint doesn't exist, fall back to getting all active engineers
        console.warn("Available engineers endpoint not available, falling back to all engineers");
        return await this.getAllActiveEngineers();
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching available engineers, falling back to all engineers:", error);
      return await this.getAllActiveEngineers();
    }
  },

  // Fallback method to get all active engineers
  async getAllActiveEngineers() {
    try {
      const response = await fetch(ENDPOINTS.ENGINEERS);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const allEngineers = await response.json();
      return allEngineers.filter((engineer) => engineer.isActive !== false);
    } catch (error) {
      console.error("Error fetching all engineers:", error);
      return [];
    }
  },

  // Get engineers assigned to a specific maintenance
  async getAssignedEngineers(maintenanceId) {
    try {
      const response = await fetch(`${ENDPOINTS.MAINTENANCES}/${maintenanceId}/engineers`);

      if (!response.ok) {
        if (response.status === 404 || response.status === 500) {
          console.warn("Assigned engineers endpoint not available yet, returning empty array");
          return [];
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching assigned engineers:", error);
      return [];
    }
  },

  // Assign multiple engineers to a maintenance - THIS IS THE WORKING VERSION
  async assignEngineersToMaintenance(maintenanceId, engineers, minimumRequired = 2) {
    try {
      console.log("Assigning engineers:", { maintenanceId, engineers, minimumRequired });

      const response = await fetch(`${ENDPOINTS.MAINTENANCES}/${maintenanceId}/assign-engineers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          engineers: engineers.map((eng) => ({
            engineerId: eng.engineerId,
            role: eng.role || "Assigned",
            notes: eng.notes || "",
          })),
          minimumEngineersRequired: minimumRequired,
        }),
      });

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          // If we can't parse the error response, use the status
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log("Engineers assigned successfully:", result);
      return result;
    } catch (error) {
      console.error("Error assigning engineers:", error);
      throw error;
    }
  },

  // Remove an engineer from a maintenance
  async removeEngineerFromMaintenance(maintenanceId, engineerId) {
    try {
      const response = await fetch(
        `${ENDPOINTS.MAINTENANCES}/${maintenanceId}/engineers/${engineerId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          // If we can't parse the error response, use the status
        }
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      console.error("Error removing engineer:", error);
      throw error;
    }
  },

  // Validate engineer assignments for a maintenance
  async validateMaintenanceEngineers(maintenanceId) {
    try {
      const response = await fetch(`${ENDPOINTS.MAINTENANCES}/${maintenanceId}/validate-engineers`);

      if (!response.ok) {
        if (response.status === 404 || response.status === 500) {
          console.warn("Validation endpoint not available, using basic validation");
          return await this.basicValidation(maintenanceId);
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error validating engineers, using basic validation:", error);
      return await this.basicValidation(maintenanceId);
    }
  },

  // Basic validation fallback
  async basicValidation(maintenanceId) {
    try {
      const assignedEngineers = await this.getAssignedEngineers(maintenanceId);
      const minimumRequired = 2; // Default minimum

      return {
        isValid: assignedEngineers.length >= minimumRequired,
        requiredEngineers: minimumRequired,
        assignedEngineers: assignedEngineers.length,
        validationErrors:
          assignedEngineers.length < minimumRequired
            ? [`Need ${minimumRequired - assignedEngineers.length} more engineer(s)`]
            : [],
      };
    } catch (error) {
      console.error("Error in basic validation:", error);
      return {
        isValid: false,
        requiredEngineers: 2,
        assignedEngineers: 0,
        validationErrors: ["Unable to validate engineer assignments"],
      };
    }
  },

  // Get maintenances that need engineers
  async getMaintenancesNeedingEngineers() {
    try {
      const response = await fetch(`${ENDPOINTS.MAINTENANCES}/needing-engineers`);

      if (!response.ok) {
        if (response.status === 404 || response.status === 500) {
          console.warn("Needing engineers endpoint not available");
          return [];
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching maintenances needing engineers:", error);
      return [];
    }
  },

  // Update engineer assignment role/notes
  async updateEngineerAssignment(maintenanceId, engineerId, role, notes) {
    try {
      const response = await fetch(
        `${ENDPOINTS.MAINTENANCES}/${maintenanceId}/engineers/${engineerId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            role: role,
            notes: notes,
          }),
        }
      );

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          // If we can't parse the error response, use the status
        }
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating engineer assignment:", error);
      throw error;
    }
  },

  // Get engineer workload for a date range
  async getEngineerWorkload(startDate, endDate) {
    try {
      const response = await fetch(
        `${ENDPOINTS.MAINTENANCES}/engineer-workload?startDate=${startDate}&endDate=${endDate}`
      );

      if (!response.ok) {
        if (response.status === 404 || response.status === 500) {
          console.warn("Engineer workload endpoint not available");
          return {};
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching engineer workload:", error);
      return {};
    }
  },
};

// Add these constants for engineer roles
export const ENGINEER_ROLES = {
  PRIMARY: "Primary",
  SECONDARY: "Secondary",
  SUPERVISOR: "Supervisor",
  ASSIGNED: "Assigned",
};

export const ROLE_COLORS = {
  [ENGINEER_ROLES.PRIMARY]: "primary",
  [ENGINEER_ROLES.SECONDARY]: "info",
  [ENGINEER_ROLES.SUPERVISOR]: "warning",
  [ENGINEER_ROLES.ASSIGNED]: "secondary",
};

// Enhanced complete maintenance function with engineer validation
export const completeMaintenanceWithValidation = async (maintenanceId, completionData) => {
  try {
    // First validate that minimum engineers are assigned
    const validation = await engineerAssignmentService.validateMaintenanceEngineers(maintenanceId);

    if (!validation.isValid) {
      throw new Error(`Cannot complete maintenance: ${validation.validationErrors.join(", ")}`);
    }

    // If validation passes, complete the maintenance
    const response = await fetch(`${ENDPOINTS.MAINTENANCES}/${maintenanceId}/complete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        completedDate: completionData.completedDate || new Date().toISOString(),
        completionNotes: completionData.completionNotes || "",
        engineerCompletions: completionData.engineerCompletions || [],
      }),
    });

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        // If we can't parse the error response, use the status
      }
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    console.error("Error completing maintenance:", error);
    throw error;
  }
};
