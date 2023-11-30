import expressAsyncHandler from "express-async-handler";
import { prisma } from "../../lib/prisma-client";
import { generateFromEmail, generateUsername } from "unique-username-generator";
import {
  generateRefreshToken,
  generateToken,
  responseError,
} from "../../helper/helper";
import { Request } from "express";
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

//----------------------------------------------
// Register
//----------------------------------------------

export const userRegisterController = expressAsyncHandler(async (req, res) => {
  let profile_imgs_name_list = [
    "Garfield",
    "Tinkerbell",
    "Annie",
    "Loki",
    "Cleo",
    "Angel",
    "Bob",
    "Mia",
    "Coco",
    "Gracie",
    "Bear",
    "Bella",
    "Abby",
    "Harley",
    "Cali",
    "Leo",
    "Luna",
    "Jack",
    "Felix",
    "Kiki",
  ];
  let profile_imgs_collections_list = [
    "notionists-neutral",
    "adventurer-neutral",
    "fun-emoji",
  ];

  // check if user is already registered
  const userExists = await prisma.user.findFirst({
    where: { email: req?.body?.email },
  });

  if (userExists) throw new Error("user already registered");
  // add three random digits
  const username = generateFromEmail(req?.body?.email, 5);
  const salt = await bcrypt.genSaltSync(10);
  const password = await bcrypt.hashSync(req?.body?.password, salt);
  // console.log(password);

  try {
    const user = await prisma.user.create({
      data: {
        ...req.body,
        username: username,
        password: password,
        image: `https://api.dicebear.com/6.x/${
          profile_imgs_collections_list[
            Math.floor(Math.random() * profile_imgs_collections_list.length)
          ]
        }/png?seed=${
          profile_imgs_name_list[
            Math.floor(Math.random() * profile_imgs_name_list.length)
          ]
        }`,
      },
    });
    res.json({
      message: "Register Successfully",
      user: user,
    });
  } catch (error) {
    responseError(error, res);
  }
});

//----------------------------------------------
// Register with provider
//----------------------------------------------

export const userRegisterProviderController = expressAsyncHandler(
  async (req, res) => {
    // check if user is already registered
    const userExists = await prisma.user.findFirst({
      where: { email: req?.body?.email },
    });

    if (userExists) throw new Error("user already registered");
    // add three random digits
    const username = generateFromEmail(req?.body?.email, 5);
    // console.log(password);
    // console.log(req?.body);

    try {
      const user = await prisma.user.create({
        data: {
          ...req.body,
          username: username,
          roleId: "cloi9ke8n000anl44pd0z72tt",
        },
      });
      res.json({
        message: "Register Successfully",
        user: user,
      });
    } catch (error) {
      responseError(error, res);
    }
  }
);

//----------------------------------------------
// Login
//----------------------------------------------

export const userLoginController = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;
  // check if user exists
  const userFound = await prisma.user.findFirst({
    where: {
      email: email,
    },
    include: {
      Role: {
        include: {
          Permission: true,
        },
      },
    },
  });
  if (!userFound) throw new Error("User not exist");

  const isPasswordMatched = await bcrypt.compare(password, userFound?.password);

  if (!isPasswordMatched) throw new Error("Password not matched");

  if (userFound) {
    const token = generateToken(userFound?.id);
    const refreshToken = generateRefreshToken(userFound?.id);

    res.json({
      message: "Login Successfully",
      user: {
        id: userFound?.id,
        name: userFound?.name,
        email: userFound?.email,
        username: userFound?.username,
        image: userFound?.image,
        Role: userFound?.Role,
      },
      token: token,
      refreshToken: refreshToken,
    });
  } else {
    res.status(401);
    throw new Error("Invalid login credentials");
  }
});

//----------------------------------------------
// Login with provider example google
//----------------------------------------------

export const userLoginProviderController = expressAsyncHandler(
  async (req, res) => {
    const { email, password } = req.body;
    // check if user exists
    const userFound = await prisma.user.findFirst({
      where: {
        email: email,
      },
      include: {
        Role: {
          include: {
            Permission: true,
          },
        },
      },
    });
    if (!userFound) throw new Error("User not exist");

    if (password) {
      const isPasswordMatched = await bcrypt.compare(
        password,
        userFound?.password
      );

      if (!isPasswordMatched) throw new Error("Password not matched");
    }

    if (userFound) {
      const token = generateToken(userFound?.id);
      const refreshToken = generateRefreshToken(userFound?.id);

      res.json({
        message: "Login Successfully",
        user: {
          id: userFound?.id,
          name: userFound?.name,
          email: userFound?.email,
          username: userFound?.username,
          image: userFound?.image,
          Role: userFound?.Role,
        },
        token: token,
        refreshToken: refreshToken,
      });
    } else {
      res.status(401);
      throw new Error("Invalid login credentials");
    }
  }
);

//----------------------------------------------
// Refresh token
//----------------------------------------------

export const refreshTokenController = expressAsyncHandler(
  async (req: any, res: any) => {
    const prevToken = req.body.prevToken;
    if (!prevToken) {
      throw new Error("Access Denied. No Previous Token token provided.");
    }

    try {
      const decoded = jwt.verify(prevToken, process.env.JWT_KEY);
      const token = generateToken(decoded.id);

      res.json({
        id: decoded.id,
        token: token,
        expired: Date.now() / 1000 + (decoded.exp - decoded.iat),
      });
    } catch (error) {
      throw new Error("Invalid refresh token.");
    }
  }
);

//----------------------------------------------
// create token
//----------------------------------------------

export const createTokenController = expressAsyncHandler(
  async (req: any, res: any) => {
    const id = req.body.id;
    if (!id) {
      throw new Error("Email empty");
    }

    try {
      const token = jwt.sign({ id: id }, process.env.JWT_KEY, {
        expiresIn: "1d",
      });
      const decoded = jwt.verify(id, process.env.JWT_KEY);

      res.json({
        id: decoded.id,
        token: token,
        expired: Date.now() / 1000 + (decoded.exp - decoded.iat),
      });
    } catch (error) {
      throw new Error("Invalid refresh token.");
    }
  }
);

//----------------------------------------------
// detail user
//----------------------------------------------

export const detailUserController = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;

  // check id
  const user = await prisma.user.findFirst({
    where: {
      id: id,
    },
    include: {
      Blog: {
        include: {
          Categories: true,
          Tags: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  // console.log(user);

  if (!user) throw new Error("User not exist");

  try {
    res.json({
      message: "Get detail user successfully",
      user: user,
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

//----------------------------------------------
// fetch user by email
//----------------------------------------------

export const fetchUserByEmailController = expressAsyncHandler(
  async (req, res) => {
    const { email } = req.body;

    // check id
    const user = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    // console.log(user);

    if (!user) {
      res.json({
        message: "User Not Found",
        user: false,
      });
    } else {
      res.json({
        message: "Get detail user successfully",
        user: true,
      });
    }
  }
);
