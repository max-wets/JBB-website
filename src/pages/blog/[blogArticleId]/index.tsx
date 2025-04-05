import { useEffect, useState } from "react";
import { GetStaticProps, GetStaticPaths, GetStaticPropsResult } from "next";
import BlogArticleDetail from "../../../components/blog/blog-detail/BlogArticleDetail";
import BlogArticleDetailHeading from "../../../components/blog/blog-detail/BlogArticleDetailHeading";
import BlogArticleAside from "../../../components/blog/blog-detail/BlogArticleAside";
import { Container, Flex, useMediaQuery } from "@chakra-ui/react";
import axios from "axios";
import qs from "qs";
import { urlStringFormatter } from "../../../lib/utils";
import Head from "next/head";
import {
  ApiResponse,
  BlogPost,
  BlogPostApi,
  BlogPostSmall,
  CategoryApi,
  PostComment,
  PostCommentApi,
  PrevNextPost,
  UserApi,
} from "../../../types";

type BlogDetailPageProps = {
  article: BlogPost;
  recentArticles: BlogPostSmall[];
  prevNextPosts: (PrevNextPost | null)[];
  recommendedArticles: BlogPost[];
  articleComments: PostComment[];
};

export default function BlogDetailPage({
  article,
  recentArticles,
  prevNextPosts,
  recommendedArticles,
  articleComments,
}: BlogDetailPageProps) {
  const [isLargerThan960] = useMediaQuery("(min-width: 960px)");
  const [isLargerThan600] = useMediaQuery("(min-width: 600px)");
  const [serverRendering, setServerRendering] = useState(true);

  useEffect(() => {
    setServerRendering(false);
  }, []);

  return (
    <>
      <Head>
        <title>{article.title} - JBBeauty</title>
        <meta
          name="description"
          content="Meta description for the Blog article page"
        />
      </Head>
      <BlogArticleDetailHeading title={article.title} />
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
            article={article}
            prevNextPosts={prevNextPosts}
            recommendedArticles={recommendedArticles}
            articleComments={articleComments}
          />
          <BlogArticleAside articles={recentArticles} />
        </Flex>
      </Container>
    </>
  );
}

