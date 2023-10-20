import { NextFunction, Request, Response } from "express";

// not found
export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Not Found: ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// error handling
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err?.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

export const validate = (schema: any) => (req: any, res: any, next: any) => {
  try {
    schema.parse(req.body);
    next();
  } catch (err: any) {
    return res.status(400).send({
      message: "Invalid request",
      error: err.errors,
    });
  }
};
