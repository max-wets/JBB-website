import { GetStaticProps, InferGetStaticPropsType } from "next";
import { itemsList } from "../../data/items";
import ProductsList from "../../components/products/ProductsList";
import ProductsAside from "../../components/products/ProductsAside";
import { useEffect, useState } from "react";
import { Container, Flex, Spinner, useMediaQuery } from "@chakra-ui/react";
import ProductsHeading from "../../components/products/ProductsHeading";
import { Product } from "../../components/products/ProductsList";
import axios from "axios";
import Head from "next/head";

function ProductsPage(props: InferGetStaticPropsType<typeof getStaticProps>) {
  const [loadedProducts, setLoadedProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("Toutes");
  const [filterRange, setFilterRange] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(null);
  const [isLargerThan960] = useMediaQuery("(min-width: 960px)");
  const [isLargerThan500] = useMediaQuery("(min-width: 500px)");

  const sortingFn = (a, b) => {
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
    setLoadedProducts(props.products);
    // console.log("Products page products:", props.products);
    // console.log("Product page active categories:", props.activeCategories);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (selectedCategory !== "Toutes") {
      const productsByCategory = props.products
        .filter((product) => product.categories.includes(selectedCategory))
        .sort(sortingFn);
      setLoadedProducts(productsByCategory);
    } else {
      setLoadedProducts(props.products);
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (filterRange.length > 0) {
      const productsByPrice = props.products
        .filter(
          (product) =>
            product.price >= filterRange[0] && product.price <= filterRange[1]
        )
        .sort(sortingFn);
      // console.log("products by price:", productsByPrice);
      setLoadedProducts(productsByPrice);
    }
  }, [filterRange]);

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
            products={props.products}
            activeCategories={props.activeCategories}
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

export const getStaticProps: GetStaticProps = async () => {
  const res = await axios.get(
    "https://jbbeauty-cms.herokuapp.com/api/items?populate=%2A&pagination[pageSize]=100&sort[0]=createdAt%3Adesc"
  );
  const data = res.data.data;

  const products = data.map((article) => ({
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

  interface Category {
    [category: string]: number;
  }

  const activeCategories = {} as Category;
  products.map((article) =>
    article.categories.map((category) => {
      activeCategories[category]
        ? (activeCategories[category] += 1)
        : (activeCategories[category] = 1);
    })
  );
  return {
    props: {
      products: products,
      activeCategories: activeCategories,
    },
    revalidate: 3600,
  };
};
