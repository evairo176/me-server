import expressAsyncHandler from "express-async-handler";
import { prisma } from "../../lib/prisma-client";

//----------------------------------------------
// detail user
//----------------------------------------------

export const findAllController = expressAsyncHandler(async (req, res) => {
  try {
    const category = await prisma.category.findMany({});
    res.json({
      message: "Get detail category successfully",
      category: category,
    });
  } catch (error) {
    res.json(error);
  }
});
