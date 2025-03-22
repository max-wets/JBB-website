import classes from './ProductDetailHeading.module.css';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Icon,
} from '@chakra-ui/react';
import { ChevronRightIcon } from '@chakra-ui/icons';
import { BiHomeHeart } from 'react-icons/bi';

type BlogHeadingProps = {
  name: string;
};

function BlogHeading(props: BlogHeadingProps) {
  return (
    <header className={classes.pageheader}>
      <div className={classes.container}>
        <h1>{props.name.toLowerCase()}</h1>
        <Breadcrumb
          spacing="1px"
          separator={<ChevronRightIcon color="gray.500" />}
        >
          <BreadcrumbItem h="24px" position="relative" top="3px">
            <BreadcrumbLink href="/" _hover={{ color: '#D93644' }}>
              <Icon as={BiHomeHeart} h={6} w={6} size="sm" pt="4px" />
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbItem h="24px">
            <BreadcrumbLink
              fontSize="13px"
              href="/products"
              _hover={{ textDecoration: 'none', color: '#D93644' }}
            >
              Produits
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbItem isCurrentPage h="24px">
            <BreadcrumbLink
              fontSize="13px"
              href="#"
              _hover={{ textDecoration: 'none', color: '#D93644' }}
            >
              {props.name}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
      </div>
    </header>
  );
}

export default BlogHeading;
