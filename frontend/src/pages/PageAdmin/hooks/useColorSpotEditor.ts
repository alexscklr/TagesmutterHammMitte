import type { ColorSpot, PageData } from "../types";

export const useColorSpotEditor = (
  _formData: Partial<PageData>,
  setFormData: (updater: ((prev: Partial<PageData>) => Partial<PageData>) | Partial<PageData>) => void
) => {
  const addColorSpot = () => {
    setFormData((prev: Partial<PageData>) => {
      const newSpot: ColorSpot = {
        id: Date.now().toString(),
        x: 50,
        y: 50,
        color: "#C8F0F8",
        opacity: 0.45,
        size: 30,
      };
      return {
        ...prev,
        background: {
          ...prev.background,
          colorSpots: [...(prev.background?.colorSpots || []), newSpot],
        },
      };
    });
  };

  const updateColorSpot = (id: string, field: keyof ColorSpot, value: unknown) => {
    setFormData((prev: Partial<PageData>) => {
      const colorSpots = prev.background?.colorSpots || [];
      return {
        ...prev,
        background: {
          ...prev.background,
          colorSpots: colorSpots.map((spot: ColorSpot) =>
            spot.id === id ? { ...spot, [field]: value } : spot
          ),
        },
      };
    });
  };

  const removeColorSpot = (id: string) => {
    setFormData((prev: Partial<PageData>) => {
      const colorSpots = prev.background?.colorSpots || [];
      return {
        ...prev,
        background: {
          ...prev.background,
          colorSpots: colorSpots.filter((spot: ColorSpot) => spot.id !== id),
        },
      };
    });
  };

  return {
    addColorSpot,
    updateColorSpot,
    removeColorSpot,
  };
};
