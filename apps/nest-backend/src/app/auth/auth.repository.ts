import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface GoogleUserProfile {
  providerUserId: string;
  email: string;
  displayName?: string;
  profileImageUrl?: string;
}

export interface AppUser {
  id: string;
  email: string;
}

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findOrCreateGoogleUser(profile: GoogleUserProfile): Promise<AppUser> {
    const provider = 'google';

    const linkedUser = await this.prisma.oAuthAccount.findUnique({
      where: {
        provider_providerUserId: {
          provider,
          providerUserId: profile.providerUserId
        }
      },
      include: {
        user: true
      }
    });

    if (linkedUser?.user && !linkedUser.user.deletedAt) {
      return this.toAppUser(linkedUser.user);
    }

    return this.prisma.$transaction(async (tx) => {
      const existingUser = await tx.user.findFirst({
        where: {
          email: profile.email,
          deletedAt: null
        }
      });

      const user =
        existingUser ??
        (await tx.user.create({
          data: {
            email: profile.email,
            displayName: profile.displayName,
            profileImageUrl: profile.profileImageUrl
          }
        }));

      await tx.oAuthAccount.upsert({
        where: {
          userId_provider: {
            userId: user.id,
            provider
          }
        },
        update: {
          providerUserId: profile.providerUserId,
          emailAtProvider: profile.email,
          updatedAt: new Date()
        },
        create: {
          userId: user.id,
          provider,
          providerUserId: profile.providerUserId,
          emailAtProvider: profile.email
        }
      });

      return this.toAppUser(user);
    });
  }

  private toAppUser(user: { id: string; email: string }): AppUser {
    return {
      id: user.id,
      email: user.email
    };
  }
}
