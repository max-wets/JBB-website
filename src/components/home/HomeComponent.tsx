import classes from './HomeComponent.module.css';
import Image from 'next/image';
import Link from 'next/link';
import ProductItem from '../products/ProductItem';
import { useEffect, useState } from 'react';
import { Grid, GridItem, useMediaQuery, Tooltip, Icon } from '@chakra-ui/react';
import { FiClock } from 'react-icons/fi';
import Head from 'next/head';
import { urlStringFormatter, newDate } from '../../lib/utils';
import { BlogPost, Product } from '../../types';

type HomeComponentProps = {
  recentProducts: Product[];
  recentArticles: BlogPost[];
};

type ArticleItem = {
  idx: number;
  article: BlogPost;
};

export default function HomeComponent(props: HomeComponentProps) {
  const [isLargerThan1000] = useMediaQuery('(min-width: 1000px)');
  const [isLargerThan750] = useMediaQuery('(min-width: 750px)');
  const [serverRendering, setServerRendering] = useState(true);

  useEffect(() => {
    // console.log("recent products:", props.recentProducts);
    // console.log("recent articles:", props.recentArticles);
    setServerRendering(false);
  }, []);

  function determineItemGridDisplay() {
    if (isLargerThan1000) return 'repeat(4, 1fr)';
    if (isLargerThan750) return 'repeat(3, 1fr)';
    return 'repeat(1, 1fr)';
  }

  function determineArticleGridDisplay() {
    if (isLargerThan1000) return 'repeat(3, 1fr)';
    if (isLargerThan750) return 'repeat(2, 1fr)';
    return 'repeat(1, 1fr)';
  }

  function ArticleItem(props: ArticleItem) {
    // console.log(props.article.description);
    const [descriptionExcerpt, setDescriptionExcerpt] = useState('');
    const articleUrl = urlStringFormatter(
      props.article.title,
      props.article.id
    );

    useEffect(() => {
      let cleanExcerpt;

      if (props.article.description?.length > 100) {
        const excerpt = props.article.description.substring(0, 100);
        const regex = new RegExp('\\n', 'g');
        cleanExcerpt = excerpt
          .split(' ')
          .map((segment) => {
            if (regex.test(segment)) {
              const newSegment = segment.replace(regex, ` `);
              return newSegment;
            }
            return segment;
          })
          .join(' ');
        // console.log(cleanExcerpt);
      } else {
        cleanExcerpt = props.article.description;
      }

      setDescriptionExcerpt(cleanExcerpt);
    }, [props.article.description]);

    return (
      <>
        <Head>
          <title>Accueil - Julie Baronnie Beauty</title>
          <meta
            name="description"
            content="Bienvenue sur Julie Baronnie Beauty, ici vous trouverez toutes mes techniques anti âge que vous pouvez retrouver sur ma chaîne Odysee Julie Baronnie"
          />
          <meta property="og:title" content="Accueil - Julie Baronnie Beauty" />
          <meta
            property="og:description"
            content="Bienvenue sur Julie Baronnie Beauty, ici vous trouverez toutes mes techniques anti âge"
          />
          <meta property="og:image" content={'/bg-picture.jpg'} />
        </Head>

        <div key={props.idx} className={classes.articlectr}>
          <div className={classes.thumbnail}>
            <Link legacyBehavior href={`/blog/${articleUrl}`}>
              <a>
                <Image
                  src={props.article.imageUrl ?? ''}
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
            <Link legacyBehavior href={`/blog/${articleUrl}`}>
              <a>
                <Tooltip
                  label={props.article.title}
                  aria-label="article title"
                  openDelay={300}
                >
                  <h2>
                    {props.article.title.length > 30
                      ? props.article.title.substring(0, 30) + '...'
                      : props.article.title}
                  </h2>
                </Tooltip>
              </a>
            </Link>
            <div className={classes.excerpt}>{descriptionExcerpt}</div>
          </div>
          <ul className={classes.meta}>
            <li>
              <Icon as={FiClock} h={5} w={5} size="sm" mt="2px" mr="2px" />
              <div>{newDate(props.article.issueDate)}</div>
            </li>
          </ul>
        </div>
      </>
    );
  }

  return (
    <main>
      <div className={classes.contentwrap}>
        <article className={classes.singlepagearticle}>
          <section className={classes.bgpicture}>
            <div className={classes.bgcolumn}>
              <div className={classes.bgtextctr}>
                <div className={classes.bgtextheading}>
                  <h1>Julie Baronnie Beauty</h1>
                </div>
                <div className={classes.bgtextdivider}>
                  <div className={classes.divider}>
                    <div> </div>
                  </div>
                </div>
                <div className={classes.bgtextcontent}>
                  <p>
                    Fils tenseurs, injections AH, mésothérapie, microneedling,
                    Botox.
                    <br />
                    Toutes mes techniques anti âge que vous pouvez retrouver sur
                    ma chaîne Odysee Julie Baronnie
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
                      serverRendering
                        ? 'repeat(4, 1fr)'
                        : determineItemGridDisplay()
                    }
                    gap={4}
                  >
                    {props.recentProducts.map((product, idx) => (
                      <GridItem key={idx} w="100%" border="1px solid #e9e9e9">
                        <ProductItem product={product} idx={idx} />
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
                      serverRendering
                        ? 'repeat(3, 3fr)'
                        : determineArticleGridDisplay()
                    }
                    gap={4}
                    maxW="94vw"
                    margin="auto"
                  >
                    {props.recentArticles.map((article, idx) => (
                      <GridItem
                        key={idx}
                        w="100%"
                        border="1px solid #e9e9e9"
                        padding="0 10px"
                        marginBottom="20px"
                      >
                        <ArticleItem idx={idx} article={article} />
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
