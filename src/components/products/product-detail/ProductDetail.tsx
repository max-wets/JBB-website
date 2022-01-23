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
                  {idx < props.product.item_categories.length - 1 ? ", " : null}
                </span>
              </>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}

export default ProductDetail;
