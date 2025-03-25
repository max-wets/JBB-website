import { useEffect, useState } from 'react';
import { GetStaticProps, GetStaticPaths, GetStaticPropsResult } from 'next';
import BlogArticleDetail from '@/application/components/blog/blog-detail/BlogArticleDetail';
import BlogArticleDetailHeading from '@/application/components/blog/blog-detail/BlogArticleDetailHeading';
import BlogArticleAside from '@/application/components/blog/blog-detail/BlogArticleAside';
import { Container, Flex, useMediaQuery } from '@chakra-ui/react';
import axios from 'axios';
import qs from 'qs';
import { urlStringFormatter } from '../../../application/utils';
import Head from 'next/head';
import {
  ApiResource,
  ApiResponse,
  BlogPost,
  BlogPostApi,
  BlogPostSmall,
  CategoryApi,
  PostComment,
  PostCommentApi,
  PrevNextPost,
  UserApi,
} from '@/domain/types';

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
  const [isLargerThan960] = useMediaQuery('(min-width: 960px)');
  const [isLargerThan600] = useMediaQuery('(min-width: 600px)');
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
        pt={isLargerThan600 ? '50px' : '20px'}
        pb={isLargerThan600 ? '50px' : '20px'}
        w="1200px"
        maxW={isLargerThan600 ? '90%' : '100%'}
        margin="0 auto"
      >
        <Flex
          flexDirection={
            serverRendering ? 'row' : isLargerThan960 ? 'row' : 'column'
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
  const sortingFn = (
    a: ApiResource<BlogPostApi>,
    b: ApiResource<BlogPostApi>
  ): number => {
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

  const aid = Number((params!.blogArticleId as string).split('-').slice(-1));
  const res = await axios.get<ApiResponse<BlogPostApi>>(
    `${process.env.NEXT_PUBLIC_API_URL}/articles?populate=%2A&pagination[pageSize]=100&sort[0]=createdAt%3Adesc`
  );
  const data = res.data.data.sort(sortingFn);
  const article = data.find((article) => article.id === aid);
  if (!article) throw new Error(`Article with ID '${aid}' not found`);

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

  const formatData = (post: ApiResource<BlogPostApi>): BlogPost => {
    return {
      id: post.id.toString(),
      title: post.attributes.Name,
      intro: post.attributes.Intro,
      description: post.attributes.Description,
      issueDate: post.attributes.updatedAt,
      videoUrl: post.attributes.Video_URL,
      imageUrl: post.attributes.Image.data.attributes.url,
      categories: post.attributes.article_categories.data.map((category) => {
        return category.attributes.Name;
      }),
    };
  };

  const getRecentArticles = (
    data: ApiResource<BlogPostApi>[]
  ): BlogPostSmall[] => {
    const max = data.length - 1;
    const articles = [];
    let idx = 0;
    while (articles.length < max) {
      if (data[idx].id != aid) {
        articles.push({
          id: data[idx].id,
          title: data[idx].attributes.Name,
          issueDate: data[idx].attributes.updatedAt,
          imageUrl: data[idx].attributes.Image.data
            ? data[idx].attributes.Image.data.attributes.url
            : null,
        });
      }
      idx += 1;
    }
    return articles;
  };

  const getRecommendedArticles = (
    data: ApiResource<BlogPostApi>[],
    article: ApiResource<BlogPostApi>
  ): BlogPost[] => {
    let recommendedArticles: ApiResource<BlogPostApi>[] = [];
    const articleCategories = article.attributes.article_categories.data.map(
      (category) => {
        return category.attributes.Name;
      }
    );
    function containsCategory(post: ApiResource<BlogPostApi>) {
      if (post.id === aid) return false;

      let hasCategory = false;
      post.attributes.article_categories.data.forEach(
        (category: ApiResource<CategoryApi>) => {
          if (
            articleCategories.indexOf(category.attributes.Name) > -1 &&
            !hasCategory
          ) {
            hasCategory = true;
          }
        }
      );
      return hasCategory;
    }
    recommendedArticles = data.filter(containsCategory);
    // return recommendedArticles;

    if (recommendedArticles.length > 3) {
      // const slicedArticlesArray = sameCategoryArticles.slice(2);
      recommendedArticles = recommendedArticles.slice(0, 3);
    } else if (recommendedArticles.length < 3) {
      const takenIds = recommendedArticles.map((post) => post.id);
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
  };

  const recentArticles = getRecentArticles(data);
  const recommendedArticles = getRecommendedArticles(data, article);

  // get article's comments
  const resComments = await axios.get<ApiResponse<PostCommentApi>>(
    `${process.env.NEXT_PUBLIC_API_URL}/comments?filters[ArticleID][$eq]=${aid}&sort=publishedAt%3Adesc`
  );
  const commentsData = resComments.data.data;
  const AuthorIdsArr: number[] = [];
  const completeComments: PostComment[] = [];
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
    const usersRes = await axios.get<UserApi[]>(
      `${process.env.NEXT_PUBLIC_API_URL}/users?${query}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
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
      prevNextPosts: prevNextArticles,
      recommendedArticles: recommendedArticles,
      articleComments: completeComments,
    },
    revalidate: 3600,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const res = await axios.get<ApiResponse<BlogPostApi>>(
    `${process.env.NEXT_PUBLIC_API_URL}/articles?pagination[pageSize]=100`
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