export const getStaticProps: GetStaticProps = async ({
  params,
}): Promise<GetStaticPropsResult<BlogDetailPageProps>> => {
  const sortingFn = (a: BlogPostApi, b: BlogPostApi): number => {
    const aDate = new Date(a.publishedAt);
    const bDate = new Date(b.publishedAt);

    if (aDate > bDate) {
      return -1;
    }
    if (aDate < bDate) {
      return 1;
    }
    return 0;
  };

  const blogPostIdArr = (params!.blogArticleId as string).split("-");
  const blogPostDocumentId = blogPostIdArr[blogPostIdArr.length - 1];
  const res = await axios.get<ApiResponse<BlogPostApi>>(
    `${process.env.NEXT_PUBLIC_API_URL}/articles?populate=%2A&pagination[pageSize]=100&sort[0]=createdAt%3Adesc`
  );
  const data = res.data.data.sort(sortingFn);
  const article = data.find(
    (article) => article.documentId === blogPostDocumentId
  );
  if (!article)
    throw new Error(
      `Article with Document ID '${blogPostDocumentId}' not found`
    );

  const previousArticle =
    article.id > 0
      ? data.find((article) => article.id === article.id - 1)
      : null;
  const nextArticle =
    article.id < data.length
      ? data.find((article) => article.id === article.id + 1)
      : null;
  const prevNextArticles: (PrevNextPost | null)[] = [
    previousArticle
      ? {
          id: previousArticle.id,
          documentId: previousArticle.documentId,
          title: previousArticle.Name,
        }
      : null,
    nextArticle
      ? {
          id: nextArticle.id,
          documentId: nextArticle.documentId,
          title: nextArticle.Name,
        }
      : null,
  ];

  const formatData = (post: BlogPostApi): BlogPost => {
    return {
      id: post.id.toString(),
      documentId: post.documentId,
      title: post.Name,
      intro: post.Intro,
      description: post.Description,
      issueDate: post.updatedAt,
      videoUrl: post.Video_URL,
      imageUrl: post.Image.url,
      categories: post.article_categories.map((category) => {
        return category.Name;
      }),
    };
  };

  const getRecentArticles = (data: BlogPostApi[]): BlogPostSmall[] => {
    const max = data.length - 1;
    const articles: BlogPostSmall[] = [];
    let idx = 0;
    while (articles.length < max) {
      if (data[idx].id != article.id) {
        articles.push({
          id: data[idx].id,
          documentId: data[idx].documentId,
          title: data[idx].Name,
          issueDate: data[idx].updatedAt,
          imageUrl: data[idx].Image ? data[idx].Image.url : null,
        });
      }
      idx += 1;
    }
    return articles;
  };

  const getRecommendedArticles = (
    data: BlogPostApi[],
    pageBlogPost: BlogPostApi
  ): BlogPost[] => {
    let recommendedArticles: BlogPostApi[] = [];
    const articleCategories = article.article_categories.map((category) => {
      return category.Name;
    });
    function containsCategory(post: BlogPostApi) {
      if (post.id === pageBlogPost.id) return false;

      let hasCategory = false;
      post.article_categories.forEach((category: CategoryApi) => {
        if (articleCategories.indexOf(category.Name) > -1 && !hasCategory) {
          hasCategory = true;
        }
      });
      return hasCategory;
    }
    recommendedArticles = data.filter(containsCategory);

    if (recommendedArticles.length > 3) {
      recommendedArticles = recommendedArticles.slice(0, 3);
    } else if (recommendedArticles.length < 3) {
      const takenIds = recommendedArticles.map((post) => post.id);
      const availableArticles = data.filter(
        (article) =>
          article.id !== pageBlogPost.id && takenIds.indexOf(article.id) < 0
      );
      let i = 0;
      while (i < 3 - recommendedArticles.length) {
        recommendedArticles.push(availableArticles[i]);
        i++;
      }
    }
    return recommendedArticles.map(formatData);
  };

  const recentArticles = getRecentArticles(data);
  const recommendedArticles = getRecommendedArticles(data, article);

  // get article's comments
  const resComments = await axios.get<ApiResponse<PostCommentApi>>(
    `${process.env.NEXT_PUBLIC_API_URL}/comments?filters[ArticleID][$eq]=${article.id}&sort=publishedAt%3Adesc`
  );
  const commentsData = resComments.data.data;
  const AuthorIdsArr: number[] = [];
  const completeComments: PostComment[] = [];
  const cleanComments = commentsData.map((comment) => {
    if (AuthorIdsArr.indexOf(comment.AuthorID) < 0)
      AuthorIdsArr.push(comment.AuthorID);
    return {
      id: comment.id,
      documentId: comment.documentId,
      ArticleID: comment.ArticleID,
      AuthorID: comment.AuthorID,
      Content: comment.Content,
      issueDate: comment.publishedAt,
    };
  });

  // get users' names
  if (AuthorIdsArr.length > 0) {
    const query = qs.stringify(
      {
        filters: {
          id: {
            $in: AuthorIdsArr,
          },
        },
      },
      {
        encodeValuesOnly: true,
      }
    );
    const usersRes = await axios.get<UserApi[]>(
      `${process.env.NEXT_PUBLIC_API_URL}/users?${query}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
        },
      }
    );
    const usersData = usersRes.data;

    cleanComments.map((comment) => {
      const authorName = usersData.filter(
        (user) => user.id === comment.AuthorID
      )[0].username;

      completeComments.push({
        ...comment,
        AuthorName: authorName,
      });
    });
  }

  return {
    props: {
      article: formatData(article),
      recentArticles: recentArticles,
      prevNextPosts: prevNextArticles,
      recommendedArticles: recommendedArticles,
      articleComments: completeComments,
    },
    revalidate: 3600,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const res = await axios.get<ApiResponse<BlogPostApi>>(
    `${process.env.NEXT_PUBLIC_API_URL}/articles?pagination[pageSize]=20`
  );
  const data = res.data.data;

  const paths = data.map((article) => ({
    params: {
      blogArticleId: urlStringFormatter(article.Name, article.documentId),
    },
  }));

  return { paths, fallback: true };
};
