const express = require("express");
const {
    addTaskController,
    updateTaskController,
    deleteTaskController,
    completeTaskController,
    getTasksController,
    getTaskController,
} = require("./controller");
const { validate, taskSchema } = require("./validation");

const router = express.Router();

router.post("/api/tasks", validate(taskSchema), addTaskController);
router.put("/api/tasks/:id", validate(taskSchema), updateTaskController);
router.delete("/api/tasks/:id", deleteTaskController);
router.patch("/api/tasks/:id/complete", completeTaskController);
router.get("/api/tasks", getTasksController);
router.get("/api/tasks/:id", getTaskController);

module.exports = router;