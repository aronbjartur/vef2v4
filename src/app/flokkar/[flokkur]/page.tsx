import Navigation from '@/components/Navigation/Navigation';
import { QuestionsApi } from '@/api';
import { notFound } from 'next/navigation';
import Category from '@/components/Category/Category';

type Params = {
  params: {
    flokkur: string;
  };
};

async function getCategoryData(slug: string) {
    const api = new QuestionsApi();
    const category = await api.getCategory(slug.toLowerCase().replace(/\s+/g, '-')); 
  
    return category || null;
  }

export default async function CategoryPage({ params }: Params) {
  const { flokkur } = params;
  const categoryData = await getCategoryData(flokkur);

  if (!categoryData) {
    notFound();
    return null;
  }

  return (
    <div>
      <Navigation />
      <Category slug={flokkur} initialData={categoryData} />
    </div>
  );
}