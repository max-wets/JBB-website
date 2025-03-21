import { GetStaticProps, GetStaticPaths, InferGetStaticPropsType } from 'next';
import ProductDetail from '../../../components/products/product-detail/ProductDetail';
import ProductDetailHeading from '../../../components/products/product-detail/ProductDetailHeading';
import ProductDetailAside from '../../../components/products/product-detail/ProductDetailAside';
import axios from 'axios';
import { Container, Flex } from '@chakra-ui/react';
import { useMediaQuery } from '@chakra-ui/react';
import Head from 'next/head';

function ProductDetailPage(
  props: InferGetStaticPropsType<typeof getStaticProps>
) {
  const [isLargerThan950] = useMediaQuery('(min-width: 950px)');

  // useEffect(() => {
  //   console.log("product detail:", props.product);
  //   console.log("prev next products:", props.prevNextProducts);
  //   console.log("recommended products:", props.recommendedProducts);
  //   console.log("related articles:", props.relatedArticles);
  // }, []);

  return (
    <>
      <Head>
        <title>{props.product.Name} - JBBeauty</title>
        <meta
          name="description"
          content="Meta description for the Product detail page"
        />
      </Head>
      <ProductDetailHeading Name={props.product.Name} />
      <Container pt="50px" pb="50px" w="1200px" maxW="90%" margin="0 auto">
        <Flex>
          {isLargerThan950 ? (
            <ProductDetailAside relatedArticles={props.relatedArticles} />
          ) : null}
          <ProductDetail
            product={props.product}
            prevNextProducts={props.prevNextProducts}
            recommendedProducts={props.recommendedProducts}
          />
        </Flex>
      </Container>
    </>
  );
}

export const getStaticProps: GetStaticProps = async (context) => {
  const pid = Number(context.params.productId);

  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/items?populate=%2A&pagination[pageSize]=100`
  );
  const data = res.data.data;

  const rawProduct = data.filter((item) => item.id === pid)[0];
  const productIdx = data.findIndex((item) => item.id === pid);
  const product = {
    id: rawProduct.id,
    Name: rawProduct.attributes.Name,
    Intro: rawProduct.attributes.Intro,
    Price: rawProduct.attributes.Price,
    Description: rawProduct.attributes.Description,
    issueDate: rawProduct.attributes.publishedAt,
    ImageUrl: rawProduct.attributes.Image.data.attributes.url,
    item_categories: rawProduct.attributes.item_categories.data.map(
      (category) => {
        return category.attributes.Name;
      }
    ),
  };

  const previousProduct =
    productIdx > 0
      ? data.find((item) => data.indexOf(item) === productIdx - 1)
      : null;
  const nextProduct =
    productIdx < data.length
      ? data.find((item) => data.indexOf(item) === productIdx + 1)
      : null;

  const prevNextProducts = [
    previousProduct
      ? {
          id: previousProduct.id,
          title: previousProduct.attributes.Name,
          imageUrl: previousProduct.attributes.Image.data.attributes.url,
        }
      : null,
    nextProduct
      ? {
          id: nextProduct.id,
          title: nextProduct.attributes.Name,
          imageUrl: nextProduct.attributes.Image.data.attributes.url,
        }
      : null,
  ];

  function getRecommendedProducts(data, product) {
    let recommendedProducts = [];
    // console.log("product:", product);

    if (product.item_categories?.length > 0) {
      const productCategories = product.item_categories;

      function containsCategory(item) {
        if (item.id === pid) return false;

        let hasCategory = false;
        item.attributes.item_categories.data.forEach((category) => {
          // console.log(category.attributes.Name);
          if (
            productCategories.indexOf(category.attributes.Name) > -1 &&
            !hasCategory
          ) {
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
      const takenIds = recommendedProducts.reduce((prev, curr) => {
        return [...prev, curr.id];
      }, []);
      const availableProducts = data.filter(
        (product) => product.id !== pid && takenIds.indexOf(product.id) < 0
      );

      let i = 0;
      while (recommendedProducts.length < 3) {
        recommendedProducts.push(availableProducts[i]);
        i++;
      }
    }

    return recommendedProducts;
  }

  async function getRelatedPosts(product) {
    let relatedPosts = [];

    try {
      const sortParam = 'sort[0]=publishedAt%3Adesc';
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/articles?populate=%2A&${sortParam}&pagination[pageSize]=100`
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const dataPosts: Array<any> = res.data.data;

      // console.log("data:", dataPosts);

      const productCategories = product.item_categories;

      function containsCategory(post) {
        let hasCategory = false;
        post.attributes.article_categories.data.forEach((category) => {
          if (
            productCategories.indexOf(category.attributes.Name) > -1 &&
            !hasCategory
          ) {
            hasCategory = true;
          }
        });
        return hasCategory;
      }

      function formatData(post) {
        return {
          id: post.id.toString(),
          title: post.attributes.Name,
          intro: post.attributes.Intro,
          description: post.attributes.Description,
          issueDate: post.attributes.publishedAt,
          videoUrl: post.attributes.Video_URL,
          imageUrl: post.attributes.Image.data.attributes.url,
          categories: post.attributes.article_categories.data.map(
            (category) => {
              return category.attributes.Name;
            }
          ),
        };
      }

      relatedPosts = dataPosts.filter(containsCategory).map(formatData);
      // console.log(relatedPosts);

      if (relatedPosts.length > 3) {
        relatedPosts = relatedPosts.slice(0, 3);
      } else {
        const takenIds = relatedPosts.reduce((prev, curr) => {
          return [...prev, curr.id];
        }, []);
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
    }
  }

  const recommendedProducts = getRecommendedProducts(data, product);
  const relatedArticles = await getRelatedPosts(product);

  // console.log("posts:", relatedArticles);
  // console.log("product:", product);
  // console.log("prev next products:", prevNextProducts);
  // console.log("recommended products:", recommendedProducts);

  return {
    props: {
      product: product,
      prevNextProducts: prevNextProducts,
      recommendedProducts: recommendedProducts,
      relatedArticles: relatedArticles ? relatedArticles : [],
    },
    revalidate: 3600,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/items?pagination[pageSize]=100`
  );
  const data = res.data.data;

  const paths = data.map((item) => ({
    params: { productId: item.id.toString() },
  }));

  return { paths, fallback: false };
};

export default ProductDetailPage;
