import classes from './ProductItem.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '../../types';

type ProductItemProps = {
  idx: number;
  product: Product;
};

export default function ProductItem(props: ProductItemProps) {
  function priceFormat(num: number) {
    let formattedNum: string;

    if (!num.toString().includes('.')) {
      formattedNum = num + ',00';
    } else {
      const splitArr = num.toString().split('.');
      splitArr[1] = Number(splitArr[1]) < 10 ? splitArr[1] + '0' : splitArr[1];
      formattedNum = splitArr.join(',');
    }
    return formattedNum + '€';
  }

  // useEffect(() => {
  //   console.log("Product item:", props.product);
  // }, []);

  return (
    <div key={props.idx} className={classes.productctr}>
      <div className={classes.imgctr}>
        <Link legacyBehavior href={`/products/${props.product.id.toString()}`}>
          <a>
            <Image
              src={props.product.imageUrl}
              alt={props.product.name}
              width={300}
              height={300}
            />
            <span className={classes.overlay}></span>
          </a>
        </Link>
      </div>
      <Link legacyBehavior href={`/products/${props.product.id.toString()}`}>
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
