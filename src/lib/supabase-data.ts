import { supabase } from "./supabase";
import { api, endpoints } from "./api";
import type {
  User,
  FilmRoll,
  Exposure,
  Tag,
  Brand,
  FilmRollStock,
} from "./api";

// types for Supabase responses
export interface SupabaseUser {
  id: string;
  email: string;
  username: string;
  first_name?: string;
  last_name?: string;
  created_at: string;
  updated_at: string;
}

export interface SupabaseFilmRoll {
  id: string;
  user_id: string;
  film_roll_stock_id: string;
  label: string;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
}

export interface SupabaseExposure {
  id: string;
  film_roll_id: string;
  is_uploading: boolean;
  is_processing: boolean;
  created_at: string;
  updated_at: string;
}

export interface SupabaseTag {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface SupabaseBrand {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo_url?: string;
  created_at: string;
  updated_at: string;
}

export interface SupabaseFilmRollStock {
  id: string;
  name: string;
  slug: string;
  description?: string;
  brand_id: string;
  iso: number;
  primary_color?: string;
  secondary_color?: string;
  cover_image_url?: string;
  roll_icon_url?: string;
  example_photo_urls: string[];
  exposures_capacity: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// data access functions
export const supabaseData = {
  // users
  async getUsers(): Promise<User[]> {
    try {
      const response = await api.get(endpoints.users);
      return response.data;
    } catch (error) {
      console.error("Error fetching users from API:", error);
      return [];
    }
  },

  // film rolls
  async getFilmRolls(): Promise<FilmRoll[]> {
    const { data, error } = await supabase
      .from("film_rolls")
      .select(
        `
        *,
        film_roll_stock:film_roll_stocks(*),
        exposures(*)
      `
      )
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch film rolls: ${error.message}`);
    }

    // Get unique user IDs from film rolls
    const userIds = [...new Set(data?.map((roll) => roll.user_id) || [])];

    // Fetch user data from the public users view
    const { data: usersData, error: usersError } = await supabase
      .from("users")
      .select("*")
      .in("id", userIds);

    if (usersError) {
      console.warn("Could not fetch user data:", usersError.message);
    }

    // Create a map of user data for quick lookup
    const usersMap = new Map(
      usersData?.map((user) => [
        user.id,
        {
          id: user.id,
          email: user.email || "",
          username: user.username || user.email?.split("@")[0] || "unknown",
          firstName: user.first_name,
          lastName: user.last_name,
          createdAt: user.created_at,
          updatedAt: user.updated_at || user.created_at,
        },
      ]) || []
    );

    return (
      data?.map((roll) => ({
        id: roll.id,
        userId: roll.user_id,
        filmRollStockId: roll.film_roll_stock_id,
        label: roll.label,
        isArchived: roll.is_archived,
        createdAt: roll.created_at,
        updatedAt: roll.updated_at,
        user: usersMap.get(roll.user_id) || {
          id: roll.user_id,
          email: "unknown@example.com",
          username: "unknown",
          firstName: undefined,
          lastName: undefined,
          createdAt: roll.created_at,
          updatedAt: roll.updated_at,
        },
        filmRollStock: {
          id: roll.film_roll_stock.id,
          name: roll.film_roll_stock.name,
          slug: roll.film_roll_stock.slug,
          description: roll.film_roll_stock.description,
          brandId: roll.film_roll_stock.brand_id,
          iso: roll.film_roll_stock.iso,
          primaryColor: roll.film_roll_stock.primary_color,
          secondaryColor: roll.film_roll_stock.secondary_color,
          coverImageUrl: roll.film_roll_stock.cover_image_url,
          rollIconUrl: roll.film_roll_stock.roll_icon_url,
          examplePhotoUrls: roll.film_roll_stock.example_photo_urls,
          exposuresCapacity: roll.film_roll_stock.exposures_capacity,
          isActive: roll.film_roll_stock.is_active,
          createdAt: roll.film_roll_stock.created_at,
          updatedAt: roll.film_roll_stock.updated_at,
          brand: {} as Brand, // will be populated if needed
          tags: [], // will be populated if needed
        },
        exposures:
          roll.exposures?.map((exposure: SupabaseExposure) => ({
            id: exposure.id,
            filmRollId: exposure.film_roll_id,
            isUploading: exposure.is_uploading,
            isProcessing: exposure.is_processing,
            createdAt: exposure.created_at,
            updatedAt: exposure.updated_at,
            filmRoll: {} as FilmRoll, // will be populated if needed
          })) || [],
      })) || []
    );
  },

  // exposures
  async getExposures(): Promise<Exposure[]> {
    const { data, error } = await supabase
      .from("exposures")
      .select(
        `
        *,
        film_roll:film_rolls(*)
      `
      )
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch exposures: ${error.message}`);
    }

