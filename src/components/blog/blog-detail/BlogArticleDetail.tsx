import classes from "./BlogArticleDetail.module.css";
import { Article } from "../BlogArticleItem";
import Image from "next/image";
import Link from "next/link";
import { Icon, useMediaQuery } from "@chakra-ui/react";
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
import { useRouter } from "next/router";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ChevronRightIcon,
} from "@chakra-ui/icons";
import { useSession } from "next-auth/react";

function BlogArticleDetail(props: {
  article: Article;
  prevNextArticles;
  recommendedArticles;
}) {
  // const api_url = "https://jbb-admin.herokuapp.com";
  const router = useRouter();
  const [isLargerThan750] = useMediaQuery("(min-width: 750px)");
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      console.log("user session:", session);
    } else console.log("no user session");
  }, []);

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
            <EmailShareButton url={router.asPath}>
              <EmailIcon size={40} borderRadius={6} />
            </EmailShareButton>
          </li>
          <li>
            <FacebookShareButton url={router.asPath}>
              <FacebookIcon size={40} borderRadius={6} />
            </FacebookShareButton>
          </li>
          <li>
            <TwitterShareButton url={router.asPath}>
              <TwitterIcon size={40} borderRadius={6} />
            </TwitterShareButton>
          </li>
          <li>
            <WhatsappShareButton url={router.asPath}>
              <WhatsappIcon size={40} borderRadius={6} />
            </WhatsappShareButton>
          </li>
        </ul>
      </div>
      <nav className={classes.postnavigation}>
        {props.prevNextArticles[0] ? (
          <div className={classes.navprevious}>
            <Link href={`/blog/${props.prevNextArticles[0].id}`}>
              <a>
                <div className={classes.prevtitle}>
                  <ArrowLeftIcon w={3} h={3} />
                  <span>Article Précédent</span>
                </div>
                <div className={classes.prevtext}>
                  {props.prevNextArticles[0].title.length > 40
                    ? props.prevNextArticles[0].title.slice(0, 40) + "..."
                    : props.prevNextArticles[0].title}
                </div>
              </a>
            </Link>
          </div>
        ) : null}
        {props.prevNextArticles[1] ? (
          <div className={classes.navnext}>
            <Link href={`/blog/${props.prevNextArticles[1].id}`}>
              <a>
                <div className={classes.nexttitle}>
                  <ArrowRightIcon w={3} h={3} />
                  <span>Article Suivant</span>
                </div>
                <div className={classes.nexttext}>
                  {props.prevNextArticles[1].title.length > 40
                    ? props.prevNextArticles[1].title.slice(0, 40) + "..."
                    : props.prevNextArticles[1].title}
                </div>
              </a>
            </Link>
          </div>
        ) : null}
      </nav>
      <section className={classes.relatedposts}>
        <div className={classes.relatedpoststitle}>
          <ChevronRightIcon w={6} h={6} color="#d93644" />
          <h3>ARTICLES RECOMMANDES</h3>
        </div>
        <div className={classes.relatedpostsentry}>
          {props.recommendedArticles.map((article) => (
            <article>
              <div className={classes.thumbnail}>
                <Link href={`/blog/${article.id}`}>
                  <a>
                    <Image
                      src={article.imageUrl}
                      alt={article.title}
                      width={isLargerThan750 ? 239 : 667}
                      height={isLargerThan750 ? 124 : 347}
                      objectFit="cover"
                    />
                    <span className={classes.overlay}></span>
                  </a>
                </Link>
              </div>
              <Link href={`/blog/${article.id}`}>
                <a>
                  <h3>
                    {article.title.length > 40
                      ? article.title.slice(0, 39) + "..."
                      : article.title}
                  </h3>
                </a>
              </Link>
              <time className="published" dateTime={article.issueDate}>
                <Icon as={FiClock} h={3} w={3} size="md" mr="4px" />
                <div>{newDate(props.article.issueDate)}</div>
              </time>
            </article>
          ))}
        </div>
      </section>
    </article>
  );
}

export default BlogArticleDetail;
