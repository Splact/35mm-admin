import axios from "axios";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export const api = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

// request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("admin-token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("admin-token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const endpoints = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
  },
  users: "/users",
  films: "/films",
  rolls: "/rolls",
} as const;

// types for API responses
export interface User {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Film {
  id: string;
  name: string;
  brand: string;
  iso: number;
  format: string;
  description?: string;
  userId: string;
  user: User;
  createdAt: string;
  updatedAt: string;
}

export interface Roll {
  id: string;
  filmId: string;
  userId: string;
  name: string;
  description?: string;
  exposureCount: number;
  maxExposures: number;
  isCompleted: boolean;
  startedAt: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
  user: User;
  film: Film;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}
