import classes from "./SearchApp.module.css";
import algoliasearch from "algoliasearch";
import { InstantSearch } from "react-instantsearch-dom";
import CustomSearchBox from "./CustomSearchBox";
import CustomHits from "./CustomHits";
import withUrlSync from "./URLSync";

const searchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY!,
);

export type SearchAppProps = {
  searchState: qs.ParsedQs;
  onSearchStateChange: (searchState: qs.ParsedQs) => void;
  createURL: (searchState: qs.ParsedQs) => string | URL;
};

function Search(props: SearchAppProps): JSX.Element {
  return (
    <>
      <InstantSearch
        searchClient={searchClient}
        indexName="jbb_articles"
        searchState={props.searchState}
        createURL={props.createURL}
        onSearchStateChange={props.onSearchStateChange}
      >
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

export default withUrlSync(Search);
