import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { FiCalendar, FiUser } from 'react-icons/fi';
import { formatDate } from '../helpers/DateHelper';
import { getPrismicClient } from '../services/prismic';
import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps) {
  const [posts, setPosts] = useState<Post[]>(postsPagination.results);
  const [nextPage, setNextPage] = useState<string | null>(
    postsPagination.next_page
  );

  const loadMorePosts = async () => {
    if (postsPagination.next_page) {
      const response = await fetch(nextPage);
      const data = await response.json();
      setPosts(prev => [...prev, ...data.results]);
      setNextPage(data.next_page);
    }
  };

  return (
    <div className={commonStyles.container}>
      <Head>
        <title> Space traveling </title>
      </Head>
      <main className={styles.container}>
        {posts.map(post => (
          <Link key={post.uid} href={`/post/${post.uid}`}>
            <a>
              <div className={styles.postContainer}>
                <h3>{post.data.title}</h3>
                <p>{post.data.subtitle}</p>
                <div className={styles.detailsContainer}>
                  <div className={styles.details}>
                    <FiCalendar />
                    <span>{formatDate(post.first_publication_date)}</span>
                  </div>
                  <div className={styles.details}>
                    <FiUser />
                    <span> {post.data.author}</span>
                  </div>
                </div>
              </div>
            </a>
          </Link>
        ))}
        {nextPage ? (
          <button onClick={loadMorePosts}> Carregar mais posts </button>
        ) : null}
      </main>
    </div>
  );
}

export const getStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query('', { pageSize: 1 });

  return {
    props: {
      postsPagination: {
        results: postsResponse.results,
        next_page: postsResponse.next_page,
      },
    },
  };
};
