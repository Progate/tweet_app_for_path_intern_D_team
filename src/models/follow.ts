import {Follow} from "@prisma/client";
import {databaseManager} from "@/db/index";

type FollowData = Pick<Follow, "followedId" | "followingId">;

export const getUserFollowedCount = async (followedId: number): Promise<number> => {
  const prisma = databaseManager.getInstance();
  const count = await prisma.follow.count({
    where: {
      followedId,
    },
  });
  return count;
};

export const getUserFollowingCount = async (followingId: number): Promise<number> => {
  const prisma = databaseManager.getInstance();
  const count = await prisma.follow.count({
    where: {
      followingId,
    },
  });
  return count;
};

export const createFollow = async (followData: FollowData): Promise<Follow> => {
  const prisma = databaseManager.getInstance();
  const follow = await prisma.follow.create({
    data: followData,
  });
  return follow;
};

export const deleteFollow = async (followData: FollowData): Promise<Follow> => {
  const prisma = databaseManager.getInstance();
  const follow = await prisma.follow.delete({
    where: {
      /* eslint-disable camelcase */
      followedId_followingId: {
        followedId: followData.followedId,
        followingId: followData.followingId,
      },
      /* eslint-enable camelcase */
    },
  });
  return follow;
};

export const hasUserFollow = async (
  followedId: number,
  followingId: number
): Promise<boolean> => {
  const prisma = databaseManager.getInstance();
  const follow = await prisma.follow.findFirst({
    where: {
      followedId,
      followingId,
    },
  });
  return follow !== null;
};
