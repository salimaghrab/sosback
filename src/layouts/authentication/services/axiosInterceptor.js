import axios from "axios";

// Create axios instance
const apiClient = axios.create({
  baseURL: "https://577bfd7052cb.ngrok-free.app/api",
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
    // Log successful responses
    console.log(`API Response: ${response.status} ${response.config.url}`, response.data);
    return response;
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

      // Don't redirect if already on authentication pages
      const currentPath = window.location.pathname;
      const authPages = ["/authentication/sign-in", "/authentication/sign-up"];

      if (!authPages.some((page) => currentPath.includes(page))) {
        // Store current URL for redirect after login
        sessionStorage.setItem("redirectUrl", currentPath);

        // Clear authentication data
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("userId");
        localStorage.removeItem("user");

        // Redirect to login
        window.location.href = "/authentication/sign-in";
      }
    }

    // Handle server errors
    if (error.response && error.response.status >= 500) {
      console.error("Server error:", error.response.status);
      // You could show a global error notification here
    }

    return Promise.reject(error);
  }
);

export default apiClient;
