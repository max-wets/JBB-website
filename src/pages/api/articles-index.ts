import algoliasearch from 'algoliasearch';
import 'dotenv/config';
import axios from 'axios';
import { ApiResponse, BlogPost, BlogPostApi } from '@/domain/types';
import { NextApiRequest, NextApiResponse } from 'next';

const client = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY!
);
const indexArticles = client.initIndex(
  process.env.ALGOLIA_ARTICLES_INDEX_NAME!
);

const fetchArticlesFromDatabase = async (): Promise<BlogPost[]> => {
  try {
    const articles = await axios.get<ApiResponse<BlogPostApi>>(
      `${process.env.NEXT_PUBLIC_API_URL}/articles?populate=%2A&pagination[pageSize]=100`
    ); // Fetch data from your database
    const cleanArticles: BlogPost[] = articles.data.data.map((article) => ({
      id: article.id.toString(),
      title: article.attributes.Name,
      intro: article.attributes.Intro,
      description: article.attributes.Description,
      issueDate: article.attributes.publishedAt,
      videoUrl: article.attributes.Video_URL,
      imageUrl: article.attributes.Image.data.attributes.url,
      categories: article.attributes.article_categories.data.map((category) => {
        return category.attributes.Name;
      }),
    }));
    return cleanArticles;
  } catch (err) {
    throw new Error('Blog posts fetching failed', { cause: err });
  }
};

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const articleRecords = await fetchArticlesFromDatabase();

    const response = indexArticles.saveObjects(articleRecords, {
      autoGenerateObjectIDIfNotExist: true,
    });
    // res.json(articleRecords);
    res.json(response);
  } catch (err) {
    res.json({ message: err });
  }
}
