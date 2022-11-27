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
    const products = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/items?populate=%2A`
    ); // Fetch data from your database
    const cleanProducts = products.data.map((article) => ({
      id: article.id.toString(),
      name: article.attributes.Name,
      intro: article.attributes.Intro,
      description: article.attributes.Description,
      price: article.attributes.Price,
      issueDate: article.attributes.publishedAt,
      imageUrl: article.attributes.Image.data.attributes.url,
      categories: article.attributes.item_categories.data.map((category) => {
        return category.attributes.Name;
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
