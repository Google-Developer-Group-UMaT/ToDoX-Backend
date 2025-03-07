const { addTask, updateTask, deleteTask, completeTask, getTasks,getTask,getTasksByDate,getTaskByName } = require("./service");

const addTaskController = async (req, res, next) => {
    try {
        const { name, date } = req.body;
        const userId = req.user.uid; // Extract userId from request

        const data = await addTask({ name, date, userId });
        res.send(data);
    } catch (error) {
        next(error);
    }
};

const updateTaskController = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, date } = req.body;
        const userId = req.user.uid;

        const data = await updateTask(id, { name, date, userId });
        if (!data) {
            return res.status(404).send("Task not found or unauthorized");
        }
        res.send(data);
    } catch (error) {
        next(error);
    }
};


const deleteTaskController = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.uid;

        const data = await deleteTask(id, userId);
        if (!data) {
            return res.status(404).send("Task not found or unauthorized");
        }
        res.send(data);
    } catch (error) {
        next(error);
    }
};


const completeTaskController = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.uid;

        const data = await completeTask(id, userId);
        if (!data) {
            return res.status(404).send("Task not found or unauthorized");
        }
        res.send(data);
    } catch (error) {
        next(error);
    }
};


const getTasksController = async (req, res, next) => {
    try {
        const userId = req.user.uid;
        const data = await getTasks(userId);
        res.send(data);
    } catch (error) {
        next(error);
    }
};


const getTaskController = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.uid;

        const data = await getTask(id, userId);
        if (!data) {
            return res.status(404).send("Task not found or unauthorized");
        }
        res.send(data);
    } catch (error) {
        next(error);
    }
};

const getTasksByDateController = async (req, res, next) => {
    try {
        const { date } = req.params;
        const userId = req.user.uid;

        const data = await getTasksByDate(userId,date);
        if (!data) {
            return res.status(404).send("Tasks not found or unauthorized");
        }
        res.send(data);
    } catch (error) {
        next(error);
    }
}

const getTaskByNameController = async (req, res, next) => {
    try {
        const { name } = req.params;
        const userId = req.user.uid;

        const data = await getTaskByName(name, userId);
        if (!data) {
            return res.status(404).send("Tasks not found or unauthorized");
        }
        res.send(data);
    } catch (error) {
        next(error);
    }
}
module.exports = {
    addTaskController,
    updateTaskController,
    deleteTaskController,
    completeTaskController,
    getTasksController,
    getTaskController,
    getTasksByDateController,
    getTaskByNameController,
};
