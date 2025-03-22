import classes from './BlogArticleDetail.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { Icon, useMediaQuery } from '@chakra-ui/react';
import { BiUser, BiComment } from 'react-icons/bi';
import { FiClock } from 'react-icons/fi';
import { BsFolder } from 'react-icons/bs';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import VideoEmbed from './VideoEmbed';
import {
  EmailShareButton,
  EmailIcon,
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  TwitterIcon,
  WhatsappShareButton,
  WhatsappIcon,
} from 'react-share';
import { useRouter } from 'next/router';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ChevronRightIcon,
} from '@chakra-ui/icons';
import { urlStringFormatter, newDate } from '../../../lib/utils';
import CommentsSection from './CommentsSection';
import { BlogPost, PostComment, PrevNextPost } from '../../../types';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL;

type BlogArticleDetailProps = {
  article: BlogPost;
  prevNextPosts: (PrevNextPost | null)[];
  recommendedArticles: BlogPost[];
  articleComments: PostComment[];
};

function BlogArticleDetail(props: BlogArticleDetailProps) {
  // const api_url = "https://jbb-admin.herokuapp.com";
  const router = useRouter();
  const [isLargerThan750] = useMediaQuery('(min-width: 750px)');
  const [isLargerThan600] = useMediaQuery('(min-width: 600px)');
  const [comments, setComments] = useState<PostComment[]>([]);

  return (
    <article className={classes.primary}>
      <div className={classes.thumbnail}>
        <Image
          src={props.article.imageUrl ?? ''}
          alt={props.article.title}
          width={833}
          height={430}
          objectFit="cover"
        />
      </div>
      <header>
        <h2 className={classes.entrytitle}>{props.article.title}</h2>
      </header>
      <div className={classes.meta}>
        <ul>
          <li>
            <Icon
              as={BiUser}
              h={isLargerThan600 ? 6 : 4}
              w={isLargerThan600 ? 6 : 4}
              size={isLargerThan600 ? 'sm' : 'sx'}
            />
            <Link legacyBehavior href="">
              <a>Julie</a>
            </Link>
          </li>
          <li>
            <Icon
              as={FiClock}
              h={isLargerThan600 ? 5 : 3}
              w={isLargerThan600 ? 5 : 3}
              size={isLargerThan600 ? 'sm' : 'sx'}
              mt="2px"
            />
            <div>{newDate(props.article.issueDate)}</div>
          </li>
          <li>
            <Icon
              as={BsFolder}
              h={isLargerThan600 ? 6 : 4}
              w={isLargerThan600 ? 6 : 4}
              size={isLargerThan600 ? 'sm' : 'sx'}
              mr="4px"
            />
            {props.article.categories.map((category, idx) => (
              <>
                <span style={idx > 0 ? { marginLeft: '4px' } : undefined}>
                  {category}
                </span>
                <span>
                  {idx < props.article.categories.length - 1 ? ',' : null}
                </span>
              </>
            ))}
          </li>
          <li>
            <Icon
              as={BiComment}
              h={isLargerThan600 ? 6 : 4}
              w={isLargerThan600 ? 6 : 4}
              size={isLargerThan600 ? 'sm' : 'sx'}
              mr="4px"
            />
            <span>
              {comments
                ? `${comments.length} Commentaire${
                    comments.length > 1 ? 's' : ''
                  }`
                : '0 Commentaires'}
            </span>
          </li>
        </ul>
        <div className={classes.entrycontent}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {props.article.description}
          </ReactMarkdown>
        </div>
        {props.article.videoUrl ? (
          <div style={{ marginTop: '30px' }}>
            <VideoEmbed source={props.article.videoUrl} />
          </div>
        ) : null}
      </div>
      <div className={classes.entryshare}>
        <h3>PARTAGER CET ARTICLE</h3>
        <ul>
          <li>
            <EmailShareButton
              url={APP_URL + router.asPath}
              subject="Pour vous, un article de Julie Baronnie Beauty"
              body={`Voici un article à partager sur le thème suivant: ${props.article.title} \n\n`}
            >
              <EmailIcon size={40} borderRadius={6} />
            </EmailShareButton>
          </li>
          <li>
            <FacebookShareButton
              url={APP_URL + router.asPath}
              hashtag={`Voici un article à lire sur le thème suivant: ${props.article.title} \n\n`}
            >
              <FacebookIcon size={40} borderRadius={6} />
            </FacebookShareButton>
          </li>
          <li>
            <TwitterShareButton
              url={APP_URL + router.asPath}
              title={`Voici un article à lire sur le thème suivant: ${props.article.title} \n\n`}
            >
              <TwitterIcon size={40} borderRadius={6} />
            </TwitterShareButton>
          </li>
          <li>
            <WhatsappShareButton
              url={APP_URL + router.asPath}
              title={`Voici un article à lire sur le thème suivant: ${props.article.title} \n\n`}
            >
              <WhatsappIcon size={40} borderRadius={6} />
            </WhatsappShareButton>
          </li>
        </ul>
      </div>
      <nav className={classes.postnavigation}>
        {props.prevNextPosts[0] ? (
          <div className={classes.navprevious}>
            <Link
              legacyBehavior
              href={`/blog/${urlStringFormatter(
                props.prevNextPosts[0].title,
                props.prevNextPosts[0].id
              )}`}
            >
              <a>
                <div className={classes.prevtitle}>
                  <ArrowLeftIcon w={3} h={3} />
                  <span>Article Précédent</span>
                </div>
                <div className={classes.prevtext}>
                  {props.prevNextPosts[0].title.length > 40
                    ? props.prevNextPosts[0].title.slice(0, 40) + '...'
                    : props.prevNextPosts[0].title}
                </div>
              </a>
            </Link>
          </div>
        ) : null}
        {props.prevNextPosts[1] ? (
          <div className={classes.navnext}>
            <Link
              legacyBehavior
              href={`/blog/${urlStringFormatter(
                props.prevNextPosts[1].title,
                props.prevNextPosts[1].id
              )}`}
            >
              <a>
                <div className={classes.nexttitle}>
                  <ArrowRightIcon w={3} h={3} />
                  <span>Article Suivant</span>
                </div>
                <div className={classes.nexttext}>
                  {props.prevNextPosts[1].title.length > 40
                    ? props.prevNextPosts[1].title.slice(0, 40) + '...'
                    : props.prevNextPosts[1].title}
                </div>
              </a>
            </Link>
          </div>
        ) : null}
      </nav>
      <section className={classes.relatedposts}>
        <div className={classes.relatedpoststitle}>
          <ChevronRightIcon w={6} h={6} color="#d93644" />
          <h3>ARTICLES RECOMMANDES</h3>
        </div>
        <div className={classes.relatedpostsentry}>
          {props.recommendedArticles.map((article) => (
            <article key={article.id}>
              <div className={classes.thumbnail}>
                <Link
                  legacyBehavior
                  href={`/blog/${urlStringFormatter(
                    article.title,
                    article.id
                  )}`}
                >
                  <a>
                    <Image
                      src={article.imageUrl ?? ''}
                      alt={article.title}
                      width={isLargerThan750 ? 239 : 667}
                      height={isLargerThan750 ? 124 : 347}
                      objectFit="cover"
                    />
                    <span className={classes.overlay}></span>
                  </a>
                </Link>
              </div>
              <Link
                legacyBehavior
                href={`/blog/${urlStringFormatter(article.title, article.id)}`}
              >
                <a>
                  <h3>
                    {article.title.length > 40
                      ? article.title.slice(0, 39) + '...'
                      : article.title}
                  </h3>
                </a>
              </Link>
              <time className="published" dateTime={article.issueDate}>
                <Icon as={FiClock} h={3} w={3} size="md" mr="4px" />
                <div>{newDate(props.article.issueDate)}</div>
              </time>
            </article>
          ))}
        </div>
      </section>
      <CommentsSection
        article={props.article}
        comments={comments}
        setComments={setComments}
      />
    </article>
  );
}

export default BlogArticleDetail;
