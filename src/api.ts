import { Category, Paginated } from './types';
import prisma from './lib/prisma';

async function getAllCategories(): Promise<Category[]> {
  const categories = await prisma.categories.findMany();
  return categories.map(c => ({
    id: c.id.toString(),
    slug: c.name.toLowerCase().replace(/\s+/g, '-'),
    name: c.name,
  }));
}

async function getCategoryBySlug(
  slug: string
): Promise<Category & { questions?: any[] } | null> {
  const category = await prisma.categories.findFirst({
    where: {
      name: {
        equals: slug.replace(/-/g, ' '),
        mode: 'insensitive',
      },
    },
    include: {
      questions: {
        include: { answers: true },
      },
    },
  });
  if (!category) return null;
  return {
    id: category.id.toString(),
    slug: category.name.toLowerCase().replace(/\s+/g, '-'),
    name: category.name,
    questions: category.questions.map(q => ({
      id: q.id,
      text: q.text,
      answers: q.answers.map(a => ({
        id: a.id,
        text: a.text,
        correct: a.correct,
      })),
    })),
  };
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';

export class QuestionsApi {
  async fetchFromApi<T>(url: string): Promise<T | null> {
    if (url === BASE_URL + '/categories') {
      try {
        const categories = await getAllCategories();
        const paginated: Paginated<Category> = {
          data: categories,
          total: categories.length,
          limit: categories.length,
          offset: 0,
        };
        return paginated as T;
      } catch (e) {
        console.error('Error in local getAllCategories', e);
        return null;
      }
    } else if (url.startsWith(BASE_URL + '/categories/')) {
      const slug = url.replace(BASE_URL + '/categories/', '');
      try {
        const category = await getCategoryBySlug(slug);
        return category as T;
      } catch (e) {
        console.error('Error in local getCategoryBySlug', e);
        return null;
      }
    }
    try {
      const response = await fetch(url);
      if (!response.ok) {
        console.error('non 2xx status from API', url);
        return null;
      }
      const json = await response.json();
      return json as T;
    } catch (e) {
      console.error('error fetching from api', url, e);
      return null;
    }
  }

  async getCategory(
    slug: string
  ): Promise<Category & { questions?: any[] } | null> {
    const url = BASE_URL + `/categories/${slug}`;
    return this.fetchFromApi(url);
  }

  async getCategories(): Promise<Paginated<Category> | null> {
    const url = BASE_URL + '/categories';
    return this.fetchFromApi(url);
  }
}