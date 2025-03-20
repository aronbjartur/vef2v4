import { QuestionsApi } from '@/api';
import Navigation from '@/components/Navigation/Navigation';
import Link from 'next/link';
import { Category } from '@/types';

export default async function Flokkar() {
  const api = new QuestionsApi();
  const categoriesResponse = await api.getCategories();

  return (
    <div>
      <Navigation />
      <h1>Flokkar</h1>
      <ul>
        {categoriesResponse?.data.map((category: Category) => (
          <li key={category.id}>
            <Link href={`/flokkar/${category.slug}`}>{category.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}