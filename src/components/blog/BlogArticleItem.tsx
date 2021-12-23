import classes from "./BlogArticleItem.module.css";
import Image from "next/image";
import Link from "next/link";

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

function BlogArticle(props: Article) {
  const api_url = "https://jbb-admin.herokuapp.com";

  return (
    <article className={classes.blogentryouter}>
      <div className={classes.thumbnail}>
        <Link href="">
          <a>
            <Image
              width={833}
              height={430}
              layout="responsive"
              src={api_url + props.imageUrl}
              alt={props.title}
            />
            <span className={classes.overlay}></span>
          </a>
        </Link>
      </div>
      <header className={classes.blogentryheader}>
        <Link href="">
          <a>
            <h2>{props.title}</h2>
          </a>
        </Link>
      </header>
    </article>
  );
}

export default BlogArticle;
