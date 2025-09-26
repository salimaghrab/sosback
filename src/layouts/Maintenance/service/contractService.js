import apiClient from "layouts/authentication/services/axiosInterceptor";

// Contract Service using apiClient
class ContractService {
  constructor() {
    // No need for baseUrl since it's configured in apiClient
    this.contractEndpoint = "/contract";
  }

  // ========== CONTRACT CRUD OPERATIONS ==========

  async getAllContracts() {
    try {
      const response = await apiClient.get(this.contractEndpoint);
      return response.data;
    } catch (error) {
      console.error("Error fetching all contracts:", error);
      throw error;
    }
  }

  async getContractById(contractId) {
    try {
      const response = await apiClient.get(`${this.contractEndpoint}/${contractId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching contract ${contractId}:`, error);
      throw error;
    }
  }

  async createContract(contractData, generateMaintenance = true) {
    try {
      const response = await apiClient.post(
        `${this.contractEndpoint}/create?generateMaintenance=${generateMaintenance}`,
        contractData
      );
      return response.data;
    } catch (error) {
      console.error("Error creating contract:", error);
      throw error;
    }
  }

  async createContractWithSite(contractData, generateMaintenance = true) {
    try {
      const response = await apiClient.post(
        `${this.contractEndpoint}/create-with-site?generateMaintenance=${generateMaintenance}`,
        contractData
      );
      return response.data;
    } catch (error) {
      console.error("Error creating contract with site:", error);
      throw error;
    }
  }

  async updateContract(contractId, updateData) {
    try {
      const response = await apiClient.put(`${this.contractEndpoint}/${contractId}`, updateData);
      return response.data;
    } catch (error) {
      console.error(`Error updating contract ${contractId}:`, error);
      throw error;
    }
  }

  async deleteContract(contractId) {
    try {
      const response = await apiClient.delete(`${this.contractEndpoint}/${contractId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting contract ${contractId}:`, error);
      throw error;
    }
  }

  // ========== CONTRACT QUERIES ==========

  async getContractsBySite(siteId) {
    try {
      const response = await apiClient.get(`${this.contractEndpoint}/by-site/${siteId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching contracts by site ${siteId}:`, error);
      throw error;
    }
  }

  async getContractsByEngineer(engineerId) {
    try {
      const response = await apiClient.get(`${this.contractEndpoint}/by-engineer/${engineerId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching contracts by engineer ${engineerId}:`, error);
      throw error;
    }
  }

  async getActiveContracts() {
    try {
      const response = await apiClient.get(`${this.contractEndpoint}/active`);
      return response.data;
    } catch (error) {
      console.error("Error fetching active contracts:", error);
      throw error;
    }
  }

  async getExpiredContracts() {
    try {
      const response = await apiClient.get(`${this.contractEndpoint}/expired`);
      return response.data;
    } catch (error) {
      console.error("Error fetching expired contracts:", error);
      throw error;
    }
  }

  async getContractsNearingExpiry(days = 30) {
    try {
      const response = await apiClient.get(`${this.contractEndpoint}/nearing-expiry?days=${days}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching contracts nearing expiry (${days} days):`, error);
      throw error;
    }
  }

  async getContractsByStatus(status) {
    try {
      const response = await apiClient.get(`${this.contractEndpoint}/by-status/${status}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching contracts by status ${status}:`, error);
      throw error;
    }
  }

  async getContractsByDateRange(startDate, endDate) {
    try {
      const response = await apiClient.get(
        `${this.contractEndpoint}/by-date-range?startDate=${startDate}&endDate=${endDate}`
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching contracts by date range ${startDate} to ${endDate}:`, error);
      throw error;
    }
  }

  async getContractAnalytics() {
    try {
      const response = await apiClient.get(`${this.contractEndpoint}/analytics`);
      return response.data;
    } catch (error) {
      console.error("Error fetching contract analytics:", error);
      throw error;
    }
  }

  async generateContractNumber() {
    try {
      const response = await apiClient.post(`${this.contractEndpoint}/generate-contract-number`);
      return response.data;
    } catch (error) {
      console.error("Error generating contract number:", error);
      throw error;
    }
  }

  // ========== EQUIPMENT MANAGEMENT ==========

  async getContractEquipments(contractId) {
    try {
      const response = await apiClient.get(`${this.contractEndpoint}/${contractId}/equipments`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching equipments for contract ${contractId}:`, error);
      throw error;
    }
  }

  async addEquipmentToContract(contractId, equipmentId, notes = null) {
    try {
      const response = await apiClient.post(`${this.contractEndpoint}/${contractId}/equipments`, {
        equipmentId,
        notes,
      });
      return response.data;
    } catch (error) {
      console.error(`Error adding equipment ${equipmentId} to contract ${contractId}:`, error);
      throw error;
    }
  }

