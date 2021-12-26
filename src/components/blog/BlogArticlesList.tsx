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
  useEffect(() => {
    props.setCurrentPage(1);
  }, []);

  const currentData = useMemo(() => {
    const firstPageIndex = (props.currentPage - 1) * PageSize;
    const lastPageIndex = firstPageIndex + PageSize;
    return props.articles.slice(firstPageIndex, lastPageIndex);
  }, [props.currentPage]);

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
          totalCount={props.articles.length}
          pageSize={PageSize}
          onPageChange={(page) => props.setCurrentPage(page)}
        />
      </div>
    </div>
  );
}

export default BlogArticlesList;
