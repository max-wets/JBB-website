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
  const blogPostIdArr = (params!.blogArticleId as string).split("-");
  const blogPostDocumentId = blogPostIdArr[blogPostIdArr.length - 1];
  const pageBlogPost = await getBlogPagePostDetails(blogPostDocumentId);

  return {
    props: {
      article: pageBlogPost,
      recentArticles: await getRecentBlogPosts(pageBlogPost.documentId),
      prevNextPosts: await getPreviousAndNextBlogPosts(pageBlogPost.issueDate),
      recommendedArticles: await getRecommendedBlogPostsWithSameCategories(
        pageBlogPost.documentId,
        pageBlogPost.categories
      ),
      articleComments: await getBlogPostComments(Number(pageBlogPost.id)),
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

const getBlogPagePostDetails = async (
  documentID: string
): Promise<BlogPost> => {
  const query = qs.stringify(
    {
      populate: ["Image", "article_categories"],
      filters: {
        documentId: {
          $eq: documentID,
        },
      },
      sort: ["updatedAt:desc"],
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
  if (!data || data.data.length < 1)
    throw new Error("No Blog post was found with document ID: " + documentID);
  const blogPostApi = data.data[0];
  return {
    id: blogPostApi.id,
    documentId: blogPostApi.documentId,
    intro: blogPostApi.Intro,
    title: blogPostApi.Name,
    description: blogPostApi.Description,
    issueDate: blogPostApi.updatedAt,
    imageUrl: blogPostApi.Image ? blogPostApi.Image.url : null,
    videoUrl: blogPostApi.Video_URL,
    categories: blogPostApi.article_categories.map(
      (category: CategoryApi) => category.Name
    ),
  };
};

const getRecommendedBlogPostsWithSameCategories = async (
  currentBlogPostDocumentId: string,
  currentBlogPostCategories: string[],
  count: number = 3
): Promise<BlogPost[]> => {
  try {
    const query = qs.stringify(
      {
        populate: ["Image", "article_categories"],
        filters: {
          documentId: {
            $ne: currentBlogPostDocumentId,
          },
          article_categories: {
            Name: {
              in: currentBlogPostCategories,
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
    const query = qs.stringify(
      {
        filters: {
          ArticleID: {
            $eq: blogPostID,
          },
        },
        sort: ["updatedAt:desc"],
      },
      {
        encodeValuesOnly: true,
      }
    );
    const url = `${process.env.NEXT_PUBLIC_API_URL}/comments-full?${query}`;
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
