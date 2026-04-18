'use server';

import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { signIn as nextAuthSignIn } from '@/lib/auth';

export async function authenticateUser(email: string, password: string) {
  try {
    if (!email || !password) {
      return { error: 'Email and password are required' };
    }

    // Find user in database
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user) {
      return { error: 'Invalid email or password' };
    }

    // TODO: implement proper password hashing/verification with bcrypt
    // For demo: accept the demo password
    if (password !== 'Demo@2026!') {
      return { error: 'Invalid email or password' };
    }

    // Create session using NextAuth
    const result = await nextAuthSignIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (!result || result.error) {
      return { error: result?.error || 'Failed to create session' };
    }

    return { success: true };
  } catch (error) {
    console.error('Authentication error:', error);
    return { error: 'An error occurred during authentication' };
  }
}
