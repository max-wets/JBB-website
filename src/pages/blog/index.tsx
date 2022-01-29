import BlogHeading from "../../components/blog/BlogHeading";
import BlogArticlesList from "../../components/blog/BlogArticlesList";
import BlogAside from "../../components/blog/BlogAside";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import axios from "axios";
import { useEffect, useState } from "react";
import { Article } from "../../components/blog/BlogArticleItem";
import { Container, Flex, Spinner, useMediaQuery } from "@chakra-ui/react";
import { BsTwitter } from "react-icons/bs";

function BlogPage(props: InferGetStaticPropsType<typeof getStaticProps>) {
  const [loadedArticles, setLoadedArticles] = useState<Article[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("Toutes");
  const [currentPage, setCurrentPage] = useState(null);
  const [isLargerThan960] = useMediaQuery("(min-width: 960px)");

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

  useEffect(() => {
    setLoadedArticles(props.articles.sort(sortingFn));
    console.log("loaded articles:", loadedArticles);
    // console.log("categories: ", props.activeCategories);
  }, [props.articles]);

  useEffect(() => {
    if (selectedCategory !== "Toutes") {
      const ArticlesByCategory = props.articles
        .filter((article) => article.categories.includes(selectedCategory))
        .sort(sortingFn);
      // console.log(ArticlesByCategory);
      setLoadedArticles(ArticlesByCategory);
    } else {
      setLoadedArticles(props.articles);
    }
  }, [selectedCategory]);

  return (
    <>
      <BlogHeading />
      <Container pt="50px" pb="50px" w="1200px" maxW="90%" margin="0 auto">
        <>
          <Flex
            display={currentPage === null ? "none" : "flex"}
            flexDirection={isLargerThan960 ? "row" : "column"}
          >
            <BlogArticlesList
              articles={loadedArticles}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
            <BlogAside
              articles={props.articles}
              activeCategories={props.activeCategories}
              setSelectedCategory={setSelectedCategory}
            />
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
  // const res = await axios.get(
  //   "https://jbb-admin.herokuapp.com/api/articles?populate=%2A"
  // );
  // const data = res.data.data;

  const res = await axios.get("https://strapi-d6ef.onrender.com/articles");
  const data = res.data;

  // console.log("blog articles data:", res.data);

  interface Category {
    [category: string]: number;
  }

  const activeCategories = {} as Category;
  data.map((article) =>
    article.article_categories.map((category) => {
      const categoryName = category.Name;
      activeCategories[categoryName]
        ? (activeCategories[categoryName] += 1)
        : (activeCategories[categoryName] = 1);
    })
  );
  // console.log("active categories to send:", JSON.stringify(activeCategories));

  const articles = data.map((article) => ({
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
  }));

  // console.log("articles to send:", articles);

  return {
    props: {
      articles: articles,
      activeCategories: activeCategories,
    },
    revalidate: 3600,
  };
};

export default BlogPage;
