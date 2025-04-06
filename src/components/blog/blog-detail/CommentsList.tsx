import useSWR from "swr";
import Comment from "./Comment";
import { Dispatch, SetStateAction, useEffect } from "react";
import { PostComment, PostCommentApi } from "../../../types";
import { Session } from "next-auth";

type CommentsListProps = {
  articleID: number | string;
  comments: PostComment[];
  setComments: Dispatch<SetStateAction<PostComment[]>>;
  sessionUser?: Session["user"];
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());
const COMMENTS_URL = `${process.env.NEXT_PUBLIC_API_URL}/comments-full`;

const CommentsList = ({
  articleID,
  comments,
  setComments,
  sessionUser,
}: CommentsListProps) => {
  const filters = `?filters[ArticleID][$eq]=${articleID}&sort=updatedAt%3Adesc`;
  const { data } = useSWR(COMMENTS_URL + filters, fetcher);

  useEffect(() => {
    if (data) {
      const cleanComments: PostComment[] =
        data &&
        data.map(
          (comment: PostCommentApi): PostComment => ({
            id: comment.id,
            documentId: comment.documentId,
            ArticleID: comment.ArticleID,
            AuthorID: comment.AuthorID,
            Content: comment.Content,
            issueDate: comment.updatedAt,
            AuthorName: comment.authorUsername,
          })
        );

      setComments(cleanComments);
    }
  }, [data, setComments]);

  return (
    <div>
      {comments.map((com, idx) => (
        <Comment
          key={com.id}
          idx={idx}
          id={com.id}
          documentId={com.documentId}
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
  );
};

export default CommentsList;
