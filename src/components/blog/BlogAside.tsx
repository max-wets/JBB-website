import classes from "./BlogAside.module.css";
import Link from "next/link";
import { Icon } from "@chakra-ui/react";
import Image from "next/image";
import { Article } from "./BlogArticleItem";
import {
  BsFillEnvelopeFill,
  BsFacebook,
  BsInstagram,
  BsYoutube,
} from "react-icons/bs";
import { urlStringFormatter } from "../../lib/utils";

function BlogAside(props: {
  articles: Article[];
  activeCategories: object;
  setSelectedCategory;
}) {
  // const api_url = "https://jbb-admin.herokuapp.com";
  const newDate = (date) => {
    const mois = [
      "Janvier",
      "Février",
      "Mars",
      "Avril",
      "Mai",
      "Juin",
      "Juillet",
      "Août",
      "Septembre",
      "Octobre",
      "Novembre",
      "Décembre",
    ];
    const nDate = new Date(date);
    return `${nDate.getDate()} ${
      mois[nDate.getMonth()]
    } ${nDate.getFullYear()}`;
  };

  // console.log("Blog Aside categories:", props.activeCategories);

  const handleClick = (e) => {
    props.setSelectedCategory(e.target.dataset.category);
  };

  function SideBlogDetail({ idx, article }) {
    const articleUrl = urlStringFormatter(article.title, article.id);

    return (
      <li key={idx}>
        <Link legacyBehavior href={`/blog/${articleUrl}`}>
          <a className={classes.imgctr}>
            <Image src={article.imageUrl} alt={article.title} fill={true} />
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
              key={1}
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
              key={2}
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
              key={3}
              href="https://www.instagram.com/julie_baronnie/"
            >
              <a target="_blank">
                <li>
                  <Icon as={BsInstagram} h={5} w={5} size="sm" />
                </li>
              </a>
            </Link>
            <Link
              legacyBehavior
              key={4}
              href="mailto:contact@juliebaronniebeauty.com"
            >
              <a target="_blank">
                <li>
                  <Icon as={BsFillEnvelopeFill} h={5} w={5} size="sm" />
                </li>
              </a>
            </Link>
          </ul>
        </div>
        <div className={classes.sidebox}>
          <h4 className={classes.socialtitle}>Catégories</h4>
          <div className={classes.blogcategories}>
            {Object.entries(props.activeCategories).map(
              ([category, qty], idx) => (
                <li key={idx}>
                  <div data-category={category} onClick={(e) => handleClick(e)}>
                    {category}
                  </div>
                  <span>{`(${qty})`}</span>
                </li>
              ),
            )}
            <li>
              <div data-category="Toutes" onClick={(e) => handleClick(e)}>
                Toutes catégories
              </div>
              <span>{`(${props.articles.length})`}</span>
            </li>
          </div>
        </div>
        <div className={classes.sidebox}>
          <h4 className={classes.socialtitle}>Articles récents</h4>
          <ul className={classes.sidebarlist}>
            <SideBlogDetail idx={1} article={props.articles[0]} />
            <SideBlogDetail idx={2} article={props.articles[1]} />
            <SideBlogDetail idx={3} article={props.articles[2]} />
          </ul>
        </div>
      </div>
    </aside>
  );
}

export default BlogAside;
