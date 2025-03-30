import { GetStaticProps, GetStaticPaths, GetStaticPropsResult } from "next";
import ProductDetail from "../../../components/products/product-detail/ProductDetail";
import ProductDetailHeading from "../../../components/products/product-detail/ProductDetailHeading";
import ProductDetailAside from "../../../components/products/product-detail/ProductDetailAside";
import axios from "axios";
import { Container, Flex } from "@chakra-ui/react";
import { useMediaQuery } from "@chakra-ui/react";
import Head from "next/head";
import {
  ApiResponse,
  BlogPost,
  BlogPostApi,
  PrevNextProduct,
  Product,
  ProductApi,
} from "../../../types";

type ProductDetailPageProps = {
  product: Product;
  prevNextProducts: (PrevNextProduct | null)[];
  recommendedProducts: ProductApi[];
  relatedArticles: BlogPost[];
};

function ProductDetailPage({
  product,
  prevNextProducts,
  recommendedProducts,
  relatedArticles,
}: ProductDetailPageProps) {
  const [isLargerThan950] = useMediaQuery("(min-width: 950px)");

  return (
    <>
      <Head>
        <title>{product.name} - JBBeauty</title>
        <meta
          name="description"
          content="Meta description for the Product detail page"
        />
      </Head>
      <ProductDetailHeading name={product.name} />
      <Container pt="50px" pb="50px" w="1200px" maxW="90%" margin="0 auto">
        <Flex>
          {isLargerThan950 ? (
            <ProductDetailAside relatedArticles={relatedArticles} />
          ) : null}
          <ProductDetail
            product={product}
            prevNextProducts={prevNextProducts}
            recommendedProducts={recommendedProducts}
          />
        </Flex>
      </Container>
    </>
  );
}

export const getStaticProps: GetStaticProps = async (
  context
): Promise<GetStaticPropsResult<ProductDetailPageProps>> => {
  const productDocumentId = context.params!.productId;

  if (!productDocumentId) throw new Error("Product ID missing");

  const res = await axios.get<ApiResponse<ProductApi>>(
    `${process.env.NEXT_PUBLIC_API_URL}/items?populate=%2A&pagination[pageSize]=100`
  );
  const data = res.data.data;

  const rawProduct = data.filter(
    (item) => item.documentId === productDocumentId
  )[0];
  const productIdx = data.findIndex(
    (item) => item.documentId === productDocumentId
  );
  const product: Product = {
    id: rawProduct.id.toString(),
    documentId: rawProduct.documentId,
    name: rawProduct.Name,
    intro: rawProduct.Intro,
    price: rawProduct.Price,
    description: rawProduct.Description,
    issueDate: rawProduct.publishedAt,
    imageUrl: rawProduct.Image.url,
    categories: rawProduct.item_categories.map((category) => {
      return category.Name;
    }),
  };

  const previousProduct =
    productIdx > 0
      ? data.find((item) => data.indexOf(item) === productIdx - 1)
      : null;
  const nextProduct =
    productIdx < data.length
      ? data.find((item) => data.indexOf(item) === productIdx + 1)
      : null;

  const prevNextProducts: (PrevNextProduct | null)[] = [
    previousProduct
      ? {
          id: previousProduct.id,
          documentId: previousProduct.documentId,
          title: previousProduct.Name,
          imageUrl: previousProduct.Image.url,
        }
      : null,
    nextProduct
      ? {
          id: nextProduct.id,
          documentId: nextProduct.documentId,
          title: nextProduct.Name,
          imageUrl: nextProduct.Image.url,
        }
      : null,
  ];

  const getRecommendedProducts = (
    data: ProductApi[],
    product: Product
  ): ProductApi[] => {
    let recommendedProducts: ProductApi[] = [];
    // console.log("product:", product);

    if (product.categories?.length > 0) {
      const productCategories = product.categories;

      function containsCategory(productApi: ProductApi) {
        if (productApi.documentId === productDocumentId) return false;

        let hasCategory = false;
        productApi.item_categories.forEach((category) => {
          // console.log(category.attributes.Name);
          if (productCategories.indexOf(category.Name) > -1 && !hasCategory) {
            hasCategory = true;
          }
        });
        return hasCategory;
      }
      recommendedProducts = data.filter(containsCategory);
      // console.log(recommendedProducts);
      // return recommendedProducts;
    }

    if (recommendedProducts.length > 3) {
      recommendedProducts = recommendedProducts.slice(0, 3);
    } else if (recommendedProducts.length < 3) {
      const takenIds: number[] = recommendedProducts.map(
        (productApi) => productApi.id
      );
      const availableProducts = data.filter(
        (product) =>
          product.documentId !== productDocumentId &&
          takenIds.indexOf(product.id) < 0
      );

      let i = 0;
      while (recommendedProducts.length < 3) {
        recommendedProducts.push(availableProducts[i]);
        i++;
      }
    }

    return recommendedProducts;
  };

  const getRelatedPosts = async (product: Product): Promise<BlogPost[]> => {
    let relatedPosts: BlogPost[] = [];

    try {
      const sortParam = "sort[0]=publishedAt%3Adesc";
      const res = await axios.get<ApiResponse<BlogPostApi>>(
        `${process.env.NEXT_PUBLIC_API_URL}/articles?populate=%2A&${sortParam}&pagination[pageSize]=100`
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const dataPosts: Array<any> = res.data.data;

      // console.log("data:", dataPosts);

      const productCategories = product.categories;

      function containsCategory(post: BlogPostApi) {
        let hasCategory = false;
        post.article_categories.forEach((category) => {
          if (productCategories.indexOf(category.Name) > -1 && !hasCategory) {
            hasCategory = true;
          }
        });
        return hasCategory;
      }

      function formatData(post: BlogPostApi): BlogPost {
        return {
          id: post.id.toString(),
          documentId: post.documentId,
          title: post.Name,
          intro: post.Intro,
          description: post.Description,
          issueDate: post.publishedAt,
          videoUrl: post.Video_URL,
          imageUrl: post.Image.url,
          categories: post.article_categories.map((category) => {
            return category.Name;
          }),
        };
      }

      relatedPosts = dataPosts.filter(containsCategory).map(formatData);
      // console.log(relatedPosts);

      if (relatedPosts.length > 3) {
        relatedPosts = relatedPosts.slice(0, 3);
      } else {
        const takenIds: number[] = relatedPosts.map((post) => Number(post.id));
        const availablePosts = dataPosts.filter(
          (post) => takenIds.indexOf(post.id) < 0
        );

        let i = 0;
        while (relatedPosts.length < 3) {
          relatedPosts.push(formatData(availablePosts[i]));
          i++;
        }
      }
      // console.log(relatedPosts);
      return relatedPosts;
    } catch (err) {
      console.error(err);
      throw new Error("Blog posts fetching failed!");
    }
  };

  const recommendedProducts: ProductApi[] = getRecommendedProducts(
    data,
    product
  );
  const relatedArticles: BlogPost[] = await getRelatedPosts(product);

  return {
    props: {
      product,
      prevNextProducts,
      recommendedProducts,
      relatedArticles,
    },
    revalidate: 3600,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const res = await axios.get<ApiResponse<ProductApi>>(
    `${process.env.NEXT_PUBLIC_API_URL}/items?pagination[pageSize]=100`
  );
  const data = res.data.data;

  const paths = data.map((item) => ({
    params: { productId: item.documentId },
  }));

  return { paths, fallback: true };
};

export default ProductDetailPage;
