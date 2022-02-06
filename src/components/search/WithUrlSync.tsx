import { useState, useEffect, useCallback } from "react";
import qs from "qs";

const updateAfter = 700;
const searchStateToUrl = (searchState: any): string | URL => {
  return searchState
    ? `${window.location.pathname}?${qs.stringify(searchState)}`
    : "";
};

const WithUrlSync = (App) => {
  const [searchState, setSearchState] = useState(undefined);

  useEffect(() => {
    setSearchState(qs.parse(window.location.search.slice(1)));
  }, []);

  const { setTimeout, clearTimeout } = window;

  const onPopState = (state) => setSearchState(state || null);

  useEffect(() => {
    window.addEventListener("popstate", onPopState);

    return () => {
      window.removeEventListener("popstate", onPopState);
    };
  }, []);

  const onSearchStateChange = (searchState) => {
    let debouncedSetState;
    clearTimeout(debouncedSetState);

    debouncedSetState = setTimeout(() => {
      window.history.pushState(
        searchState,
        null,
        searchStateToUrl(searchState)
      );
    }, updateAfter);

    setSearchState(searchState);
  };

  return (
    <WithUrlSync
      searchState={searchState}
      onSearchStateChange={onSearchStateChange}
      createUrl={searchStateToUrl}
    />
  );
};

export default WithUrlSync;
