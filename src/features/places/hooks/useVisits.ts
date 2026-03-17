import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/src/api/api";
import { SAVED_PLACES_KEY } from "@/src/features/places/hooks/useSavedPlaces";

export interface VisitRecord {
  id: number;
  place_id: number;
  visited_at: string; // ISO date string "2024-01-15"
  memo: string | null;
  created_at: string;
}

const visitsKey = (savedPlaceId: number) => ["visits", savedPlaceId] as const;

export function useVisits(savedPlaceId: number | null) {
  return useQuery<VisitRecord[]>({
    queryKey: visitsKey(savedPlaceId ?? 0),
    queryFn: async () => {
      const { data } = await api.get<VisitRecord[]>("/visits", {
        params: { place_id: savedPlaceId },
      });
      return data;
    },
    enabled: !!savedPlaceId,
  });
}

export function useAddVisit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: { place_id: number; visited_at: string }) => {
      const { data } = await api.post<VisitRecord>("/visits", body);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: visitsKey(data.place_id) });
      queryClient.invalidateQueries({ queryKey: SAVED_PLACES_KEY });
    },
  });
}

export function useUpdateVisit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      place_id,
      visited_at,
    }: {
      id: number;
      place_id: number;
      visited_at: string;
    }) => {
      const { data } = await api.patch<VisitRecord>(`/visits/${id}`, {
        visited_at,
      });
      return { ...data, place_id };
    },
    onSuccess: (data) =>
      queryClient.invalidateQueries({ queryKey: visitsKey(data.place_id) }),
  });
}

export function useDeleteVisit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, place_id }: { id: number; place_id: number }) => {
      await api.delete(`/visits/${id}`);
      return place_id;
    },
    onSuccess: (place_id) => {
      queryClient.invalidateQueries({ queryKey: visitsKey(place_id) });
      queryClient.invalidateQueries({ queryKey: SAVED_PLACES_KEY });
    },
  });
}
