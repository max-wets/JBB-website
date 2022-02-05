import React, { useState, useEffect, useCallback } from "react";
import qs from "qs";

const updateAfter = 700;
const searchStateToUrl = (searchState: any): string | URL => {
  return searchState
    ? `${window.location.pathname}?${qs.stringify(searchState)}`
    : "";
};

const WithUrlSync = (App) => {
  const [searchState, setSearchState] = useState(
    qs.parse(window.location.search.slice(1))
  );

  const onPopState = (state) => setSearchState(state || null);

  useEffect(() => {
    window.addEventListener("popstate", onPopState);

    return () => {
      window.removeEventListener("popstate", onPopState);
    };
  }, []);

  const onSearchStateChange = (searchState) => {
    const debouncedSetState = setTimeout(() => {
      window.history.pushState(
        searchState,
        null,
        searchStateToUrl(searchState)
      );
    }, updateAfter);

    setSearchState(searchState);
  };

  return (
    <App
      searchState={searchState}
      onSearchStateChange={onSearchStateChange}
      createUrl={searchStateToUrl}
    />
  );
};
