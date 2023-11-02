import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import { prisma } from "../../../src/lib/prisma-client";
import { PrismaClientValidationError } from "@prisma/client/runtime/library";

//----------------------------------------------
// create blog
//----------------------------------------------

export const createController = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const checkIfExist = await prisma.role.findFirst({
      where: {
        name: req.body.name,
      },
    });
    if (checkIfExist) {
      throw new Error(`Sorry you role already exist`);
    }
    try {
      const role = await prisma.role.create({
        data: {
          ...req.body,
        },
      });

      res.json({
        message: `Role was created successfully`,
        role: role,
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
// fetch all blog
//----------------------------------------------

export const fetchAllRoleController = expressAsyncHandler(async (req, res) => {
  const role = await prisma.role.findMany({
    include: {
      users: true,
      menus: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  if (!role) throw new Error(`Blog not found`);

  try {
    res.json({
      message: `Showed data detail blog successfully`,
      role: role,
    });
  } catch (error) {
    res.json(error);
  }
});

//----------------------------------------------
// delete role
//----------------------------------------------

export const deleteController = expressAsyncHandler(async (req, res) => {
  const ids = req.body.idArray;

  // check validation
  const checkIfExist = await prisma.role.findMany({
    where: {
      id: {
        in: ids,
      },
    },
  });

  if (checkIfExist.length < 1) throw new Error(`Role not found`);

  try {
    const deleteRole = await prisma.role.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
    if (deleteRole.count === 0) {
      res.status(400).json({
        message: `data not found`,
        role: deleteRole,
      });
    } else {
      res.json({
        message: `Deleted Role successfully`,
        role: checkIfExist,
      });
    }
  } catch (error) {
    res.json(error);
  }
});
