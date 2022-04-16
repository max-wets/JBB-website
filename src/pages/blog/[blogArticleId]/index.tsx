import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  GetStaticProps,
  GetServerSideProps,
  GetStaticPaths,
  InferGetStaticPropsType,
  InferGetServerSidePropsType,
} from "next";
import BlogArticleDetail from "../../../components/blog/blog-detail/BlogArticleDetail";
import BlogArticleDetailHeading from "../../../components/blog/blog-detail/BlogArticleDetailHeading";
import BlogArticleAside from "../../../components/blog/blog-detail/BlogArticleAside";
import { Container, Flex, useMediaQuery } from "@chakra-ui/react";
import axios from "axios";
import qs from "qs";
import { urlStringFormatter } from "../../../lib/utils";

function BlogDetailPage(props: InferGetStaticPropsType<typeof getStaticProps>) {
  const [isLargerThan960] = useMediaQuery("(min-width: 960px)");
  const [isLargerThan600] = useMediaQuery("(min-width: 600px)");
  const [serverRendering, setServerRendering] = useState(true);

  useEffect(() => {
    // console.log("Blog detail page article data:", props.article);
    // console.log("Blog detail page prevNext data:", props.prevNextArticles);
    // console.log("Blog detail page recent articles data:", props.recentArticles);
    // console.log(
    //   "Blog detail page recommended articles data:",
    //   props.recommendedArticles
    // );
    // console.log("Blog article comments:", props.articleComments);
    setServerRendering(false);
  }, []);

  return (
    <>
      <BlogArticleDetailHeading title={props.article.title} />
      <Container
        pt={isLargerThan600 ? "50px" : "20px"}
        pb={isLargerThan600 ? "50px" : "20px"}
        w="1200px"
        maxW={isLargerThan600 ? "90%" : "100%"}
        margin="0 auto"
      >
        <Flex
          flexDirection={
            serverRendering ? "row" : isLargerThan960 ? "row" : "column"
          }
        >
          <BlogArticleDetail
            article={props.article}
            prevNextArticles={props.prevNextArticles}
            recommendedArticles={props.recommendedArticles}
            articleComments={props.articleComments}
          />
          <BlogArticleAside articles={props.recentArticles} />
        </Flex>
      </Container>
    </>
  );
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
  const aid = Number(
    (context.params.blogArticleId as string).split("-").slice(-1)
  );
  const res = await axios.get(
    `https://jbbeauty-cms.herokuapp.com/api/articles?populate=%2A&pagination[pageSize]=100&sort[0]=createdAt%3Adesc`
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
          title: previousArticle.attributes.Name,
        }
      : null,
    nextArticle
      ? {
          id: nextArticle.id,
          title: nextArticle.attributes.Name,
        }
      : null,
  ];

  function formatData(post) {
    return {
      id: post.id.toString(),
      title: post.attributes.Name,
      intro: post.attributes.Intro,
      description: post.attributes.Description,
      issueDate: post.attributes.publishedAt,
      videoUrl: post.attributes.Video_URL,
      imageUrl: post.attributes.Image.data.attributes.url,
      categories: post.attributes.article_categories.data.map((category) => {
        return category.attributes.Name;
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
          title: data[idx].attributes.Name,
          issueDate: data[idx].attributes.publishedAt,
          imageUrl: data[idx].attributes.Image.data.attributes.url,
        });
      }
      idx += 1;
    }
    return articles;
  }

  function getRecommendedArticles(data, article) {
    let recommendedArticles = [];
    const articleCategories = article.attributes.article_categories.data.map(
      (category) => {
        return category.attributes.Name;
      }
    );
    function containsCategory(post) {
      if (post.id === aid) return false;

      let hasCategory = false;
      post.attributes.article_categories.data.forEach((category) => {
        if (articleCategories.indexOf(category.attributes.Name) > -1) {
          !hasCategory ? (hasCategory = true) : null;
        }
      });
      return hasCategory;
    }
    recommendedArticles = data.filter(containsCategory);
    // return recommendedArticles;

    if (recommendedArticles.length > 3) {
      // const slicedArticlesArray = sameCategoryArticles.slice(2);
      recommendedArticles = recommendedArticles.slice(0, 3);
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

  // get article's comments
  const resComments = await axios.get(
    `https://jbbeauty-cms.herokuapp.com/api/comments?filters[ArticleID][$eq]=${aid}&sort=publishedAt%3Adesc`
  );
  const commentsData = resComments.data.data;
  const AuthorIdsArr = [];
  const completeComments = [];
  const cleanComments = commentsData.map((comment) => {
    if (AuthorIdsArr.indexOf(comment.attributes.AuthorID) < 0)
      AuthorIdsArr.push(comment.attributes.AuthorID);
    return {
      id: comment.id,
      ArticleID: comment.attributes.ArticleID,
      AuthorID: comment.attributes.AuthorID,
      Content: comment.attributes.Content,
      issueDate: comment.attributes.publishedAt,
    };
  });
  // console.log("comments:", cleanComments);
  // console.log("authors id arr:", AuthorIdsArr);

  // get users' names
  if (AuthorIdsArr.length > 0) {
    const query = qs.stringify(
      {
        filters: {
          id: {
            $in: AuthorIdsArr,
          },
        },
        // fields: ["id", "username"],
      },
      {
        encodeValuesOnly: true,
      }
    );
    const usersRes = await axios.get(
      `https://jbbeauty-cms.herokuapp.com/api/users?${query}`,
      {
        headers: {
          Authorization: `bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
        },
      }
    );
    const usersData = usersRes.data;
    // console.log("users data:", usersData);

    cleanComments.map((comment) => {
      const authorName = usersData.filter(
        (user) => user.id === comment.AuthorID
      )[0].username;

      completeComments.push({
        ...comment,
        AuthorName: authorName,
      });
    });

    // console.log("complete comments:", completeComments);
  }

  return {
    props: {
      article: formatData(article),
      recentArticles: recentArticles,
      prevNextArticles: prevNextArticles,
      recommendedArticles: recommendedArticles,
      articleComments: completeComments,
    },
    revalidate: 3600,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const res = await axios.get(
    "https://jbbeauty-cms.herokuapp.com/api/articles?pagination[pageSize]=100"
  );
  const data = res.data.data;

  // console.log(data.length);

  const paths = data.map((article) => ({
    params: {
      blogArticleId: urlStringFormatter(article.attributes.Name, article.id),
    },
  }));

  return { paths, fallback: false };
};

export default BlogDetailPage;
