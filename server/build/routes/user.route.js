"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = __importDefault(require("../controllers/user.controller"));
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const router = (0, express_1.Router)();
router.post("/register", user_controller_1.default.register);
router.post("/login", user_controller_1.default.login);
router.get("/search", (0, auth_middleware_1.default)(), user_controller_1.default.findAll);
exports.default = router;
