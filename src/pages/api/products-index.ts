import algoliasearch from "algoliasearch";
import "dotenv/config";
import axios from "axios";
import { ApiResponse, Product, ProductApi } from "../../types";
import { NextApiRequest, NextApiResponse } from "next";

const client = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY!,
);
const indexProducts = client.initIndex(
  process.env.ALGOLIA_PRODUCTS_INDEX_NAME!,
);

const fetchProductsFromDatabase = async (): Promise<Product[]> => {
  try {
    const products = await axios.get<ApiResponse<ProductApi>>(
      `${process.env.NEXT_PUBLIC_API_URL}/items?populate=%2A`,
    ); // Fetch data from your database
    const cleanProducts: Product[] = products.data.data.map((article) => ({
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
    throw new Error("Products fetching failed", { cause: err });
  }
};

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse,
) {
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