  async addEquipmentToContractWithMaintenance(
    contractId,
    equipmentId,
    notes = null,
    generateMaintenance = true
  ) {
    try {
      const response = await apiClient.post(
        `${this.contractEndpoint}/${contractId}/equipments/add-with-maintenance?generateMaintenance=${generateMaintenance}`,
        { equipmentId, notes }
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error adding equipment ${equipmentId} to contract ${contractId} with maintenance:`,
        error
      );
      throw error;
    }
  }

  async removeEquipmentFromContract(contractId, equipmentId) {
    try {
      const response = await apiClient.delete(
        `${this.contractEndpoint}/${contractId}/equipments/${equipmentId}`
      );
      return response.data;
    } catch (error) {
      console.error(`Error removing equipment ${equipmentId} from contract ${contractId}:`, error);
      throw error;
    }
  }

  async updateEquipmentFrequency(
    contractId,
    equipmentId,
    frequency,
    frequencyDays,
    regenerateMaintenance = false
  ) {
    try {
      const response = await apiClient.put(
        `${this.contractEndpoint}/${contractId}/equipments/frequency?regenerateMaintenance=${regenerateMaintenance}`,
        { equipmentId, frequency, frequencyDays }
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error updating equipment frequency for ${equipmentId} in contract ${contractId}:`,
        error
      );
      throw error;
    }
  }

  // ========== MAINTENANCE MANAGEMENT ==========

  async generateMaintenanceForContract(contractId) {
    try {
      const response = await apiClient.post(
        `${this.contractEndpoint}/${contractId}/generate-maintenance`
      );
      return response.data;
    } catch (error) {
      console.error(`Error generating maintenance for contract ${contractId}:`, error);
      throw error;
    }
  }

  async regenerateMaintenanceForContract(contractId) {
    try {
      const response = await apiClient.post(
        `${this.contractEndpoint}/${contractId}/regenerate-maintenance`
      );
      return response.data;
    } catch (error) {
      console.error(`Error regenerating maintenance for contract ${contractId}:`, error);
      throw error;
    }
  }

