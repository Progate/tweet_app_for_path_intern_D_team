import express from "express";
import {ensureAuthUser} from "@/middlewares/authentication";
import {createFollow, deleteFollow} from "@/models/follow";

export const followRouter = express.Router();

followRouter.post(
  "/:userId/follows",
  ensureAuthUser,
  async (req, res, next) => {
    const {userId} = req.params;
    const redirectUrl = req.query.redirect;
    const activeTab = req.query.activeTab;
    if (typeof redirectUrl !== "string") {
      return res.redirect("/");
    }
    const currentUserId = req.authentication?.currentUserId;
    if (currentUserId === undefined) {
      // `ensureAuthUser` enforces `currentUserId` is not undefined.
      // This must not happen.
      return next(new Error("Invalid error: currentUserId is undefined."));
    }
    await createFollow({
      followingId: Number(currentUserId),
      followedId: Number(userId),
    });
    res.redirect(redirectUrl + '&activeTab=' + activeTab);
  }
);

followRouter.delete(
  "/:userId/follows",
  ensureAuthUser,
  async (req, res, next) => {
    const {userId} = req.params;
    const redirectUrl = req.query.redirect;
    const activeTab = req.query.activeTab;
    if (typeof redirectUrl !== "string") {
      return res.redirect("/");
    }
    const currentUserId = req.authentication?.currentUserId;
    if (currentUserId === undefined) {
      // `ensureAuthUser` enforces `currentUserId` is not undefined.
      // This must not happen.
      return next(new Error("Invalid error: currentUserId is undefined."));
    }
    await deleteFollow({
      followingId: Number(currentUserId),
      followedId: Number(userId),
    });
    res.redirect(redirectUrl + '&activeTab=' + activeTab);
  }
);
