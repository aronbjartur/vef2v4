import Navigation from '@/components/Navigation/Navigation';
import Categories from '@/components/Categories/Categories';
import { QuestionsApi } from '@/api';
import styles from './Home.module.css';

export default async function Home() {
  const api = new QuestionsApi();
  const categoriesData = await api.getCategories();

  return (
    <div className={styles.container}>
      <Navigation />
      <h1 className={styles.title}>Spurningaflokkar</h1>
      <Categories title="Spurningaflokkar" initialData={categoriesData} />
    </div>
  );
}