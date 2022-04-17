import { useState, useRef, useEffect } from "react";
import classes from "./Comment.module.css";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import {
  Button,
  Spinner,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import axios from "axios";
import { newDate } from "../../../lib/utils/index";

function Comment(props: {
  idx;
  id;
  ArticleID;
  AuthorID;
  AuthorName;
  Content;
  issueDate;
  sessionUser;
  setComments;
}) {
  const [editOn, setEditOn] = useState(false);
  const [commentText, setCommentText] = useState(props.Content);
  const [postingComment, setPostingComment] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>();

  useEffect(() => {
    if (editOn) {
      const end = inputRef.current.value.length;
      inputRef.current.setSelectionRange(end, end);
      inputRef.current.focus();
    }
  }, [editOn]);

  function autoResize(el) {
    // console.log(el);
    el.style.height = "auto";
    el.style.height = el.scrollHeight + 2 + "px";
  }

  async function updateComment() {
    setPostingComment(true);

    try {
      const { data } = await axios.put(
        `https://jbbeauty-cms.herokuapp.com/api/comments/${props.id}`,
        {
          data: {
            Content: commentText,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${props.sessionUser.accessToken}`,
          },
        }
      );
    } catch (err) {
      console.error(err);
    }

    props.setComments((prev) => {
      const newCom = { ...prev[props.idx], Content: commentText };
      //   console.log(newCom);
      return [
        ...prev.slice(0, props.idx),
        { ...prev[props.idx], Content: commentText },
        ...prev.slice(props.idx + 1),
      ];
    });

    setPostingComment(false);
    setEditOn(false);
  }

  async function deleteComment() {
    setPostingComment(true);

    try {
      const { data } = await axios.delete(
        `https://jbbeauty-cms.herokuapp.com/api/comments/${props.id}`,
        {
          headers: {
            Authorization: `Bearer ${props.sessionUser.accessToken}`,
          },
        }
      );
    } catch (err) {
      console.error(err);
    }

    props.setComments((prev) => prev.filter((com) => com.id !== props.id));

    setPostingComment(false);
    // setEditOn(false);
    setIsOpen(false);
  }

  function DeleteAlertDialog() {
    const onClose = () => setIsOpen(false);
    const cancelRef = useRef();

    return (
      <>
        <AlertDialog
          isOpen={isOpen}
          leastDestructiveRef={cancelRef}
          onClose={onClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Supprimer commentaire
              </AlertDialogHeader>

              <AlertDialogBody>
                Êtes-vous sûr de vouloir supprimer ce commentaire ?
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onClose}>
                  Annuler
                </Button>
                <Button
                  colorScheme="red"
                  onClick={() => {
                    deleteComment();
                    // onClose;
                  }}
                  ml={3}
                  style={{ minWidth: 108 }}
                >
                  {postingComment ? <Spinner size="sm" /> : "Supprimer"}
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </>
    );
  }

  return (
    <div key={props.id} className={classes.commenttext}>
      {!editOn && props.sessionUser?.id === props.AuthorID ? (
        <div className={classes.commentbtns}>
          <EditIcon onClick={() => setEditOn(true)} />
          <DeleteIcon onClick={() => setIsOpen(true)} />
          <DeleteAlertDialog />
        </div>
      ) : null}
      <p className={classes.meta}>
        <strong className={classes.author}>{props.AuthorName}</strong>
        <span>-</span>
        <time dateTime={props.issueDate}>{newDate(props.issueDate)}</time>
      </p>
      <div className={classes.description}>
        {editOn ? (
          <>
            <textarea
              ref={inputRef}
              value={commentText}
              cols={30}
              rows={1}
              onChange={(e) => {
                setCommentText(e.target.value);
                autoResize(e.target);
              }}
            />
            <div className={classes.footer}>
              <div className={classes.buttons}>
                <button
                  className={classes.cancelbutton}
                  onClick={() => {
                    setPostingComment(false);
                    setCommentText(props.Content);
                    // inputRef.current.style.height = "24px";
                    setEditOn(false);
                  }}
                >
                  ANNULER
                </button>
                <button
                  className={classes.submitbutton}
                  disabled={commentText ? false : true}
                  onClick={() => updateComment()}
                >
                  {postingComment ? <Spinner size="sm" /> : "SAUVEGARDER"}
                </button>
              </div>
            </div>
          </>
        ) : (
          <p>{commentText}</p>
        )}
      </div>
    </div>
  );
}

export default Comment;
