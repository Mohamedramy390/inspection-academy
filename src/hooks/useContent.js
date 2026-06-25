import { useState, useEffect } from 'react';
import content from '../../cms/content/data.json';

/**
 * useContent — hook to access CMS content data.
 * In production, swap the static import with an API fetch from your
 * Decap CMS Git backend or Netlify Functions endpoint.
 *
 * Usage:
 *   const { data, loading, error } = useContent();
 *   const { data: courseData } = useContent('courses');
 */
const useContent = (section = null) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      // Simulates async fetch — replace with real fetch for remote CMS
      setTimeout(() => {
        const result = section ? content[section] : content;
        setData(result);
        setLoading(false);
      }, 0);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }, [section]);

  return { data, loading, error };
};

export default useContent;
