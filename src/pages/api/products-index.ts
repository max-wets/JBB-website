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
      `${process.env.NEXT_PUBLIC_API_URL}/items?populate=%2A&pagination[pageSize]=100`,
    ); // Fetch data from your database
    const cleanProducts: Product[] = products.data.data.map((article) => ({
      id: article.id.toString(),
      documentId: article.documentId,
      name: article.Name,
      intro: article.Intro,
      description: article.Description,
      price: article.Price,
      issueDate: article.publishedAt,
      imageUrl: article.Image.url,
      categories: article.item_categories.map((category) => {
        return category.Name;
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