    return (
      data?.map((exposure) => ({
        id: exposure.id,
        filmRollId: exposure.film_roll_id,
        isUploading: exposure.is_uploading,
        isProcessing: exposure.is_processing,
        createdAt: exposure.created_at,
        updatedAt: exposure.updated_at,
        filmRoll: {
          id: exposure.film_roll.id,
          userId: exposure.film_roll.user_id,
          filmRollStockId: exposure.film_roll.film_roll_stock_id,
          label: exposure.film_roll.label,
          isArchived: exposure.film_roll.is_archived,
          createdAt: exposure.film_roll.created_at,
          updatedAt: exposure.film_roll.updated_at,
          user: {} as User, // will be populated if needed
          filmRollStock: {} as FilmRollStock, // will be populated if needed
          exposures: [], // will be populated if needed
        },
      })) || []
    );
  },

  // tags
  async getTags(): Promise<Tag[]> {
    const { data, error } = await supabase
      .from("tags")
      .select(
        `
        *,
        film_roll_stocks:film_roll_stock_tags(film_roll_stock_id)
      `
      )
      .order("name", { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch tags: ${error.message}`);
    }

    return (
      data?.map((tag) => ({
        id: tag.id,
        name: tag.name,
        description: tag.description,
        createdAt: tag.created_at,
        updatedAt: tag.updated_at,
        filmRollStocks: [], // will be populated if needed
      })) || []
    );
  },

  // brands
  async getBrands(): Promise<Brand[]> {
    const { data, error } = await supabase
      .from("brands")
      .select(
        `
        *,
        film_roll_stocks:film_roll_stocks(*)
      `
      )
      .order("name", { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch brands: ${error.message}`);
    }

    return (
      data?.map((brand) => ({
        id: brand.id,
        name: brand.name,
        slug: brand.slug,
        description: brand.description,
        logoUrl: brand.logo_url,
        createdAt: brand.created_at,
        updatedAt: brand.updated_at,
        filmRollStocks:
          brand.film_roll_stocks?.map((stock: SupabaseFilmRollStock) => ({
            id: stock.id,
            name: stock.name,
            slug: stock.slug,
            description: stock.description,
            brandId: stock.brand_id,
            iso: stock.iso,
            primaryColor: stock.primary_color,
            secondaryColor: stock.secondary_color,
            coverImageUrl: stock.cover_image_url,
            rollIconUrl: stock.roll_icon_url,
            examplePhotoUrls: stock.example_photo_urls,
            exposuresCapacity: stock.exposures_capacity,
            isActive: stock.is_active,
            createdAt: stock.created_at,
            updatedAt: stock.updated_at,
            brand: {} as Brand, // will be populated if needed
            tags: [], // will be populated if needed
          })) || [],
      })) || []
    );
  },

  // film roll stocks
  async getFilmRollStocks(): Promise<FilmRollStock[]> {
    const { data, error } = await supabase
      .from("film_roll_stocks")
      .select(
        `
        *,
        brand:brands(*),
        tags:film_roll_stock_tags(tag:tags(*))
      `
      )
      .order("name", { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch film roll stocks: ${error.message}`);
    }

    return (
      data?.map((stock) => ({
        id: stock.id,
        name: stock.name,
        slug: stock.slug,
        description: stock.description,
        brandId: stock.brand_id,
        iso: stock.iso,
        primaryColor: stock.primary_color,
        secondaryColor: stock.secondary_color,
        coverImageUrl: stock.cover_image_url,
        rollIconUrl: stock.roll_icon_url,
        examplePhotoUrls: stock.example_photo_urls,
        exposuresCapacity: stock.exposures_capacity,
        isActive: stock.is_active,
        createdAt: stock.created_at,
        updatedAt: stock.updated_at,
        brand: {
          id: stock.brand.id,
          name: stock.brand.name,
          slug: stock.brand.slug,
          description: stock.brand.description,
          logoUrl: stock.brand.logo_url,
          createdAt: stock.brand.created_at,
          updatedAt: stock.brand.updated_at,
          filmRollStocks: [], // will be populated if needed
        },
        tags:
          stock.tags?.map((tagRef: { tag: SupabaseTag }) => ({
            id: tagRef.tag.id,
            name: tagRef.tag.name,
            description: tagRef.tag.description,
            createdAt: tagRef.tag.created_at,
            updatedAt: tagRef.tag.updated_at,
            filmRollStocks: [], // will be populated if needed
          })) || [],
      })) || []
    );
  },

  // create film roll
  async createFilmRoll(data: {
    label: string;
    filmRollStockId: string;
    userId: string;
  }): Promise<FilmRoll> {
    try {
      const response = await api.post(`${endpoints.filmRolls}`, {
        label: data.label,
        filmRollStockId: data.filmRollStockId,
        userId: data.userId,
        isArchived: false,
      });

      return response.data;
    } catch (error) {
      console.error("Error creating film roll:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      const apiError = error as { response?: { data?: { message?: string } } };
      throw new Error(
        `Failed to create film roll: ${
          apiError.response?.data?.message || errorMessage
        }`
      );
    }
  },

  // update film roll
  async updateFilmRoll(
    id: string,
    data: {
      label?: string;
      filmRollStockId?: string;
      userId?: string;
      isArchived?: boolean;
    }
  ): Promise<FilmRoll> {
    try {
      const response = await api.patch(`${endpoints.filmRolls}/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Error updating film roll:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      const apiError = error as { response?: { data?: { message?: string } } };
      throw new Error(
        `Failed to update film roll: ${
          apiError.response?.data?.message || errorMessage
        }`
      );
    }
  },
};
