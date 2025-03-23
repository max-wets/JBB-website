import classes from './BlogArticlesList.module.css';
import BlogArticle from './BlogArticleItem';
import Pagination from '../pagination/Pagination';
import { useState, useMemo, useEffect } from 'react';
import { BlogPost } from '../../types';

type BlogArticlesListProps = {
  articles: BlogPost[];
  currentPage: number;
  setCurrentPage: (page: number) => void;
};

const PageSize = 3;

function BlogArticlesList({
  articles,
  currentPage,
  setCurrentPage,
}: BlogArticlesListProps) {
  const [loadedArticles, setLoadedArticles] = useState(articles);

  useEffect(() => {
    setLoadedArticles(articles);
  }, [articles]);

  useEffect(() => {
    setCurrentPage(1);
  }, [setCurrentPage]);

  const currentData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * PageSize;
    const lastPageIndex = firstPageIndex + PageSize;
    return loadedArticles.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, loadedArticles]);

  return (
    <div className={classes.contentarea}>
      <div>
        {currentData.map((article) => (
          <BlogArticle
            key={article.id}
            id={article.id}
            title={article.title}
            description={article.description}
            issueDate={article.issueDate}
            imageUrl={article.imageUrl}
            categories={article.categories}
            intro={article.intro}
            videoUrl={article.videoUrl}
          />
        ))}
        <Pagination
          className={classes.paginationbar}
          currentPage={currentPage}
          totalCount={loadedArticles.length}
          pageSize={PageSize}
          onPageChange={(page) => setCurrentPage(Number(page))}
        />
      </div>
    </div>
  );
}

export default BlogArticlesList;
