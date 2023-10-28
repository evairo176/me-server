import { Response } from "express";
import expressAsyncHandler from "express-async-handler";
import slug from "slug";
import { prisma } from "../../lib/prisma-client";
import {
  deleteFile,
  deleteImage,
  deleteImageSupabase,
  sharpUpload,
  supabaseUpload,
} from "../../helper/helper";
import { PrismaClientValidationError } from "@prisma/client/runtime/library";
const fs = require("fs");

//----------------------------------------------
// create tag
//----------------------------------------------

async function insertTagsIfNotExist(tagArray: []) {
  const createdTags = [];

  for (const tagName of tagArray) {
    try {
      const tag = await prisma.tag.upsert({
        where: { name: tagName },
        create: {
          name: tagName,
        },
        update: {},
      });

      createdTags.push(tag);
    } catch (error) {
      // Handle any errors, such as unique constraint violations (duplicate tag names)
      console.error("Error inserting tag:", error);
    }
  }

  return createdTags;
}

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

    let localPath: string = "";
    if (req?.file) {
      // // 1. get the path to img
      const fileBuffer = fs.readFileSync(req.file.path);
      localPath = await supabaseUpload(fileBuffer);
    }

    const tags = JSON.parse(req.body.Tags);
    //update
    if (localPath == "") {
      throw new Error(`Image something wrong try new image`);
    }

    try {
      const blog = await prisma.blog.create({
        data: {
          ...req.body,
          authorId: id,
          slug: slugTitle,
          image: localPath,
          content: req.body.content,
          draft: req.body.draft === "1" ? true : false,
          Tags: {
            connectOrCreate: tags.map((tag: string) => ({
              where: { name: tag },
              create: { name: tag },
            })),
          },
        },
      });

      res.json({
        message: `Blog was created successfully`,
        blog: blog,
      });
    } catch (error) {
      if (error instanceof PrismaClientValidationError) {
        res.json(error);
        console.error("Prisma Validation Error Message:", error.message);
      } else {
        console.error("Non-Prisma Validation Error:", error);
      }
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
    include: {
      Tags: true,
      Categories: true,
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
        Tags: true,
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

    // const checkSlug = await prisma.blog.findFirst({
    //   where: {
    //     slug: slugTitle,
    //   },
    // });

    // if (checkSlug) {
    //   throw new Error(
    //     `Creating failed because ${slugTitle} content already exist`
    //   );
    // }

    let localPath: string = "";
    if (req?.file) {
      // // 1. get the path to img
      const fileBuffer = fs.readFileSync(req.file.path);
      localPath = await supabaseUpload(fileBuffer);

      if (localPath != "") {
        deleteImageSupabase(blog?.image);
      }
    }

    const tags = JSON.parse(req.body.Tags);
    //update
    if (localPath == "") {
      localPath = blog?.image;
    }

    try {
      const blogUpdate = await prisma.blog.update({
        data: {
          ...req.body,
          authorId: authorId,
          slug: slugTitle,
          image: localPath,
          content: req.body.content,
          draft: req.body.draft === "1" ? true : false,
          Tags: {
            connectOrCreate: tags.map((tag: string) => ({
              where: { name: tag },
              create: { name: tag },
            })),
          },
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
      deleteImageSupabase(deleteBlog?.image);
    }

    res.json({
      message: `Deleted blog successfully`,
      blog: deleteBlog,
    });
  } catch (error) {
    res.json(error);
  }
});

//----------------------------------------------
// fetch all blog by user
//----------------------------------------------

export const fetchAllblogByUserController = expressAsyncHandler(
  async (req, res) => {
    const { id } = req.params;

    const blog = await prisma.blog.findMany({
      include: {
        Tags: true,
        Categories: true,
        Author: {
          where: {
            id: id,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    if (!blog) throw new Error(`Blog not found`);

    try {
      res.json({
        message: `Showed data detail blog successfully`,
        blog: blog,
      });
    } catch (error) {
      res.json(error);
    }
  }
);

//----------------------------------------------
// fetch single blog by slug
//----------------------------------------------

export const fetchBlogBySlugController = expressAsyncHandler(
  async (req, res) => {
    const { slug } = req.params;

    const checkIfExist = await prisma.blog.findFirst({
      where: {
        slug: slug,
      },
      include: {
        Tags: true,
        Categories: true,
      },
    });
    if (!checkIfExist) throw new Error(`Blog not found`);

    try {
      const blog = await prisma.blog.findFirst({
        where: {
          slug: slug,
        },
        include: {
          Author: true,
          Tags: true,
        },
      });
      res.json({
        message: `Showed data detail blog successfully`,
        blog: blog,
      });
    } catch (error) {
      res.json(error);
    }
  }
);
