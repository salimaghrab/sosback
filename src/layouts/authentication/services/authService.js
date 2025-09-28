import axios from "axios";
import apiClient from "./axiosInterceptor";
// Helper functions (add these to your existing authService)
const isTokenExpired = (token) => {
  if (!token) return true;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime + 30;
  } catch (error) {
    return true;
  }
};

export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  return token && !isTokenExpired(token);
};

export const initializeAuth = () => {
  const token = localStorage.getItem("token");

  if (token && isTokenExpired(token)) {
    logout();
  }
};

// Keep your existing login function but use apiClient for future requests
export const login = async (email, password) => {
  try {
    const response = await apiClient.post(`/User/login`, { email, password });

    // FIXED: Since your interceptor returns the payload directly,
    // response is already the data, not response.data
    const { token, user } = response; // Changed from response.data to response

    if (token && user) {
      // stockage token + infos basiques
      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role ?? "");
      localStorage.setItem("userId", user.id ?? "");
      localStorage.setItem("user", JSON.stringify(user));

      // profile : prioritise technicien puis conducteur (null sinon)
      const profile = user.technicien ?? user.conducteur ?? null;
      if (profile) {
        localStorage.setItem("profile", JSON.stringify(profile));
      } else {
        localStorage.removeItem("profile");
      }

      // optional: pour le chat, stocke un mini-objet "chatUser" (id, displayName, avatarBase64)
      const chatUser = {
        id: user.id,
        displayName: profile ? profile.prenom ?? profile.nom ?? user.email : user.email,
        avatarBase64: profile?.image ?? null,
      };
      localStorage.setItem("chatUser", JSON.stringify(chatUser));
    }

    return response; // Changed from response.data to response
  } catch (error) {
    // Remonter message d'erreur du backend si présent
    throw error.response?.data?.message || "Erreur lors de la connexion";
  }
};

export const logout = () => {
  try {
    // Clear all authentication-related data from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    localStorage.removeItem("user");

    // Optional: Clear any other app-specific data
    localStorage.clear();

    //console.log("✅ Logout successful - localStorage cleared");

    return true;
  } catch (error) {
    console.error(" Erreur lors du logout:", error);
    return false;
  }
};

export const register = async (formData) => {
  const response = await fetch("/api/conducteurs/add-with-user", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("Erreur du backend :", errorData);
    throw new Error(errorData.message || "Erreur lors de l'inscription !");
  }

  return await response.json();
};

// Add these functions to your existing authService.js

/**
 * Change password for authenticated user
 */
export const changePassword = async (userId, currentPassword, newPassword) => {
  try {
    const response = await apiClient.post("/User/change-password", {
      userId,
      currentPassword,
      newPassword,
    });
    return response; // Changed from response.data to response
  } catch (error) {
    throw error.response?.data?.message || "Erreur lors du changement de mot de passe";
  }
};

/**
 * Change password by email (for users who know their current password)
 */
export const changePasswordByEmail = async (email, currentPassword, newPassword) => {
  try {
    const response = await apiClient.post("/User/change-password-by-email", {
      email,
      currentPassword,
      newPassword,
    });
    return response; // Changed from response.data to response
  } catch (error) {
    throw error.response?.data?.message || "Erreur lors du changement de mot de passe";
  }
};

/**
 * Initiate password reset - sends email with reset link
 */
export const forgotPassword = async (email) => {
  try {
    const response = await apiClient.post("/User/forgot-password", {
      email,
    });
    return response; // Changed from response.data to response
  } catch (error) {
    throw error.response?.data?.message || "Erreur lors de l'envoi de l'email de réinitialisation";
  }
};

/**
 * Validate password reset token
 */
export const validateResetToken = async (email, token) => {
  try {
    const response = await apiClient.post("/User/validate-reset-token", {
      email,
      token,
    });
    return response; // Changed from response.data to response
  } catch (error) {
    throw error.response?.data?.message || "Erreur lors de la validation du token";
  }
};

/**
 * Reset password using token from email
 */
export const resetPassword = async (email, token, newPassword) => {
  try {
    const response = await apiClient.post("/User/reset-password", {
      email,
      token,
      newPassword,
    });
    return response; // Changed from response.data to response
  } catch (error) {
    throw error.response?.data?.message || "Erreur lors de la réinitialisation du mot de passe";
  }
};

/**
 * Admin reset password for another user
 */
export const adminResetPassword = async (userId, newPassword, adminUserId) => {
  try {
    const response = await apiClient.post("/User/admin-reset-password", {
      userId,
      newPassword,
      adminUserId,
    });
    return response; // Changed from response.data to response
  } catch (error) {
    throw (
      error.response?.data?.message ||
      "Erreur lors de la réinitialisation du mot de passe par l'admin"
    );
  }
};

/**
 * Check if password meets strength requirements
 */
export const checkPasswordStrength = async (password) => {
  try {
    const response = await apiClient.post("/User/check-password-strength", {
      password,
    });
    return response; // Changed from response.data to response
  } catch (error) {
    throw (
      error.response?.data?.message || "Erreur lors de la vérification de la force du mot de passe"
    );
  }
};

/**
 * Client-side password strength validation
 */
export const validatePasswordStrength = (password) => {
  const requirements = {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const isStrong = Object.values(requirements).every(Boolean);

  return {
    isStrong,
    requirements,
    score: Object.values(requirements).filter(Boolean).length,
  };
};

/**
 * Get password requirements text for UI
 */
export const getPasswordRequirements = () => {
  return [
    "Au moins 8 caractères",
    "Au moins une majuscule",
    "Au moins une minuscule",
    "Au moins un chiffre",
    "Au moins un caractère spécial",
  ];
};
