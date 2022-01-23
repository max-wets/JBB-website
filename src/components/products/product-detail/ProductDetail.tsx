import classes from "./ProductDetail.module.css";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { Tooltip } from "@chakra-ui/react";
import ReactMarkdown from "react-markdown";

function ProductDetail(props: {
  product;
  prevNextProducts;
  recommendedProducts;
}) {
  function priceFormat(num) {
    let formattedNum;

    if (!num.toString().includes(".")) {
      formattedNum = num + ",00";
    } else {
      const splitArr = num.toString().split(".");
      Number(splitArr[1]) < 10 ? (splitArr[1] = splitArr[1] + "0") : null;
      formattedNum = splitArr.join(",");
    }
    return formattedNum + "€";
  }

  function RelatedProduct({ product }) {
    return (
      <li className={classes.listentry}>
        <div className={classes.productinner}>
          <div className={classes.thumbnail}>
            <Link href={`/products/${product.id}`}>
              <a>
                <Image
                  src={product.Image.url}
                  alt={product.Name}
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
                <a>{product.Name}</a>
              </Link>
            </h2>
          </div>
          <div className={classes.pricewrap}>
            <span style={{ fontSize: "18px" }} className={classes.price}>
              {priceFormat(product.Price)}
            </span>
          </div>
        </div>
      </li>
    );
  }

  return (
    <article className={classes.entrycontent}>
      <div className={classes.prevnextctr}>
        <ul>
          <li>
            <Link href={`/blog/${props.prevNextProducts[0].id}`}>
              <a>
                <Tooltip label={props.prevNextProducts[0].title}>
                  <ChevronLeftIcon w={5} h={5} />
                </Tooltip>
              </a>
            </Link>
          </li>
          <li>
            <Link href={`/blog/${props.prevNextProducts[1].id}`}>
              <a>
                <Tooltip label={props.prevNextProducts[1].title}>
                  <ChevronRightIcon w={5} h={5} />
                </Tooltip>
              </a>
            </Link>
          </li>
        </ul>
      </div>
      <div className={classes.prodctr}>
        <div className={classes.productimg}>
          <Image
            src={props.product.Image.url}
            alt={props.product.Name}
            width={370}
            height={370}
            objectFit="cover"
          />
        </div>
        <div className={classes.summary}>
          <h2>{props.product.Name.toLowerCase()}</h2>
          <p className={classes.price}>{priceFormat(props.product.Price)}</p>
          <div className={classes.intro}>
            <p>
              <ReactMarkdown>{props.product.Intro}</ReactMarkdown>
            </p>
          </div>
          <div className={classes.categories}>
            <div>
              <span>Categories: </span>
              {props.product.item_categories.map((category, idx) => (
                <>
                  <Link href="">
                    <a>{category.Name}</a>
                  </Link>
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
          <ReactMarkdown>{props.product.Description}</ReactMarkdown>
        </p>
      </div>
      <section className={classes.relatedproducts}>
        <h2>Produits associés</h2>
        <ul className={classes.productslist}>
          {props.recommendedProducts.map((product) => (
            <RelatedProduct product={product} />
          ))}
        </ul>
      </section>
    </article>
  );
}

export default ProductDetail;
