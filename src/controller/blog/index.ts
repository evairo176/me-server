import { Response } from "express";
import expressAsyncHandler from "express-async-handler";
import slug from "slug";
import { prisma } from "../../lib/prisma-client";
import { deleteImageSupabase, supabaseUpload } from "../../helper/helper";
import { PrismaClientValidationError } from "@prisma/client/runtime/library";
const fs = require("fs");

//----------------------------------------------
// create blog
//----------------------------------------------
export const createController = expressAsyncHandler(
  async (req: any, res: Response) => {
    const { id } = req.user;

    const slugTitle = slug(req.body.slug);

    // const checkIfExist = await prisma.blog.findFirst({
    //   where: {
    //     slug: slugTitle,
    //   },
    // });

    // if (checkIfExist) {
    //   throw new Error(
    //     `Creating failed because ${slugTitle} content already exist`
    //   );
    // }

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
          lang: req.body.lang,
          slug: slugTitle,
          image: localPath,
          content: req.body.content,
          draft: req.body.draft === "1" ? true : false,
          Tags: {
            connectOrCreate: tags.map((tag: string) => ({
              where: { unique_name_lang: { name: tag, lang: req.body.lang } },
              create: { name: tag, lang: req.body.lang },
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
        res.status(500).json(error);
        console.error("Prisma Validation Error Message:", error.message);
      } else {
        console.error("Non-Prisma Validation Error:", error);
      }
      res.status(500).json(error);
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
    res.status(500).json(error);
  }
});

//----------------------------------------------
// update blog
//----------------------------------------------

export const updateController = expressAsyncHandler(
  async (req: any, res: any) => {
    const { id } = req.params;
    const { authorId } = req.user;
    const slugTitle = slug(req.body.slug);

    const blog = await prisma.blog.findFirst({
      where: {
        id: id,
      },
      include: {
        Tags: true,
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

    // console.log(req.body)

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
          lang: req.body.lang,
          image: localPath,
          content: req.body.content,
          draft: req.body.draft === "1" ? true : false,
          Tags: {
            disconnect: blog.Tags, // detach existing tagsc
            connectOrCreate: tags.map((tag: string) => ({
              where: { unique_name_lang: { name: tag, lang: req.body.lang } },
              create: { name: tag, lang: req.body.lang },
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
      if (error instanceof PrismaClientValidationError) {
        res.statusCode.json(error);
        console.error("Prisma Validation Error Message:", error.message);
      } else {
        console.error("Non-Prisma Validation Error:", error);
      }
      res.status(500).json(error);
    }
  }
);

//----------------------------------------------
// delete blog
//----------------------------------------------

export const deleteController = expressAsyncHandler(async (req, res) => {
  const ids = req.body.idArray;

  // check validation
  const checkIfExist = await prisma.blog.findMany({
    where: {
      id: {
        in: ids,
      },
    },
  });

  if (checkIfExist.length < 1) throw new Error(`Role not found`);

  checkIfExist.forEach((element) => {
    if (element.image != "") {
      deleteImageSupabase(element.image);
    }
  });

  try {
    const deleteBlog = await prisma.blog.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
    if (deleteBlog.count === 0) {
      res.status(400).json({
        message: `data not found`,
        role: deleteBlog,
      });
    } else {
      res.json({
        message: `Deleted Role successfully`,
        blog: checkIfExist,
      });
    }
  } catch (error) {
    res.status(500).json(error);
  }

  // const { id } = req.params;
  // // check validation
  // const checkIfExist = await prisma.blog.findFirst({
  //   where: {
  //     id: id,
  //   },
  // });
  // if (!checkIfExist) throw new Error(`Blog not found`);

  // try {
  //   const deleteBlog = await prisma.blog.delete({
  //     where: {
  //       id: id,
  //     },
  //   });

  //   if (deleteBlog?.image != "") {
  //     deleteImageSupabase(deleteBlog?.image);
  //   }

  //   res.json({
  //     message: `Deleted blog successfully`,
  //     blog: deleteBlog,
  //   });
  // } catch (error) {
  //   res.status(500).json(error);
  // }
});

//----------------------------------------------
// fetch all blog by user
//----------------------------------------------

export const fetchAllblogByUserController = expressAsyncHandler(
  async (req, res) => {
    const { id } = req.params;

    let blog: any[] = [];
    if (req.query.lang !== "") {
      blog = await prisma.blog.findMany({
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
        where: {
          draft: true,
          lang: req.query.lang as string,
        },
      });
    } else {
      blog = await prisma.blog.findMany({
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
        where: {
          draft: true,
        },
      });
    }

    if (!blog) throw new Error(`Blog not found`);

    try {
      res.json({
        message: `Showed data detail blog successfully`,
        blog: blog,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

//----------------------------------------------
// fetch single blog by slug
//----------------------------------------------

export const fetchBlogBySlugController = expressAsyncHandler(
  async (req, res) => {
    const { slug } = req.params;

    let blog: any = {};
    if (req.query.lang !== "") {
      blog = await prisma.blog.findFirst({
        where: {
          slug: slug,
          lang: req.query.lang as string,
        },
        include: {
          Tags: true,
          Categories: true,
          Author: true,
        },
      });
    } else {
      blog = await prisma.blog.findFirst({
        where: {
          slug: slug,
        },
        include: {
          Tags: true,
          Categories: true,
          Author: true,
        },
      });
    }
    if (!blog) throw new Error(`Blog not found`);
    const idTagsArray = blog?.Tags?.map((item: any) => item.id);

    let tagsRelevant: any = [];
    if (req.query.lang !== "") {
      tagsRelevant = await prisma.tag.findMany({
        where: {
          id: {
            notIn: idTagsArray,
          },
          lang: req.query.lang as string,
        },
        orderBy: {
          Blogs: {
            _count: "desc",
          },
        },
        include: {
          Blogs: true,
        },
        take: 10,
      });
    } else {
      tagsRelevant = await prisma.tag.findMany({
        where: {
          id: {
            notIn: idTagsArray,
          },
        },
        orderBy: {
          Blogs: {
            _count: "desc",
          },
        },
        include: {
          Blogs: true,
        },
        take: 10,
      });
    }

    const exampleTagsRelevant = tagsRelevant.map((tag: any) => ({
      ...tag,
      blogCount: tag.Blogs.length,
    }));

    try {
      res.json({
        message: `Showed data detail blog successfully`,
        blog: blog,
        tagsRelevant: exampleTagsRelevant,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

//----------------------------------------------
// fetch all blog
//----------------------------------------------

export const fetchAllblogController = expressAsyncHandler(async (req, res) => {
  let blog: any[] = [];
  const categorySlug = req.query.category
    ? (req.query.category as string)
    : undefined;
  const user = req.query.user_id ? (req.query.user_id as string) : undefined;
  const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
  if (req.query.lang !== "") {
    blog = await prisma.blog.findMany({
      include: {
        Tags: true,
        Categories: true,
        Author: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      where: {
        draft: true,
        lang: req.query.lang as string,
        Categories: {
          slug: categorySlug,
        },
        Author: {
          id: user,
        },
      },
      take: limit,
    });
  } else {
    blog = await prisma.blog.findMany({
      include: {
        Tags: true,
        Categories: true,
        Author: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      where: {
        draft: true,
        Categories: {
          slug: categorySlug,
        },
        Author: {
          id: user,
        },
      },
      take: limit,
    });
  }
  if (!blog) throw new Error(`Blog not found`);

  let tagsRelevant: any = [];
  if (req.query.lang !== "") {
    tagsRelevant = await prisma.tag.findMany({
      where: {
        lang: req.query.lang as string,
      },
      orderBy: {
        Blogs: {
          _count: "desc",
        },
      },
      include: {
        Blogs: true,
      },
      take: 10,
    });
  } else {
    tagsRelevant = await prisma.tag.findMany({
      orderBy: {
        Blogs: {
          _count: "desc",
        },
      },
      include: {
        Blogs: true,
      },
      take: 10,
    });
  }

  const exampleTagsRelevant = tagsRelevant?.map((tag: any) => ({
    ...tag,
    blogCount: tag.Blogs.length,
  }));

  try {
    res.json({
      message: `Showed data detail blog successfully`,
      blog: blog,
      tagsRelevant: exampleTagsRelevant,
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

//----------------------------------------------
// fetch all blog by slug category
//----------------------------------------------

export const fetchAllblogBySlugCategoryController = expressAsyncHandler(
  async (req, res) => {
    const categorySlug = req.query.categorySlug as string;
    let blog: any[] = [];
    if (req.query.lang !== "") {
      blog = await prisma.blog.findMany({
        include: {
          Tags: true,
          Categories: true,
          Author: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        where: {
          draft: true,
          lang: req.query.lang as string,
          Categories: {
            slug: categorySlug ? categorySlug : "",
          },
        },
      });
    } else {
      blog = await prisma.blog.findMany({
        include: {
          Tags: true,
          Categories: true,
          Author: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        where: {
          draft: true,
          Categories: {
            slug: categorySlug ? categorySlug : "",
          },
        },
      });
    }
    if (!blog) throw new Error(`Blog not found`);

    let tagsRelevant: any = [];
    if (req.query.lang !== "") {
      tagsRelevant = await prisma.tag.findMany({
        where: {
          lang: req.query.lang as string,
        },
        orderBy: {
          Blogs: {
            _count: "desc",
          },
        },
        include: {
          Blogs: true,
        },
        take: 10,
      });
    } else {
      tagsRelevant = await prisma.tag.findMany({
        orderBy: {
          Blogs: {
            _count: "desc",
          },
        },
        include: {
          Blogs: true,
        },
        take: 10,
      });
    }

    console.log(tagsRelevant);

    const exampleTagsRelevant = tagsRelevant?.map((tag: any) => ({
      ...tag,
      blogCount: tag.Blogs.length,
    }));

    try {
      res.json({
        message: `Showed data detail blog successfully`,
        blog: blog,
        tagsRelevant: exampleTagsRelevant,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

//----------------------------------------------
// fetch all blog by category slug
//----------------------------------------------

export const fetchAllblogByCategorySlugController = expressAsyncHandler(
  async (req, res) => {
    const { categorySlug } = req.params;

    let blog: any = {};
    if (req.query.lang !== "") {
      blog = await prisma.category.findFirst({
        include: {
          Blog: {
            where: {
              lang: req.query.lang as string,
              draft: true,
            },
            include: {
              Author: true,
              Tags: true,
              Categories: true,
            },
            orderBy: {
              createdAt: "desc",
            },
          },
        },
        where: {
          slug: categorySlug,
          lang: req.query.lang as string,
        },
      });
    } else {
      blog = await prisma.category.findFirst({
        include: {
          Blog: {
            where: {
              draft: true,
            },
            include: {
              Author: true,
              Tags: true,
              Categories: true,
            },
            orderBy: {
              createdAt: "desc",
            },
          },
        },
        where: {
          slug: categorySlug,
          lang: req.query.lang as string,
        },
      });
    }

    if (!blog) throw new Error(`Blog not found`);

    let tagsRelevant: any = [];
    if (req.query.lang !== "") {
      tagsRelevant = await prisma.tag.findMany({
        where: {
          lang: req.query.lang as string,
        },
        orderBy: {
          Blogs: {
            _count: "desc",
          },
        },
        include: {
          Blogs: {
            where: {
              Categories: {
                slug: categorySlug,
              },
            },
          },
        },
        take: 10,
      });
    } else {
      tagsRelevant = await prisma.tag.findMany({
        orderBy: {
          Blogs: {
            _count: "desc",
          },
        },
        include: {
          Blogs: {
            where: {
              Categories: {
                slug: categorySlug,
              },
            },
          },
        },
        take: 10,
      });
    }

    const exampleTagsRelevant = tagsRelevant.map((tag: any) => ({
      ...tag,
      blogCount: tag.Blogs.length,
    }));

    try {
      res.json({
        message: `Showed data detail blog successfully`,
        blog: blog,
        tagsRelevant: exampleTagsRelevant,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  }
);
