import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/src/api/api";

export interface Category {
  id: number;
  name: string;
  icon: string;
  color: string;
  created_at: string;
  sort_order: number;
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

export function useReorderCategories() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ids: number[]) => api.patch("/categories", { ids }),
    onMutate: async (ids) => {
      await queryClient.cancelQueries({ queryKey: CATEGORIES_KEY });
      const previous = queryClient.getQueryData<Category[]>(CATEGORIES_KEY);
      const reordered = ids
        .map((id, i) => {
          const cat = (previous ?? []).find((c) => c.id === id);
          return cat ? { ...cat, sort_order: i + 1 } : null;
        })
        .filter((c): c is Category => c !== null);
      queryClient.setQueryData(CATEGORIES_KEY, reordered);
      return { previous };
    },
    onError: (_, __, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(CATEGORIES_KEY, ctx.previous);
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: CATEGORIES_KEY }),
  });
}
