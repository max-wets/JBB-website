import { useRouter } from "next/router";
import { useEffect } from "react";
import { GetStaticProps, GetStaticPaths, InferGetStaticPropsType } from "next";
import BlogArticleDetail from "../../../components/blog/blog-detail/BlogArticleDetail";
import BlogArticleDetailHeading from "../../../components/blog/blog-detail/BlogArticleDetailHeading";
import BlogArticleAside from "../../../components/blog/blog-detail/BlogArticleAside";
import { Container, Flex, Spinner } from "@chakra-ui/react";
import axios from "axios";

function BlogDetailPage(props: InferGetStaticPropsType<typeof getStaticProps>) {
  useEffect(() => {
    console.log("Blog detail page article data:", props.article);
    console.log("Blog detail page prevNext data:", props.prevNextArticles);
    console.log("Blog detail page recent articles data:", props.recentArticles);
    console.log(
      "Blog detail page recommended articles data:",
      props.recommendedArticles
    );
  }, []);

  return (
    <>
      <BlogArticleDetailHeading title={props.article.title} />
      <Container pt="50px" pb="50px" w="1200px" maxW="90%" margin="0 auto">
        <Flex>
          <BlogArticleDetail
            article={props.article}
            prevNextArticles={props.prevNextArticles}
            recommendedArticles={props.recommendedArticles}
          />
          <BlogArticleAside articles={props.recentArticles} />
        </Flex>
      </Container>
    </>
  );
}

export const getStaticProps: GetStaticProps = async (context) => {
  const sortingFn = (a, b) => {
    const aDate = new Date(a.published_at);
    const bDate = new Date(b.published_at);

    if (aDate > bDate) {
      return -1;
    }
    if (aDate < bDate) {
      return 1;
    }
    return 0;
  };
  const aid = Number(context.params.blogArticleId);
  const res = await axios.get(`https://strapi-d6ef.onrender.com/articles`);
  const data = res.data.sort(sortingFn);
  const article = data.find((article) => article.id === aid);
  const previousArticle =
    aid > 0 ? data.find((article) => article.id === aid - 1) : null;
  const nextArticle =
    aid < data.length ? data.find((article) => article.id === aid + 1) : null;
  const prevNextArticles = [
    previousArticle
      ? {
          id: previousArticle.id,
          title: previousArticle.Name,
        }
      : null,
    nextArticle
      ? {
          id: nextArticle.id,
          title: nextArticle.Name,
        }
      : null,
  ];

  function formatData(post) {
    return {
      id: post.id.toString(),
      title: post.Name,
      intro: post.Intro,
      description: post.Description,
      issueDate: post.published_at,
      videoUrl: post.Video_URL,
      imageUrl: post.Image.url,
      categories: post.article_categories.map((category) => {
        return category.Name;
      }),
    };
  }

  function getRecentArticles(data) {
    const max = data.length - 1;
    const articles = [];
    let idx = 0;
    while (articles.length < max) {
      if (data[idx].id != aid) {
        articles.push({
          id: data[idx].id,
          title: data[idx].Name,
          issueDate: data[idx].published_at,
          imageUrl: data[idx].Image.url,
        });
      }
      idx += 1;
    }
    return articles;
  }

  function getRecommendedArticles(data, article) {
    let recommendedArticles = [];
    const articleCategories = article.article_categories.map((category) => {
      return category.Name;
    });
    function containsCategory(post) {
      if (post.id === aid) return false;

      let hasCategory = false;
      post.article_categories.forEach((category) => {
        if (articleCategories.indexOf(category.Name) > -1) {
          !hasCategory ? (hasCategory = true) : null;
        }
      });
      return hasCategory;
    }
    recommendedArticles = data.filter(containsCategory);
    // return recommendedArticles;

    if (recommendedArticles.length > 3) {
      // const slicedArticlesArray = sameCategoryArticles.slice(2);
      recommendedArticles = recommendedArticles.slice(2);
    } else if (recommendedArticles.length < 3) {
      const takenIds = recommendedArticles.reduce((prev, curr) => {
        return [...prev, curr.id];
      }, []);
      const availableArticles = data.filter(
        (article) => article.id !== aid && takenIds.indexOf(article.id) < 0
      );
      let i = 0;
      while (i < 3 - recommendedArticles.length) {
        recommendedArticles.push(availableArticles[i]);
        i++;
      }
    }
    return recommendedArticles.map(formatData);
  }

  const recentArticles = getRecentArticles(data);
  const recommendedArticles = getRecommendedArticles(data, article);

  return {
    props: {
      article: formatData(article),
      recentArticles: recentArticles,
      prevNextArticles: prevNextArticles,
      recommendedArticles: recommendedArticles,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const res = await axios.get("https://strapi-d6ef.onrender.com/articles");
  const data = res.data;

  const paths = data.map((article) => ({
    params: { blogArticleId: article.id.toString() },
  }));

  return { paths, fallback: false };
};

export default BlogDetailPage;
