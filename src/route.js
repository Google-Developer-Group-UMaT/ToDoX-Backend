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
    dotController
} = require("./controller");


const { validate, taskSchema , dotSchema } = require("./validation");
const authMiddleware = require("./middleware")

const router = express.Router();
router.use(authMiddleware)
router.post("/api/tasks",  validate(taskSchema), addTaskController);
router.put("/api/tasks/:id",  validate(taskSchema), updateTaskController);
router.delete("/api/tasks/:id",  deleteTaskController);
router.patch("/api/tasks/:id/complete",  completeTaskController);
router.get("/api/tasks",  getTasksController);
router.get("/api/tasks/:id",  getTaskController);
router.post("/api/dot" ,validate(dotSchema) , dotController)
router.get("/api/tasks/date/:date", authMiddleware, getTasksByDateController);
router.get("/api/tasks/search/:name", authMiddleware, getTaskByNameController);

module.exports = router;
