'use server';

import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { signIn as nextAuthSignIn } from 'next-auth/react';

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
      console.error('User not found:', email);
      return { error: 'Invalid email or password' };
    }

    // TODO: implement proper password hashing/verification with bcrypt
    // For demo: accept the demo password
    if (password !== 'Demo@2026!') {
      console.error('Invalid password for user:', email);
      return { error: 'Invalid email or password' };
    }

    console.log('Authentication successful for:', email);
    return { success: true };
  } catch (error) {
    console.error('Authentication error:', error);
    return { error: 'An error occurred during authentication' };
  }
}
