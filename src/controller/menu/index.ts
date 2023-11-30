// import { Request, Response } from "express";
// import expressAsyncHandler from "express-async-handler";
// import { prisma } from "../../../src/lib/prisma-client";
// import { PrismaClientValidationError } from "@prisma/client/runtime/library";
// import { responseError } from "../../../src/helper/helper";

// //----------------------------------------------
// // create blog
// //----------------------------------------------

// export const createController = expressAsyncHandler(
//   async (req: Request, res: Response) => {
//     const checkIfExist = await prisma.menu.findFirst({
//       where: {
//         name: req.body.name,
//       },
//     });
//     if (checkIfExist) {
//       throw new Error(`Sorry you menu already exist`);
//     }

//     try {
//       const menu = await prisma.menu.create({
//         data: {
//           ...req.body,
//           name: req.body.name,
//           url: req.body.url,
//           status: req.body.status ? req.body.status : false,
//         },
//       });

//       res.json({
//         message: `Menu was created successfully`,
//         menu: menu,
//       });
//     } catch (error) {
//       responseError(error, res);
//     }
//   }
// );
