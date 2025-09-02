import axios from "axios";
import { supabase } from "./supabase";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export const api = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

// request interceptor to add auth token from Supabase
api.interceptors.request.use(async (config) => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }
  return config;
});

// response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // sign out user if token is invalid
      await supabase.auth.signOut();
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
  filmRolls: "/film-rolls",
  exposures: "/exposures",
  tags: "/tags",
  brands: "/brands",
  filmRollStocks: "/film-roll-stocks",
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

export interface FilmRoll {
  id: string;
  userId: string;
  filmRollStockId: string;
  label: string;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
  user: User;
  filmRollStock: FilmRollStock;
  exposures: Exposure[];
}

export interface Exposure {
  id: string;
  filmRollId: string;
  isUploading: boolean;
  isProcessing: boolean;
  createdAt: string;
  updatedAt: string;
  filmRoll: FilmRoll;
}

export interface Tag {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  filmRollStocks: FilmRollStock[];
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logoUrl?: string;
  createdAt: string;
  updatedAt: string;
  filmRollStocks: FilmRollStock[];
}

export interface FilmRollStock {
  id: string;
  name: string;
  slug: string;
  description?: string;
  brandId: string;
  iso: number;
  primaryColor?: string;
  secondaryColor?: string;
  coverImageUrl?: string;
  rollIconUrl?: string;
  examplePhotoUrls: string[];
  exposuresCapacity: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  brand: Brand;
  tags: Tag[];
}

export interface LoginResponse {
  user: User;
  accessToken: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}
