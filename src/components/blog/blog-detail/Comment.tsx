import { useState, useEffect } from "react";
import classes from "./Comment.module.css";

function Comment() {
  return (
    <div className={classes.commenttext}>
      <p className={classes.meta}>
        <strong className={classes.author}>AuthorName</strong>
        <span>-</span>
        <time dateTime="2016-04-26T17:14:08+00:00">April 26, 2016</time>
      </p>
      <div className={classes.description}>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quae
          accusamus reiciendis velit amet, nulla laborum sit vitae a quibusdam
          eum!
        </p>
      </div>
    </div>
  );
}

export default Comment;
