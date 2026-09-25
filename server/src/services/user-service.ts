import { db } from '../lib/db.js';

export class UserService {
  static async getUserProfile(userId: string) {
    const user = await db.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        preferences: true,
      },
    });

    if (!user) throw new Error('User record not found');

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      profile: user.profile,
      preferences: user.preferences,
    };
  }

  static async updateProfile(userId: string, data: { name?: string; title?: string; company?: string; location?: string; bio?: string }) {
    if (data.name) {
      await db.user.update({
        where: { id: userId },
        data: { name: data.name },
      });
    }

    const updatedProfile = await db.profile.upsert({
      where: { userId },
      update: {
        title: data.title,
        company: data.company,
        location: data.location,
        bio: data.bio,
      },
      create: {
        userId,
        title: data.title || 'Head of Analytics',
        company: data.company || 'Acme Corp',
        location: data.location || 'San Francisco, CA',
        bio: data.bio || '',
      },
    });

    return updatedProfile;
  }

  static async updatePreferences(userId: string, preferences: Record<string, any>) {
    return db.userPreference.upsert({
      where: { userId },
      update: { ...preferences },
      create: {
        userId,
        ...preferences,
      },
    });
  }
}
