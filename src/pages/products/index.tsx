import { GetStaticProps, InferGetStaticPropsType } from "next";
import { itemsList } from "../../data/items";
import ProductsList from "../../components/products/ProductsList";
import ProductsAside from "../../components/products/ProductsAside";
import { useEffect, useState } from "react";
import { Container, Flex, Spinner } from "@chakra-ui/react";
import ProductsHeading from "../../components/products/ProductsHeading";
import { Product } from "../../components/products/ProductsList";
import axios from "axios";

function ProductsPage(props: InferGetStaticPropsType<typeof getStaticProps>) {
  const [loadedProducts, setLoadedProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("Toutes");
  const [filterRange, setFilterRange] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(null);

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
    console.log("Products page products:", props.products);
    console.log("Product page active categories:", props.activeCategories);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (selectedCategory !== "Toutes") {
      const ProductsByCategory = props.products
        .filter((product) => product.item_categories.includes(selectedCategory))
        .sort(sortingFn);
      // console.log(ArticlesByCategory);
      setLoadedProducts(ProductsByCategory);
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
      <ProductsHeading />
      <Container pt="50px" pb="50px" w="1200px" maxW="90%" margin="0 auto">
        <Flex display={loading ? "none" : "flex"}>
          <ProductsList
            products={loadedProducts}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
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
  const res = await axios.get("https://strapi-d6ef.onrender.com/items");
  const data = res.data;

  const products = data.map((article) => ({
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
