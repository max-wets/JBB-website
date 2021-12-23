import BlogHeading from "../../components/blog/BlogHeading";
import BlogArticlesList from "../../components/blog/BlogArticlesList";
import { Container } from "@chakra-ui/react";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import axios from "axios";
import { useEffect, useState } from "react";
import { Article } from "../../components/blog/BlogArticleItem";

function BlogPage(props: InferGetStaticPropsType<typeof getStaticProps>) {
  const [loadedArticles, setLoadedArticles] = useState<Article[]>([]);

  useEffect(() => {
    setLoadedArticles(props.articles);
    console.log(props.articles);
  }, [props.articles]);

  return (
    <>
      <BlogHeading />
      <Container w="1200px" maxW="90%" margin="0 auto">
        <BlogArticlesList articles={loadedArticles} />
      </Container>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const res = await axios.get(
    "https://jbb-admin.herokuapp.com/api/articles?populate=%2A"
  );
  const data = res.data.data;

  //   console.log(data);

  return {
    props: {
      articles: data.map((article) => ({
        id: article.id.toString(),
        title: article.attributes.title,
        intro: article.attributes.intro,
        description: article.attributes.description,
        issueDate: article.attributes.publishedAt,
        videoUrl: article.attributes.Video_URL,
        imageUrl: article.attributes.image.data.attributes.url,
        categories: article.attributes.article_categories.data.map(
          (category) => {
            return category.attributes.name;
          }
        ),
      })),
    },
    revalidate: 3600,
  };
};

export default BlogPage;
