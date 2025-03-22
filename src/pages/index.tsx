import HomeComponent from "../components/home/HomeComponent";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import axios from "axios";
import { ApiResponse, BlogPostApi, ProductApi } from "../types";

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
  const resProducts = await axios.get<ApiResponse<ProductApi>>(
    `${process.env.NEXT_PUBLIC_API_URL}/items?populate=%2A`
  );
  const dataProducts = resProducts.data.data;

  const resArticles = await axios.get<ApiResponse<BlogPostApi>>(
    `${process.env.NEXT_PUBLIC_API_URL}/articles?populate=%2A`
  );
  const dataArticles = resArticles.data.data;

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
      name: product.attributes.Name,
      intro: product.attributes.Intro,
      description: product.attributes.Description,
      price: product.attributes.Price,
      issueDate: product.attributes.publishedAt,
      imageUrl: product.attributes.Image.data.attributes.url,
      categories: product.attributes.item_categories.data.map((category) => {
        return category.attributes.Name;
      }),
    }))
    .sort(sortingFn);

  const recentArticles = dataArticles
    .map((article) => ({
      id: article.id.toString(),
      title: article.attributes.Name,
      intro: article.attributes.Intro,
      description: article.attributes.Description,
      issueDate: article.attributes.publishedAt,
      videoUrl: article.attributes.Video_URL,
      imageUrl: article.attributes.Image.data.attributes.url,
      categories: article.attributes.article_categories.data.map((category) => {
        return category.attributes.Name;
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
