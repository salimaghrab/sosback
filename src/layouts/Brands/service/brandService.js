import apiClient from "layouts/authentication/services/axiosInterceptor";

const BRANDS_API_URL = "/Brands";

export const fetchAllBrands = async () => {
  try {
    const response = await apiClient.get(`${BRANDS_API_URL}`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des brands :", error);
    throw error;
  }
};

// extra useful helpers (optional)
export const fetchBrandById = async (id) => {
  try {
    const response = await apiClient.get(`${BRANDS_API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la récupération de la brand ${id} :`, error);
    throw error;
  }
};

export const addBrand = async (brand) => {
  try {
    const response = await apiClient.post(`${BRANDS_API_URL}`, brand);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de l'ajout d'une brand :", error);
    throw error;
  }
};

export const updateBrand = async (id, brand) => {
  try {
    const response = await apiClient.put(`${BRANDS_API_URL}/${id}`, brand);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la mise à jour de la brand ${id} :`, error);
    throw error;
  }
};

export const deleteBrand = async (id) => {
  try {
    const response = await apiClient.delete(`${BRANDS_API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la suppression de la brand ${id} :`, error);
    throw error;
  }
};
