import { useRouter } from "next/router";
import { useEffect } from "react";
import { GetStaticProps, GetStaticPaths, InferGetStaticPropsType } from "next";
import BlogArticleDetail from "../../../components/blog/BlogArticleDetail";
import axios from "axios";

function BlogDetailPage(props: InferGetStaticPropsType<typeof getStaticProps>) {
  useEffect(() => {
    console.log("Blog detail page data:", props.article);
  }, []);

  return <h1>Blog Detail Page</h1>;
}

export const getStaticProps: GetStaticProps = async (context) => {
  const aid = context.params.blogArticleId;
  const res = await axios.get(
    `https://jbb-admin.herokuapp.com/api/articles/${aid}?populate=%2A`
  );
  const data = res.data.data;

  //   console.log("blog detail page data:", data);

  return {
    props: {
      article: {
        id: data.id.toString(),
        title: data.attributes.title,
        intro: data.attributes.intro,
        description: data.attributes.description,
        issueDate: data.attributes.publishedAt,
        videoUrl: data.attributes.Video_URL,
        imageUrl: data.attributes.image.data.attributes.url,
        categories: data.attributes.article_categories.data.map((category) => {
          return category.attributes.name;
        }),
      },
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const res = await axios.get("https://jbb-admin.herokuapp.com/api/articles");
  const data = res.data.data;

  const paths = data.map((article) => ({
    params: { blogArticleId: article.id.toString() },
  }));
  //   console.log("static paths:", paths);

  return { paths, fallback: false };
};

export default BlogDetailPage;
