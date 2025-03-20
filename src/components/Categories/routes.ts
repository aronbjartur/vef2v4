import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const categories = await prisma.categories.findMany();
    return NextResponse.json({
      data: categories.map(c => ({
        id: c.id.toString(),
        slug: c.name.toLowerCase().replace(/\s+/g, '-'),
        name: c.name,
      })),
    });
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching categories' }, { status: 500 });
  }
}