import classes from "./HomeComponent.module.css";
import Image from "next/image";
import bgPicture from "../../public/home/bg-picture.jpg";
import ProductItem from "../products/ProductItem";
import { useEffect } from "react";
import { Grid, GridItem, useMediaQuery } from "@chakra-ui/react";

function HomeComponent(props: { recentProducts; recentArticles }) {
  useEffect(() => {
    console.log("recent products:", props.recentProducts);
    console.log("recent articles:", props.recentArticles);
  }, []);

  return (
    <main>
      <div className={classes.contentwrap}>
        <article className={classes.singlepagearticle}>
          <section className={classes.bgpicture}>
            <div className={classes.bgcolumn}>
              {/* <Image
                src={bgPicture}
                alt="home page background picture"
                width={1300}
                height={800}
                objectFit="cover"
              /> */}
              <div className={classes.bgtextctr}>
                <div className={classes.bgtextheading}>
                  <h2>Lorem ipsum dolor sit.</h2>
                </div>
                <div className={classes.bgtextdivider}>
                  <div className={classes.divider}>
                    <div> </div>
                  </div>
                </div>
                <div className={classes.bgtextcontent}>
                  <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    <br />
                    Perferendis maxime autem nam cumque quo expedita!
                  </p>
                </div>
              </div>
            </div>
          </section>
          <section className={classes.recentproducts}>
            <div className={classes.rpcolumn}>
              <div className={classes.rprow}>
                <div className={classes.rpheading}>
                  <h2>Produits récents</h2>
                </div>
                <div className={classes.rpdividerctr}>
                  <div className={classes.rpdivider}>
                    <div> </div>
                  </div>
                </div>
                <div className={classes.productsctr}>
                  <Grid templateColumns="repeat(4, 1fr)" gap={4}>
                    {props.recentProducts.map((product) => (
                      <GridItem w="100%" border="1px solid #e9e9e9">
                        <ProductItem product={product} />
                      </GridItem>
                    ))}
                  </Grid>
                </div>
              </div>
            </div>
          </section>
        </article>
      </div>
    </main>
  );
}

export default HomeComponent;
