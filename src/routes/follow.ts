import express from "express";
import {ensureAuthUser} from "@/middlewares/authentication";
import {createFollow, deleteFollow} from "@/models/follow";

export const followRouter = express.Router();

followRouter.post("/follows/:userId", ensureAuthUser, async (req, res, next) => {
  const {userId} = req.params;
  const currentUserId = req.authentication?.currentUserId;
  if (currentUserId === undefined) {
    // `ensureAuthUser` enforces `currentUserId` is not undefined.
    // This must not happen.
    return next(new Error("Invalid error: currentUserId is undefined."));
  }
  await createFollow({followingId: Number(currentUserId), followedId: Number(userId)});
  res.redirect(`/users/${userId}`);
});

followRouter.delete("/follows/:userId", ensureAuthUser, async (req, res, next) => {
  const {userId} = req.params;
  const currentUserId = req.authentication?.currentUserId;
  if (currentUserId === undefined) {
    // `ensureAuthUser` enforces `currentUserId` is not undefined.
    // This must not happen.
    return next(new Error("Invalid error: currentUserId is undefined."));
  }
  await deleteFollow({followingId: Number(currentUserId), followedId: Number(userId)});
  res.redirect(`/users/${userId}`);
});
