import HomeComponent from "../components/home/HomeComponent";
import { GetStaticPropsResult } from "next";
import axios from "axios";
import {
  ApiResponse,
  BlogPost,
  BlogPostApi,
  Product,
  ProductApi,
} from "../types";

type HomeProps = {
  recentProducts: Product[];
  recentArticles: BlogPost[];
};

const Home = (props: HomeProps) => {
  // const number = useRandomNumber();
  return (
    <HomeComponent
      recentProducts={props.recentProducts}
      recentArticles={props.recentArticles}
    />
  );
};

export const getStaticProps = async (): Promise<
  GetStaticPropsResult<HomeProps>
> => {
  const resProducts = await axios.get<ApiResponse<ProductApi>>(
    `${process.env.NEXT_PUBLIC_API_URL}/items?populate=%2A`,
  );
  const dataProducts = resProducts.data.data;

  const resArticles = await axios.get<ApiResponse<BlogPostApi>>(
    `${process.env.NEXT_PUBLIC_API_URL}/articles?populate=%2A`,
  );
  const dataArticles = resArticles.data.data;

  const sortingFn = (a: Product | BlogPost, b: Product | BlogPost) => {
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

  const recentProducts: Product[] = dataProducts
    .map((product) => ({
      id: product.id.toString(),
      documentId: product.documentId,
      name: product.Name,
      intro: product.Intro,
      description: product.Description,
      price: product.Price,
      issueDate: product.publishedAt,
      imageUrl: product.Image.url,
      categories: product.item_categories.map((category) => {
        return category.Name;
      }),
    }))
    .sort(sortingFn);

  const recentArticles: BlogPost[] = dataArticles
    .map((article) => ({
      id: article.id.toString(),
      documentId: article.documentId,
      title: article.Name,
      intro: article.Intro,
      description: article.Description,
      issueDate: article.publishedAt,
      videoUrl: article.Video_URL,
      imageUrl: article.Image.url,
      categories: article.article_categories.map((category) => {
        return category.Name;
      }),
    }))
    .sort(sortingFn);

  if (recentProducts.length > 8) {
    recentProducts.splice(8);
  } else if (recentProducts.length > 4) {
    recentProducts.splice(4);
  }

  if (recentArticles.length > 3) {
    recentArticles.splice(3);
  }

  return {
    props: {
      recentProducts: recentProducts,
      recentArticles: recentArticles,
    },
  };
};

export default Home;
