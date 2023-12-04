"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCommentBlogController = exports.createCommentBlogController = exports.showCommentBlogController = exports.likeBlogController = exports.readController = exports.fetchAllblogByCategorySlugController = exports.fetchAllblogBySlugCategoryController = exports.fetchAllblogController = exports.fetchBlogBySlugController = exports.fetchAllblogByUserController = exports.deleteController = exports.updateController = exports.editController = exports.createController = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const slug_1 = __importDefault(require("slug"));
const prisma_client_1 = require("../../lib/prisma-client");
const helper_1 = require("../../helper/helper");
const fs = require("fs");
//----------------------------------------------
// create blog
//----------------------------------------------
exports.createController = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.user;
    const slugTitle = (0, slug_1.default)(req.body.slug);
    // const checkIfExist = await prisma.blog.findFirst({
    //   where: {
    //     slug: slugTitle,
    //   },
    // });
    // if (checkIfExist) {
    //   throw new Error(
    //     `Creating failed because ${slugTitle} content already exist`
    //   );
    // }
    let localPath = "";
    if (req === null || req === void 0 ? void 0 : req.file) {
        // // 1. get the path to img
        const fileBuffer = fs.readFileSync(req.file.path);
        localPath = yield (0, helper_1.supabaseUpload)(fileBuffer);
    }
    const tags = JSON.parse(req.body.Tags);
    //update
    if (localPath == "") {
        throw new Error(`Image something wrong try new image`);
    }
    try {
        const blog = yield prisma_client_1.prisma.blog.create({
            data: Object.assign(Object.assign({}, req.body), { authorId: id, lang: req.body.lang, slug: slugTitle, image: localPath, content: req.body.content, draft: req.body.draft === "1" ? true : false, Tags: {
                    connectOrCreate: tags.map((tag) => ({
                        where: { unique_name_lang: { name: tag, lang: req.body.lang } },
                        create: { name: tag, lang: req.body.lang },
                    })),
                } }),
        });
        res.json({
            message: `Blog was created successfully`,
            blog: blog,
        });
    }
    catch (error) {
        (0, helper_1.responseError)(error, res);
    }
}));
//----------------------------------------------
// fetch single blog to update
//----------------------------------------------
exports.editController = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const checkIfExist = yield prisma_client_1.prisma.blog.findFirst({
        where: {
            id: id,
        },
        include: {
            Tags: true,
            Categories: true,
        },
    });
    if (!checkIfExist)
        throw new Error(`Blog not found`);
    try {
        const blog = yield prisma_client_1.prisma.blog.findFirst({
            where: {
                id: id,
            },
            include: {
                Author: true,
                Tags: true,
            },
        });
        res.json({
            message: `Showed data detail blog successfully`,
            blog: blog,
        });
    }
    catch (error) {
        res.status(500).json(error);
    }
}));
//----------------------------------------------
// update blog
//----------------------------------------------
exports.updateController = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { authorId } = req.user;
    const slugTitle = (0, slug_1.default)(req.body.slug);
    const blog = yield prisma_client_1.prisma.blog.findFirst({
        where: {
            id: id,
        },
        include: {
            Tags: true,
        },
    });
    if (!blog) {
        throw new Error(`Blog not found`);
    }
    // const checkSlug = await prisma.blog.findFirst({
    //   where: {
    //     slug: slugTitle,
    //   },
    // });
    // if (checkSlug) {
    //   throw new Error(
    //     `Creating failed because ${slugTitle} content already exist`
    //   );
    // }
    // console.log(req.body)
    let localPath = "";
    if (req === null || req === void 0 ? void 0 : req.file) {
        // // 1. get the path to img
        const fileBuffer = fs.readFileSync(req.file.path);
        localPath = yield (0, helper_1.supabaseUpload)(fileBuffer);
        if (localPath != "") {
            (0, helper_1.deleteImageSupabase)(blog === null || blog === void 0 ? void 0 : blog.image);
        }
    }
    const tags = JSON.parse(req.body.Tags);
    //update
    if (localPath == "") {
        localPath = blog === null || blog === void 0 ? void 0 : blog.image;
    }
    try {
        const blogUpdate = yield prisma_client_1.prisma.blog.update({
            data: Object.assign(Object.assign({}, req.body), { authorId: authorId, slug: slugTitle, lang: req.body.lang, image: localPath, content: req.body.content, draft: req.body.draft === "1" ? true : false, Tags: {
                    disconnect: blog.Tags,
                    connectOrCreate: tags.map((tag) => ({
                        where: { unique_name_lang: { name: tag, lang: req.body.lang } },
                        create: { name: tag, lang: req.body.lang },
                    })),
                } }),
            where: {
                id: id,
            },
        });
        res.json({
            message: `Updated blog successfully`,
            blog: blogUpdate,
        });
    }
    catch (error) {
        (0, helper_1.responseError)(error, res);
    }
}));
//----------------------------------------------
// delete blog
//----------------------------------------------
exports.deleteController = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ids = req.body.idArray;
    // check validation
    const checkIfExist = yield prisma_client_1.prisma.blog.findMany({
        where: {
            id: {
                in: ids,
            },
        },
    });
    if (checkIfExist.length < 1)
        throw new Error(`Role not found`);
    checkIfExist.forEach((element) => {
        if (element.image != "") {
            (0, helper_1.deleteImageSupabase)(element.image);
        }
    });
    try {
        const deleteBlog = yield prisma_client_1.prisma.blog.deleteMany({
            where: {
                id: {
                    in: ids,
                },
            },
        });
        if (deleteBlog.count === 0) {
            res.status(400).json({
                message: `data not found`,
                role: deleteBlog,
            });
        }
        else {
            res.json({
                message: `Deleted Role successfully`,
                blog: checkIfExist,
            });
        }
    }
    catch (error) {
        res.status(500).json(error);
    }
    // const { id } = req.params;
    // // check validation
    // const checkIfExist = await prisma.blog.findFirst({
    //   where: {
    //     id: id,
    //   },
    // });
    // if (!checkIfExist) throw new Error(`Blog not found`);
    // try {
    //   const deleteBlog = await prisma.blog.delete({
    //     where: {
    //       id: id,
    //     },
    //   });
    //   if (deleteBlog?.image != "") {
    //     deleteImageSupabase(deleteBlog?.image);
    //   }
    //   res.json({
    //     message: `Deleted blog successfully`,
    //     blog: deleteBlog,
    //   });
    // } catch (error) {
    //   res.status(500).json(error);
    // }
}));
//----------------------------------------------
// fetch all blog by user
//----------------------------------------------
exports.fetchAllblogByUserController = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    let blog = [];
    if (req.query.lang !== "") {
        blog = yield prisma_client_1.prisma.blog.findMany({
            include: {
                Tags: true,
                Categories: true,
                Author: {
                    where: {
                        id: id,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
            where: {
                draft: true,
                lang: req.query.lang,
            },
        });
    }
    else {
        blog = yield prisma_client_1.prisma.blog.findMany({
            include: {
                Tags: true,
                Categories: true,
                Author: {
                    where: {
                        id: id,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
            where: {
                draft: true,
            },
        });
    }
    if (!blog)
        throw new Error(`Blog not found`);
    try {
        res.json({
            message: `Showed data detail blog successfully`,
            blog: blog,
        });
    }
    catch (error) {
        res.status(500).json(error);
    }
}));
//----------------------------------------------
// fetch single blog by slug
//----------------------------------------------
exports.fetchBlogBySlugController = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { slug } = req.params;
    const lang = req.query.lang ? req.query.lang : undefined;
    let blog = {};
    if (req.query.lang !== "") {
        blog = yield prisma_client_1.prisma.blog.findFirst({
            where: {
                slug: slug,
                lang: lang,
            },
            include: {
                Tags: true,
                Categories: true,
                Author: true,
                Likes: true,
                Comment: {
                    include: {
                        User: true,
                        Replay: {
                            include: {
                                User: true,
                                Replay: {
                                    include: {
                                        User: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
    }
    else {
        blog = yield prisma_client_1.prisma.blog.findFirst({
            where: {
                slug: slug,
            },
            include: {
                Tags: true,
                Categories: true,
                Author: true,
                Likes: true,
                Comment: {
                    include: {
                        User: true,
                        Replay: {
                            include: {
                                User: true,
                                Replay: {
                                    include: {
                                        User: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
    }
    if (!blog)
        throw new Error(`Blog not found`);
    const idTagsArray = (_a = blog === null || blog === void 0 ? void 0 : blog.Tags) === null || _a === void 0 ? void 0 : _a.map((item) => item.id);
    let tagsRelevant = [];
    if (req.query.lang !== "") {
        tagsRelevant = yield prisma_client_1.prisma.tag.findMany({
            where: {
                id: {
                    notIn: idTagsArray,
                },
                lang: lang,
                Blogs: {
                    some: {
                        Categories: {
                            id: blog.categoryId,
                        },
                    },
                },
            },
            include: {
                Language: true,
                Blogs: {
                    where: {
                        Categories: {
                            id: blog.categoryId,
                        },
                    },
                },
            },
            orderBy: {
                Blogs: {
                    _count: "desc",
                },
            },
            take: 10,
        });
    }
    else {
        tagsRelevant = yield prisma_client_1.prisma.tag.findMany({
            where: {
                id: {
                    notIn: idTagsArray,
                },
                Blogs: {
                    some: {
                        Categories: {
                            id: blog.categoryId,
                        },
                    },
                },
            },
            include: {
                Language: true,
                Blogs: {
                    where: {
                        Categories: {
                            id: blog.categoryId,
                        },
                    },
                },
            },
            orderBy: {
                Blogs: {
                    _count: "desc",
                },
            },
            take: 10,
        });
    }
    const exampleTagsRelevant = tagsRelevant.map((tag) => (Object.assign(Object.assign({}, tag), { blogCount: tag.Blogs.length })));
    blog.total_likes = blog.Likes.length;
    try {
        res.json({
            message: `Showed data detail blog successfully`,
            blog: blog,
            tagsRelevant: exampleTagsRelevant,
        });
    }
    catch (error) {
        res.status(500).json(error);
    }
}));
//----------------------------------------------
// fetch all blog
//----------------------------------------------
exports.fetchAllblogController = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let blog = [];
    const categorySlug = req.query.category
        ? req.query.category
        : undefined;
    const user = req.query.user_id ? req.query.user_id : undefined;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    if (req.query.lang !== "") {
        blog = yield prisma_client_1.prisma.blog.findMany({
            include: {
                Tags: true,
                Categories: true,
                Author: true,
            },
            orderBy: {
                createdAt: "desc",
            },
            where: {
                draft: true,
                lang: req.query.lang,
                Categories: {
                    slug: categorySlug,
                },
                Author: {
                    id: user,
                },
            },
            take: limit,
        });
    }
    else {
        blog = yield prisma_client_1.prisma.blog.findMany({
            include: {
                Tags: true,
                Categories: true,
                Author: true,
            },
            orderBy: {
                createdAt: "desc",
            },
            where: {
                draft: true,
                Categories: {
                    slug: categorySlug,
                },
                Author: {
                    id: user,
                },
            },
            take: limit,
        });
    }
    if (!blog)
        throw new Error(`Blog not found`);
    let tagsRelevant = [];
    if (req.query.lang !== "") {
        tagsRelevant = yield prisma_client_1.prisma.tag.findMany({
            where: {
                lang: req.query.lang,
                Blogs: {
                    some: {
                        Categories: {
                            slug: categorySlug,
                        },
                    },
                },
            },
            include: {
                Language: true,
                Blogs: {
                    where: {
                        Categories: {
                            slug: categorySlug,
                        },
                    },
                },
            },
            orderBy: {
                Blogs: {
                    _count: "desc",
                },
            },
            take: 10,
        });
    }
    else {
        tagsRelevant = yield prisma_client_1.prisma.tag.findMany({
            where: {
                Blogs: {
                    some: {
                        Categories: {
                            slug: categorySlug,
                        },
                    },
                },
            },
            include: {
                Language: true,
                Blogs: {
                    where: {
                        Categories: {
                            slug: categorySlug,
                        },
                    },
                },
            },
            orderBy: {
                Blogs: {
                    _count: "desc",
                },
            },
            take: 10,
        });
    }
    const exampleTagsRelevant = tagsRelevant === null || tagsRelevant === void 0 ? void 0 : tagsRelevant.map((tag) => (Object.assign(Object.assign({}, tag), { blogCount: tag.Blogs.length })));
    try {
        res.json({
            message: `Showed data detail blog successfully`,
            blog: blog,
            tagsRelevant: exampleTagsRelevant,
        });
    }
    catch (error) {
        res.status(500).json(error);
    }
}));
//----------------------------------------------
// fetch all blog by slug category
//----------------------------------------------
exports.fetchAllblogBySlugCategoryController = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const categorySlug = req.query.categorySlug;
    let blog = [];
    if (req.query.lang !== "") {
        blog = yield prisma_client_1.prisma.blog.findMany({
            include: {
                Tags: true,
                Categories: true,
                Author: true,
            },
            orderBy: {
                createdAt: "desc",
            },
            where: {
                draft: true,
                lang: req.query.lang,
                Categories: {
                    slug: categorySlug ? categorySlug : "",
                },
            },
        });
    }
    else {
        blog = yield prisma_client_1.prisma.blog.findMany({
            include: {
                Tags: true,
                Categories: true,
                Author: true,
            },
            orderBy: {
                createdAt: "desc",
            },
            where: {
                draft: true,
                Categories: {
                    slug: categorySlug ? categorySlug : "",
                },
            },
        });
    }
    if (!blog)
        throw new Error(`Blog not found`);
    let tagsRelevant = [];
    if (req.query.lang !== "") {
        tagsRelevant = yield prisma_client_1.prisma.tag.findMany({
            where: {
                lang: req.query.lang,
            },
            orderBy: {
                Blogs: {
                    _count: "desc",
                },
            },
            include: {
                Blogs: true,
            },
            take: 10,
        });
    }
    else {
        tagsRelevant = yield prisma_client_1.prisma.tag.findMany({
            orderBy: {
                Blogs: {
                    _count: "desc",
                },
            },
            include: {
                Blogs: true,
            },
            take: 10,
        });
    }
    console.log(tagsRelevant);
    const exampleTagsRelevant = tagsRelevant === null || tagsRelevant === void 0 ? void 0 : tagsRelevant.map((tag) => (Object.assign(Object.assign({}, tag), { blogCount: tag.Blogs.length })));
    try {
        res.json({
            message: `Showed data detail blog successfully`,
            blog: blog,
            tagsRelevant: exampleTagsRelevant,
        });
    }
    catch (error) {
        res.status(500).json(error);
    }
}));
//----------------------------------------------
// fetch all blog by category slug
//----------------------------------------------
exports.fetchAllblogByCategorySlugController = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { categorySlug } = req.params;
    let blog = {};
    if (req.query.lang !== "") {
        blog = yield prisma_client_1.prisma.category.findFirst({
            include: {
                Blog: {
                    where: {
                        lang: req.query.lang,
                        draft: true,
                    },
                    include: {
                        Author: true,
                        Tags: true,
                        Categories: true,
                    },
                    orderBy: {
                        createdAt: "desc",
                    },
                },
            },
            where: {
                slug: categorySlug,
                lang: req.query.lang,
            },
        });
    }
    else {
        blog = yield prisma_client_1.prisma.category.findFirst({
            include: {
                Blog: {
                    where: {
                        draft: true,
                    },
                    include: {
                        Author: true,
                        Tags: true,
                        Categories: true,
                    },
                    orderBy: {
                        createdAt: "desc",
                    },
                },
            },
            where: {
                slug: categorySlug,
                lang: req.query.lang,
            },
        });
    }
    if (!blog)
        throw new Error(`Blog not found`);
    let tagsRelevant = [];
    if (req.query.lang !== "") {
        tagsRelevant = yield prisma_client_1.prisma.tag.findMany({
            where: {
                lang: req.query.lang,
            },
            orderBy: {
                Blogs: {
                    _count: "desc",
                },
            },
            include: {
                Blogs: {
                    where: {
                        Categories: {
                            slug: categorySlug,
                        },
                    },
                },
            },
            take: 10,
        });
    }
    else {
        tagsRelevant = yield prisma_client_1.prisma.tag.findMany({
            orderBy: {
                Blogs: {
                    _count: "desc",
                },
            },
            include: {
                Blogs: {
                    where: {
                        Categories: {
                            slug: categorySlug,
                        },
                    },
                },
            },
            take: 10,
        });
    }
    const exampleTagsRelevant = tagsRelevant.map((tag) => (Object.assign(Object.assign({}, tag), { blogCount: tag.Blogs.length })));
    try {
        res.json({
            message: `Showed data detail blog successfully`,
            blog: blog,
            tagsRelevant: exampleTagsRelevant,
        });
    }
    catch (error) {
        res.status(500).json(error);
    }
}));
//----------------------------------------------
// read blog
//----------------------------------------------
exports.readController = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const blog = yield prisma_client_1.prisma.blog.findFirst({
        where: {
            id: id,
        },
    });
    if (!blog) {
        throw new Error(`Blog not found`);
    }
    try {
        const blogUpdate = yield prisma_client_1.prisma.blog.update({
            data: Object.assign(Object.assign({}, req.body), { total_reads: blog.total_reads + 1 }),
            where: {
                id: id,
            },
        });
        res.json({
            message: `Read blog successfully`,
            blog: blogUpdate,
        });
    }
    catch (error) {
        (0, helper_1.responseError)(error, res);
    }
}));
//----------------------------------------------
// like blog
//----------------------------------------------
exports.likeBlogController = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.user;
    const { blogId } = req.body;
    // Check if the user and blog exist
    const user = yield prisma_client_1.prisma.user.findUnique({
        where: { id: id },
    });
    const blog = yield prisma_client_1.prisma.blog.findUnique({
        where: { id: blogId },
    });
    if (!user || !blog) {
        res.status(404).json({ error: "User or blog not found" });
    }
    // / Check if the user has already liked the blog
    const existingLike = yield prisma_client_1.prisma.like.findFirst({
        where: {
            userId: id,
            blogId: blogId,
        },
    });
    if (existingLike) {
        const deleteLike = yield prisma_client_1.prisma.like.delete({
            where: {
                id: existingLike.id,
            },
        });
        res.json({
            message: `Unlike successfully`,
            like: deleteLike,
        });
    }
    else {
        try {
            // Create a new like
            const newLike = yield prisma_client_1.prisma.like.create({
                data: {
                    userId: id,
                    blogId: blogId,
                },
            });
            res.json({
                message: `Like successfully`,
                like: newLike,
            });
        }
        catch (error) {
            (0, helper_1.responseError)(error, res);
        }
    }
}));
//----------------------------------------------
// show comment blog
//----------------------------------------------
exports.showCommentBlogController = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { blogId } = req.body;
    const blog = yield prisma_client_1.prisma.blog.findUnique({
        where: { id: blogId },
    });
    if (!blog) {
        res.status(404).json({ error: "Blog not found" });
    }
    try {
        // show comment blog
        const commentBlog = yield prisma_client_1.prisma.blog.findFirst({
            where: {
                id: blogId,
            },
            include: {
                Comment: {
                    include: {
                        User: true,
                        Replay: {
                            include: {
                                User: true,
                                Replay: {
                                    include: {
                                        User: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
        res.json({
            message: `Like successfully`,
            blogComment: commentBlog,
        });
    }
    catch (error) {
        (0, helper_1.responseError)(error, res);
    }
}));
//----------------------------------------------
// create comment blog
//----------------------------------------------
exports.createCommentBlogController = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.user;
    const content = req.body.content;
    const blogId = req.body.blogId;
    const parentId = req.body.parentId;
    try {
        const comment = yield prisma_client_1.prisma.comment.create({
            data: Object.assign(Object.assign({}, req.body), { content: content, blogId: blogId, userId: id, parentId: parentId }),
        });
        res.json({
            message: `Comment was created successfully`,
            comment: comment,
        });
    }
    catch (error) {
        (0, helper_1.responseError)(error, res);
    }
}));
//----------------------------------------------
// delete comment blog
//----------------------------------------------
exports.deleteCommentBlogController = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { id } = req.params;
    // check validation
    const checkIfExist = yield prisma_client_1.prisma.comment.findUnique({
        where: {
            id: id,
        },
    });
    if (!checkIfExist || !user)
        throw new Error(`Comment or User not found`);
    try {
        const deleteComment = yield prisma_client_1.prisma.comment.delete({
            where: {
                id: id,
            },
        });
        res.json({
            message: `Deleted Comment successfully`,
            comment: deleteComment,
        });
    }
    catch (error) {
        (0, helper_1.responseError)(error, res);
    }
}));
//# sourceMappingURL=index.js.map