import Image from 'next/image';
import Link from 'next/link';
import { connectStateResults } from 'react-instantsearch-dom';
import classes from './CustomHits.module.css';
import Pagination from '../pagination/Pagination';
import { useMemo, useState } from 'react';
import { urlStringFormatter } from '../../lib/utils';

const PageSize = 3;

function Hits({ searchState, searchResults }) {
  const [currentPage, setCurrentPage] = useState(1);

  const currentData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * PageSize;
    const lastPageIndex = firstPageIndex + PageSize;
    return searchResults?.hits.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, searchResults]);

  function ResultHit({ id, title, description, imageUrl }) {
    const articleUrl = urlStringFormatter(title, id);

    return (
      <article key={id} className={classes.resulthit}>
        <div className={classes.ctr}>
          <div className={classes.thumbnail}>
            <Link legacyBehavior href={`/blog/${articleUrl}`}>
              <a>
                <Image
                  width={120}
                  height={80}
                  alt={title}
                  src={imageUrl}
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
                  <a>{title}</a>
                </Link>
              </h2>
            </header>
            <div className={classes.contentsummary}>
              <p>{description.slice(0, 200) + '...'}</p>
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
                  key={hit.id}
                  id={hit.id}
                  title={hit.title}
                  description={hit.description}
                  imageUrl={hit.imageUrl}
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
              onPageChange={(page) => setCurrentPage(page)}
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
