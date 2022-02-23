import classes from "./VideoEmbed.module.css";
import React from "react";

function VideoEmbed({ source }) {
  // console.log("source URL:", source);
  const isUrlMinimized = /^http.:\/\/youtu\.be\/.+/gm.test(source.trim());
  const regex = isUrlMinimized ? /\.be\/(\w+)/i : /\/watch\?v=(.*)/i;
  const embedId = source.match(regex)[1];

  // console.log("embed id:", embedId);

  return (
    <div className={classes.videoresponsive}>
      <iframe
        width="853"
        height="480"
        src={`https://www.youtube.com/embed/${embedId}`}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="Embedded video"
      />
    </div>
  );
}

export default VideoEmbed;
