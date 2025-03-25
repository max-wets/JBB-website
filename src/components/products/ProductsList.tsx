import classes from './ProductsList.module.css';
import ProductItem from './ProductItem';
import Pagination from '../pagination/Pagination';
import { Grid, GridItem, Flex } from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import { Product } from '../../types';

type ProductsListProps = {
  products: Product[];
  currentPage: number;
  setCurrentPage: (page: number) => void;
  isLargerThan500: boolean;
};

type ViewSelectorProps = {
  productsLength: number | string;
  pageSize: number;
};

const PageSize = 12;

export default function ProductsList({
  products,
  currentPage,
  setCurrentPage,
  isLargerThan500,
}: ProductsListProps) {
  const [pageSize, setPageSize] = useState(PageSize);

  useEffect(() => {
    setCurrentPage(1);
  }, [setCurrentPage]);

  const currentData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * pageSize;
    const lastPageIndex = firstPageIndex + pageSize;
    return products.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, products, pageSize]);

  function ViewSelector({ productsLength, pageSize }: ViewSelectorProps) {
    const nbrOfViews = Math.ceil(Number(productsLength) / pageSize);
    const views = [];
    for (let i = 1; i < nbrOfViews + 1; i++) {
      views.push(i * pageSize);
    }
    return (
      <ul className={classes.resultcount}>
        <li className={classes.viewtitle}>Produits par page:</li>
        {views.map((view, idx) => (
          <li key={idx} onClick={() => setPageSize(parseInt(view.toString()))}>
            {view}
          </li>
        ))}
        <li onClick={() => setPageSize(parseInt(productsLength.toString()))}>
          Tous
        </li>
      </ul>
    );
  }

  return (
    <div className={classes.productlist}>
      <Flex flexDirection="row-reverse">
        <ViewSelector productsLength={products.length} pageSize={PageSize} />
      </Flex>
      <Grid
        templateColumns={isLargerThan500 ? 'repeat(3, 1fr)' : 'repeat(1, 1fr)'}
        gap={6}
      >
        {currentData.map((product, idx) => (
          <GridItem key={idx} w="100%" border="1px solid #e9e9e9">
            <ProductItem idx={idx} product={product} />
          </GridItem>
        ))}
      </Grid>
      <Pagination
        className={classes.paginationbar}
        currentPage={currentPage}
        totalCount={products.length}
        pageSize={pageSize}
        onPageChange={(page) => setCurrentPage(Number(page))}
      />
    </div>
  );
}
