import classes from "./BlogArticleAside.module.css";
import Link from "next/link";
import { Icon } from "@chakra-ui/react";
import Image from "next/image";
import { BsFacebook, BsInstagram, BsFillEnvelopeFill } from "react-icons/bs";
import { urlStringFormatter, newDate } from "../../../lib/utils";
import { BlogPostSmall } from "../../../types";

type BlogAsideProps = {
  articles: BlogPostSmall[];
};

type SideBlogDetailProps = {
  article: BlogPostSmall;
};

export default function BlogAside(props: BlogAsideProps) {
  // const api_url = "https://jbb-admin.herokuapp.com";

  function SideBlogDetail({ article }: SideBlogDetailProps) {
    const articleUrl = urlStringFormatter(article.title, article.id);

    return (
      <li>
        <Link legacyBehavior href={`/blog/${articleUrl}`}>
          <a className={classes.imgctr}>
            <Image
              src={article.imageUrl ?? ""}
              alt={article.title}
              fill={true}
            />
            <span className={classes.overlay}></span>
          </a>
        </Link>
        <div className={classes.recentpostdetails}>
          <Link legacyBehavior href={`/blog/${articleUrl}`}>
            <a>{article.title}</a>
          </Link>
          <div>
            <div>{newDate(article.issueDate)}</div>
            <span> / </span>
            <div>0 Comments</div>
          </div>
        </div>
      </li>
    );
  }

  return (
    <aside className={classes.sidebarctn}>
      <div className={classes.sidebarinner}>
        <div className={classes.sidebox}>
          <h4 className={classes.socialtitle}>Me suivre</h4>
          <ul className={classes.socialicons}>
            {/* <Link
              legacyBehavior
              href="https://www.youtube.com/channel/UCvVIi4gAhSC4x7sM3g9q53w"
            >
              <a target="_blank">
                <li>
                  <Icon as={BsYoutube} h={5} w={5} size="sm" />
                </li>
              </a>
            </Link> */}
            <Link
              legacyBehavior
              href="https://www.facebook.com/groups/3136931483299677"
            >
              <a target="_blank">
                <li>
                  <Icon as={BsFacebook} h={5} w={5} size="sm" />
                </li>
              </a>
            </Link>
            <Link
              legacyBehavior
              href="https://www.instagram.com/julie_baronnie/"
            >
              <a target="_blank">
                <li>
                  <Icon as={BsInstagram} h={5} w={5} size="sm" />
                </li>
              </a>
            </Link>
            <Link legacyBehavior href="mailto:contact@juliebaronniebeauty.com">
              <a target="_blank">
                <li>
                  <Icon as={BsFillEnvelopeFill} h={5} w={5} size="sm" />
                </li>
              </a>
            </Link>
          </ul>
        </div>
        <div className={classes.sidebox}>
          <h4 className={classes.socialtitle}>Articles récents</h4>
          <ul className={classes.sidebarlist}>
            <SideBlogDetail article={props.articles[0]} />
            <SideBlogDetail article={props.articles[1]} />
            <SideBlogDetail article={props.articles[2]} />
          </ul>
        </div>
      </div>
    </aside>
  );
}
