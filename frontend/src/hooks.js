import { useState, useEffect, useCallback } from "react";

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // storage unavailable — fail silently, app still works in-memory
    }
  }, [key, value]);

  return [value, setValue];
}

export function useSavedCafes() {
  const [saved, setSaved] = useLocalStorage("jaipur-hope:saved-cafes", []);

  const isSaved = useCallback((id) => saved.some((c) => c.id === id), [saved]);

  const toggleSave = useCallback(
    (cafe) => {
      setSaved((prev) => {
        const exists = prev.some((c) => c.id === cafe.id);
        if (exists) return prev.filter((c) => c.id !== cafe.id);
        return [
          ...prev,
          {
            id: cafe.id,
            name: cafe.name,
            area: cafe.area,
            coverImage: cafe.coverImage,
            rating: cafe.rating,
            theme: cafe.theme,
          },
        ];
      });
    },
    [setSaved]
  );

  return { saved, isSaved, toggleSave };
}
