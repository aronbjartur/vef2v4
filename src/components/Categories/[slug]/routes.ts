import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const category = await prisma.categories.findFirst({
      where: {
        name: { equals: params.slug.replace(/-/g, ' '), mode: 'insensitive' },
      },
      include: { questions: { include: { answers: true } } },
    });

    if (!category) return NextResponse.json({ error: 'Category not found' }, { status: 404 });

    return NextResponse.json({
      id: category.id.toString(),
      slug: category.name.toLowerCase().replace(/\s+/g, '-'),
      name: category.name,
      questions: category.questions.map(q => ({
        id: q.id,
        text: q.text,
        answers: q.answers.map(a => ({ id: a.id, text: a.text, correct: a.correct })),
      })),
    });
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching category' }, { status: 500 });
  }
}