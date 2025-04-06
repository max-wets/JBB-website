import { useEffect, useState } from "react";
import { GetStaticProps, GetStaticPaths, GetStaticPropsResult } from "next";
import BlogArticleDetail from "../../../components/blog/blog-detail/BlogArticleDetail";
import BlogArticleDetailHeading from "../../../components/blog/blog-detail/BlogArticleDetailHeading";
import BlogArticleAside from "../../../components/blog/blog-detail/BlogArticleAside";
import { Container, Flex, useMediaQuery } from "@chakra-ui/react";
import axios from "axios";
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
  PreviousAndNextBlogPosts,
  PrevNextPost,
} from "../../../types";
import qs from "qs";

type BlogDetailPageProps = {
  article: BlogPost;
  recentArticles: BlogPostSmall[];
  prevNextPosts: PreviousAndNextBlogPosts;
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
      categories: post.article_categories.map(
        (category: CategoryApi) => category.Name
      ),
    };
  };

  return {
    props: {
      article: formatData(article),
      recentArticles: await getRecentBlogPosts(article.documentId),
      prevNextPosts: await getPreviousAndNextBlogPosts(article.updatedAt),
      recommendedArticles:
        await getRecommendedBlogPostsWithSameCategories(article),
      articleComments: await getBlogPostComments(article.id),
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

const getRecommendedBlogPostsWithSameCategories = async (
  currentBlogPost: BlogPostApi,
  count: number = 3
): Promise<BlogPost[]> => {
  try {
    const blogPostCategories = currentBlogPost.article_categories.map(
      (category) => category.Name
    );
    const query = qs.stringify(
      {
        populate: ["Image", "article_categories"],
        filters: {
          documentId: {
            $ne: currentBlogPost.documentId,
          },
          article_categories: {
            Name: {
              in: blogPostCategories,
            },
          },
        },
        sort: ["updatedAt:desc"],
        pagination: {
          pageSize: count,
          page: 1,
        },
      },
      {
        encodeValuesOnly: true,
      }
    );
    const { data } = await axios.get<ApiResponse<BlogPostApi>>(
      `${process.env.NEXT_PUBLIC_API_URL}/articles?${query}`
    );
    if (!data || data.data.length < 1) return [];
    return data.data.map((blogPostApi) => ({
      id: blogPostApi.id,
      documentId: blogPostApi.documentId,
      title: blogPostApi.Name,
      description: blogPostApi.Description,
      intro: blogPostApi.Intro,
      issueDate: blogPostApi.updatedAt,
      imageUrl: blogPostApi.Image ? blogPostApi.Image.url : null,
      videoUrl: blogPostApi.Video_URL,
      categories: blogPostApi.article_categories.map(
        (category: CategoryApi) => category.Name
      ),
    }));
  } catch (e) {
    throw new Error(
      "Something wrong happened while fetching blog posts recommendations...",
      { cause: e }
    );
  }
};

const getRecentBlogPosts = async (
  currentBlogPostDocumentId: string,
  count: number = 3
): Promise<BlogPostSmall[]> => {
  try {
    const query = qs.stringify(
      {
        populate: ["Image"],
        filters: {
          documentId: {
            $ne: currentBlogPostDocumentId,
          },
        },
        sort: ["updatedAt:desc"],
        pagination: {
          pageSize: count,
          page: 1,
        },
      },
      {
        encodeValuesOnly: true,
      }
    );
    const { data } = await axios.get<ApiResponse<BlogPostApi>>(
      `${process.env.NEXT_PUBLIC_API_URL}/articles?${query}`
    );
    if (!data || data.data.length < 1) return [];
    return data.data.map((blogPostApi) => ({
      id: blogPostApi.id,
      documentId: blogPostApi.documentId,
      title: blogPostApi.Name,
      issueDate: blogPostApi.updatedAt,
      imageUrl: blogPostApi.Image ? blogPostApi.Image.url : "",
    }));
  } catch (e) {
    throw new Error(
      "Something wrong happened while fetching the recent blog posts details",
      { cause: e }
    );
  }
};

const getPreviousAndNextBlogPosts = async (
  currentBlogPostUpdateDate: string
): Promise<PreviousAndNextBlogPosts> => {
  return {
    previousPost: await getClosestBlogPostInTime(
      currentBlogPostUpdateDate,
      false
    ),
    nextPost: await getClosestBlogPostInTime(currentBlogPostUpdateDate, true),
  };
};
const getClosestBlogPostInTime = async (
  currentBlogPostUpdateDate: string,
  isNext: boolean
): Promise<PrevNextPost | null> => {
  try {
    const query = qs.stringify(
      {
        filters: {
          updatedAt: {
            [isNext ? "$gt" : "$lt"]: currentBlogPostUpdateDate,
          },
        },
        sort: [`updatedAt:${isNext ? "asc" : "desc"}`],
        pagination: {
          pageSize: 1,
          page: 1,
        },
      },
      {
        encodeValuesOnly: true,
      }
    );
    const { data } = await axios.get<ApiResponse<BlogPostApi>>(
      `${process.env.NEXT_PUBLIC_API_URL}/articles?${query}`
    );
    if (!data || data.data.length < 1) return null;
    const nextBlogPostApi = data.data[0];
    return {
      id: nextBlogPostApi.id,
      documentId: nextBlogPostApi.documentId,
      title: nextBlogPostApi.Name,
    };
  } catch (e) {
    throw new Error(
      `Something wrong happened while fetching the ${isNext ? "next" : "previous"} article details...`,
      { cause: e }
    );
  }
};

const getBlogPostComments = async (
  blogPostID: number
): Promise<PostComment[]> => {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/comments-full?filters[ArticleID][$eq]=${blogPostID}&sort=updatedAt%3Adesc`;
    const { data } = await axios.get<PostCommentApi[]>(url);
    if (!data || data.length < 1) return [];
    return data.map((comment) => ({
      id: comment.id,
      documentId: comment.documentId,
      ArticleID: comment.ArticleID,
      AuthorID: comment.AuthorID,
      Content: comment.Content,
      issueDate: comment.updatedAt,
      AuthorName: comment.authorUsername,
    }));
  } catch (e) {
    throw new Error("Something wrong happened while fetching comments...", {
      cause: e,
    });
  }
};
