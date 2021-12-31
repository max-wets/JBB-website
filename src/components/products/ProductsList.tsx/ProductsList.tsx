import classes from "./ProductsList.module.css";
import ProductItem from "./ProductItem";
import { Grid, GridItem } from "@chakra-ui/react";
import { useEffect } from "react";

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
          <GridItem w="100%" bg="blue.500">
            <ProductItem product={product} />
          </GridItem>
        ))}
      </Grid>
    </div>
  );
}

export default ProductsList;
