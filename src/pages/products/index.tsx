import { GetStaticProps, InferGetStaticPropsType } from "next";
import { itemsList } from "../../data/items";
import ProductsList from "../../components/products/ProductsList.tsx/ProductsList";
import { useEffect } from "react";

function ProductsPage(props: InferGetStaticPropsType<typeof getStaticProps>) {
  useEffect(() => {
    console.log("Products page:", props.products);
  }, []);

  return <ProductsList products={props.products} />;
}

export default ProductsPage;

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      products: itemsList,
    },
    revalidate: 3600,
  };
};
