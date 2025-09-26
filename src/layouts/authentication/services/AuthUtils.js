/**
 * Authentication utility functions
 */

/**
 * Checks if the user is authenticated
 * @returns {boolean} True if user is authenticated
 */
export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  return !!(token && user);
};

/**
 * Checks if the user has a specific role
 * @param {string|string[]} requiredRoles - Required role(s)
 * @returns {boolean} True if user has required role
 */
export const hasRole = (requiredRoles) => {
  const userRole = localStorage.getItem("role");
  
  if (!userRole) return false;
  
  if (Array.isArray(requiredRoles)) {
    return requiredRoles.includes(userRole);
  }
  
  return userRole === requiredRoles;
};

/**
 * Gets the current authenticated user
 * @returns {Object|null} User object or null
 */
export const getCurrentUser = () => {
  const userJson = localStorage.getItem("user");
  if (!userJson) return null;
  
  try {
    return JSON.parse(userJson);
  } catch (error) {
    console.error("Error parsing user data:", error);
    // Clear corrupted data
    localStorage.removeItem("user");
    return null;
  }
};

/**
 * Gets the current user's ID
 * @returns {string|null} User ID or null
 */
export const getCurrentUserId = () => {
  return localStorage.getItem("userId");
};

/**
 * Gets the current user's role
 * @returns {string|null} User role or null
 */
export const getCurrentUserRole = () => {
  return localStorage.getItem("role");
};

/**
 * Gets the current user's entity type (Employee, Engineer, Client)
 * @returns {string|null} Entity type or null
 */
export const getCurrentUserEntityType = () => {
  const user = getCurrentUser();
  return user?.userType || null;
};

/**
 * Gets the current user's associated entity
 * @returns {Object|null} Associated entity or null
 */
export const getCurrentUserEntity = () => {
  const user = getCurrentUser();
  if (!user) return null;
  
  return user.associatedEntity || null;
};

/**
 * Checks if the current user is approved
 * @returns {boolean} True if user is approved
 */
export const isUserApproved = () => {
  const user = getCurrentUser();
  return user?.approved === true;
};

/**
 * Checks if the current user is an admin
 * @returns {boolean} True if user has admin role
 */
export const isAdmin = () => {
  return hasRole(["Admin", "Administrator"]);
};

/**
 * Checks if the current user is a specific entity type
 * @param {string} entityType - Entity type to check (Employee, Engineer, Client)
 * @returns {boolean} True if user is of the specified entity type
 */
export const isEntityType = (entityType) => {
  const userEntityType = getCurrentUserEntityType();
  return userEntityType?.toLowerCase() === entityType.toLowerCase();
};

/**
 * Gets the authentication token
 * @returns {string|null} JWT token or null
 */
export const getAuthToken = () => {
  return localStorage.getItem("token");
};

/**
 * Validates if the token exists and user data is complete
 * @returns {boolean} True if authentication is valid
 */
export const isAuthenticationValid = () => {
  const token = getAuthToken();
  const user = getCurrentUser();
  
  if (!token || !user) return false;
  
  // Check if user has required properties
  return !!(user.id && user.email && user.hasOwnProperty('approved'));
};

/**
 * Logs out the user and clears all authentication data
 * @param {boolean} redirect - Whether to redirect to login page
 */
export const logout = (redirect = true) => {
  try {
    // Clear all authentication data
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    localStorage.removeItem("user");
    
    // Clear any other app-specific data if needed
    // localStorage.removeItem("preferences");
    
    console.log("User logged out successfully");
    
    if (redirect) {
      window.location.href = "/authentication/sign-in";
    }
    
    return true;
  } catch (error) {
    console.error("Error during logout:", error);
    return false;
  }
};

/**
 * Refreshes user data from localStorage
 * @returns {Object|null} Updated user object or null
 */
export const refreshUserData = () => {
  return getCurrentUser();
};

/**
 * Updates user data in localStorage
 * @param {Object} userData - Updated user data
 */
export const updateUserData = (userData) => {
  try {
    localStorage.setItem("user", JSON.stringify(userData));
    
    // Update related data if provided
    if (userData.role) {
      localStorage.setItem("role", userData.role);
    }
    if (userData.id) {
      localStorage.setItem("userId", userData.id);
    }
  } catch (error) {
    console.error("Error updating user data:", error);
  }
};

/**
 * Checks if authentication data needs refresh
 * @returns {boolean} True if data might be stale
 */
export const shouldRefreshAuth = () => {
  const token = getAuthToken();
  if (!token) return false;
  
  // Simple check - you could add JWT expiration checking here
  const user = getCurrentUser();
  return !user || !user.id;
};

/**
 * Format user display name
 * @returns {string} Formatted display name
 */
export const getUserDisplayName = () => {
  const user = getCurrentUser();
  if (!user) return "Unknown User";
  
  // Try to get name from associated entity first
  const entity = getCurrentUserEntity();
  if (entity && entity.name) {
    return entity.name;
  }
  
  // Fall back to email
  return user.email || "Unknown User";
};

/**
 * Get user avatar or initials for display
 * @returns {string} User initials or avatar URL
 */
export const getUserInitials = () => {
  const displayName = getUserDisplayName();
  if (displayName === "Unknown User") return "U";
  
  const names = displayName.split(" ");
  if (names.length >= 2) {
    return names[0].charAt(0).toUpperCase() + names[1].charAt(0).toUpperCase();
  }
  return displayName.charAt(0).toUpperCase();
};

/**
 * Get user permissions based on role and entity type
 * @returns {Object} Permission object
 */
export const getUserPermissions = () => {
  const role = getCurrentUserRole();
  const entityType = getCurrentUserEntityType();
  
  const permissions = {
    canViewDashboard: false,
    canManageUsers: false,
    canViewReports: false,
    canManageEntities: false,
    canApproveUsers: false
  };
  
  // Admin permissions
  if (isAdmin()) {
    return {
      canViewDashboard: true,
      canManageUsers: true,
      canViewReports: true,
      canManageEntities: true,
      canApproveUsers: true
    };
  }
  
  // Role-based permissions
  switch (role?.toLowerCase()) {
    case "manager":
      permissions.canViewDashboard = true;
      permissions.canViewReports = true;
      permissions.canManageUsers = false;
      break;
    case "user":
    default:
      permissions.canViewDashboard = true;
      break;
  }
  
  // Entity-based permissions
  switch (entityType?.toLowerCase()) {
    case "engineer":
      permissions.canViewReports = true;
      break;
    case "employee":
      permissions.canViewDashboard = true;
      break;
    case "client":
      permissions.canViewDashboard = true;
      break;
  }
  
  return permissions;
};