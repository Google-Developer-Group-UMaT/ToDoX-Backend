const { db } = require("../config/firebase");

const addTask = async ({ name, date, userId }) => {
    const task = { 
        name, 
        date, 
        completed: false, 
        active: true, 
        userId // Store the user's ID with the task
    };

    const docRef = await db.collection("tasks").add(task);
    const doc = await docRef.get();
    return { id: doc.id, ...doc.data() };
};


const updateTask = async (id, { name, date, userId }) => {
    const taskRef = db.collection("tasks").doc(id);
    const task = await taskRef.get();
    
    if (!task.exists || task.data().userId !== userId) {
        return null; // Ensure users can only update their own tasks
    }

    await taskRef.update({ name, date });
    return { id: task.id, ...task.data() };
};

const deleteTask = async (id, userId) => {
    const taskRef = db.collection("tasks").doc(id);
    const task = await taskRef.get();
    
    if (!task.exists || task.data().userId !== userId) {
        return null; // Ensure users can only delete their own tasks
    }

    await taskRef.update({ active: false });
    return { id: task.id, ...task.data() };
};

const completeTask = async (id, userId) => {
    const taskRef = db.collection("tasks").doc(id);
    const task = await taskRef.get();
    
    if (!task.exists || task.data().userId !== userId) {
        return null; // Ensure users can only complete their own tasks
    }

    await taskRef.update({ completed: !task.data().completed });
    return { id: task.id, ...task.data() };
};


const getTasks = async (userId) => {
    const snapshot = await db.collection("tasks")
        .where("active", "==", true)
        .where("userId", "==", userId) // Fetch only tasks for the logged-in user
        .get();
    
    const tasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return tasks;
};


const getTask = async (id, userId) => {
    const snapshot = await db.collection("tasks").doc(id).get();
    
    if (!snapshot.exists || snapshot.data().userId !== userId) {
        return null; // Prevent users from accessing tasks that aren't theirs
    }

    return { id: snapshot.id, ...snapshot.data() };
};

module.exports = {
    addTask,
    updateTask,
    deleteTask,
    completeTask,
    getTasks,
    getTask
};