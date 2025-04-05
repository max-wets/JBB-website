import Link from "next/link";
import { connectStateResults } from "react-instantsearch-dom";
import Image from "next/image";
import classes from "./CustomHits.module.css";
import Pagination from "../pagination/Pagination";
import { useMemo, useState } from "react";
import { urlStringFormatter } from "../../lib/utils";
import { StateResultsProvided } from "react-instantsearch-core";
import { BlogPostApi } from "../../types";

type ArticleResultHitProps = BlogPostApi & { objectID: string };

type HitsProps = StateResultsProvided<ArticleResultHitProps>;

const PageSize = 3;

function Hits({ searchState, searchResults }: HitsProps): JSX.Element {
  const [currentPage, setCurrentPage] = useState(1);

  const currentData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * PageSize;
    const lastPageIndex = firstPageIndex + PageSize;
    return searchResults?.hits.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, searchResults]);

  function ResultHit({
    id,
    documentId,
    Name,
    Description,
    Image: articleImage,
  }: ArticleResultHitProps) {
    const articleUrl = urlStringFormatter(Name, documentId);

    return (
      <article key={id} className={classes.resulthit}>
        <div className={classes.ctr}>
          <div className={classes.thumbnail}>
            <Link legacyBehavior href={`/blog/${articleUrl}`}>
              <a>
                <Image
                  width={120}
                  height={80}
                  alt={Name}
                  src={articleImage.url ?? ""}
                  layout="responsive"
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mO88uRJPQAITQMdakdKKAAAAABJRU5ErkJggg=="
                />
              </a>
            </Link>
          </div>
          <div className={classes.content}>
            <header className={classes.contentheader}>
              <h2>
                <Link legacyBehavior href={`/blog/${articleUrl}`}>
                  <a>{Name}</a>
                </Link>
              </h2>
            </header>
            <div className={classes.contentsummary}>
              <p>{Description.slice(0, 200) + "..."}</p>
            </div>
            <div className={classes.readmore}>
              <Link legacyBehavior href={`/blog/${articleUrl}`}>
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
      {searchResults && searchResults.nbHits ? (
        <>
          <div>
            <ul>
              {currentData.map((hit) => (
                <ResultHit
                  key={`jbb_article_search_${hit.id}_${hit.documentId}`}
                  {...hit}
                />
              ))}
            </ul>
          </div>
          <div className={classes.paginationctr}>
            <Pagination
              className={classes.paginationbar}
              currentPage={currentPage}
              totalCount={searchResults.hits.length}
              pageSize={PageSize}
              onPageChange={(page) => setCurrentPage(Number(page))}
            />
          </div>
        </>
      ) : (
        <p>
          0 résultat. Désolé, nous n&apos;avons rien trouvé qui corresponde à
          votre recherche: &quot;<span>{searchState.query}</span>&quot;
        </p>
      )}
    </div>
  );
}

export default connectStateResults(Hits);
