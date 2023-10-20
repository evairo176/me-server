import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import slug from "slug";
import { prisma } from "../../lib/prisma-client";
import { deleteFile } from "../../helper/helper";
const fs = require("fs");

//----------------------------------------------
// create blog
//----------------------------------------------
export const createController = expressAsyncHandler(
  async (req: any, res: Response) => {
    const { id } = req.user;
    const slugTitle = slug(req.body.title);

    const checkIfExist = await prisma.blog.findUnique({
      where: {
        slug: slugTitle,
      },
    });

    if (checkIfExist) {
      throw new Error(
        `Creating failed because ${slugTitle} content already exist`
      );
    }

    let localPath = "";
    if (req?.file?.filename) {
      // // 1. get the path to img
      localPath = `public/images/blogs/${req.file.filename}`;
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
      fs.unlinkSync(localPath);
      res.json(error);
    }
  }
);

//----------------------------------------------
// fetch single blog to update
//----------------------------------------------

export const editController = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;

  console.log(req.baseUrl);
  try {
    const blog = await prisma.blog.findUnique({
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

    const blog = await prisma.blog.findUnique({
      where: {
        id: id,
      },
    });

    if (!blog) {
      throw new Error(`Blog not found`);
    }

    const checkSlug = await prisma.blog.findUnique({
      where: {
        slug: slugTitle,
      },
    });

    if (checkSlug) {
      throw new Error(
        `Creating failed because ${slugTitle} content already exist`
      );
    }

    const bannerOld = blog?.image;
    let localPath = "";

    if (req?.file?.filename) {
      // // 1. get the path to img
      localPath = `public/images/blogs/${req.file.filename}`;

      fs.unlinkSync(bannerOld);
    }
    const imageUrl = localPath !== "" ? localPath : bannerOld;

    try {
      const postUpdate = await prisma.blog.update({
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
      res.json(postUpdate);
    } catch (error) {
      res.json(error);
      fs.unlinkSync(localPath);
    }
  }
);

//----------------------------------------------
// delete blog
//----------------------------------------------

const deleteController = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  // check validation
  const checkIfExist = await prisma.blog.findUnique({
    where: {
      id: id,
    },
  });
  if (checkIfExist) throw new Error(`Blog not found`);

  try {
    const deletePost = await prisma.blog.delete({
      where: {
        id: id,
      },
    });

    res.json(deletePost);
  } catch (error) {
    res.json(error);
  }
});
