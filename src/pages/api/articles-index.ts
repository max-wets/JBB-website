import algoliasearch from "algoliasearch";
import "dotenv/config";
import axios from "axios";

const client = algoliasearch(
  process.env.ALGOLIA_APP_ID,
  process.env.ALGOLIA_API_KEY
);
const indexArticles = client.initIndex(process.env.ALGOLIA_ARTICLES_INDEX_NAME);

const fetchArticlesFromDatabase = async () => {
  try {
    const articles = await axios.get(
      "https://strapi-d6ef.onrender.com/articles"
    ); // Fetch data from your database
    const cleanArticles = articles.data.map((article) => ({
      id: article.id.toString(),
      title: article.Name,
      intro: article.Intro,
      description: article.Description,
      issueDate: article.published_at,
      videoUrl: article.Video_URL,
      imageUrl: article.Image.url,
      categories: article.article_categories.map((category) => {
        return category.Name;
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
