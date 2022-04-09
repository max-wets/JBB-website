import Image from "next/image";
import Link from "next/link";
import { connectStateResults } from "react-instantsearch-dom";
import classes from "./CustomHits.module.css";
import Pagination from "../pagination/Pagination";
import { useMemo, useState } from "react";

let PageSize = 3;

function Hits({ searchState, searchResults }) {
  const validQuery = searchState.query?.length >= 1;
  // console.log(searchResults?.hits);

  const [currentPage, setCurrentPage] = useState(1);

  const currentData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * PageSize;
    const lastPageIndex = firstPageIndex + PageSize;
    return searchResults?.hits.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, searchResults]);

  function ResultHit({ idx, id, title, description, imageUrl }) {
    return (
      <article key={id} className={classes.resulthit}>
        <div className={classes.ctr}>
          <div className={classes.thumbnail}>
            <Link href={`/blog/${id}`}>
              <a>
                <Image
                  width={120}
                  height={120}
                  alt={title}
                  src={imageUrl}
                  objectFit="fill"
                />
              </a>
            </Link>
          </div>
          <div className={classes.content}>
            <header className={classes.contentheader}>
              <h2>
                <Link href={`/blog/${id}`}>
                  <a>{title}</a>
                </Link>
              </h2>
            </header>
            <div className={classes.contentsummary}>
              <p>{description.slice(0, 200) + "..."}</p>
            </div>
            <div className={classes.readmore}>
              <Link href={`/blog/${id}`}>
                <a>Lire</a>
              </Link>
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <div className={classes.resultsbox}>
      {searchResults?.hits.length === 0 && validQuery && (
        <p>
          0 résultat. Désolé, nous n'avons rien trouvé qui corresponde à votre
          recherche.
        </p>
      )}
      {searchResults?.hits.length > 0 && validQuery && (
        <>
          <div>
            <ul>
              {currentData.map((hit, idx) => (
                <ResultHit
                  idx={idx}
                  id={hit.id}
                  title={hit.title}
                  description={hit.description}
                  imageUrl={hit.imageUrl}
                />
              ))}
            </ul>
          </div>
          <Pagination
            className={classes.paginationbar}
            currentPage={currentPage}
            totalCount={searchResults.hits.length}
            pageSize={PageSize}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </>
      )}
    </div>
  );
}

export default connectStateResults(Hits);
