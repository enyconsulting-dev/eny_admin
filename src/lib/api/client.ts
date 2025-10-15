import { store } from "@/store";

const BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3010/v1"
    : "https://event-api-k0uh.onrender.com/v1";

const getAuthHeaders = () => {
  const state = store.getState();
  const token = state.auth.token?.access;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const apiClient = {
  get: async <T = any>(url: string): Promise<T> => {
    const response = await fetch(`${BASE_URL}${url}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...getAuthHeaders(),
      },
      mode: "cors",
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    const responseText = await response.text();

    if (!responseText) {
      return {} as T;
    }

    // Check if response looks like JSON
    if (
      responseText.trim().startsWith("{") ||
      responseText.trim().startsWith("[")
    ) {
      try {
        return JSON.parse(responseText);
      } catch (parseError) {
        // console.error("Failed to parse response as JSON:", parseError);
        // console.error("Response text was:", responseText);
        throw new Error(
          `Invalid JSON response: ${responseText.substring(0, 200)}...`
        );
      }
    } else {
      // console.error("Response is not JSON:", responseText);
      throw new Error(
        `Expected JSON response but got: ${responseText.substring(0, 200)}...`
      );
    }
  },

  post: async <T = any>(url: string, data?: any): Promise<T> => {
    const response = await fetch(`${BASE_URL}${url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...getAuthHeaders(),
      },
      body: data ? JSON.stringify(data) : undefined,
      mode: "cors",
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    const responseText = await response.text();

    if (!responseText) {
      return {} as T;
    }

    if (
      responseText.trim().startsWith("{") ||
      responseText.trim().startsWith("[")
    ) {
      try {
        return JSON.parse(responseText);
      } catch (parseError) {
        throw new Error(
          `Invalid JSON response: ${responseText.substring(0, 200)}...`
        );
      }
    } else {
      throw new Error(
        `Expected JSON response but got: ${responseText.substring(0, 200)}...`
      );
    }
  },

  put: async <T = any>(url: string, data?: any): Promise<T> => {
    const response = await fetch(`${BASE_URL}${url}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...getAuthHeaders(),
      },
      body: data ? JSON.stringify(data) : undefined,
      mode: "cors",
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    const responseText = await response.text();

    if (!responseText) {
      return {} as T;
    }

    // Check if response looks like JSON
    if (
      responseText.trim().startsWith("{") ||
      responseText.trim().startsWith("[")
    ) {
      try {
        return JSON.parse(responseText);
      } catch (parseError) {
        throw new Error(
          `Invalid JSON response: ${responseText.substring(0, 200)}...`
        );
      }
    } else {
      throw new Error(
        `Expected JSON response but got: ${responseText.substring(0, 200)}...`
      );
    }
  },

  patch: async <T = any>(url: string, data?: any): Promise<T> => {
    const response = await fetch(`${BASE_URL}${url}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...getAuthHeaders(),
      },
      body: data ? JSON.stringify(data) : undefined,
      mode: "cors",
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    const responseText = await response.text();
    // console.log("Response text:", responseText);

    if (!responseText) {
      return {} as T;
    }

    if (
      responseText.trim().startsWith("{") ||
      responseText.trim().startsWith("[")
    ) {
      try {
        return JSON.parse(responseText);
      } catch (parseError) {
        throw new Error(
          `Invalid JSON response: ${responseText.substring(0, 200)}...`
        );
      }
    } else {
      throw new Error(
        `Expected JSON response but got: ${responseText.substring(0, 200)}...`
      );
    }
  },

  delete: async <T = any>(url: string): Promise<T> => {
    const response = await fetch(`${BASE_URL}${url}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...getAuthHeaders(),
      },
      mode: "cors",
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    const responseText = await response.text();
    // console.log("Response text:", responseText);

    if (!responseText) {
      return {} as T;
    }
    
    if (
      responseText.trim().startsWith("{") ||
      responseText.trim().startsWith("[")
    ) {
      try {
        return JSON.parse(responseText);
      } catch (parseError) {
        throw new Error(
          `Invalid JSON response: ${responseText.substring(0, 200)}...`
        );
      }
    } else {
      // console.error("Response is not JSON:", responseText);
      throw new Error(
        `Expected JSON response but got: ${responseText.substring(0, 200)}...`
      );
    }
  },
};