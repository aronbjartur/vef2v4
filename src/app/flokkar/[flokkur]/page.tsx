import Navigation from '@/components/Navigation/Navigation';
import { QuestionsApi } from '@/api';
import { notFound } from 'next/navigation';
import Category from '@/components/Category/Category';

type CategoryPageProps = {
  params: Promise<{ flokkur: string }>;
};

export default async function CategoryPage({ params }: CategoryPageProps) {
  // Await the params immediately:
  const { flokkur } = await params;
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