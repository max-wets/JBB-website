import HomeComponent from '../components/home/HomeComponent';
import { GetStaticPropsResult } from 'next';
import axios from 'axios';
import {
  ApiResponse,
  BlogPost,
  BlogPostApi,
  Product,
  ProductApi,
} from '../types';

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
    `${process.env.NEXT_PUBLIC_API_URL}/items?populate=%2A`
  );
  const dataProducts = resProducts.data.data;

  const resArticles = await axios.get<ApiResponse<BlogPostApi>>(
    `${process.env.NEXT_PUBLIC_API_URL}/articles?populate=%2A`
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

  const recentArticles: BlogPost[] = dataArticles
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
