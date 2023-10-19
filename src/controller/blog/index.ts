import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";

//----------------------------------------------
// create blog
//----------------------------------------------
export const createPostController = expressAsyncHandler(
  async (req: any, res: Response) => {
    console.log(req.body);

    try {
      res.json({
        message: `Blog was created successfully`,
        post: { ...req.body, image: req.file.filename },
      });
    } catch (error) {
      res.json(error);
    }
  }
);
