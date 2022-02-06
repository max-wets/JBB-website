import { connectStateResults } from "react-instantsearch-dom";

function Hits({ searchState, searchResults }) {
  const validQuery = searchState.query?.length >= 1;
  console.log(searchResults?.hits);

  return (
    <>
      {searchResults?.hits.length === 0 && validQuery && (
        <p>Aw snap! No search results were found.</p>
      )}
      {searchResults?.hits.length > 0 && validQuery && (
        <ul>
          {searchResults.hits.map((hit) => (
            <li key={hit.id}>{hit.title}</li>
          ))}
        </ul>
      )}
    </>
  );
}

export default connectStateResults(Hits);
