import axios from "axios";
import apiClient from "./axiosInterceptor";

export const login = async (email, password) => {
  try {
    const response = await apiClient.post(`/User/login`, { email, password });

    console.log("Complete API Response:", response);

    const { token, user } = response.data;

    if (token && user) {
      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role);
      localStorage.setItem("userId", user.id);
      localStorage.setItem("user", JSON.stringify(user));
    }

    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error.response?.data?.error || "Error during login";
  }
};

// Enhanced registration with entity creation
export const register = async (registrationData) => {
  try {
    console.log("Sending registration data:", registrationData); // Debug log

    const response = await apiClient.post(`/User/register`, {
      email: registrationData.email,
      password: registrationData.password,
      role: registrationData.role || "User",
      entityType: registrationData.entityType,
      entityData: registrationData.entityData,
    });

    console.log("Registration response:", response.data); // Debug log
    return response.data;
  } catch (error) {
    console.error("Registration error:", error);
    console.error("Error details:", error.response?.data); // Debug log
    throw error.response?.data?.error || "Error during registration";
  }
};

export const logout = () => {
  try {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    localStorage.removeItem("user");
    localStorage.clear();
    return true;
  } catch (error) {
    console.error("Logout error:", error);
    return false;
  }
};

// Get departments for employee registration
export const getDepartments = async () => {
  try {
    const response = await apiClient.get("/departments");
    return response.data;
  } catch (error) {
    console.error("Error fetching departments:", error);
    throw error.response?.data?.error || "Error fetching departments";
  }
};

// Get entities without accounts for registration (legacy support)
export const getEntitiesWithoutAccounts = async (entityType = null) => {
  try {
    const url = entityType
      ? `/api/User/entities-sans-compte?entityType=${entityType}`
      : "/api/User/entities-sans-compte";

    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching entities without accounts:", error);
    throw error.response?.data?.error || "Error fetching entities without accounts";
  }
};

// Get all users (admin only)
export const getAllUsers = async () => {
  try {
    const response = await apiClient.get("/User/all");
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error.response?.data?.error || "Error fetching users";
  }
};

