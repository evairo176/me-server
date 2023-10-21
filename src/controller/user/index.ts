import expressAsyncHandler from "express-async-handler";
import { prisma } from "../../lib/prisma-client";
import { generateFromEmail, generateUsername } from "unique-username-generator";
import { generateToken } from "../../helper/helper";
const bcrypt = require("bcrypt");
const crypto = require("crypto");

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

  try {
    const user = await prisma.user.create({
      data: {
        ...req.body,
        username: username,
        password: password,
        profile_img: `https://api.dicebear.com/6.x/${
          profile_imgs_collections_list[
            Math.floor(Math.random() * profile_imgs_collections_list.length)
          ]
        }/svg?seed=${
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
    res.json(error);
  }
});

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
  });
  if (!userFound) throw new Error("User not exist");

  const isPasswordMatched = await bcrypt.compare(password, userFound?.password);

  if (!isPasswordMatched) throw new Error("Password not matched");

  if (userFound && isPasswordMatched) {
    res.json({
      message: "Login Successfully",
      user: {
        id: userFound?.id,
        fullname: userFound?.fullname,
        email: userFound?.email,
        username: userFound?.username,
        profile_img: userFound?.profile_img,
      },
      token: generateToken(userFound?.id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid login credentials");
  }
});

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
      Blog: true,
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
    res.json(error);
  }
});
