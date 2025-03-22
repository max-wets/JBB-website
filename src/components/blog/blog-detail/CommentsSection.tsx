import classes from "./CommentsSection.module.css";
import Link from "next/link";
import { Spinner } from "@chakra-ui/react";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { BlogPost, PostComment } from "../../../types";
import CommentsList from "./CommentsList";
import axios from "axios";

type CommentsSectionProps = {
  article: BlogPost;
  comments: PostComment[];
  setComments: Dispatch<SetStateAction<PostComment[]>>;
};

const CommentsSection = (props: CommentsSectionProps) => {
  const [commentText, setCommentText] = useState("");
  const [postingComment, setPostingComment] = useState(false);
  //   const [comments, setComments] = useState([]);
  const { data: session } = useSession();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const commentBoxBtnsRef = useRef<HTMLDivElement>(null);

  const sessionUser = session?.user;

  const autoResize = (el: HTMLElement) => {
    // console.log(el);
    el.style.height = "auto";
    el.style.height = el.scrollHeight + 2 + "px";
  };

  const createComment = async () => {
    if (!sessionUser) return;

    setPostingComment(true);

    let newComment: PostComment;

    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/comments`,
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
        },
      );

      // console.log(data);
      newComment = {
        id: data.data.id,
        ArticleID: data.data.attributes.ArticleID,
        AuthorID: data.data.attributes.AuthorID,
        Content: data.data.attributes.Content,
        issueDate: data.data.attributes.publishedAt,
        AuthorName: sessionUser.name ?? "",
      };
      // console.log(newComment);

      commentBoxBtnsRef.current!.style.display = "none";
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

    props.setComments((prev) => {
      return [...prev, newComment];
    });

    setPostingComment(false);
    commentBoxBtnsRef.current!.style.display = "none";
    setCommentText("");
  };

  //    useEffect(() => {
  //      // console.log("blog detail comments:", props.articleComments);
  //      setComments(props.articleComments);
  //    }, []);

  return (
    <section className={classes.commentsarea}>
      <div className={classes.commentrespond}>
        <>
          <h3 className={classes.commentreplytitle}>Laisser un commentaire</h3>
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
                    (commentBoxBtnsRef.current!.style.display = "flex")
                  }
                />

                <div className={classes.footer} ref={commentBoxBtnsRef}>
                  <div className={classes.buttons}>
                    <button
                      className={classes.cancelbutton}
                      onClick={() => {
                        setPostingComment(false);
                        setCommentText("");
                        inputRef.current!.style.height = "24px";
                        commentBoxBtnsRef.current!.style.display = "none";
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
              <Link legacyBehavior href={"/auth/signin"}>
                <a>connecté</a>
              </Link>{" "}
              pour publier un commentaire
            </p>
          )}
        </>
      </div>
      <CommentsList
        articleID={props.article.id}
        setComments={props.setComments}
        comments={props.comments}
        sessionUser={sessionUser}
      />
    </section>
  );
};

export default CommentsSection;
