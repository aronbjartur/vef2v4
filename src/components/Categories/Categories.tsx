'use client';

import { Category, Paginated } from '@/types';
import Link from 'next/link';
import styles from './Categories.module.css';

type Props = {
  title: string;
  initialData?: Paginated<Category> | null;
};

export default function Categories({ title, initialData }: Props) {
  const categories = initialData ?? null;

  return (
    <div className={styles.cats}>
      <h2>{title}</h2>
      {categories ? (
        <ul>
          {categories.data.map((category, index) => (
            <li key={index}>
              <Link href={`/flokkar/${category.slug}`}>{category.name}</Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>Sækjir flokka...</p>
      )}
    </div>
  );
}