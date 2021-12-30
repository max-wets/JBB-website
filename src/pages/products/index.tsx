import { GetStaticProps, InferGetStaticPropsType } from "next";
import { itemsList } from "../../data/items";
import ProductsList from "../../components/products/ProductsList.tsx/ProductsList";

function ProductsPage(props: InferGetStaticPropsType<typeof getStaticProps>) {
  return <ProductsList />;
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
