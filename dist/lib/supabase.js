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
Object.defineProperty(exports, "__esModule", { value: true });
exports.supabaseUpdateFile = exports.supabaseDeleteFile = exports.supabaseGetPublicUrl = exports.supabaseUploadFile = exports.supabase = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
// Create a single supabase client for interacting with your database
exports.supabase = (0, supabase_js_1.createClient)(process.env.SUPABASE_URL, process.env.SUPABASE_PUBLIC_KEY);
const createId = (length) => {
    let result = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
};
const supabaseUploadFile = (file, bucket) => __awaiter(void 0, void 0, void 0, function* () {
    const filename = createId(12) + "-" + new Date().getTime() + ".jpg";
    const { data, error } = yield exports.supabase.storage
        .from(bucket)
        .upload("public/" + filename, file, {
        cacheControl: "3600",
        upsert: false,
    });
    return {
        data,
        error,
        filename,
    };
});
exports.supabaseUploadFile = supabaseUploadFile;
const supabaseGetPublicUrl = (filename, bucket) => {
    const { data } = exports.supabase.storage
        .from(bucket)
        .getPublicUrl("public/" + filename);
    return {
        publicUrl: data.publicUrl,
    };
};
exports.supabaseGetPublicUrl = supabaseGetPublicUrl;
const supabaseDeleteFile = (filename, bucket) => __awaiter(void 0, void 0, void 0, function* () {
    const { data, error } = yield exports.supabase.storage
        .from(bucket)
        .remove(["public/" + filename]);
    return {
        data,
        error,
    };
});
exports.supabaseDeleteFile = supabaseDeleteFile;
const supabaseUpdateFile = (file, filename, bucket) => __awaiter(void 0, void 0, void 0, function* () {
    const { data, error } = yield exports.supabase.storage
        .from(bucket)
        .update("public/" + filename, file, {
        cacheControl: "3600",
        upsert: true,
    });
    return {
        data,
        error,
    };
});
exports.supabaseUpdateFile = supabaseUpdateFile;
//# sourceMappingURL=supabase.js.map