import { GetStaticProps, InferGetStaticPropsType } from "next";
import { itemsList } from "../../data/items";
import ProductsList from "../../components/products/ProductsList";
import ProductsAside from "../../components/products/ProductsAside";
import { useEffect, useState } from "react";
import { Container } from "@chakra-ui/react";
import ProductsHeading from "../../components/products/ProductsHeading";
import { Product } from "../../components/products/ProductsList";

function ProductsPage(props: InferGetStaticPropsType<typeof getStaticProps>) {
  const [loadedProducts, setLoadedProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("Toutes");

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
  }, []);

  useEffect(() => {
    if (selectedCategory !== "Toutes") {
      const ProductsByCategory = props.products
        .filter((product) => product.categories.includes(selectedCategory))
        .sort(sortingFn);
      // console.log(ArticlesByCategory);
      setLoadedProducts(ProductsByCategory);
    } else {
      setLoadedProducts(props.products);
    }
  }, [selectedCategory]);

  return (
    <>
      <ProductsHeading />
      <Container pt="50px" pb="50px" w="1200px" maxW="90%" margin="0 auto">
        <ProductsList products={loadedProducts} />
        <ProductsAside
          products={props.products}
          activeCategories={props.activeCategories}
          setSelectedCategory={setSelectedCategory}
        />
      </Container>
    </>
  );
}

export default ProductsPage;

export const getStaticProps: GetStaticProps = async () => {
  interface Category {
    [category: string]: number;
  }

  const activeCategories = {} as Category;
  itemsList.map((article) =>
    article.item_categories.map((category) => {
      activeCategories[category]
        ? (activeCategories[category] += 1)
        : (activeCategories[category] = 1);
    })
  );
  return {
    props: {
      products: itemsList,
      activeCategories: activeCategories,
    },
    revalidate: 3600,
  };
};
