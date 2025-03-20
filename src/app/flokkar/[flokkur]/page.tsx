import Navigation from '@/components/Navigation/Navigation';
import { QuestionsApi } from '@/api';
import { notFound } from 'next/navigation';
import Category from '@/components/Category/Category';

type CategoryPageProps = {
  params: { flokkur: string } | Promise<{ flokkur: string }>;
};

export default async function CategoryPage({ params }: CategoryPageProps) {
  // Ensure that params is a resolved object:
  const resolvedParams = params instanceof Promise ? await params : params;
  const { flokkur } = resolvedParams;

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