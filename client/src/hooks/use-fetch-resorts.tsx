import { useEffect, useState } from "react";
import { fetchResorts } from "../helpers/fetch-client.helper.ts";

const reFetchTime = 1000 * 60 * 5; // 5 minutes
// const reFetchTime = 1000 * 5; // 5 seconds

function useFetchResorts(favorites: string[]) {
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [fetchedLastTime, setFetchedLastTime] = useState(0);

  const shouldFetch = () => {
    const now = Date.now();
    return !fetching && (now - fetchedLastTime >= reFetchTime);
  };

  const handleFetch = () => {
    if (!shouldFetch()) {
      return;
    }
    setFetching(true);
    fetchResorts()
      .then(() => {
        setLoading(false);
        setFetchedLastTime(Date.now());
      })
      .catch(() => {
        setFetchedLastTime(Date.now() - reFetchTime + 5000);
        setLoading(false);
      })
      .finally(() => {
        setFetching(false);
      });
  };

  useEffect(() => {
    handleFetch();
  }, [favorites]); // Re-fetch when favorites change

  useEffect(() => {
    const interval = setInterval(handleFetch, reFetchTime); // Re-fetch every 5 minutes
    return () => clearInterval(interval);
  }, []); // Empty dependency array ensures this sets up once

  useEffect(() => {
    const handleFocus = () => {
      handleFetch();
    };
    window.addEventListener("focus", handleFocus);
    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, []); // Empty dependency array ensures this sets up once

  return { loading };
}

export default useFetchResorts;