  async getContractMaintenanceSchedule(contractId) {
    try {
      const response = await apiClient.get(
        `${this.contractEndpoint}/${contractId}/maintenance-schedule`
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching maintenance schedule for contract ${contractId}:`, error);
      throw error;
    }
  }

  // ========== BULK OPERATIONS ==========

  async addMultipleEquipmentsToContract(contractId, equipments, generateMaintenance = true) {
    const results = [];
    const errors = [];

    for (const equipment of equipments) {
      try {
        const result = await this.addEquipmentToContract(
          contractId,
          equipment.equipmentId,
          equipment.notes
        );
        results.push({ ...result, equipmentId: equipment.equipmentId });
      } catch (error) {
        errors.push({ equipmentId: equipment.equipmentId, error: error.message });
      }
    }

    let maintenanceGenerated = false;
    let maintenanceResult = null;
    let maintenanceError = null;

    if (generateMaintenance && results.length > 0) {
      try {
        maintenanceResult = await this.generateMaintenanceForContract(contractId);
        maintenanceGenerated = true;
      } catch (error) {
        maintenanceError = error.message;
        maintenanceGenerated = false;
      }
    }

    return {
      equipmentResults: results,
      equipmentErrors: errors,
      maintenanceGenerated,
      maintenanceResult,
      maintenanceError,
    };
  }

  // ========== UTILITY METHODS ==========

  calculateContractDuration(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.ceil(diffDays / 365);
  }

  formatContractData(formData) {
    console.log("=== FORMATTING CONTRACT DATA ===");
    console.log("Input formData:", formData);

    const baseData = {
      contractNumber: formData.contractNumber || "",
      startDate: formData.startDate,
      endDate: formData.endDate,
      durationYears: this.calculateContractDuration(formData.startDate, formData.endDate),
      status: formData.status || "Active",
      contractValue: parseFloat(formData.contractValue) || 0,
      currency: formData.currency || "QAR",
    };

    if (formData.responsibleEngineerId) {
      baseData.responsibleEngineerId = formData.responsibleEngineerId;
    }

    console.log("Base contract data:", baseData);

    if (formData.createNewSite) {
      console.log("Formatting for NEW SITE creation");
      // For new site creation - match CreateContractWithSiteRequest exactly
      const result = {
        // Contract fields
        contractNumber: baseData.contractNumber,
        responsibleEngineerId: baseData.responsibleEngineerId || null,
        startDate: baseData.startDate,
        endDate: baseData.endDate,
        durationYears: baseData.durationYears,
        status: baseData.status,
        contractValue: baseData.contractValue,
        currency: baseData.currency,
        // Site fields
        siteName: formData.newSiteName?.trim() || "",
        clientName: formData.newSiteClientName?.trim() || "",
        location: formData.newSiteLocation?.trim() || "",
      };
      console.log("Formatted new site contract data:", result);
      return result;
    } else {
      console.log("Formatting for EXISTING SITE");
      // For existing site - match CreateContractRequest exactly
      if (!formData.siteId) {
        throw new Error("Site ID is required for existing site");
      }
      const result = {
        ...baseData,
        siteId: formData.siteId,
      };
      console.log("Formatted existing site contract data:", result);
      return result;
    }
  }

  // Enhanced createContractWithEquipments method with detailed logging
  async createContractWithEquipments(
    formData,
    selectedEquipments = [],
    generateMaintenance = true
  ) {
    try {
      console.log("=== CREATE CONTRACT WITH EQUIPMENTS DEBUG ===");
      console.log("Raw form data:", formData);
      console.log("Selected equipments:", selectedEquipments);
      console.log("Generate maintenance:", generateMaintenance);

      // Validate required fields
      if (!formData.startDate || !formData.endDate) {
        throw new Error("Start and end dates are required");
      }
      if (new Date(formData.startDate) >= new Date(formData.endDate)) {
        throw new Error("End date must be after start date");
      }
      if (!formData.contractValue || parseFloat(formData.contractValue) <= 0) {
        throw new Error("Valid contract value is required");
      }
      if (formData.createNewSite) {
        if (!formData.newSiteName || !formData.newSiteClientName || !formData.newSiteLocation) {
          throw new Error("All new site fields (name, client name, location) are required");
        }
      } else if (!formData.siteId) {
        throw new Error("Site ID is required for existing site");
      }

      // Format contract data
      const contractData = this.formatContractData(formData);
      console.log("=== FORMATTED CONTRACT DATA ===");
      console.log("Contract data:", JSON.stringify(contractData, null, 2));
      console.log("Will use endpoint:", formData.createNewSite ? "create-with-site" : "create");

      // Create contract
      let contractResult;
      try {
        if (formData.createNewSite) {
          console.log("Calling createContractWithSite...");
          contractResult = await this.createContractWithSite(contractData, false);
        } else {
          console.log("Calling createContract...");
          contractResult = await this.createContract(contractData, false);
        }
      } catch (error) {
        console.error("Contract creation failed:", error);
        throw new Error(`Failed to create contract: ${error.message}`);
      }

      const contractId = contractResult.contract?.id || contractResult.id;
      if (!contractId) {
        throw new Error("Contract created but ID not returned");
      }
      console.log("Contract created with ID:", contractId);

      let equipmentResults = [];
      let equipmentErrors = [];

      // Add equipments if any selected
      if (selectedEquipments.length > 0) {
        console.log("Adding equipments to contract:", selectedEquipments);
        const equipmentResult = await this.addMultipleEquipmentsToContract(
          contractId,
          selectedEquipments,
          generateMaintenance
        );
        equipmentResults = equipmentResult.equipmentResults;
        equipmentErrors = equipmentResult.equipmentErrors;
        if (equipmentResult.maintenanceGenerated) {
          contractResult.maintenanceGenerated = true;
          contractResult.maintenanceResult = equipmentResult.maintenanceResult;
          contractResult.maintenanceError = equipmentResult.maintenanceError;
        }
      } else if (generateMaintenance) {
        // Generate maintenance even without equipment
        try {
          console.log("Generating maintenance for contract without equipment...");
          const maintenanceResult = await this.generateMaintenanceForContract(contractId);
          contractResult.maintenanceGenerated = true;
          contractResult.maintenanceResult = maintenanceResult;
        } catch (error) {
          console.warn("Maintenance generation failed (no equipment):", error.message);
          contractResult.maintenanceGenerated = false;
          contractResult.maintenanceError =
            "Maintenance schedule generated but no equipment assigned yet";
        }
      }

      return {
        contract: contractResult.contract || contractResult,
        contractId,
        equipmentResults,
        equipmentErrors,
        maintenanceGenerated: contractResult.maintenanceGenerated || false,
        maintenanceResult: contractResult.maintenanceResult || null,
        maintenanceError: contractResult.maintenanceError || null,
      };
    } catch (error) {
      console.error("createContractWithEquipments error:", error);
      throw new Error(`Failed to create contract with equipments: ${error.message}`);
    }
  }
}

export default ContractService;
