import HomeComponent from "../components/home/HomeComponent";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import axios from "axios";

const Home = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
  // const number = useRandomNumber();
  return (
    <HomeComponent
      recentProducts={props.recentProducts}
      recentArticles={props.recentArticles}
    />
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const resProducts = await axios.get("https://strapi-d6ef.onrender.com/items");
  const dataProducts = resProducts.data;

  const resArticles = await axios.get(
    "https://strapi-d6ef.onrender.com/articles"
  );
  const dataArticles = resArticles.data;

  const sortingFn = (a, b) => {
    const aDate = new Date(a.issueDate);
    const bDate = new Date(b.issueDate);

    if (aDate > bDate) {
      return -1;
    }
    if (aDate < bDate) {
      return 1;
    }
    return 0;
  };

  const recentProducts = dataProducts
    .map((product) => ({
      id: product.id.toString(),
      name: product.Name,
      intro: product.Intro,
      description: product.Description,
      price: product.Price,
      issueDate: product.published_at,
      imageUrl: product.Image.url,
      categories: product.item_categories.map((category) => {
        return category.Name;
      }),
    }))
    .sort(sortingFn);

  const recentArticles = dataArticles
    .map((article) => ({
      id: article.id.toString(),
      title: article.Name,
      intro: article.Intro,
      description: article.Description,
      issueDate: article.published_at,
      videoUrl: article.Video_URL,
      imageUrl: article.Image.url,
      categories: article.article_categories.map((category) => {
        return category.Name;
      }),
    }))
    .sort(sortingFn);

  recentProducts.length > 8
    ? recentProducts.splice(8)
    : recentProducts.length > 4
    ? recentProducts.splice(4)
    : recentProducts;

  recentArticles.length > 3 ? recentArticles.splice(3) : recentArticles;

  return {
    props: {
      recentProducts: recentProducts,
      recentArticles: recentArticles,
    },
  };
};

export default Home;
