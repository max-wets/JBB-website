import classes from "./ProductItem.module.css";
import Image from "next/image";
import ProductsList from "./ProductsList";
import Link from "next/link";
import { useEffect } from "react";

const myLoader = ({ src }) => {
  return `../public/${src}`;
};

function ProductItem(props: { product }) {
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

  // useEffect(() => {
  //   console.log("Product item:", props.product);
  // }, []);

  return (
    <div key={props.product.id} className={classes.productctr}>
      <div className={classes.imgctr}>
        <Link href="">
          <a>
            <Image
              loader={myLoader}
              src={props.product.image}
              alt={props.product.name}
              width={300}
              height={300}
            />
            <span className={classes.overlay}></span>
          </a>
        </Link>
      </div>
      <Link href="">
        <a>
          <h3>{props.product.name}</h3>
        </a>
      </Link>
      <div className={classes.aftertitle}>
        <div className={classes.shopprice}>
          {priceFormat(props.product.price)}
        </div>
        <div className={classes.shopbuttons}></div>
      </div>
    </div>
  );
}

export default ProductItem;
