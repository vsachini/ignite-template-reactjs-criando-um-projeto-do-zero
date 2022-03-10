import Prismic from '@prismicio/client';
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { RichText } from 'prismic-dom';
import { FiCalendar, FiClock, FiUser } from 'react-icons/fi';
import PostInfoWithIcon from '../../components/PostInfoWithIcon';
import { formatDate } from '../../helpers/DateHelper';
import { getPrismicClient } from '../../services/prismic';
import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: PostContent[];
  };
}

interface PostContent {
  heading: string;
  body: {
    text: string;
  }[];
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps) {
  const router = useRouter();
  const words = post.data.content.reduce(
    (acc: number, item: PostContent) =>
      acc + RichText.asText(item.body).split(' ').length,
    0
  );
  const readingTime = `${Math.ceil(words / 200)} min`;

  if (router.isFallback) return <div>Carregando...</div>;

  return (
    <>
      <Head>
        <title> {post?.data?.title} | Space traveling </title>
      </Head>
      <div className={styles.banner}>
        <img src={post?.data?.banner.url} alt="banner" />
      </div>
      <div className={`${commonStyles.container} ${styles.container}`}>
        <h1>{post?.data.title}</h1>
        <div className={styles.detailsContainer}>
          <PostInfoWithIcon
            icon={FiCalendar}
            text={formatDate(post?.first_publication_date)}
          />
          <PostInfoWithIcon icon={FiUser} text={post?.data?.author} />
          <PostInfoWithIcon icon={FiClock} text={readingTime} />
        </div>
        {post?.data?.content.map(contentItem => (
          <div key={contentItem.heading}>
            <h3>{contentItem.heading}</h3>
            <div
              dangerouslySetInnerHTML={{
                __html: RichText.asHtml(contentItem.body),
              }}
            ></div>
          </div>
        ))}
      </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async context => {
  const prismic = getPrismicClient();
  const posts = await prismic.query(
    [Prismic.Predicates.at('document.type', 'posts')],
    { pageSize: 1 }
  );

  return {
    paths: posts.results.map(post => ({ params: { slug: post.uid } })),
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async context => {
  const prismic = getPrismicClient();
  const response = await prismic.getByUID(
    'posts',
    context.params.slug as string,
    {}
  );

  return {
    props: {
      post: response,
    },
    revalidate: 60 * 60,
  };
};
