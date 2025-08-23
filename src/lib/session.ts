import { SessionOptions } from 'iron-session';
import { SessionData } from '@/types/session';

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET!,
  cookieName: "career-session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
};

export const defaultSession: SessionData = {
  isGuest: true,
  isLoggedIn: false,
  assessmentProgress: {
    phase1Complete: false,
    phase2Complete: false,
    phase3Complete: false,
  },
};