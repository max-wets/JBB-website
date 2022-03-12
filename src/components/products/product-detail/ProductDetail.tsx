import classes from "./ProductDetail.module.css";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { Tooltip } from "@chakra-ui/react";
import ReactMarkdown from "react-markdown";
import { useEffect } from "react";
import remarkGfm from "remark-gfm";

function ProductDetail(props: {
  product;
  prevNextProducts;
  recommendedProducts;
}) {
  // useEffect(() => {
  //   console.log("product:", props.product);
  // });

  function priceFormat(num) {
    let formattedNum;

    if (!num?.toString().includes(".")) {
      formattedNum = num + ",00";
    } else {
      const splitArr = num.toString().split(".");
      Number(splitArr[1]) < 10 ? (splitArr[1] = splitArr[1] + "0") : null;
      formattedNum = splitArr.join(",");
    }
    return formattedNum + "€";
  }

  function RelatedProduct({ idx, product }) {
    return (
      <li key={idx} className={classes.listentry}>
        <div className={classes.productinner}>
          <div className={classes.thumbnail}>
            <Link href={`/products/${product.id}`}>
              <a>
                <Image
                  src={product.attributes.Image.data.attributes.url}
                  alt={product.attributes.Name}
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
              <Link href={`/products/${product.id}`}>
                <a>{product.attributes.Name}</a>
              </Link>
            </h2>
          </div>
          {product.attributes.Price && (
            <div className={classes.pricewrap}>
              <span style={{ fontSize: "18px" }} className={classes.price}>
                {priceFormat(product.attributes.Price)}
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
            <li>
              <Link href={`/products/${props.prevNextProducts[0].id}`}>
                <a>
                  <Tooltip label={props.prevNextProducts[0].title}>
                    <ChevronLeftIcon w={5} h={5} />
                  </Tooltip>
                </a>
              </Link>
            </li>
          ) : null}
          {props.prevNextProducts[1] ? (
            <li>
              <Link href={`/products/${props.prevNextProducts[1].id}`}>
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
            src={props.product.ImageUrl}
            alt={props.product.Name}
            width={370}
            height={370}
            objectFit="cover"
          />
        </div>
        <div className={classes.summary}>
          <h2>{props.product.Name.toLowerCase()}</h2>
          {props.product.Price && (
            <p className={classes.price}>{priceFormat(props.product.Price)}</p>
          )}
          <div className={classes.intro}>
            <div>
              <ReactMarkdown>{props.product.Intro}</ReactMarkdown>
            </div>
          </div>
          <div className={classes.categories}>
            <div>
              <span>Categories: </span>
              {props.product.item_categories.map((category, idx) => (
                <>
                  {category}
                  <span style={{ fontSize: "16px" }}>
                    {idx < props.product.item_categories.length - 1
                      ? ", "
                      : null}
                  </span>
                </>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className={classes.description}>
        <p>
          <h2>Description</h2>
          <ReactMarkdown
            className={classes.descriptioncontent}
            remarkPlugins={[remarkGfm]}
          >
            {props.product.Description}
          </ReactMarkdown>
        </p>
      </div>
      <section className={classes.relatedproducts}>
        <h2>Produits associés</h2>
        <ul className={classes.productslist}>
          {props.recommendedProducts.map((product, idx) => (
            <RelatedProduct idx={idx} product={product} />
          ))}
        </ul>
      </section>
    </article>
  );
}

export default ProductDetail;
