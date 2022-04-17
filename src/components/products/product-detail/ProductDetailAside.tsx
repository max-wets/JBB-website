import classes from "./ProductDetailAside.module.css";
import Link from "next/link";
import { Field, Form, Formik } from "formik";
import {
  Icon,
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import Image from "next/image";
import {
  BsFillEnvelopeFill,
  BsFacebook,
  BsInstagram,
  BsYoutube,
} from "react-icons/bs";
import { FaRss } from "react-icons/fa";
import { urlStringFormatter } from "../../../lib/utils";

function BlogAside(props: { relatedArticles }) {
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

  function SideBlogDetail({ article }) {
    const articleUrl = urlStringFormatter(article.title, article.id);

    return (
      <li key={article.id}>
        <Link
          href={{
            pathname: `/blog/[articleId]`,
            query: { articleId: articleUrl },
          }}
        >
          <a className={classes.imgctr}>
            <Image
              src={article.imageUrl}
              alt={article.title}
              width="100%"
              height="100%"
            />
            <span className={classes.overlay}></span>
          </a>
        </Link>
        <div className={classes.recentpostdetails}>
          <Link href={`/blog/${articleUrl}`}>
            <a>{article.title}</a>
          </Link>
          <div>
            <div>{newDate(article.issueDate)}</div>
            <span> / </span>
            <div>0 Comments</div>
          </div>
        </div>
      </li>
    );
  }

  return (
    <aside className={classes.sidebarctn}>
      <div className={classes.sidebarinner}>
        <div className={classes.sidebox}>
          <h4 className={classes.socialtitle}>Me suivre</h4>
          <ul className={classes.socialicons}>
            <Link href="https://www.youtube.com/channel/UCvVIi4gAhSC4x7sM3g9q53w">
              <a target="_blank" key={"youtube-link"}>
                <li>
                  <Icon as={BsYoutube} h={5} w={5} />
                </li>
              </a>
            </Link>
            <Link href="https://www.facebook.com/groups/3136931483299677">
              <a target="_blank" key={"facebook-link"}>
                <li>
                  <Icon as={BsFacebook} h={5} w={5} />
                </li>
              </a>
            </Link>
            <Link href="https://www.instagram.com/julie_baronnie/">
              <a target="_blank" key={"instagram-link"}>
                <li>
                  <Icon as={BsInstagram} h={5} w={5} />
                </li>
              </a>
            </Link>
            <Link href="mailto:contact@juliebaronniebeauty.com">
              <a target="_blank" key={"last-link"}>
                <li>
                  <Icon as={BsFillEnvelopeFill} h={5} w={5} />
                </li>
              </a>
            </Link>
          </ul>
        </div>
        {props.relatedArticles.length > 0 ? (
          <div className={classes.sidebox}>
            <h4 className={classes.socialtitle}>Articles recommandés</h4>
            <ul className={classes.sidebarlist}>
              {props.relatedArticles.map((article, idx) => (
                <SideBlogDetail article={article} />
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </aside>
  );
}

export default BlogAside;
