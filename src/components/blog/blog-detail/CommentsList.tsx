import useSWR from "swr";
import axios from "axios";
import qs from "qs";
import Comment from "./Comment";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { SessionUser } from "../../../types";

const fetcher = (url) => fetch(url).then((res) => res.json());
const COMMENTS_URL = "https://jbbeauty-cms.herokuapp.com/api/comments";
const CommentsList = (props: { articleID; setComments }) => {
  const { data: session } = useSession();
  const sessionUser: SessionUser = session?.user;
  const [commentsList, setCommentsList] = useState([]);
  const filters = `?filters[ArticleID][$eq]=${props.articleID}&sort=publishedAt%3Adesc`;
  const { data, error } = useSWR(COMMENTS_URL + filters, fetcher);
  console.log("comments:", data);
  const AuthorIdsArr = [];
  let completeComments = [];
  let cleanComments =
    data &&
    data.data.map((comment) => {
      if (AuthorIdsArr.indexOf(comment.attributes.AuthorID) < 0)
        AuthorIdsArr.push(comment.attributes.AuthorID);
      return {
        id: comment.id,
        ArticleID: comment.attributes.ArticleID,
        AuthorID: comment.attributes.AuthorID,
        Content: comment.attributes.Content,
        issueDate: comment.attributes.publishedAt,
      };
    });

  // get users' names
  if (AuthorIdsArr.length > 0) {
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
      }
    );

    async function getUsers() {
      const url = `https://jbbeauty-cms.herokuapp.com/api/users?${query}`;
      const options = {
        headers: {
          Authorization: `bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
        },
      };
      try {
        let res = await fetch(url, options);
        return await res.json();
      } catch (error) {
        console.error(error);
      }
    }

    async function renderUsers() {
      let users = await getUsers();
      console.log("users:", users);

      const completeComments = cleanComments.map((comment) => {
        const authorName = users.filter(
          (user) => user.id === comment.AuthorID
        )[0].username;

        return {
          ...comment,
          AuthorName: authorName,
        };
      });
      console.log("complete comments:", completeComments);
      setCommentsList(completeComments);
    }

    renderUsers();
  }

  if (error) return <div>Une erreur s'est produite...</div>;
  if (!data) return <div>Chargement en cours...</div>;

  return (
    <div>
      {commentsList &&
        commentsList.map((com) => (
          <Comment
            id={com.id}
            AuthorID={com.AuthorID}
            ArticleID={com.ArticleID}
            AuthorName={com.AuthorName}
            Content={com.Content}
            issueDate={com.issueDate}
            sessionUser={sessionUser}
            setComments={props.setComments}
          />
        ))}
    </div>
  );
};

export default CommentsList;
