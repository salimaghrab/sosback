// utils/filterRoutes.js

/**
 * Parse user roles from localStorage
 * Handles different formats: string, JSON string, array
 */
export const parseUserRoles = () => {
  let raw = localStorage.getItem("role");
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed.map((r) => String(r).trim().toLowerCase());
    return [String(parsed).trim().toLowerCase()];
  } catch {
    return [String(raw).trim().toLowerCase()];
  }
};

/**
 * Check if user has access to a route based on roles
 */
const hasAccess = (allowedRoles = [], userRoles = []) => {
  if (!allowedRoles || allowedRoles.length === 0) return true;
  const allowed = allowedRoles.map((r) => String(r).trim().toLowerCase());
  const users = userRoles.map((r) => String(r).trim().toLowerCase());
  return users.some((ur) => allowed.includes(ur));
};

/**
 * Extract required roles from different sources
 */
const extractRequiredRoles = (route) => {
  // Priority 1: explicit allowedRoles property
  if (route.allowedRoles) return route.allowedRoles;

  // Priority 2: roles property (your current setup)
  if (route.roles) return route.roles;

  // Priority 3: extract from ProtectedRoute component props
  if (route.component && route.component.props && route.component.props.requiredRoles) {
    return route.component.props.requiredRoles;
  }

  // Priority 4: extract from nested children (for React elements)
  if (route.component && route.component.type && route.component.type.name === "ProtectedRoute") {
    return route.component.props?.requiredRoles;
  }

  return null;
};

/**
 * Filter routes based on user roles
 * @param {Array} routes - Array of route objects
 * @param {Array} userRolesParam - Optional user roles array, if not provided will read from localStorage
 * @returns {Array} Filtered routes array
 */
export const filterRoutesByRole = (routes, userRolesParam) => {
  const token = localStorage.getItem("token");

  // Get user roles
  const userRoles =
    userRolesParam && userRolesParam.length
      ? userRolesParam.map((r) => String(r).trim())
      : parseUserRoles();

  /**
   * Recursive function to filter routes
   */
  const filterRecursive = (routesList) => {
    return routesList
      .map((route) => {
        // Handle nested routes in collapse property
        if (route.collapse && Array.isArray(route.collapse)) {
          const filteredChildren = filterRecursive(route.collapse);

          // If no children are accessible, remove the parent
          if (filteredChildren.length === 0) return null;

          return { ...route, collapse: filteredChildren };
        }

        // Extract required roles from various sources
        const requiredRoles = extractRequiredRoles(route);

        // Special handling for public routes when user is not logged in
        if (!token) {
          // Only show public routes (no roles required) when not authenticated
          const isPublic = !requiredRoles || requiredRoles.length === 0;
          return isPublic ? route : null;
        }

        // If no roles required, it's accessible to everyone
        if (!requiredRoles || requiredRoles.length === 0) {
          return route;
        }

        // Check if user has required access
        const hasAccessResult = hasAccess(requiredRoles, userRoles);
        return hasAccessResult ? route : null;
      })
      .filter(Boolean); // Remove null entries
  };

  return filterRecursive(routes);
};

/**
 * Check if a specific route is accessible by current user
 * @param {Object} route - Route object to check
 * @returns {boolean} True if accessible, false otherwise
 */
export const isRouteAccessible = (route) => {
  const token = localStorage.getItem("token");
  const userRoles = parseUserRoles();
  const requiredRoles = extractRequiredRoles(route);

  // Public routes
  if (!requiredRoles || requiredRoles.length === 0) {
    return true;
  }

  // No token means only public routes are accessible
  if (!token) return false;

  // Check role access
  return hasAccess(requiredRoles, userRoles);
};

/**
 * Get user's accessible routes for a specific type
 * @param {Array} routes - All routes
 * @param {string} type - Route type to filter ('collapse', 'route', etc.)
 * @returns {Array} Filtered routes of specified type
 */
export const getAccessibleRoutesByType = (routes, type) => {
  const filteredRoutes = filterRoutesByRole(routes);
  return filteredRoutes.filter((route) => route.type === type);
};

/**
 * Get the first accessible route for redirection
 * @param {Array} routes - All routes
 * @param {Array} preferredRoutes - Array of preferred route paths in order of preference
 * @returns {string} First accessible route path
 */
export const getFirstAccessibleRoute = (routes, preferredRoutes = ["/dashboard"]) => {
  const filteredRoutes = filterRoutesByRole(routes);

  // Check preferred routes first
  for (const preferredPath of preferredRoutes) {
    const preferredRoute = filteredRoutes.find((route) => route.route === preferredPath);
    if (preferredRoute) return preferredPath;
  }

  // Find first accessible non-redirect route
  const firstAccessible = filteredRoutes.find(
    (route) => route.route && route.type !== "redirect" && route.type !== "none"
  );

  return firstAccessible ? firstAccessible.route : "/sign-in";
};
