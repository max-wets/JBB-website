import BlogHeading from '@/application/components/blog/BlogHeading';
import BlogArticlesList from '@/application/components/blog/BlogArticlesList';
import BlogAside from '@/application/components/blog/BlogAside';
import { GetStaticProps, GetStaticPropsResult } from 'next';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Container, Flex, Spinner, useMediaQuery } from '@chakra-ui/react';
import Head from 'next/head';
import {
  ActiveCategories,
  ApiResponse,
  BlogPost,
  BlogPostApi,
} from '@/domain/types';

type BlogPageProps = {
  articles: BlogPost[];
  activeCategories: ActiveCategories;
};

function BlogPage({ articles, activeCategories }: BlogPageProps) {
  const [loadedArticles, setLoadedArticles] = useState<BlogPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('Toutes');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLargerThan960] = useMediaQuery('(min-width: 960px)');
  const [isLargerThan600] = useMediaQuery('(min-width: 600px)');

  const sortingFn = (a: BlogPost, b: BlogPost) => {
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
    setLoadedArticles(articles.sort(sortingFn));
    // console.log("loaded articles:", loadedArticles);
    // console.log("categories: ", props.activeCategories);
  }, [articles]);

  useEffect(() => {
    if (selectedCategory !== 'Toutes') {
      const ArticlesByCategory = articles
        .filter((article) => article.categories.includes(selectedCategory))
        .sort(sortingFn);
      // console.log(ArticlesByCategory);
      setLoadedArticles(ArticlesByCategory);
    } else {
      setLoadedArticles(articles);
    }
  }, [articles, selectedCategory]);

  return (
    <>
      <Head>
        <title>Blog - JBBeauty</title>
        <meta name="description" content="Meta description for the Blog page" />
      </Head>
      <BlogHeading />
      <Container
        pt={isLargerThan600 ? '50px' : '20px'}
        pb={isLargerThan600 ? '50px' : '20px'}
        w="1200px"
        maxW={isLargerThan600 ? '90%' : '100%'}
        margin={isLargerThan600 ? '0 auto' : 'none'}
      >
        <>
          <Flex
            display={currentPage === null ? 'none' : 'flex'}
            flexDirection={isLargerThan960 ? 'row' : 'column'}
          >
            <BlogArticlesList
              articles={loadedArticles}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
            <BlogAside
              articles={articles}
              activeCategories={activeCategories}
              setSelectedCategory={setSelectedCategory}
            />
          </Flex>
          <Flex
            display={currentPage !== null ? 'none' : 'flex'}
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

export const getStaticProps: GetStaticProps = async (): Promise<
  GetStaticPropsResult<BlogPageProps>
> => {
  // const res = await axios.get(
  //   "https://jbb-admin.herokuapp.com/api/articles?populate=%2A"
  // );
  // const data = res.data.data;

  const res = await axios.get<ApiResponse<BlogPostApi>>(
    `${process.env.NEXT_PUBLIC_API_URL}/articles?populate=%2A&pagination[pageSize]=100&sort[0]=createdAt%3Adesc`
  );
  const data = res.data.data;

  const activeCategories = {} as ActiveCategories;
  data.map((article) =>
    article.attributes.article_categories.data.map((category) => {
      const categoryName = category.attributes.Name;
      activeCategories[categoryName] = activeCategories[categoryName]
        ? activeCategories[categoryName] + 1
        : 1;
    })
  );
  // console.log("active categories to send:", JSON.stringify(activeCategories));

  const articles: BlogPost[] = data.map((article) => ({
    id: article.id.toString(),
    title: article.attributes.Name,
    intro: article.attributes.Intro,
    description: article.attributes.Description,
    issueDate: article.attributes.updatedAt,
    videoUrl: article.attributes.Video_URL,
    imageUrl: article.attributes.Image.data
      ? article.attributes.Image.data.attributes.url
      : null,
    categories: article.attributes.article_categories.data.map((category) => {
      return category.attributes.Name;
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
