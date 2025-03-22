import { useState, useEffect } from "react";
import qs, { ParsedQs } from "qs";
import { SearchAppProps } from "./SearchApp";

const updateAfter = 700;
const searchStateToUrl = (searchState: ParsedQs): string | URL => {
  return searchState
    ? `${window.location.pathname}?${qs.stringify(searchState)}`
    : "";
};
// let debouncedSetState;

const withUrlSync = (App: React.ComponentType<SearchAppProps>) =>
  function WithURLSync() {
    const [searchState, setSearchState] = useState({} as ParsedQs);
    const [debouncedState, setDebouncedState] = useState<number | null>(null);

    useEffect(() => {
      setSearchState(qs.parse(window.location.search.slice(1)));
    }, []);

    const { setTimeout, clearTimeout } = window;

    const onPopState = (state: PopStateEvent) => {
      setSearchState(state.state || null);
    };

    useEffect(() => {
      window.addEventListener("popstate", onPopState);

      return () => {
        if (debouncedState) clearTimeout(debouncedState);
        window.removeEventListener("popstate", onPopState);
      };
    }, [clearTimeout, debouncedState]);

    const onSearchStateChange = (searchState: ParsedQs) => {
      console.log("search state: ", searchState);
      if (debouncedState) clearTimeout(debouncedState);

      setDebouncedState(
        setTimeout(() => {
          window.history.pushState(
            searchState,
            "",
            searchStateToUrl(searchState),
          );
        }, updateAfter),
      );

      setSearchState(searchState);
    };

    return (
      <App
        searchState={searchState}
        onSearchStateChange={onSearchStateChange}
        createURL={searchStateToUrl}
      />
    );
  };

export default withUrlSync;
