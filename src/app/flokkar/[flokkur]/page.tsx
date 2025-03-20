import Navigation from '@/components/Navigation/Navigation';
import { QuestionsApi } from '@/api';
import { notFound } from 'next/navigation';
import Category from '@/components/Category/Category';

export default async function CategoryPage({
  params,
}: {
  // Allow params to be either an object or a Promise resolving to an object.
  params: { flokkur: string } | Promise<{ flokkur: string }>;
}) {
  // Use Promise.resolve so that if params is not already a Promise, it becomes one.
  const { flokkur } = await Promise.resolve(params);
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