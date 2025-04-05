import { useState, useRef, useEffect, Dispatch, SetStateAction } from "react";
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
import { Session } from "next-auth";
import { ApiUpdateResponse, PostComment, PostCommentApi } from "../../../types";

type CommentProps = {
  idx: number;
  id: number;
  documentId: string;
  ArticleID: number;
  AuthorID: number;
  AuthorName?: string;
  Content: string;
  issueDate: string;
  sessionUser?: Session["user"];
  setComments: Dispatch<SetStateAction<PostComment[]>>;
};

export default function Comment({
  idx,
  id,
  documentId,
  AuthorID,
  AuthorName,
  Content,
  issueDate,
  sessionUser,
  setComments,
}: CommentProps) {
  const [editOn, setEditOn] = useState(false);
  const [commentText, setCommentText] = useState(Content);
  const [postingComment, setPostingComment] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (editOn && inputRef.current) {
      const end = inputRef.current.value.length;
      inputRef.current.setSelectionRange(end, end);
      inputRef.current.focus();
    }
  }, [editOn]);

  function autoResize(el: HTMLElement) {
    // console.log(el);
    el.style.height = "auto";
    el.style.height = el.scrollHeight + 2 + "px";
  }

  async function updateComment() {
    if (!sessionUser) return;
    setPostingComment(true);

    try {
      await axios.put<ApiUpdateResponse<PostCommentApi>>(
        `${process.env.NEXT_PUBLIC_API_URL}/comments/${documentId}`,
        {
          data: {
            Content: commentText,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${sessionUser.accessToken}`,
          },
        }
      );
    } catch (err) {
      console.error(err);
    }

    setComments((prev) => {
      //   console.log(newCom);
      return [
        ...prev.slice(0, idx),
        { ...prev[idx], Content: commentText },
        ...prev.slice(idx + 1),
      ];
    });

    setPostingComment(false);
    setEditOn(false);
  }

  async function deleteComment() {
    if (!sessionUser) return;

    setPostingComment(true);

    try {
      await axios.delete<void>(
        `${process.env.NEXT_PUBLIC_API_URL}/comments/${documentId}`,
        {
          headers: {
            Authorization: `Bearer ${sessionUser.accessToken}`,
          },
        }
      );
    } catch (err) {
      console.error(err);
    }

    setPostingComment(false);
    setIsOpen(false);

    setComments((prev) => prev.filter((com) => com.id !== id));
  }

  function DeleteAlertDialog() {
    const onClose = () => setIsOpen(false);
    const cancelRef = useRef(null);

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
    <div key={id} className={classes.commenttext}>
      {!editOn && sessionUser?.id === AuthorID ? (
        <div className={classes.commentbtns}>
          <EditIcon onClick={() => setEditOn(true)} />
          <DeleteIcon onClick={() => setIsOpen(true)} />
          <DeleteAlertDialog />
        </div>
      ) : null}
      <p className={classes.meta}>
        <strong className={classes.author}>{AuthorName}</strong>
        <span>-</span>
        <time dateTime={issueDate}>{newDate(issueDate)}</time>
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
                    setCommentText(Content);
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
