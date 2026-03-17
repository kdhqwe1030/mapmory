"use client";

import { useState } from "react";
import EditRounded from "@mui/icons-material/EditRounded";
import DeleteRounded from "@mui/icons-material/DeleteRounded";
import CheckRounded from "@mui/icons-material/CheckRounded";
import CloseRounded from "@mui/icons-material/CloseRounded";
import AddRounded from "@mui/icons-material/AddRounded";
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
  type Category,
} from "@/src/features/categories/hooks/useCategories";
import { PRESET_COLORS } from "@/src/features/categories/categoryColors";

const extractEmoji = (value: string): string => {
  const match = value.match(/\p{Extended_Pictographic}/u);
  return match ? match[0] : "";
};

export function CategoryManager() {
  const { data: categories = [], isLoading } = useCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ icon: "", name: "", color: "" });
  const [newForm, setNewForm] = useState({
    icon: "",
    name: "",
    color: PRESET_COLORS[0],
  });
  const [isAdding, setIsAdding] = useState(false);
  const [shakeNew, setShakeNew] = useState(false);
  const [shakeEdit, setShakeEdit] = useState(false);

  const handleCreate = () => {
    if (!newForm.name.trim()) return;
    const icon = newForm.icon.trim() || "🏠";
    createCategory.mutate(
      { ...newForm, icon },
      {
        onSuccess: () => {
          setNewForm({ icon: "", name: "", color: PRESET_COLORS[0] });
          setIsAdding(false);
        },
      },
    );
  };

  const handleEdit = (cat: Category) => {
    setEditingId(cat.id);
    setEditForm({
      icon: cat.icon,
      name: cat.name,
      color: cat.color ?? PRESET_COLORS[0],
    });
  };

  const handleUpdate = (id: number) => {
    const icon = editForm.icon.trim() || "🏠";
    updateCategory.mutate(
      { id, ...editForm, icon },
      {
        onSuccess: () => setEditingId(null),
      },
    );
  };

  const handleDelete = (id: number) => {
    deleteCategory.mutate(id);
  };

  const handleNewIconChange = (value: string) => {
    if (value === "") {
      setNewForm({ ...newForm, icon: "" });
      return;
    }
    const emoji = extractEmoji(value);
    if (emoji) {
      setNewForm({ ...newForm, icon: emoji });
    } else {
      setShakeNew(true);
      setTimeout(() => setShakeNew(false), 400);
    }
  };

  const handleEditIconChange = (value: string) => {
    if (value === "") {
      setEditForm({ ...editForm, icon: "" });
      return;
    }
    const emoji = extractEmoji(value);
    if (emoji) {
      setEditForm({ ...editForm, icon: emoji });
    } else {
      setShakeEdit(true);
      setTimeout(() => setShakeEdit(false), 400);
    }
  };

  return (
    <>
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-4px); }
          40% { transform: translateX(4px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(2px); }
        }
      `}</style>
      <div className="px-4 pt-4 pb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-semibold text-text-primary">
            장소 카테고리
          </h1>
          <button
            onClick={() => setIsAdding(true)}
            className="w-8 h-8 rounded-full bg-[#FFDCDC] flex items-center justify-center hover:bg-brand-salmon transition-colors"
          >
            <AddRounded sx={{ fontSize: 18, color: "#3A2E2A" }} />
          </button>
        </div>

        {/* 카테고리 목록 */}
        <div className="flex flex-col gap-2">
          {isLoading ? (
            <p className="text-text-muted text-sm text-center py-8">
              불러오는 중...
            </p>
          ) : categories.length === 0 ? (
            <p className="text-text-muted text-sm text-center py-8">
              카테고리가 없어요
            </p>
          ) : (
            categories.map((cat) =>
              editingId === cat.id ? (
                <div
                  key={cat.id}
                  className="rounded-2xl bg-white border border-border p-3"
                >
                  <div className="flex gap-2 mb-2">
                    <div className="flex flex-col items-center gap-1">
                      <input
                        value={editForm.icon}
                        onChange={(e) => handleEditIconChange(e.target.value)}
                        placeholder="🏠"
                        maxLength={8}
                        className="w-12 h-12 rounded-xl bg-brand-cream border-2 border-dashed border-brand-salmon text-center text-2xl focus:outline-none focus:border-[#FFDCDC] placeholder-[#D4C4BC]"
                        style={{
                          animation: shakeEdit ? "shake 0.4s ease" : undefined,
                        }}
                      />
                      <span className="text-[10px] text-text-muted">
                        아이콘
                      </span>
                    </div>
                    <input
                      value={editForm.name}
                      onChange={(e) =>
                        setEditForm({ ...editForm, name: e.target.value })
                      }
                      placeholder="카테고리 이름"
                      className="flex-1 h-12 rounded-xl border border-border px-3 text-sm text-text-primary focus:outline-none focus:border-brand-salmon"
                    />
                  </div>
                  <div className="flex gap-2 mb-3">
                    {PRESET_COLORS.map((c) => (
                      <button
                        key={c}
                        onClick={() => setEditForm({ ...editForm, color: c })}
                        className="w-7 h-7 rounded-full border-2 transition-all"
                        style={{
                          background: c,
                          borderColor:
                            editForm.color === c ? "#3A2E2A" : "transparent",
                        }}
                      />
                    ))}
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => setEditingId(null)}
                      className="w-8 h-8 rounded-full bg-[#F5F0EE] flex items-center justify-center"
                    >
                      <CloseRounded sx={{ fontSize: 16, color: "#9B8B84" }} />
                    </button>
                    <button
                      onClick={() => handleUpdate(cat.id)}
                      className="w-8 h-8 rounded-full bg-[#FFDCDC] flex items-center justify-center hover:bg-brand-salmon"
                    >
                      <CheckRounded sx={{ fontSize: 16, color: "#3A2E2A" }} />
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  key={cat.id}
                  className="flex items-center gap-3 rounded-2xl bg-white border border-border px-4 py-3"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
                    style={{ background: cat.color ?? "#FFF2EB" }}
                  >
                    {cat.icon === "default" ? "📁" : cat.icon}
                  </div>
                  <span className="flex-1 text-sm font-medium text-text-primary">
                    {cat.name}
                  </span>
                  <button
                    onClick={() => handleEdit(cat)}
                    className="w-7 h-7 flex items-center justify-center"
                  >
                    <EditRounded sx={{ fontSize: 16, color: "#9B8B84" }} />
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="w-7 h-7 flex items-center justify-center"
                  >
                    <DeleteRounded sx={{ fontSize: 16, color: "#9B8B84" }} />
                  </button>
                </div>
              ),
            )
          )}
        </div>

        {/* 카테고리 추가 폼 */}
        {isAdding && (
          <div className="mt-3 rounded-2xl bg-white border border-[#FFDCDC] p-3">
            <div className="flex gap-2 mb-2">
              <div className="flex flex-col items-center gap-1">
                <input
                  autoFocus
                  value={newForm.icon}
                  onChange={(e) => handleNewIconChange(e.target.value)}
                  placeholder="🏠"
                  maxLength={8}
                  className="w-12 h-12 rounded-xl bg-brand-cream border-2 border-dashed border-brand-salmon text-center text-2xl focus:outline-none focus:border-[#FFDCDC] placeholder-[#D4C4BC]"
                  style={{
                    animation: shakeNew ? "shake 0.4s ease" : undefined,
                  }}
                />
                <span className="text-[10px] text-text-muted">아이콘</span>
              </div>
              <input
                value={newForm.name}
                onChange={(e) =>
                  setNewForm({ ...newForm, name: e.target.value })
                }
                placeholder="카테고리 이름"
                className="flex-1 h-12 rounded-xl border  border-border px-3 text-sm text-text-primary focus:outline-none focus:border-brand-salmon"
                onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              />
            </div>
            <div className="flex gap-2 mb-3">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setNewForm({ ...newForm, color: c })}
                  className="w-7 h-7 rounded-full border-2 transition-all"
                  style={{
                    background: c,
                    borderColor:
                      newForm.color === c ? "#3A2E2A" : "transparent",
                  }}
                />
              ))}
            </div>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setIsAdding(false)}
                className="w-8 h-8 rounded-full bg-[#F5F0EE] flex items-center justify-center"
              >
                <CloseRounded sx={{ fontSize: 16, color: "#9B8B84" }} />
              </button>
              <button
                onClick={handleCreate}
                className="w-8 h-8 rounded-full bg-[#FFDCDC] flex items-center justify-center hover:bg-brand-salmon"
              >
                <CheckRounded sx={{ fontSize: 16, color: "#3A2E2A" }} />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
