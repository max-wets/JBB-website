import { useRouter } from "next/router";
import { useEffect } from "react";
import { GetStaticProps, GetStaticPaths, InferGetStaticPropsType } from "next";
import ProductDetail from "../../../components/products/ProductDetail";
import axios from "axios";
import { itemsList } from "../../../data/items";

function ProductDetailPage(
  props: InferGetStaticPropsType<typeof getStaticProps>
) {
  useEffect(() => {
    console.log("product detail:", props.product);
  }, []);
  return <ProductDetail />;
}

export const getStaticProps: GetStaticProps = async (context) => {
  const pid = Number(context.params.productId);

  return {
    props: {
      product: itemsList.filter((item) => item.id === pid)[0],
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = itemsList.map((item) => ({
    params: { productId: item.id.toString() },
  }));

  return { paths, fallback: false };
};

export default ProductDetailPage;
