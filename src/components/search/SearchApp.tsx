import algoliasearch from "algoliasearch";
import { InstantSearch, SearchBox, Hits } from "react-instantsearch-dom";
import CustomSearchBox from "./CustomSearchBox";
import CustomHits from "./CustomHits";

const searchClient = algoliasearch(
  "RX7LAXFJUA",
  "4464a67bccd9d2ba13f636b6a10f4336"
);

export default function Search() {
  return (
    <>
      <InstantSearch searchClient={searchClient} indexName="jbb_articles">
        <CustomSearchBox />
        <CustomHits />
      </InstantSearch>
    </>
  );
}
