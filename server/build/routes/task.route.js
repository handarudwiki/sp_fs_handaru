"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const task_controller_1 = __importDefault(require("../controllers/task.controller"));
const router = (0, express_1.Router)();
router.use((0, auth_middleware_1.default)());
router.post('/', task_controller_1.default.create);
router.put('/:id', task_controller_1.default.update);
router.delete('/:id', task_controller_1.default.delete);
router.get('/:projectId', task_controller_1.default.findAll);
router.get('/:projectId/analytics', task_controller_1.default.analytics);
exports.default = router;
