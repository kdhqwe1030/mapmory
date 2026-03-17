import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/src/api/api";

export interface SavedPlaceRecord {
  id: number;
  place_id: number;
  category_id: number | null;
  visit_status: string;
  created_at: string;
  places: {
    id: number;
    name: string;
    address: string | null;
    lat: number | null;
    lng: number | null;
    external_id: string | null;
    naver_category: string | null;
  };
  categories: {
    id: number;
    name: string;
    icon: string;
    color: string;
  } | null;
}

export const SAVED_PLACES_KEY = ["saved-places"] as const;

export function useSavedPlaces() {
  return useQuery<SavedPlaceRecord[]>({
    queryKey: SAVED_PLACES_KEY,
    queryFn: async () => {
      const { data } = await api.get<SavedPlaceRecord[]>("/saved-places");
      return data;
    },
  });
}

export function useSavePlace() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: {
      name: string;
      address: string;
      external_id: string;
      lat: number;
      lng: number;
      naver_category: string;
      category_id: number;
    }) => {
      // 1. upsert place
      const { data: place } = await api.post("/places", {
        name: body.name,
        address: body.address,
        external_id: body.external_id,
        lat: body.lat,
        lng: body.lng,
        naver_category: body.naver_category,
      });
      // 2. save to category
      const { data: saved } = await api.post("/saved-places", {
        place_id: place.id,
        category_id: body.category_id,
      });
      return saved;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: SAVED_PLACES_KEY }),
  });
}

export function useRemoveSavedPlace() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete(`/saved-places/${id}`),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: SAVED_PLACES_KEY }),
  });
}
