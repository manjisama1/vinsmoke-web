import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { API_ENDPOINTS } from '@/config/api';
import { PERMANENT_FAQS, getPermanentCategories } from '@/data/permanentFAQs';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchingRef = useRef(false); // Prevent duplicate requests

  const fetchApiData = async () => {
    // Prevent duplicate requests
    if (fetchingRef.current) return;
    
    fetchingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(API_ENDPOINTS.publicData);
      const result = await response.json();

      if (result.success) {
        setApiData(result);
      } else {
        throw new Error(result.error || 'Failed to fetch data');
      }
    } catch (err) {
      setError(err.message);
      // Don't fail completely - we still have permanent FAQs
      setApiData({ faqs: [], plugins: [], categories: [] });
    } finally {
      setLoading(false);
      fetchingRef.current = false;
    }
  };

  useEffect(() => {
    fetchApiData();
  }, []);

  const refreshData = () => {
    fetchApiData();
  };

  // Combine permanent FAQs with API FAQs
  const allFAQs = [
    ...PERMANENT_FAQS,
    ...(apiData?.faqs || []).filter(faq => !faq.isPermanent) // Only add non-permanent FAQs from API
  ];

  // Combine categories
  const permanentCategories = getPermanentCategories();
  const apiCategories = apiData?.categories || [];
  const allCategories = ['All', ...new Set([...permanentCategories, ...apiCategories])].sort();

  const value = {
    faqs: allFAQs,
    plugins: apiData?.plugins || [],
    categories: allCategories,
    loading,
    error,
    refreshData,
    // Separate access to permanent and API data
    permanentFAQs: PERMANENT_FAQS,
    apiFAQs: apiData?.faqs || []
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};