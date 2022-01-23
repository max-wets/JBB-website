import { useRouter } from "next/router";
import { useEffect } from "react";
import { GetStaticProps, GetStaticPaths, InferGetStaticPropsType } from "next";
import ProductDetail from "../../../components/products/product-detail/ProductDetail";
import ProductDetailHeading from "../../../components/products/product-detail/ProductDetailHeading";
import ProductDetailAside from "../../../components/products/product-detail/ProductDetailAside";
import axios from "axios";
import { itemsList } from "../../../data/items";
import { Container, Flex, Spinner } from "@chakra-ui/react";

function ProductDetailPage(
  props: InferGetStaticPropsType<typeof getStaticProps>
) {
  useEffect(() => {
    console.log("product detail:", props.product);
    console.log("prev next products:", props.prevNextProducts);
    console.log("recommended products:", props.recommendedProducts);
    console.log("related articles:", props.relatedArticles);
  }, []);
  return (
    <>
      <ProductDetailHeading name={props.product.Name} />
      <Container pt="50px" pb="50px" w="1200px" maxW="90%" margin="0 auto">
        <Flex>
          <ProductDetailAside relatedArticles={props.relatedArticles} />
          <ProductDetail />
        </Flex>
      </Container>
    </>
  );
}

export const getStaticProps: GetStaticProps = async (context) => {
  const pid = Number(context.params.productId);

  const res = await axios.get(`https://strapi-d6ef.onrender.com/items`);
  const data = res.data;

  const product = data.filter((item) => item.id === pid)[0];

  const previousProduct =
    pid > 0 ? data.find((item) => item.id === pid - 1) : null;
  const nextProduct =
    pid < data.length ? data.find((item) => item.id === pid + 1) : null;

  const prevNextProducts = [
    previousProduct
      ? {
          id: previousProduct.id,
          title: previousProduct.Name,
          imageUrl: previousProduct.Image.url,
        }
      : null,
    nextProduct
      ? {
          id: nextProduct.id,
          title: nextProduct.Name,
          imageUrl: nextProduct.Image.url,
        }
      : null,
  ];

  function getRecommendedProducts(data, product) {
    let recommendedProducts = [];
    // console.log("product:", product);
    const productCategories = product.item_categories.map((category) => {
      return category.Name;
    });
    function containsCategory(item) {
      if (item.id === pid) return false;

      let hasCategory = false;
      item.item_categories.forEach((category) => {
        if (productCategories.indexOf(category.Name) > -1) {
          !hasCategory ? (hasCategory = true) : null;
        }
      });
      return hasCategory;
    }
    recommendedProducts = data.filter(containsCategory);
    // return recommendedProducts;

    if (recommendedProducts.length > 3) {
      // const slicedArticlesArray = sameCategoryArticles.slice(2);
      recommendedProducts = recommendedProducts.slice(2);
    } else if (recommendedProducts.length < 3) {
      const takenIds = recommendedProducts.reduce((prev, curr) => {
        return [...prev, curr.id];
      }, []);
      const availableProducts = data.filter(
        (product) => product.id !== pid && takenIds.indexOf(product.id) < 0
      );
      let i = 0;
      while (i < 3 - recommendedProducts.length) {
        recommendedProducts.push(availableProducts[i]);
        i++;
      }
    }
    return recommendedProducts;
  }

  async function getRelatedPosts(product) {
    let relatedPosts = [];

    try {
      const res = await axios.get("https://strapi-d6ef.onrender.com/articles");
      const data = res.data;

      // console.log("data:", data);

      const productCategories = product.item_categories.map((category) => {
        return category.Name;
      });

      function containsCategory(post) {
        let hasCategory = false;
        post.article_categories.forEach((category) => {
          if (productCategories.indexOf(category.Name) > -1) {
            !hasCategory ? (hasCategory = true) : null;
          }
        });
        return hasCategory;
      }

      function formatData(post) {
        return {
          id: post.id.toString(),
          title: post.Name,
          intro: post.Intro,
          description: post.Description,
          issueDate: post.published_at,
          videoUrl: post.Video_URL,
          imageUrl: post.Image.url,
          categories: post.article_categories.map((category) => {
            return category.Name;
          }),
        };
      }

      relatedPosts = data.filter(containsCategory).map(formatData);

      return relatedPosts;
    } catch (err) {
      console.error(err);
    }
  }

  const recommendedProducts = getRecommendedProducts(data, product);
  const relatedArticles = await getRelatedPosts(product);

  console.log("posts:", relatedArticles);

  return {
    props: {
      product: product,
      prevNextProducts: prevNextProducts,
      recommendedProducts: recommendedProducts,
      relatedArticles: relatedArticles,
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
