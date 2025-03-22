import useSWR from 'swr';
import qs from 'qs';
import Comment from './Comment';
import { Dispatch, SetStateAction, useEffect } from 'react';
import {
  ApiResource,
  PostComment,
  PostCommentApi,
  UserApi,
} from '../../../types';
import { Session } from 'next-auth';

type CommentsListProps = {
  articleID: number | string;
  comments: PostComment[];
  setComments: Dispatch<SetStateAction<PostComment[]>>;
  sessionUser?: Session['user'];
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());
const COMMENTS_URL = `${process.env.NEXT_PUBLIC_API_URL}/comments`;

const CommentsList = (props: CommentsListProps) => {
  //   const [commentsList, setCommentsList] = useState([]);
  const filters = `?filters[ArticleID][$eq]=${props.articleID}&sort=publishedAt%3Adesc`;
  const { data } = useSWR(COMMENTS_URL + filters, fetcher);

  useEffect(() => {
    const AuthorIdsArr: number[] = [];
    const completeComments: PostComment[] = [];
    const cleanComments: PostComment[] =
      data &&
      data.data.map((comment: ApiResource<PostCommentApi>): PostComment => {
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
        }
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
        throw new Error('Users fetching failed', { cause: error });
      }
    };

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
