import axios from "axios";

// Create axios instance
const apiClient = axios.create({
  baseURL: "https://sos-main-api.onrender.com/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    // Log request details for debugging
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`, {
      headers: config.headers,
      data: config.data,
    });

    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    try {
      // Debug: Log the raw response structure
      console.log("Raw response.data:", response.data);

      // Unified payload: prefer response.data.data (some APIs wrap like { data: ... })
      const payload =
        response.data && response.data.data !== undefined ? response.data.data : response.data;

      console.log("Extracted payload:", payload);

      // Log response summary (avoid printing huge or sensitive things)
      console.log(
        `API Response: ${response.status} ${response.config.url}`,
        // Handle different payload types for better logging
        Array.isArray(payload)
          ? `Array with ${payload.length} items`
          : typeof payload === "object" && payload !== null
          ? Object.keys(payload)
          : payload
      );

      // If this is the login endpoint and returned a token, persist it
      // Adjust the URL check to your real login route if different
      const url = (response.config.url || "").toLowerCase();
      if (url.includes("/user/login") && payload && payload.token) {
        try {
          localStorage.setItem("token", payload.token);
          if (payload.user) {
            localStorage.setItem("user", JSON.stringify(payload.user));
            // optional: store role or id if present
            if (payload.user.role) localStorage.setItem("role", payload.user.role);
            if (payload.user.id) localStorage.setItem("userId", payload.user.id);
          }
          console.log("Saved auth token + user to localStorage");
        } catch (e) {
          console.warn("Could not persist auth info to localStorage", e);
        }
      }

      // SOLUTION 2: Preserve axios response structure but with normalized data
      response.data = payload;
      return response; // Return the full response object with modified data

      // Alternative: If you want to keep your current approach (returning payload directly),
      // then update your authService.js to expect the payload directly instead of response.data
    } catch (e) {
      console.error("Error processing response:", e);
      // fallback: return original response if something unexpected happened
      return response;
    }
  },
  (error) => {
    console.error("API Error:", {
      status: error.response?.status,
      url: error.config?.url,
      message: error.response?.data?.error || error.message,
      data: error.response?.data,
    });

    // Handle authentication errors
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      console.log("Authentication error detected:", error.response.status);

      const currentPath = window.location.pathname;
      const authPages = ["/authentication/sign-in", "/authentication/sign-up"];

      if (!authPages.some((page) => currentPath.includes(page))) {
        sessionStorage.setItem("redirectUrl", currentPath);
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("userId");
        localStorage.removeItem("user");

        window.location.href = "/authentication/sign-in";
      }
    }

    // Handle server errors
    if (error.response && error.response.status >= 500) {
      console.error("Server error:", error.response.status);
    }

    return Promise.reject(error);
  }
);

export default apiClient;
