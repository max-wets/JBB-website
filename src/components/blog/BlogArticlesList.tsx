import classes from "./BlogArticlesList.module.css";
import { Article } from "./BlogArticleItem";
import BlogArticle from "./BlogArticleItem";

function BlogArticlesList(props: { articles: Article[] }) {
  return (
    <div className={classes.contentarea}>
      <div>
        {props.articles.map((article) => (
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
      </div>
    </div>
  );
}

export default BlogArticlesList;
