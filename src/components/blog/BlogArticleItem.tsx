import classes from "./BlogArticleItem.module.css";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@chakra-ui/react";
import { BiUser } from "react-icons/bi";
import { FiClock } from "react-icons/fi";
import { useEffect } from "react";

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
  const mois = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ];
  const date = new Date(props.issueDate);
  const newDate = `${date.getDate()} ${
    mois[date.getMonth()]
  } ${date.getFullYear()}`;

  useEffect(() => {
    console.log(newDate);
  }, []);

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
        <h2>
          <Link href="">
            <a>{props.title}</a>
          </Link>
        </h2>
      </header>
      <ul>
        <li>
          <Icon as={BiUser} h={6} w={6} size="sm" />
          <Link href="">
            <a>Julie</a>
          </Link>
        </li>
        <li>
          <Icon as={FiClock} h={6} w={6} size="sm" />
          <div>{newDate}</div>
        </li>
        <li></li>
        <li></li>
      </ul>
    </article>
  );
}

export default BlogArticle;
