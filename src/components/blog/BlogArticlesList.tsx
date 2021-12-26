import classes from "./BlogArticlesList.module.css";
import { Article } from "./BlogArticleItem";
import BlogArticle from "./BlogArticleItem";
import Pagination from "../pagination/Pagination";
import { useState, useMemo, useEffect } from "react";
import { Spinner } from "@chakra-ui/react";

let PageSize = 3;

function BlogArticlesList(props: {
  articles: Article[];
  currentPage: number;
  setCurrentPage: (arg0: any) => any;
}) {
  const [loadedArticles, setLoadedArticles] = useState(props.articles);

  useEffect(() => {
    setLoadedArticles(props.articles);
    console.log("Blog List articles:", loadedArticles);
  }, [props.articles]);

  useEffect(() => {
    props.setCurrentPage(1);
  }, []);

  const currentData = useMemo(() => {
    const firstPageIndex = (props.currentPage - 1) * PageSize;
    const lastPageIndex = firstPageIndex + PageSize;
    return loadedArticles.slice(firstPageIndex, lastPageIndex);
  }, [props.currentPage, loadedArticles]);

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
          currentPage={props.currentPage}
          totalCount={loadedArticles.length}
          pageSize={PageSize}
          onPageChange={(page) => props.setCurrentPage(page)}
        />
      </div>
    </div>
  );
}

export default BlogArticlesList;
