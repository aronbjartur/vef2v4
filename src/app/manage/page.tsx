import Navigation from '@/components/Navigation/Navigation';
import { QuestionsApi } from '@/api';
import ManageForm from './ManageForm';

export default async function ManagePage() {
  const api = new QuestionsApi();
  const categoriesResponse = await api.getCategories(); 
  const categories = categoriesResponse?.data || []; 

  return (
    <>
      <Navigation />
      <h1>Búa til spurningu</h1>
      {}
      <ManageForm initialCategories={categories} />
    </>
  );
}