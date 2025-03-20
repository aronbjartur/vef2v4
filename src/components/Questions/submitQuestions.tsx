'use server';

import prisma from '@/lib/prisma';
import { z } from 'zod';
import xss from 'xss';

const CategorySchema = z.object({
  title: z.string().min(3).max(1024),
});

const QuestionSchema = z.object({
  text: z.string().min(3).max(1024),
});

export async function submitQuestion(formData: FormData) {
  const question = formData.get('question') as string;
  const categoryId = formData.get('category_id') as string;
  const newCategory = formData.get('new_category') as string | null;
  const correctAnswerStr = formData.get('correct_answer') as string;
  let answers = formData.getAll('answers[]') as string[];

  if (!question || !correctAnswerStr || !answers.length) {
    throw new Error('Missing required fields');
  }

  const correctAnswer = parseInt(correctAnswerStr, 10);
  let finalCategoryId: number;

  if (categoryId === 'new') {
    if (!newCategory?.trim()) {
      throw new Error('New category name is required');
    }
    
    const parsed = CategorySchema.safeParse({ title: newCategory });
    if (!parsed.success) {
      throw new Error('Invalid category name');
    }

    const safeTitle = xss(newCategory);
    const createdCategory = await prisma.categories.create({ data: { name: safeTitle } });
    finalCategoryId = createdCategory.id;
  } else {
    finalCategoryId = parseInt(categoryId, 10);
  }
 
  const parsedQuestion = QuestionSchema.safeParse({ text: question });
  if (!parsedQuestion.success) {
    throw new Error('Invalid question text');
  }

  const createdQuestion = await prisma.questions.create({
    data: { category_id: finalCategoryId, text: question },
  });

  const questionId = createdQuestion.id;

  if (!Array.isArray(answers)) answers = [answers];

  await prisma.answers.createMany({
    data: answers.map((text, i) => ({
      question_id: questionId,
      text: text.trim(),
      correct: i + 1 === correctAnswer,
    })),
  });

  return { message: 'Spurning gerð', questionId };
}