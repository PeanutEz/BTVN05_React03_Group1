import Header from '../components/Header';
import PostList from '../components/PostList';
import styles from './HomePage.module.css';

export default function HomePage() {

  return (
    <div className={styles.container}>
      <Header />
      <PostList />
    </div>
  );
}