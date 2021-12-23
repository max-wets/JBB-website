import classes from "./BlogArticleItem.module.css";

export interface Article {
  id: string;
  title: string;
  intro?: string;
  description: string;
  issueDate: string;
  videoUrl?: string;
  imageUrl: string;
  categories: string[];
}

function BlogArticle() {
  return <h1>Blog Article</h1>;
}

export default BlogArticle;
