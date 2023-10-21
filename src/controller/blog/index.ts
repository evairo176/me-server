import { Response } from "express";
import expressAsyncHandler from "express-async-handler";
import slug from "slug";
import { prisma } from "../../lib/prisma-client";
import { deleteFile, deleteImage, sharpUpload } from "../../helper/helper";
const fs = require("fs");

//----------------------------------------------
// create blog
//----------------------------------------------
export const createController = expressAsyncHandler(
  async (req: any, res: Response) => {
    const { id } = req.user;
    const slugTitle = slug(req.body.title);

    const checkIfExist = await prisma.blog.findFirst({
      where: {
        slug: slugTitle,
      },
    });

    if (checkIfExist) {
      throw new Error(
        `Creating failed because ${slugTitle} content already exist`
      );
    }

    // console.log(req.body.image);
    let localPath = "";
    if (req?.file) {
      // // 1. get the path to img
      localPath = await sharpUpload(req.file, req?.body?.title);
    }

    try {
      const blog = await prisma.blog.create({
        data: {
          ...req.body,
          authorId: id,
          slug: slugTitle,
          image: localPath,
          content: req.body.content,
        },
      });

      res.json({
        message: `Blog was created successfully`,
        blog: blog,
      });
    } catch (error) {
      res.json(error);
    }
  }
);

//----------------------------------------------
// fetch single blog to update
//----------------------------------------------

export const editController = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;

  const checkIfExist = await prisma.blog.findFirst({
    where: {
      id: id,
    },
  });
  if (!checkIfExist) throw new Error(`Blog not found`);

  try {
    const blog = await prisma.blog.findFirst({
      where: {
        id: id,
      },
      include: {
        Author: true,
      },
    });
    res.json({
      message: `Showed data detail blog successfully`,
      blog: blog,
    });
  } catch (error) {
    res.json(error);
  }
});

//----------------------------------------------
// update blog
//----------------------------------------------

export const updateController = expressAsyncHandler(
  async (req: any, res: any) => {
    const { id } = req.params;
    const { authorId } = req.user;
    const slugTitle = slug(req?.body?.title);

    const blog = await prisma.blog.findFirst({
      where: {
        id: id,
      },
    });

    if (!blog) {
      throw new Error(`Blog not found`);
    }

    const checkSlug = await prisma.blog.findFirst({
      where: {
        slug: slugTitle,
      },
    });

    if (checkSlug) {
      throw new Error(
        `Creating failed because ${slugTitle} content already exist`
      );
    }

    const bannerOld = blog?.image || "";
    let localPath = "";

    if (req?.file) {
      // // 1. get the path to img
      localPath = await sharpUpload(
        req.file,
        req?.body?.title ? req?.body?.title : blog?.title
      );
      if (localPath != "") {
        deleteImage(bannerOld);
      }
    }
    const imageUrl = localPath !== "" ? localPath : bannerOld;

    try {
      const blogUpdate = await prisma.blog.update({
        data: {
          ...req.body,
          authorId: authorId,
          slug: slugTitle,
          image: imageUrl,
          content: req.body.content,
        },
        where: {
          id: id,
        },
      });
      res.json({
        message: `Updated blog successfully`,
        blog: blogUpdate,
      });
    } catch (error) {
      res.json(error);
    }
  }
);

//----------------------------------------------
// delete blog
//----------------------------------------------

export const deleteController = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  // check validation
  const checkIfExist = await prisma.blog.findFirst({
    where: {
      id: id,
    },
  });
  if (!checkIfExist) throw new Error(`Blog not found`);

  try {
    const deleteBlog = await prisma.blog.delete({
      where: {
        id: id,
      },
    });

    if (deleteBlog?.image != "") {
      deleteImage(deleteBlog?.image || "");
    }

    res.json({
      message: `Deleted blog successfully`,
      blog: deleteBlog,
    });
  } catch (error) {
    res.json(error);
  }
});
