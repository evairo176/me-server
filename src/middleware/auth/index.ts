import { prisma } from "../../lib/prisma-client";

const expressAsyncHandler = require("express-async-handler");

const jwt = require("jsonwebtoken");

export const authMiddleware = expressAsyncHandler(
  async (req: any, res: any, next: any) => {
    let token;

    if (req?.headers?.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];

      try {
        if (token) {
          const decoded = jwt.verify(token, process.env.JWT_KEY);

          const { id, iat, exp } = decoded;

          // find the user by id
          const user = await prisma.user.findFirst({
            where: {
              id: id,
            },
            select: {
              id: true,
              fullname: true,
              email: true,
              username: true,
              profile_img: true,
            },
          });

          // attach the user to the request object
          // console.log(user);
          req.user = user;
          req.token_detail = { iat, exp };
          next();
        }
      } catch (error) {
        return res.status(401).send({
          message: "Authorization error",
        });
      }
    } else {
      throw new Error("There is no token attached to the header");
    }
  }
);
