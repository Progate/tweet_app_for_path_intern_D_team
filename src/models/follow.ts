import {Follow} from "@prisma/client";
import {databaseManager} from "@/db/index";
import {UserWithoutPassword, selectUserColumnsWithoutPassword} from "./user";

type FollowData = Pick<Follow, "followedId" | "followingId">;

export const getUserFollowedCount = async (
  followedId: number
): Promise<number> => {
  const prisma = databaseManager.getInstance();
  const count = await prisma.follow.count({
    where: {
      followedId,
    },
  });
  return count;
};

export const getUserFollowingCount = async (
  followingId: number
): Promise<number> => {
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

export const getFollowedUsers = async (
  followedId: number
): Promise<Array<{followedAt: Date; following: UserWithoutPassword}>> => {
  const prisma = databaseManager.getInstance();
  const followers = await prisma.follow.findMany({
    where: {
      followedId,
    },
    select: {
      following: {
        select: {
          ...selectUserColumnsWithoutPassword,
        },
      },
      followedAt: true,
    },
    // TODO: 最近フォローした人順でsortしとくといいかもしれない
    orderBy: {
      followedAt: "desc",
    },
  });
  /**
   * select * from follows
   * join users on users.user_id = follows.followed_id
   * join users on users.user_id = follows.following_id
   * where followed_id = {みたいユーザーID}
   */
  return followers;
};

export const getFollowingUsers = async (
  followingId: number
): Promise<Array<{followedAt: Date; followed: UserWithoutPassword}>> => {
  const prisma = databaseManager.getInstance();
  const followings = await prisma.follow.findMany({
    where: {
      followingId,
    },
    select: {
      followed: {
        select: {
          ...selectUserColumnsWithoutPassword,
        },
      },
      followedAt: true,
    },
    orderBy: {
      followedAt: "desc",
    },
  });
  return followings;
};
