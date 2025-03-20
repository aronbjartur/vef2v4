import Navigation from '@/components/Navigation/Navigation';
import { QuestionsApi } from '@/api';
import { notFound } from 'next/navigation';
import Category from '@/components/Category/Category';

export default async function CategoryPage({ params }: { params: { flokkur: string } }) {
  const { flokkur } = params;
  const api = new QuestionsApi();
  const categoryData = await api.getCategory(flokkur);

  if (!categoryData) {
    notFound();
  }

  return (
    <div>
      <Navigation />
      <Category slug={flokkur} initialData={categoryData} />
    </div>
  );
}