import classes from "./ProductItem.module.css";
import Image from "next/image";
import ProductsList from "./ProductsList";

const myLoader = ({ src }) => {
  return `../public/${src}`;
};

function ProductItem(props: { product }) {
  return (
    <li className={classes.productctr}>
      <div className={classes.imgctr}>
        <Image
          loader={myLoader}
          src={props.product.image}
          alt={props.product.name}
          width={300}
          height={300}
        />
      </div>
    </li>
  );
}

export default ProductItem;
