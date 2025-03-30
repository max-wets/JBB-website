import classes from "./BlogAside.module.css";
import Link from "next/link";
import { Icon } from "@chakra-ui/react";
import Image from "next/image";
import { BsFillEnvelopeFill, BsFacebook, BsInstagram } from "react-icons/bs";
import { urlStringFormatter } from "../../lib/utils";
import { ActiveCategories, BlogPost } from "../../types";
import React, { Dispatch, SetStateAction } from "react";

type BlogAsideProps = {
  articles: BlogPost[];
  activeCategories: ActiveCategories;
  setSelectedCategory: Dispatch<SetStateAction<string>>;
};

type SideBlogDetailProps = {
  idx: number;
  article: BlogPost;
};

function BlogAside({
  articles,
  activeCategories,
  setSelectedCategory,
}: BlogAsideProps) {
  // const api_url = "https://jbb-admin.herokuapp.com";
  const newDate = (date: string) => {
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

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target) {
      const target = e.target as HTMLElement;
      setSelectedCategory(target.dataset.category || "");
    }
  };

  function SideBlogDetail({ idx, article }: SideBlogDetailProps) {
    const articleUrl = urlStringFormatter(article.title, article.documentId);

    return (
      <li key={idx}>
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
            {Object.entries(activeCategories).map(([category, qty], idx) => (
              <li key={idx}>
                <div data-category={category} onClick={(e) => handleClick(e)}>
                  {category}
                </div>
                <span>{`(${qty})`}</span>
              </li>
            ))}
            <li>
              <div data-category="Toutes" onClick={(e) => handleClick(e)}>
                Toutes catégories
              </div>
              <span>{`(${articles.length})`}</span>
            </li>
          </div>
        </div>
        <div className={classes.sidebox}>
          <h4 className={classes.socialtitle}>Articles récents</h4>
          <ul className={classes.sidebarlist}>
            <SideBlogDetail idx={1} article={articles[0]} />
            <SideBlogDetail idx={2} article={articles[1]} />
            <SideBlogDetail idx={3} article={articles[2]} />
          </ul>
        </div>
      </div>
    </aside>
  );
}

export default BlogAside;
