import { useState } from "react";
import type { PageData } from "../types";

export const usePageManagement = () => {
  const [pages, setPages] = useState<PageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<PageData>>({});
  const [isCreating, setIsCreating] = useState(false);

  const updateFormField = (field: keyof PageData, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateBackground = (field: "image_url", value: string) => {
    setFormData(prev => ({
      ...prev,
      background: {
        ...(prev.background || { gradient: { stops: [], direction: "" }, image_url: "" }),
        [field]: value,
      },
    }));
  };

  return {
    pages,
    loading,
    error,
    editingId,
    formData,
    isCreating,
    setPages,
    setLoading,
    setError,
    setEditingId,
    setFormData,
    setIsCreating,
    updateFormField,
    updateBackground,
  };
};
