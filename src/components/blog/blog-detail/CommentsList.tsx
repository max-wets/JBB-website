import useSWR from 'swr';
import qs from 'qs';
import Comment from './Comment';
import { useEffect } from 'react';

const fetcher = (url) => fetch(url).then((res) => res.json());
const COMMENTS_URL = `${process.env.NEXT_PUBLIC_API_URL}/comments`;

const CommentsList = (props: {
  articleID;
  comments;
  setComments;
  sessionUser;
}) => {
  //   const [commentsList, setCommentsList] = useState([]);
  const filters = `?filters[ArticleID][$eq]=${props.articleID}&sort=publishedAt%3Adesc`;
  const { data } = useSWR(COMMENTS_URL + filters, fetcher);

  useEffect(() => {
    const AuthorIdsArr = [];
    const completeComments = [];
    const cleanComments =
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

    async function getUsers() {
      // get users' names
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
      const url = `${process.env.NEXT_PUBLIC_API_URL}/users?${query}`;
      const options = {
        headers: {
          Authorization: `bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
        },
      };
      try {
        const res = await fetch(url, options);
        return await res.json();
      } catch (error) {
        console.error(error);
      }
    }

    async function renderUsers() {
      const users = await getUsers();
      // console.log("users:", users);

      cleanComments?.map((comment) => {
        const authorName = users?.filter(
          (user) => user.id === comment.AuthorID
        )[0].username;

        completeComments.push({
          ...comment,
          AuthorName: authorName,
        });
      });
      // console.log("complete comments:", completeComments);
      props.setComments(completeComments);
    }

    renderUsers();
  }, [data, props]);

  return (
    <div>
      {props.comments.map((com, idx) => (
        <Comment
          key={com.id}
          idx={idx}
          id={com.id}
          AuthorID={com.AuthorID}
          ArticleID={com.ArticleID}
          AuthorName={com.AuthorName}
          Content={com.Content}
          issueDate={com.issueDate}
          sessionUser={props.sessionUser}
          setComments={props.setComments}
        />
      ))}
    </div>
  );
};

export default CommentsList;
