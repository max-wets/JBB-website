import classes from './ProductsAside.module.css';
import Link from 'next/link';
import {
  Icon,
  Button,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
} from '@chakra-ui/react';
import Image from 'next/image';
import { BsFillEnvelopeFill, BsFacebook, BsInstagram } from 'react-icons/bs';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { ActiveCategories, Product } from '@/domain/types';

type BlogAsideProps = {
  products: Product[];
  activeCategories: ActiveCategories;
  setSelectedCategory: Dispatch<SetStateAction<string>>;
  setFilterRange: Dispatch<SetStateAction<number[]>>;
};

type SideProductDetailProps = {
  product: Product;
};

function BlogAside({
  products,
  activeCategories,
  setSelectedCategory,
  setFilterRange,
}: BlogAsideProps) {
  const [priceRange, setPriceRange] = useState<number[]>([]);
  const [priceRangeCurrentValues, setPriceRangeCurrentValues] = useState([
    0, 20,
  ]);
  // const api_url = "https://jbb-admin.herokuapp.com/";

  function getPriceRange(products: Product[]) {
    const priceRangeArr = [];
    const pricesArr = products.map((product) => product.price);
    priceRangeArr[0] = Math.min(...pricesArr);
    priceRangeArr[1] = Math.max(...pricesArr);
    // console.log("prices range array:", priceRangeArr);
    return priceRangeArr;
  }

  useEffect(() => {
    const priceRange = getPriceRange(products);
    setPriceRange(priceRange);
  }, [products]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target) {
      const target = e.target as HTMLElement;
      setSelectedCategory(target.dataset.category || '');
    }
  };

  function priceFormat(num: number) {
    let formattedNum;

    if (!num.toString().includes('.')) {
      formattedNum = num + ',00';
    } else {
      const splitArr = num.toString().split('.');
      splitArr[1] = Number(splitArr[1]) < 10 ? splitArr[1] + '0' : splitArr[1];
      formattedNum = splitArr.join(',');
    }
    return formattedNum + '€';
  }

  function SideProductDetail({ product }: SideProductDetailProps) {
    return (
      <li key={product.id}>
        <Link legacyBehavior href={`/products/${product.id}`}>
          <a className={classes.imgctr}>
            <Image src={product.imageUrl} alt={product.name} fill={true} />
            <span className={classes.overlay}></span>
          </a>
        </Link>
        <div className={classes.recentarticledetails}>
          <Link legacyBehavior href={`/products/${product.id}`}>
            <a>{product.name}</a>
          </Link>
          <div>
            <div>{priceFormat(product.price)}</div>
          </div>
        </div>
      </li>
    );
  }

  return (
    <aside className={classes.sidebarctn}>
      <div className={classes.sidebarinner}>
        <div className={classes.sidebox}>
          <h4 className={classes.socialtitle}>Filtrer par prix</h4>
          <RangeSlider
            defaultValue={[0, 20]}
            min={0}
            max={priceRange[1]}
            // step={(priceRange[1] - priceRange[0]) / 10}
            onChangeEnd={(values) =>
              setPriceRangeCurrentValues(values.map((val) => Math.round(val)))
            }
          >
            <RangeSliderTrack bg="red.200">
              <RangeSliderFilledTrack bg="#D93644" />
            </RangeSliderTrack>
            <RangeSliderThumb boxSize={6} index={0} />
            <RangeSliderThumb boxSize={6} index={1} />
          </RangeSlider>
          <div className={classes.filterlowerbox}>
            <div
              className={classes.pricelabel}
            >{`Prix: ${priceRangeCurrentValues[0]}€ - ${priceRangeCurrentValues[1]}€`}</div>
            <Button
              size="xs"
              colorScheme="red"
              onClick={() => setFilterRange(priceRangeCurrentValues)}
            >
              Filtrer
            </Button>
          </div>
        </div>
        <div className={classes.sidebox}>
          <h4 className={classes.socialtitle}>Me suivre</h4>
          <ul className={classes.socialicons}>
            <Link
              legacyBehavior
              href="https://www.facebook.com/groups/3136931483299677"
            >
              <a target="_blank">
                <li>
                  <Icon as={BsFacebook} h={5} w={5} size="sm" />
                </li>
              </a>
            </Link>
            <Link
              legacyBehavior
              href="https://www.instagram.com/julie_baronnie/"
            >
              <a target="_blank">
                <li>
                  <Icon as={BsInstagram} h={5} w={5} size="sm" />
                </li>
              </a>
            </Link>
            <Link legacyBehavior href="mailto:contact@juliebaronniebeauty.com">
              <a target="_blank">
                <li>
                  <Icon as={BsFillEnvelopeFill} h={5} w={5} size="sm" />
                </li>
              </a>
            </Link>
          </ul>
        </div>
        {/* <div className={classes.sidebox}>
          <h4 className={classes.socialtitle}>Newsletter</h4>
          <div className={classes.newsletter}>
            <div className={classes.newslettertxt}>
              Recevez mes dernières nouvelles directement sur votre boîte mail
            </div>
            <Formik
              initialValues={{ email: "" }}
              onSubmit={() => console.log("email submitted")}
            >
              {(props) => (
                <Form>
                  <Field name="email">
                    {({ field, form }) => (
                      <FormControl>
                        <FormLabel htmlFor="email" />
                        <InputGroup size="md">
                          <Input
                            {...field}
                            variant="filled"
                            id="email"
                            placeholder="Adresse mail"
                          />
                          <InputRightElement width="4.5rem">
                            <Button colorScheme="blackAlpha" type="submit">
                              OK
                            </Button>
                          </InputRightElement>
                        </InputGroup>
                      </FormControl>
                    )}
                  </Field>
                </Form>
              )}
            </Formik>
          </div>
        </div> */}
        <div className={classes.sidebox}>
          <h4 className={classes.socialtitle}>Catégories</h4>
          <div className={classes.blogcategories}>
            {Object.entries(activeCategories).map(([category, qty]) => (
              <li key={category}>
                <div data-category={category} onClick={(e) => handleClick(e)}>
                  {category}
                </div>
                <span>{`(${qty})`}</span>
              </li>
            ))}
            <li>
              <div data-category="Toutes" onClick={(e) => handleClick(e)}>
                Toutes catégories
              </div>
              <span>{`(${products.length})`}</span>
            </li>
          </div>
        </div>
        <div className={classes.sidebox}>
          <h4 className={classes.socialtitle}>Produits récents</h4>
          <ul className={classes.sidebarlist}>
            <SideProductDetail product={products[0]} />
            <SideProductDetail product={products[1]} />
            <SideProductDetail product={products[2]} />
          </ul>
        </div>
      </div>
    </aside>
  );
}

export default BlogAside;
