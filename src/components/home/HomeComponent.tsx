import classes from "./HomeComponent.module.css";
import Image from "next/image";
import Link from "next/link";
import bgPicture from "../../public/home/bg-picture.jpg";
import ProductItem from "../products/ProductItem";
import { useEffect } from "react";
import { Grid, GridItem, useMediaQuery, Tooltip, Icon } from "@chakra-ui/react";
import { FiClock } from "react-icons/fi";
import { BiComment } from "react-icons/bi";

function HomeComponent(props: { recentProducts; recentArticles }) {
  const [isLargerThan1000] = useMediaQuery("(min-width: 1000px)");
  const [isLargerThan750] = useMediaQuery("(min-width: 750px)");
  const [isLargerThan480] = useMediaQuery("(min-width: 480px)");

  useEffect(() => {
    console.log("recent products:", props.recentProducts);
    console.log("recent articles:", props.recentArticles);
  }, []);

  const newDate = (date) => {
    const mois = [
      "Janvier",
      "Février",
      "Mars",
      "Avril",
      "Mai",
      "Juin",
      "Juillet",
      "Août",
      "Septembre",
      "Octobre",
      "Novembre",
      "Décembre",
    ];
    const nDate = new Date(date);
    return `${nDate.getDate()} ${
      mois[nDate.getMonth()]
    } ${nDate.getFullYear()}`;
  };

  function ArticleItem(props: { article }) {
    return (
      <div className={classes.articlectr}>
        <div className={classes.thumbnail}>
          <Link href={`/blog/${props.article.id}`}>
            <a>
              <Image
                src={props.article.imageUrl}
                alt={props.article.title}
                width={351}
                height={181}
                layout="responsive"
                objectFit="cover"
              />
              <span className={classes.overlay}>
                <span className={classes.overlaybtn}>Lire</span>
              </span>
            </a>
          </Link>
        </div>
        <div className={classes.details}>
          <Link href={`/blog/${props.article.id}`}>
            <a>
              <Tooltip
                label={props.article.title}
                aria-label="article title"
                openDelay={300}
              >
                <h2>
                  {props.article.title.length > 30
                    ? props.article.title.substring(0, 30) + "..."
                    : props.article.title}
                </h2>
              </Tooltip>
            </a>
          </Link>
          <div className={classes.excerpt}>
            {props.article.description.substring(0, 100) + "..."}
          </div>
        </div>
        <ul className={classes.meta}>
          <li>
            <Icon as={FiClock} h={5} w={5} size="sm" mt="2px" mr="2px" />
            <div>{newDate(props.article.issueDate)}</div>
          </li>
        </ul>
      </div>
    );
  }

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
                  <Grid
                    templateColumns={
                      isLargerThan750
                        ? "repeat(4, 1fr)"
                        : isLargerThan480 && !isLargerThan750
                        ? "repeat(3, 1fr)"
                        : "repeat(1, 1fr)"
                    }
                    gap={4}
                  >
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
          <section className={classes.recentarticles}>
            <div className={classes.racolumn}>
              <div className={classes.rarow}>
                <div className={classes.raheading}>
                  <h2>Articles récents</h2>
                </div>
                <div className={classes.radividerctr}>
                  <div className={classes.radivider}>
                    <div> </div>
                  </div>
                </div>
                <div className={classes.articlesctr}>
                  <Grid
                    templateColumns={
                      isLargerThan1000
                        ? "repeat(3, 1fr)"
                        : isLargerThan750 && !isLargerThan1000
                        ? "repeat(2, 2fr)"
                        : "repeat(1, 1fr)"
                    }
                    gap={4}
                  >
                    {props.recentArticles.map((article) => (
                      <GridItem
                        w="100%"
                        border="1px solid #e9e9e9"
                        padding="0 10px"
                        marginBottom="20px"
                      >
                        <ArticleItem article={article} />
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
