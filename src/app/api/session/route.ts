// src/app/api/session/route.ts
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { SessionData } from '@/types/session';
import { sessionOptions, defaultSession } from '@/lib/session';

export async function GET() {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
  
  // Auto-create guest session if none exists
  if (!session.guestId && !session.userId) {
    Object.assign(session, {
      ...defaultSession,
      guestId: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    });
    await session.save();
  }
  
  return NextResponse.json(session);
}

export async function POST(request: Request) {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
  const data = await request.json();
  
  // Update session with new data
  Object.assign(session, data);
  await session.save();
  
  return NextResponse.json({ success: true });
}