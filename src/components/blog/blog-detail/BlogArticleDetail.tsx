import classes from "./BlogArticleDetail.module.css";
import { Article } from "../BlogArticleItem";
import Image from "next/image";
import Link from "next/link";
import { Icon, Button } from "@chakra-ui/react";
import { BiUser } from "react-icons/bi";
import { FiClock } from "react-icons/fi";
import { BsFolder } from "react-icons/bs";
import { BiComment } from "react-icons/bi";
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import VideoEmbed from "./VideoEmbed";
import {
  EmailShareButton,
  EmailIcon,
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  TwitterIcon,
  WhatsappShareButton,
  WhatsappIcon,
} from "react-share";
import { BsTwitter, BsFacebook, BsInstagram } from "react-icons/bs";
import { MdEmail } from "react-icons/md";
// import { EmailIcon } from "@chakra-ui/icons";

function BlogArticleDetail(props: { article: Article }) {
  // const api_url = "https://jbb-admin.herokuapp.com";

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
    <article className={classes.primary}>
      <div className={classes.thumbnail}>
        <Image
          src={props.article.imageUrl}
          alt={props.article.title}
          width={833}
          height={430}
          objectFit="cover"
        />
      </div>
      <header>
        <h2 className={classes.entrytitle}>{props.article.title}</h2>
      </header>
      <div className={classes.meta}>
        <ul>
          <li>
            <Icon as={BiUser} h={6} w={6} size="sm" />
            <Link href="">
              <a>Julie</a>
            </Link>
          </li>
          <li>
            <Icon as={FiClock} h={5} w={5} size="sm" mt="2px" />
            <div>{newDate(props.article.issueDate)}</div>
          </li>
          <li>
            <Icon as={BsFolder} h={6} w={6} size="sm" />
            {props.article.categories.map((category, idx) => (
              <>
                <Link href="">
                  <a>{category}</a>
                </Link>
                <span style={{ fontSize: "16px" }}>
                  {idx < props.article.categories.length - 1 ? ", " : null}
                </span>
              </>
            ))}
          </li>
          <li>
            <Icon as={BiComment} h={6} w={6} size="sm" />
            <Link href="">
              <a>0 Commentaires</a>
            </Link>
          </li>
        </ul>
        <div className={classes.entrycontent}>
          <ReactMarkdown>{props.article.description}</ReactMarkdown>
        </div>
        {props.article.videoUrl ? (
          <div style={{ marginTop: "30px" }}>
            <VideoEmbed source={props.article.videoUrl} />
          </div>
        ) : null}
      </div>
      <div className={classes.entryshare}>
        <h3>PARTAGER CET ARTICLE</h3>
        <ul>
          <li>
            <EmailShareButton url={window.location.href}>
              <EmailIcon size={40} borderRadius={6} />
            </EmailShareButton>
          </li>
          <li>
            <FacebookShareButton url={window.location.href}>
              <FacebookIcon size={40} borderRadius={6} />
            </FacebookShareButton>
          </li>
          <li>
            <TwitterShareButton url={window.location.href}>
              <TwitterIcon size={40} borderRadius={6} />
            </TwitterShareButton>
          </li>
          <li>
            <WhatsappShareButton url={window.location.href}>
              <WhatsappIcon size={40} borderRadius={6} />
            </WhatsappShareButton>
          </li>
        </ul>
      </div>
    </article>
  );
}

export default BlogArticleDetail;
