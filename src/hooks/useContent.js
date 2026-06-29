import { useState, useEffect } from 'react';

const DATA_URL = 'https://mohamedramy390.github.io/inspection-academy/cms/content/data.json';

/**
 * useContent — hook to access CMS content data from GitHub Pages.
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
    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        // Using cache busting to ensure we always get the latest data from the CMS
        const response = await fetch(`${DATA_URL}?t=${new Date().getTime()}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const json = await response.json();
        
        if (isMounted) {
          const result = section ? json[section] : json;
          setData(result);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [section]);

  return { data, loading, error };
};

export default useContent;
