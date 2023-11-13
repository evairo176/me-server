import expressAsyncHandler from "express-async-handler";
import { prisma } from "../../../src/lib/prisma-client";

//----------------------------------------------
// fetch all blog
//----------------------------------------------

export const fetchAllLanguageController = expressAsyncHandler(
  async (req, res) => {
    let languages = await prisma.language.findMany({
      orderBy: {
        name: "asc",
      },
      where: {
        status: true,
      },
    });
    if (!languages) throw new Error(`Language not found`);

    try {
      res.json({
        message: `Showed data detail Language successfully`,
        language: languages,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  }
);
