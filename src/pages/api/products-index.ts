import algoliasearch from "algoliasearch";
import "dotenv/config";
import axios from "axios";

const client = algoliasearch(
  process.env.ALGOLIA_APP_ID,
  process.env.ALGOLIA_API_KEY
);
const indexProducts = client.initIndex(process.env.ALGOLIA_PRODUCTS_INDEX_NAME);

const fetchProductsFromDatabase = async () => {
  try {
    const products = await axios.get("https://strapi-d6ef.onrender.com/items"); // Fetch data from your database
    const cleanProducts = products.data.map((article) => ({
      id: article.id.toString(),
      name: article.Name,
      intro: article.Intro,
      description: article.Description,
      price: article.Price,
      issueDate: article.published_at,
      imageUrl: article.Image.url,
      categories: article.item_categories.map((category) => {
        return category.Name;
      }),
    }));
    return cleanProducts;
  } catch (err) {
    return err;
  }
};

export default async function handler(req, res) {
  try {
    const productRecords = await fetchProductsFromDatabase();
    const response = indexProducts.saveObjects(productRecords, {
      autoGenerateObjectIDIfNotExist: true,
    });
    res.status(200).json(response);
  } catch (err) {
    res.json({ message: err });
  }
}
