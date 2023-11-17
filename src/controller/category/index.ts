import expressAsyncHandler from "express-async-handler";
import { prisma } from "../../lib/prisma-client";

//----------------------------------------------
// all category
//----------------------------------------------

export const AllCtegoryController = expressAsyncHandler(async (req, res) => {
  try {
    let category: any[] = [];
    if (req.query.lang !== "") {
      category = await prisma.category.findMany({
        where: {
          lang: req.query.lang as string,
        },
      });
    } else {
      category = await prisma.category.findMany({});
    }

    res.json({
      message: "Get detail category successfully",
      category: category,
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

//----------------------------------------------
// fetch category by slug
//----------------------------------------------

export const fetchCategoryBySlugController = expressAsyncHandler(
  async (req, res) => {
    const { categorySlug } = req.params;

    let category: any = {};
    if (req.query.lang !== "") {
      category = await prisma.category.findFirst({
        where: {
          slug: categorySlug,
          lang: req.query.lang as string,
        },
      });
    } else {
      category = await prisma.category.findFirst({
        where: {
          slug: categorySlug,
        },
      });
    }

    if (!category) throw new Error(`Blog not found`);

    try {
      res.json({
        message: `Showed data detail blog successfully`,
        category: category,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  }
);
