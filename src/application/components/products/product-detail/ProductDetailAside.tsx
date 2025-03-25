import classes from './ProductDetailAside.module.css';
import Link from 'next/link';
import { Icon } from '@chakra-ui/react';
import Image from 'next/image';
import { BsFillEnvelopeFill, BsFacebook, BsInstagram } from 'react-icons/bs';
import { BlogPost } from '@/domain/types';
import { urlStringFormatter } from '@/application/utils';

type BlogAsideProps = {
  relatedArticles: BlogPost[];
};

type SideBlogDetailProps = {
  article: BlogPost;
};

function BlogAside({ relatedArticles }: BlogAsideProps) {
  const newDate = (date: string) => {
    const mois = [
      'Janvier',
      'Février',
      'Mars',
      'Avril',
      'Mai',
      'Juin',
      'Juillet',
      'Août',
      'Septembre',
      'Octobre',
      'Novembre',
      'Décembre',
    ];
    const nDate = new Date(date);
    return `${nDate.getDate()} ${
      mois[nDate.getMonth()]
    } ${nDate.getFullYear()}`;
  };

  function SideBlogDetail({ article }: SideBlogDetailProps) {
    const articleUrl = urlStringFormatter(article.title, article.id);

    return (
      <li key={article.id}>
        <Link
          legacyBehavior
          href={{
            pathname: `/blog/[articleId]`,
            query: { articleId: articleUrl },
          }}
        >
          <a className={classes.imgctr}>
            <Image
              src={article.imageUrl ?? ''}
              alt={article.title}
              fill={true}
            />
            <span className={classes.overlay}></span>
          </a>
        </Link>
        <div className={classes.recentpostdetails}>
          <Link legacyBehavior href={`/blog/${articleUrl}`}>
            <a>{article.title}</a>
          </Link>
          <div>
            <div>{newDate(article.issueDate)}</div>
            <span> / </span>
            <div>0 Comments</div>
          </div>
        </div>
      </li>
    );
  }

  return (
    <aside className={classes.sidebarctn}>
      <div className={classes.sidebarinner}>
        <div className={classes.sidebox}>
          <h4 className={classes.socialtitle}>Me suivre</h4>
          <ul className={classes.socialicons}>
            <Link
              legacyBehavior
              href="https://www.facebook.com/groups/3136931483299677"
            >
              <a target="_blank" key={'facebook-link'}>
                <li>
                  <Icon as={BsFacebook} h={5} w={5} />
                </li>
              </a>
            </Link>
            <Link
              legacyBehavior
              href="https://www.instagram.com/julie_baronnie/"
            >
              <a target="_blank" key={'instagram-link'}>
                <li>
                  <Icon as={BsInstagram} h={5} w={5} />
                </li>
              </a>
            </Link>
            <Link legacyBehavior href="mailto:contact@juliebaronniebeauty.com">
              <a target="_blank" key={'last-link'}>
                <li>
                  <Icon as={BsFillEnvelopeFill} h={5} w={5} />
                </li>
              </a>
            </Link>
          </ul>
        </div>
        {relatedArticles.length > 0 ? (
          <div className={classes.sidebox}>
            <h4 className={classes.socialtitle}>Articles recommandés</h4>
            <ul className={classes.sidebarlist}>
              {relatedArticles.map((article) => (
                <SideBlogDetail key={article.id} article={article} />
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </aside>
  );
}

export default BlogAside;
