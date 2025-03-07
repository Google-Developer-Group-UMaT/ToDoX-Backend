const express = require("express");
const {
    addTaskController,
    updateTaskController,
    deleteTaskController,
    completeTaskController,
    getTasksController,
    getTaskController,
    getTasksByDateController,
    getTaskByNameController,
} = require("./controller");
const { validate, taskSchema } = require("./validation");
const authMiddleware = require("./middleware.js");

const router = express.Router();

router.post("/api/tasks", authMiddleware, validate(taskSchema), addTaskController);
router.put("/api/tasks/:id", authMiddleware, validate(taskSchema), updateTaskController);
router.delete("/api/tasks/:id", authMiddleware, deleteTaskController);
router.patch("/api/tasks/:id/complete", authMiddleware, completeTaskController);
router.get("/api/tasks", authMiddleware, getTasksController);
router.get("/api/tasks/:id", authMiddleware, getTaskController);
router.get("/api/tasks/date/:date", authMiddleware, getTasksByDateController);
router.get("/api/tasks/search/:name", authMiddleware, getTaskByNameController);

module.exports = router;
