import { useRouter } from "next/router";
import { useEffect } from "react";
import { GetStaticProps, GetStaticPaths, InferGetStaticPropsType } from "next";
import BlogArticleDetail from "../../../components/blog/blog-detail/BlogArticleDetail";
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

  return <BlogArticleDetail article={props.article} />;
}

export const getStaticProps: GetStaticProps = async (context) => {
  const sortingFn = (a, b) => {
    const aDate = new Date(a.attributes.publishedAt);
    const bDate = new Date(b.attributes.publishedAt);

    if (aDate > bDate) {
      return -1;
    }
    if (aDate < bDate) {
      return 1;
    }
    return 0;
  };
  const aid = Number(context.params.blogArticleId);
  const res = await axios.get(
    `https://jbb-admin.herokuapp.com/api/articles?populate=%2A`
  );
  const data = res.data.data.sort(sortingFn);
  const article = data.find((article) => article.id === aid);
  const previousArticle =
    aid > 0 ? data.find((article) => article.id === aid - 1) : null;
  const nextArticle =
    aid < data.length ? data.find((article) => article.id === aid + 1) : null;
  const prevNextArticles = [
    previousArticle
      ? {
          id: previousArticle.id,
          title: previousArticle.attributes.title,
        }
      : null,
    nextArticle
      ? {
          id: nextArticle.id,
          title: nextArticle.attributes.title,
        }
      : null,
  ];

  function getRecentArticles(data) {
    const max = data.length - 1;
    const articles = [];
    let idx = 0;
    while (articles.length < max) {
      if (data[idx].id != aid) {
        articles.push({
          id: data[idx].id,
          title: data[idx].attributes.title,
          issueDate: data[idx].attributes.publishedAt,
          imageUrl: data[idx].attributes.image.data.attributes.url,
        });
      }
      idx += 1;
    }
    return articles;
  }

  function getRecommendedArticles(data, article) {
    const articleCategories = article.attributes.article_categories.data.map(
      (category) => {
        return category.attributes.name;
      }
    );
    function containsCategory(post) {
      let hasCategory = false;
      post.attributes.article_categories.data.forEach((category) => {
        if (articleCategories.indexOf(category.attributes.name) > -1) {
          !hasCategory ? (hasCategory = true) : null;
        }
      });
      return hasCategory;
    }
    const sameCategoryArticles = data
      .filter(containsCategory)
      .map((article) => ({
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
      }));

    return sameCategoryArticles;
  }

  const recentArticles = getRecentArticles(data);
  const recommendedArticles = getRecommendedArticles(data, article);

  return {
    props: {
      article: {
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
      },
      recentArticles: recentArticles,
      prevNextArticles: prevNextArticles,
      recommendedArticles: recommendedArticles,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const res = await axios.get("https://jbb-admin.herokuapp.com/api/articles");
  const data = res.data.data;

  const paths = data.map((article) => ({
    params: { blogArticleId: article.id.toString() },
  }));

  return { paths, fallback: false };
};

export default BlogDetailPage;
