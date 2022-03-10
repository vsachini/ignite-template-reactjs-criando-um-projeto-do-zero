import Link from 'next/link';
import styles from './header.module.scss';

export default function Header() {
  return (
    <main className={styles.container}>
      <Link href="/">
        <a>
          <img src="/assets/logo.svg" alt="logo" />
        </a>
      </Link>
    </main>
  );
}
