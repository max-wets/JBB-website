import classes from "./SearchApp.module.css";
import algoliasearch from "algoliasearch";
import { InstantSearch, SearchBox, Hits } from "react-instantsearch-dom";
import CustomSearchBox from "./CustomSearchBox";
import CustomHits from "./CustomHits";

const searchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY
);

export default function Search() {
  return (
    <>
      <InstantSearch searchClient={searchClient} indexName="jbb_articles">
        <header className={classes.header}>
          <p className={classes.headertitle}>Que cherchez-vous ?</p>
          <CustomSearchBox />
        </header>
        <CustomHits />
      </InstantSearch>
    </>
  );
}
