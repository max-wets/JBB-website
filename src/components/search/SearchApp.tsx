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
        <section className={classes.spacer}></section>
        <section className={classes.appsection}>
          <div className={classes.appcontainer}>
            <div className={classes.columnwrap}>
              <p className={classes.heading}>
                <h1>Que cherchez-vous ?</h1>
              </p>
              <CustomSearchBox />

              <CustomHits />
            </div>
          </div>
        </section>
      </InstantSearch>
    </>
  );
}
