import algoliasearch from "algoliasearch";
import "dotenv/config";
import axios from "axios";

const client = algoliasearch(
  process.env.ALGOLIA_APP_ID,
  process.env.ALGOLIA_API_KEY,
);
const indexArticles = client.initIndex(process.env.ALGOLIA_ARTICLES_INDEX_NAME);

const fetchArticlesFromDatabase = async () => {
  try {
    const articles = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/articles?populate=%2A&pagination[pageSize]=100`,
    ); // Fetch data from your database
    const cleanArticles = articles.data.data.map((article) => ({
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
    return err;
  }
};

export default async function handler(req, res) {
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
