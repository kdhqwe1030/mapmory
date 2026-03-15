import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/src/api/api";

export interface Category {
  id: number;
  name: string;
  icon: string;
  color: string;
  created_at: string;
}

export const CATEGORIES_KEY = ["categories"] as const;

export function useCategories() {
  return useQuery<Category[]>({
    queryKey: CATEGORIES_KEY,
    queryFn: async () => {
      const { data } = await api.get<Category[]>("/categories");
      return data;
    },
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: { name: string; icon: string; color: string }) =>
      api.post<Category>("/categories", body).then((r) => r.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CATEGORIES_KEY }),
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      ...body
    }: {
      id: number;
      name: string;
      icon: string;
      color: string;
    }) => api.put<Category>(`/categories/${id}`, body).then((r) => r.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CATEGORIES_KEY }),
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete(`/categories/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CATEGORIES_KEY }),
  });
}
