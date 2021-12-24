import BlogHeading from "../../components/blog/BlogHeading";
import BlogArticlesList from "../../components/blog/BlogArticlesList";
import BlogAside from "../../components/blog/BlogAside";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import axios from "axios";
import { useEffect, useState } from "react";
import { Article } from "../../components/blog/BlogArticleItem";
import { Container, Flex, Spinner } from "@chakra-ui/react";

function BlogPage(props: InferGetStaticPropsType<typeof getStaticProps>) {
  const [loadedArticles, setLoadedArticles] = useState<Article[]>([]);
  const [currentPage, setCurrentPage] = useState(null);

  useEffect(() => {
    setLoadedArticles(props.articles);
    console.log(props.articles);
  }, [props.articles]);

  return (
    <>
      <BlogHeading />
      <Container pt="50px" pb="50px" w="1200px" maxW="90%" margin="0 auto">
        <>
          <Flex display={currentPage === null ? "none" : "flex"}>
            <BlogArticlesList
              articles={loadedArticles}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
            <BlogAside />
          </Flex>
          <Flex
            display={currentPage !== null ? "none" : "flex"}
            h="50vh"
            w="100%"
            justifyContent="center"
            alignItems="center"
          >
            <Spinner />
          </Flex>
        </>
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
