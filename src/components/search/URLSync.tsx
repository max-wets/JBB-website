import { useState, useEffect } from "react";
import qs from "qs";

const updateAfter = 700;
const searchStateToUrl = (searchState: string): string | URL => {
  return searchState
    ? `${window.location.pathname}?${qs.stringify(searchState)}`
    : "";
};
// let debouncedSetState;

const withUrlSync = (App) =>
  function WithURLSync() {
    const [searchState, setSearchState] = useState({});
    const [debouncedState, setDebouncedState] = useState(null);

    useEffect(() => {
      setSearchState(qs.parse(window.location.search.slice(1)));
    }, []);

    const { setTimeout, clearTimeout } = window;

    const onPopState = (state) => setSearchState(state || null);

    useEffect(() => {
      window.addEventListener("popstate", onPopState);

      return () => {
        clearTimeout(debouncedState);
        window.removeEventListener("popstate", onPopState);
      };
    }, [clearTimeout, debouncedState]);

    const onSearchStateChange = (searchState) => {
      clearTimeout(debouncedState);

      setDebouncedState(
        setTimeout(() => {
          window.history.pushState(
            searchState,
            null,
            searchStateToUrl(searchState),
          );
        }, updateAfter),
      );

      setSearchState(searchState);
    };

    return (
      <App
        {...App.props}
        searchState={searchState}
        onSearchStateChange={onSearchStateChange}
        createUrl={searchStateToUrl}
      />
    );
  };

export default withUrlSync;