// Toggle user approval (admin only)
export const toggleUserApproval = async (userId) => {
  try {
    const response = await apiClient.post(`/User/toggle-approval/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error toggling user approval:", error);
    throw error.response?.data?.error || "Error toggling user approval";
  }
};

// Update user
export const updateUser = async (userId, updateData) => {
  try {
    const response = await apiClient.put(`/User/update/${userId}`, updateData);
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error.response?.data?.error || "Error updating user";
  }
};

// Delete user
export const deleteUser = async (userId) => {
  try {
    const response = await apiClient.delete(`/User/delete/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error.response?.data?.error || "Error deleting user";
  }
};

// Validate engineer code availability
export const validateEngineerCode = async (code) => {
  try {
    const response = await apiClient.get(`/Engineer/validate-code/${code}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || "Error validating engineer code";
  }
};

// Validate client code availability
export const validateClientCode = async (code) => {
  try {
    const response = await apiClient.get(`/Client/validate-code/${code}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || "Error validating client code";
  }
};

// Get user profile with entity details
export const getUserProfile = async (userId) => {
  try {
    const response = await apiClient.get(`/User/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error.response?.data?.error || "Error fetching user profile";
  }
};

// Update user profile
export const updateUserProfile = async (userId, profileData) => {
  try {
    const response = await apiClient.put(`/User/profile/${userId}`, profileData);
    return response.data;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error.response?.data?.error || "Error updating user profile";
  }
};

// Change password
export const changePassword = async (userId, oldPassword, newPassword) => {
  try {
    const response = await apiClient.post(`/User/change-password/${userId}`, {
      oldPassword,
      newPassword,
    });
    return response.data;
  } catch (error) {
    console.error("Error changing password:", error);
    throw error.response?.data?.error || "Error changing password";
  }
};

// Request password reset
export const requestPasswordReset = async (email) => {
  try {
    const response = await apiClient.post("/User/request-password-reset", { email });
    return response.data;
  } catch (error) {
    console.error("Error requesting password reset:", error);
    throw error.response?.data?.error || "Error requesting password reset";
  }
};

// Reset password with token
export const resetPassword = async (token, newPassword) => {
  try {
    const response = await apiClient.post("/User/reset-password", {
      token,
      newPassword,
    });
    return response.data;
  } catch (error) {
    console.error("Error resetting password:", error);
    throw error.response?.data?.error || "Error resetting password";
  }
};

// Helper function to build entity data based on type
export const buildEntityData = (entityType, formData) => {
  const baseData = {
    name: formData.name,
    code: formData.code || "",
    email: formData.email_entity || "",
    phone: formData.phone || "",
  };

  switch (entityType.toLowerCase()) {
    case "employee":
      return {
        ...baseData,
        nationality: formData.nationality || "",
        departmentId: formData.departmentId || "",
      };

    case "engineer":
      return {
        ...baseData,
        specializations: formData.specializations || "",
      };

    case "client":
      return {
        ...baseData,
        address: formData.address || "",
        companyName: formData.companyName || "",
      };

    default:
      return baseData;
  }
};

// Validate form data before submission
export const validateRegistrationData = (formData) => {
  const errors = [];

  // Basic validation
  if (!formData.email) errors.push("Email is required");
  if (!formData.password) errors.push("Password is required");
  if (!formData.confirmPassword) errors.push("Password confirmation is required");
  if (!formData.entityType) errors.push("Profile type is required");
  if (!formData.name) errors.push("Name is required");

  // Password validation
  if (formData.password !== formData.confirmPassword) {
    errors.push("Passwords do not match");
  }
  if (formData.password && formData.password.length < 6) {
    errors.push("Password must be at least 6 characters long");
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (formData.email && !emailRegex.test(formData.email)) {
    errors.push("Please enter a valid email address");
  }

  // Entity-specific validation
  switch (formData.entityType) {
    case "employee":
      if (!formData.nationality) errors.push("Nationality is required for employees");
      if (!formData.departmentId) errors.push("Department is required for employees");
      break;
    case "engineer":
      if (!formData.code) errors.push("Engineer code is required");
      break;
    case "client":
      if (!formData.code) errors.push("Client code is required");
      break;
  }

  return errors;
};

// Check if email already exists
export const checkEmailExists = async (email) => {
  try {
    const response = await axios.get(`/api/User/check-email/${email}`);
    return response.data.exists;
  } catch (error) {
    console.error("Error checking email:", error);
    return false;
  }
};

// Get user by email
export const getUserByEmail = async (email) => {
  try {
    const response = await axios.get(`/api/User/by-email/${email}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user by email:", error);
    throw error.response?.data?.error || "Error fetching user";
  }
};

// Set axios interceptor for auth token
export const setupAxiosInterceptor = () => {
  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor to handle token expiration
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Token expired or invalid
        logout();
        window.location.href = "/authentication/sign-in";
      }
      return Promise.reject(error);
    }
  );
};

// Initialize authentication
export const initializeAuth = () => {
  setupAxiosInterceptor();

  // Check if user is logged in
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  if (token && user) {
    try {
      const userData = JSON.parse(user);
      return {
        isAuthenticated: true,
        user: userData,
        token: token,
      };
    } catch (error) {
      console.error("Error parsing user data:", error);
      logout();
      return {
        isAuthenticated: false,
        user: null,
        token: null,
      };
    }
  }

  return {
    isAuthenticated: false,
    user: null,
    token: null,
  };
};

// Get current user from localStorage
export const getCurrentUser = () => {
  try {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
};

// Check if user has specific role
export const hasRole = (requiredRole) => {
  const user = getCurrentUser();
  return user && user.role === requiredRole;
};

// Check if user has any of the specified roles
export const hasAnyRole = (roles) => {
  const user = getCurrentUser();
  return user && roles.includes(user.role);
};

// Refresh user data
export const refreshUserData = async () => {
  try {
    const user = getCurrentUser();
    if (user && user.id) {
      const updatedUser = await getUserProfile(user.id);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      return updatedUser;
    }
    return null;
  } catch (error) {
    console.error("Error refreshing user data:", error);
    return null;
  }
};
