import classes from "./ProductsList.module.css";
import ProductItem from "./ProductItem";
import Pagination from "../pagination/Pagination";
import { Grid, GridItem } from "@chakra-ui/react";
import { useEffect, useMemo } from "react";

let PageSize = 12;

export interface Product {
  id: number;
  name: string;
  intro: string;
  price: number;
  description: string;
  item_categories: string[];
  image: string;
}

function ProductsList(props: { products; currentPage; setCurrentPage }) {
  useEffect(() => {
    console.log("Products list items:");
    props.products.map((product) => {
      console.log(product);
    });
  }, []);

  useEffect(() => {
    props.setCurrentPage(1);
  }, []);

  const currentData = useMemo(() => {
    const firstPageIndex = (props.currentPage - 1) * PageSize;
    const lastPageIndex = firstPageIndex + PageSize;
    return props.products.slice(firstPageIndex, lastPageIndex);
  }, [props.currentPage, props.products]);

  return (
    <div className={classes.productlist}>
      <Grid templateColumns="repeat(3, 1fr)" gap={6}>
        {currentData.map((product) => (
          <GridItem w="100%" bg="gray.200">
            <ProductItem product={product} />
          </GridItem>
        ))}
      </Grid>
      <Pagination
        className={classes.paginationbar}
        currentPage={props.currentPage}
        totalCount={props.products.length}
        pageSize={PageSize}
        onPageChange={(page) => props.setCurrentPage(page)}
      />
    </div>
  );
}

export default ProductsList;
