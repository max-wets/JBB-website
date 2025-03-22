import classes from './ProductDetail.module.css';
import Link from 'next/link';
import Image from 'next/image';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ExternalLinkIcon,
} from '@chakra-ui/icons';
import { Tooltip, Button } from '@chakra-ui/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  ApiResource,
  PrevNextProduct,
  Product,
  ProductApi,
} from '../../../types';

type ProductDetailProps = {
  product: Product;
  prevNextProducts: (PrevNextProduct | null)[];
  recommendedProducts: ApiResource<ProductApi>[];
};

type RelatedProductProps = {
  productApi: ApiResource<ProductApi>;
};

export default function ProductDetail(props: ProductDetailProps) {
  // useEffect(() => {
  //   console.log("product: ", props.product);
  // }, []);

  function getManufacturerLink(itemDescription: string): string {
    // /https?\:\/\/\w+\.[\w+-]+\.\w+(\/[\w+-]*)*/gm;
    const regex = new RegExp(
      'https?\\:\\/\\/\\w+\\.[\\w+-]+\\.\\w+(\\/[\\w+-]*)*',
      'gm'
    );
    const regexMatch = itemDescription.match(regex);
    const urlLink = regexMatch ? regexMatch[0] : '#';
    return urlLink;
  }

  function priceFormat(num: number) {
    let formattedNum;

    if (!num?.toString().includes('.')) {
      formattedNum = num + ',00';
    } else {
      const splitArr = num.toString().split('.');
      splitArr[1] = Number(splitArr[1]) < 10 ? splitArr[1] + '0' : splitArr[1];
      formattedNum = splitArr.join(',');
    }
    return formattedNum + '€';
  }

  function RelatedProduct({ productApi }: RelatedProductProps) {
    return (
      <li key={productApi.id} className={classes.listentry}>
        <div className={classes.productinner}>
          <div className={classes.thumbnail}>
            <Link legacyBehavior href={`/products/${productApi.id}`}>
              <a>
                <Image
                  src={productApi.attributes.Image.data.attributes.url}
                  alt={productApi.attributes.Name}
                  height={294}
                  width={235}
                  objectFit="contain"
                />
                <span className={classes.overlay}></span>
              </a>
            </Link>
          </div>
          <div className={classes.productname}>
            <h2>
              <Link legacyBehavior href={`/products/${productApi.id}`}>
                <a>{productApi.attributes.Name}</a>
              </Link>
            </h2>
          </div>
          {productApi.attributes.Price && (
            <div className={classes.pricewrap}>
              <span style={{ fontSize: '18px' }} className={classes.price}>
                {priceFormat(productApi.attributes.Price)}
              </span>
            </div>
          )}
        </div>
      </li>
    );
  }

  return (
    <article className={classes.entrycontent}>
      <div className={classes.prevnextctr}>
        <ul>
          {props.prevNextProducts[0] ? (
            <li key={props.prevNextProducts[0].id}>
              <Link
                legacyBehavior
                href={`/products/${props.prevNextProducts[0].id}`}
              >
                <a>
                  <Tooltip label={props.prevNextProducts[0].title}>
                    <ChevronLeftIcon w={5} h={5} />
                  </Tooltip>
                </a>
              </Link>
            </li>
          ) : null}
          {props.prevNextProducts[1] ? (
            <li key={props.prevNextProducts[1].id}>
              <Link
                legacyBehavior
                href={`/products/${props.prevNextProducts[1].id}`}
              >
                <a>
                  <Tooltip label={props.prevNextProducts[1].title}>
                    <ChevronRightIcon w={5} h={5} />
                  </Tooltip>
                </a>
              </Link>
            </li>
          ) : null}
        </ul>
      </div>
      <div className={classes.prodctr}>
        <div className={classes.productimg}>
          <Image
            src={props.product.imageUrl}
            alt={props.product.name}
            width={370}
            height={370}
            objectFit="cover"
          />
        </div>
        <div className={classes.summary}>
          <h2>{props.product.name.toLowerCase()}</h2>
          {props.product.price && (
            <p className={classes.price}>{priceFormat(props.product.price)}</p>
          )}
          <div className={classes.intro}>
            <ReactMarkdown>{props.product.intro}</ReactMarkdown>
          </div>
          <div className={classes.categories}>
            <div>
              <span>Categories: </span>
              {props.product.categories.map((category, idx) => (
                <span key={category}>
                  {category}
                  <span style={{ fontSize: '16px' }}>
                    {idx < props.product.categories.length - 1 ? ', ' : null}
                  </span>
                </span>
              ))}
            </div>
          </div>
          <div className={classes.itemlink}>
            <Link
              legacyBehavior
              href={getManufacturerLink(props.product.description)}
            >
              <a target="_blank">
                <Button size="sm" colorScheme="red">
                  <ExternalLinkIcon mr="4px" />
                  ACHETER
                </Button>
              </a>
            </Link>
          </div>
        </div>
      </div>
      <div className={classes.description}>
        <div>
          <h2>Description</h2>
          <ReactMarkdown
            className={classes.descriptioncontent}
            remarkPlugins={[remarkGfm]}
          >
            {props.product.description}
          </ReactMarkdown>
        </div>
      </div>
      <section className={classes.relatedproducts}>
        <h2>Produits associés</h2>
        <ul className={classes.productslist}>
          {props.recommendedProducts.map((productApi) => (
            <RelatedProduct key={productApi.id} productApi={productApi} />
          ))}
        </ul>
      </section>
    </article>
  );
}
