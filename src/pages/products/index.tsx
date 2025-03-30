import { GetStaticProps, GetStaticPropsResult } from "next";
import ProductsList from "../../components/products/ProductsList";
import ProductsAside from "../../components/products/ProductsAside";
import { useEffect, useState } from "react";
import { Container, Flex, Spinner, useMediaQuery } from "@chakra-ui/react";
import ProductsHeading from "../../components/products/ProductsHeading";
import axios from "axios";
import Head from "next/head";
import {
  ActiveCategories,
  ApiResponse,
  Product,
  ProductApi,
} from "../../types";

type ProductsPageProps = {
  products: Product[];
  activeCategories: ActiveCategories;
};

function ProductsPage({ products, activeCategories }: ProductsPageProps) {
  const [loadedProducts, setLoadedProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("Toutes");
  const [filterRange, setFilterRange] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLargerThan960] = useMediaQuery("(min-width: 960px)");
  const [isLargerThan500] = useMediaQuery("(min-width: 500px)");

  const sortingFn = (a: Product, b: Product) => {
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
    setLoadedProducts(products);
    setLoading(false);
  }, [products]);

  useEffect(() => {
    if (selectedCategory !== "Toutes") {
      const productsByCategory = products
        .filter((product) => product.categories.includes(selectedCategory))
        .sort(sortingFn);
      setLoadedProducts(productsByCategory);
    } else {
      setLoadedProducts(products);
    }
  }, [products, selectedCategory]);

  useEffect(() => {
    if (filterRange.length > 0) {
      const productsByPrice = products
        .filter(
          (product) =>
            product.price >= filterRange[0] && product.price <= filterRange[1],
        )
        .sort(sortingFn);
      // console.log("products by price:", productsByPrice);
      setLoadedProducts(productsByPrice);
    }
  }, [filterRange, products]);

  return (
    <>
      <Head>
        <title>Produits - JBBeauty</title>
        <meta
          name="description"
          content="Meta description for the Products page"
        />
      </Head>
      <ProductsHeading />
      <Container pt="50px" pb="50px" w="1200px" maxW="90%" margin="0 auto">
        <Flex
          display={loading ? "none" : "flex"}
          flexDirection={isLargerThan960 ? "row" : "column"}
        >
          <ProductsList
            products={loadedProducts}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            isLargerThan500={isLargerThan500}
          />
          <ProductsAside
            products={products}
            activeCategories={activeCategories}
            setSelectedCategory={setSelectedCategory}
            setFilterRange={setFilterRange}
          />
        </Flex>
        <Flex
          display={loading ? "flex" : "none"}
          h="50vh"
          w="100%"
          justifyContent="center"
          alignItems="center"
        >
          <Spinner />
        </Flex>
      </Container>
    </>
  );
}

export default ProductsPage;

export const getStaticProps: GetStaticProps = async (): Promise<
  GetStaticPropsResult<ProductsPageProps>
> => {
  const res = await axios.get<ApiResponse<ProductApi>>(
    `${process.env.NEXT_PUBLIC_API_URL}/items?populate=%2A&pagination[pageSize]=100&sort[0]=createdAt%3Adesc`,
  );
  const data = res.data.data;

  const products: Product[] = data.map((article) => ({
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

  const activeCategories = {} as ActiveCategories;
  products.forEach((article) =>
    article.categories.forEach((category) => {
      activeCategories[category] = activeCategories[category]
        ? (activeCategories[category] += 1)
        : 1;
    }),
  );
  return {
    props: {
      products: products,
      activeCategories: activeCategories,
    },
    revalidate: 3600,
  };
};
