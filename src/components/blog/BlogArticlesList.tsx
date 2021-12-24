import classes from "./BlogArticlesList.module.css";
import { Article } from "./BlogArticleItem";
import BlogArticle from "./BlogArticleItem";
import Pagination from "../pagination/Pagination";
import { useState, useMemo } from "react";

let PageSize = 3;

function BlogArticlesList(props: { articles: Article[] }) {
  const [currentPage, setCurrentPage] = useState(1);

  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * PageSize;
    const lastPageIndex = firstPageIndex + PageSize;
    return props.articles.slice(firstPageIndex, lastPageIndex);
  }, [currentPage]);

  return (
    <div className={classes.contentarea}>
      <div>
        {currentTableData.map((article) => (
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
          totalCount={props.articles.length}
          pageSize={PageSize}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
}

export default BlogArticlesList;
