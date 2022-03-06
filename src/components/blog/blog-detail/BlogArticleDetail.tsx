import classes from "./BlogArticleDetail.module.css";
import { Article } from "../BlogArticleItem";
import Image from "next/image";
import Link from "next/link";
import { Icon, useMediaQuery, Spinner } from "@chakra-ui/react";
import { BiUser } from "react-icons/bi";
import { FiClock } from "react-icons/fi";
import { BsFolder } from "react-icons/bs";
import { BiComment } from "react-icons/bi";
import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
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
import Comment from "./Comment";
import axios from "axios";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL;

function BlogArticleDetail(props: {
  article: Article;
  prevNextArticles;
  recommendedArticles;
  articleComments;
}) {
  // const api_url = "https://jbb-admin.herokuapp.com";
  const router = useRouter();
  const [isLargerThan750] = useMediaQuery("(min-width: 750px)");
  const { data: session } = useSession();
  const [commentText, setCommentText] = useState("");
  const [postingComment, setPostingComment] = useState(false);
  const [comments, setComments] = useState([]);
  const inputRef = useRef<HTMLTextAreaElement>();
  const commentBoxBtnsRef = useRef<HTMLDivElement>();

  interface SessionUser {
    id?: number;
    name?: string;
    email?: string;
    image?: string;
    accessToken?: string;
  }

  const sessionUser: SessionUser = session?.user;

  function autoResize(el) {
    // console.log(el);
    el.style.height = "auto";
    el.style.height = el.scrollHeight + 2 + "px";
  }

  async function createComment() {
    setPostingComment(true);

    let newComment;

    try {
      const { data } = await axios.post(
        "https://jbbeauty-cms.herokuapp.com/api/comments",
        {
          data: {
            ArticleID: props.article.id,
            AuthorID: sessionUser.id,
            Content: commentText,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${sessionUser.accessToken}`,
          },
        }
      );

      // console.log(data);
      newComment = {
        id: data.data.id,
        ArticleID: data.data.attributes.ArticleID,
        AuthorID: data.data.attributes.AuthorID,
        Content: data.data.attributes.Content,
        issueDate: data.data.attributes.publishedAt,
        AuthorName: sessionUser.name,
      };
      // console.log(newComment);

      commentBoxBtnsRef.current.style.display = "none";
      setCommentText("");
    } catch (err) {
      console.error(err);
    }

    // newComment = {
    //   id: 20,
    //   ArticleID: Number(props.article.id),
    //   AuthorID: sessionUser.id,
    //   Content: commentText,
    //   issueDate: "2016-04-26T17:14:08+00:00",
    //   AuthorName: sessionUser.name,
    // };

    // console.log(newComment);

    setComments((prev) => {
      return [...prev, newComment];
    });

    setPostingComment(false);
    commentBoxBtnsRef.current.style.display = "none";
    setCommentText("");
  }

  useEffect(() => {
    // console.log("blog detail comments:", props.articleComments);
    setComments(props.articleComments);
  }, []);

  // useEffect(() => {
  //   console.log(APP_URL);
  //   console.log(router);
  //   if (session) {
  //     console.log("user session:", session);
  //   } else console.log("no user session");
  // }, []);

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
                <span>{category}</span>

                <span style={{ fontSize: "16px" }}>
                  {idx < props.article.categories.length - 1 ? ", " : null}
                </span>
              </>
            ))}
          </li>
          <li>
            <Icon as={BiComment} h={6} w={6} size="sm" />
            <span>
              {comments ? `${comments.length} Commentaires` : "0 Commentaires"}
            </span>
          </li>
        </ul>
        <div className={classes.entrycontent}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {props.article.description}
          </ReactMarkdown>
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
            <EmailShareButton
              url={APP_URL + router.asPath}
              subject="Pour vous, un article de Julie Baronnie Beauty"
              body={`Voici un article à partager sur le thème suivant: ${props.article.title} \n\n`}
            >
              <EmailIcon size={40} borderRadius={6} />
            </EmailShareButton>
          </li>
          <li>
            <FacebookShareButton
              url={APP_URL + router.asPath}
              quote={`Voici un article à lire sur le thème suivant: ${props.article.title} \n\n`}
            >
              <FacebookIcon size={40} borderRadius={6} />
            </FacebookShareButton>
          </li>
          <li>
            <TwitterShareButton
              url={APP_URL + router.asPath}
              title={`Voici un article à lire sur le thème suivant: ${props.article.title} \n\n`}
            >
              <TwitterIcon size={40} borderRadius={6} />
            </TwitterShareButton>
          </li>
          <li>
            <WhatsappShareButton
              url={APP_URL + router.asPath}
              title={`Voici un article à lire sur le thème suivant: ${props.article.title} \n\n`}
            >
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
      <section className={classes.commentsarea}>
        <div className={classes.commentrespond}>
          <>
            <h3 className={classes.commentreplytitle}>
              Laisser un commentaire
            </h3>
            {session?.user ? (
              <div className={classes.inputrow}>
                <div className={classes.commentbox}>
                  <textarea
                    ref={inputRef}
                    required
                    minLength={1}
                    maxLength={2000}
                    rows={1}
                    placeholder="Ajoutez un commentaire..."
                    value={commentText}
                    onChange={(e) => {
                      setCommentText(e.target.value);
                      autoResize(e.target);
                    }}
                    onFocus={() =>
                      (commentBoxBtnsRef.current.style.display = "flex")
                    }
                  />

                  <div className={classes.footer} ref={commentBoxBtnsRef}>
                    <div className={classes.buttons}>
                      <button
                        className={classes.cancelbutton}
                        onClick={() => {
                          setPostingComment(false);
                          setCommentText("");
                          inputRef.current.style.height = "24px";
                          commentBoxBtnsRef.current.style.display = "none";
                        }}
                      >
                        ANNULER
                      </button>
                      <button
                        className={classes.submitbutton}
                        disabled={commentText ? false : true}
                        onClick={() => createComment()}
                      >
                        {postingComment ? (
                          <Spinner size="sm" />
                        ) : (
                          "AJOUTER UN COMMENTAIRE"
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <p className={classes.mustlogin}>
                Vous devez être{" "}
                <Link href={"/auth/signin"}>
                  <a>connecté</a>
                </Link>{" "}
                pour publier un commentaire
              </p>
            )}
          </>
        </div>
        <div className={classes.commentslist}>
          {comments?.map((com, idx) => (
            <Comment
              idx={idx}
              id={com.id}
              AuthorID={com.AuthorID}
              ArticleID={com.ArticleID}
              AuthorName={com.AuthorName}
              Content={com.Content}
              issueDate={com.issueDate}
              sessionUser={sessionUser}
              setComments={setComments}
            />
          ))}
        </div>
      </section>
    </article>
  );
}

export default BlogArticleDetail;
