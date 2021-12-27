import classes from "./BlogArticleDetail.module.css";
import { Article } from "./BlogArticleItem";

function BlogArticleDetail(props: Article) {
  const api_url = "https://jbb-admin.herokuapp.com";

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

  return <h1>Blog Article Detail</h1>;
}

export default BlogArticleDetail;
