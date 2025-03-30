import useSWR from "swr";
import qs from "qs";
import Comment from "./Comment";
import { Dispatch, SetStateAction, useEffect } from "react";
import { PostComment, PostCommentApi, UserApi } from "../../../types";
import { Session } from "next-auth";

type CommentsListProps = {
  articleID: number | string;
  comments: PostComment[];
  setComments: Dispatch<SetStateAction<PostComment[]>>;
  sessionUser?: Session["user"];
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());
const COMMENTS_URL = `${process.env.NEXT_PUBLIC_API_URL}/comments`;

const CommentsList = ({
  articleID,
  comments,
  setComments,
  sessionUser,
}: CommentsListProps) => {
  const filters = `?filters[ArticleID][$eq]=${articleID}&sort=publishedAt%3Adesc`;
  const { data } = useSWR(COMMENTS_URL + filters, fetcher);

  useEffect(() => {
    const AuthorIdsArr: number[] = [];
    const completeComments: PostComment[] = [];
    const cleanComments: PostComment[] =
      data &&
      data.data.map((comment: PostCommentApi): PostComment => {
        if (AuthorIdsArr.indexOf(comment.AuthorID) < 0)
          AuthorIdsArr.push(comment.AuthorID);
        return {
          id: comment.id,
          ArticleID: comment.ArticleID,
          AuthorID: comment.AuthorID,
          Content: comment.Content,
          issueDate: comment.publishedAt,
        };
      });

    const getUsers = async (): Promise<UserApi[]> => {
      const query = qs.stringify(
        {
          filters: {
            id: {
              $in: AuthorIdsArr,
            },
          },
        },
        {
          encodeValuesOnly: true,
        },
      );
      const url = `${process.env.NEXT_PUBLIC_API_URL}/users?${query}`;
      const options = {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
        },
      };
      try {
        const res = await fetch(url, options);
        return await res.json();
      } catch (error) {
        throw new Error("Users fetching failed", { cause: error });
      }
    };

    async function renderUsers() {
      const users = await getUsers();
      // console.log('users:', users);

      cleanComments?.map((comment) => {
        const authorName = users?.filter(
          (user) => user.id === comment.AuthorID,
        )[0].username;

        completeComments.push({
          ...comment,
          AuthorName: authorName,
        });
      });
      setComments(completeComments);
    }

    if (AuthorIdsArr.length) {
      renderUsers();
    }
  }, [data, setComments]);

  return (
    <div>
      {comments.map((com, idx) => (
        <Comment
          key={com.id}
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
  );
};

export default CommentsList;
