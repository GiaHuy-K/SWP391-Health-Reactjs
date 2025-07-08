import { useState, useEffect } from "react";
import { getBlogCategories, getBlogStatuses } from "../services/api.blog";

export function useBlogEnums() {
  const [enums, setEnums] = useState({ categories: [], statuses: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEnums() {
      setLoading(true);
      try {
        const [categories, statuses] = await Promise.all([
          getBlogCategories(),
          getBlogStatuses(),
        ]);
        setEnums({ categories, statuses });
      } catch (e) {
        setEnums({ categories: [], statuses: [] });
      } finally {
        setLoading(false);
      }
    }
    fetchEnums();
  }, []);

  // Helper
  const getStatusLabel = (value) => enums.statuses.find(s => s.value === value)?.displayName || value;
  const getCategoryLabel = (value) => enums.categories.find(c => c.value === value)?.displayName || value;
  const getStatusColor = (value) => enums.statuses.find(s => s.value === value)?.color || undefined;
  const getCategoryColor = (value) => enums.categories.find(c => c.value === value)?.color || undefined;

  return {
    enums,
    loading,
    getStatusLabel,
    getCategoryLabel,
    getStatusColor,
    getCategoryColor,
  };
} 