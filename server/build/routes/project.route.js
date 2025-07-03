"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const project_controller_1 = __importDefault(require("../controllers/project.controller"));
const router = (0, express_1.Router)();
router.use((0, auth_middleware_1.default)());
router.post('/', project_controller_1.default.create);
router.put('/:id', project_controller_1.default.update);
router.delete('/:id', project_controller_1.default.delete);
router.get('/', project_controller_1.default.findAll);
router.get('/:id', project_controller_1.default.details);
router.post('/:id/invite', project_controller_1.default.inviteMember);
router.post('/:id/kick', project_controller_1.default.kickMember);
router.get('/:id/members', project_controller_1.default.getMembers);
exports.default = router;
