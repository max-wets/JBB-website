import classes from "./BlogArticleItem.module.css";
import Image from "next/image";
import Link from "next/link";
import { Icon, Button, useMediaQuery } from "@chakra-ui/react";
import { BiUser } from "react-icons/bi";
import { FiClock } from "react-icons/fi";
import { useEffect } from "react";
import { BsFolder } from "react-icons/bs";
import { BiComment } from "react-icons/bi";
import { urlStringFormatter } from "../../lib/utils";

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
  // const api_url = "https://jbb-admin.herokuapp.com";
  const [isLargerThan600] = useMediaQuery("(min-width: 600px)");
  const articleUrl = urlStringFormatter(props.title, props.id);

  const newDate = (date) => {
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
    const nDate = new Date(date);
    return `${nDate.getDate()} ${
      mois[nDate.getMonth()]
    } ${nDate.getFullYear()}`;
  };

  return (
    <article className={classes.blogentryouter}>
      <div className={classes.thumbnail}>
        <Link legacyBehavior href={`/blog/${articleUrl}`}>
          <a>
            <Image
              width={833}
              height={430}
              src={props.imageUrl}
              alt={props.title}
              layout="responsive"
              objectFit="cover"
            />
            <span className={classes.overlay}></span>
          </a>
        </Link>
      </div>
      <header className={classes.blogentryheader}>
        <h2>
          <Link legacyBehavior href={`/blog/${articleUrl}`}>
            <a>{props.title}</a>
          </Link>
        </h2>
      </header>
      <ul>
        <li>
          <Icon
            as={BiUser}
            h={isLargerThan600 ? 6 : 4}
            w={isLargerThan600 ? 6 : 4}
            size={isLargerThan600 ? "sm" : "xs"}
            mr="4px"
          />
          Julie
        </li>
        <li>
          <Icon
            as={FiClock}
            h={isLargerThan600 ? 5 : 4}
            w={isLargerThan600 ? 5 : 4}
            size={isLargerThan600 ? "sm" : "xs"}
            mt="2px"
          />
          <div>{newDate(props.issueDate)}</div>
        </li>
        <li>
          <Icon
            as={BsFolder}
            h={isLargerThan600 ? 6 : 4}
            w={isLargerThan600 ? 6 : 4}
            size={isLargerThan600 ? "sm" : "xs"}
            mr="4px"
          />
          {props.categories.map((category, idx) => (
            <>
              {category}
              <span style={{ fontSize: "16px" }}>
                {idx < props.categories.length - 1 ? ", " : null}
              </span>
            </>
          ))}
        </li>
        <li>
          <Icon
            as={BiComment}
            h={isLargerThan600 ? 6 : 4}
            w={isLargerThan600 ? 6 : 4}
            size={isLargerThan600 ? "sm" : "xs"}
          />

          <a>0 Commentaires</a>
        </li>
      </ul>
      <div className={classes.blogentrysummary}>{props.intro}</div>
      <div className={classes.blogentryreadmore}>
        <Link legacyBehavior href={`/blog/${articleUrl}`}>
          <a>
            <Button
              colorScheme="white"
              color="black"
              variant="outline"
              size={isLargerThan600 ? "md" : "sm"}
              _hover={{ color: "#D93644" }}
            >
              Lire la suite...
            </Button>
          </a>
        </Link>
      </div>
    </article>
  );
}

export default BlogArticle;
