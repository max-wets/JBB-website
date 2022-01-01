import classes from "./ProductsList.module.css";
import ProductItem from "./ProductItem";
import { Grid, GridItem } from "@chakra-ui/react";
import { useEffect } from "react";

export interface Product {
  id: number;
  name: string;
  intro: string;
  price: number;
  description: string;
  item_categories: string[];
  image: string;
}

function ProductsList(props: { products }) {
  useEffect(() => {
    console.log("Products list items:");
    props.products.map((product) => {
      console.log(product);
    });
  }, []);
  return (
    <div className={classes.productlist}>
      <Grid templateColumns="repeat(3, 1fr)" gap={6}>
        {props.products.map((product) => (
          <GridItem w="100%" bg="gray.200">
            <ProductItem product={product} />
          </GridItem>
        ))}
      </Grid>
    </div>
  );
}

export default ProductsList;
