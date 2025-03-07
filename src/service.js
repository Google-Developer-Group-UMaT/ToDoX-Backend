const { db } = require("../config/firebase");
const firebase = require("firebase-admin"); // Ensure firebase-admin is used


// Function to generate keywords array
const generateKeywords = (text) => {
    return text
        .toLowerCase()
        .replace(/[^\w\s]/g, "") // Remove special characters
        .split(/\s+/) // Split into words
        .filter(word => word.length > 1); // Exclude very short words
};

const addTask = async ({ name, date, userId }) => {
    const keywords = generateKeywords(name);

    const task = {
        name,
        date,
        completed: false,
        active: true,
        userId,
        keywords, // Store searchable words
        createdDate: firebase.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await db.collection("tasks").add(task);
    const doc = await docRef.get();
    return { id: doc.id, ...doc.data() };
};

// Get tasks by keywords (semantic search)
const getTaskByName = async (name, userId) => {
    const keywords = generateKeywords(name);

    const snapshot = await db.collection("tasks")
        .where("keywords", "array-contains-any", keywords) // Efficient search
        .where("active", "==", true)
        .where("userId", "==", userId)
        .get();

    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};


const updateTask = async (id, { name, date, userId }) => {
    const taskRef = db.collection("tasks").doc(id);
    const task = await taskRef.get();

    if (!task.exists || task.data().userId !== userId || !task.data().active) {
        return null;
    }

    await taskRef.update({ name, date });
    const updatedTask = await taskRef.get();
    return { id: updatedTask.id, ...updatedTask.data() };
};

const deleteTask = async (id, userId) => {
    const taskRef = db.collection("tasks").doc(id);
    const task = await taskRef.get();

    if (!task.exists || task.data().userId !== userId) {
        return null;
    }

    await taskRef.update({ active: false });
    return { id: task.id, ...task.data() };
};

const completeTask = async (id, userId) => {
    const taskRef = db.collection("tasks").doc(id);
    const task = await taskRef.get();

    if (!task.exists || task.data().userId !== userId || !task.data().active) {
        return null;
    }

    await taskRef.update({ completed: !task.data().completed });
    const updatedTask = await taskRef.get();
    return { id: updatedTask.id, ...updatedTask.data() };
};

const getTasks = async (userId) => {
    const snapshot = await db.collection("tasks")
        .where("active", "==", true)
        .where("userId", "==", userId)
        .get();

    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

const getTask = async (id, userId) => {
    const taskRef = db.collection("tasks").doc(id);
    const task = await taskRef.get();

    if (!task.exists || task.data().userId !== userId || !task.data().active) {
        return null;
    }

    return { id: task.id, ...task.data() };
};

const getTasksByDate = async (userId, date) => {
    const snapshot = await db.collection("tasks")
        .where("date", "==", new Date(date))
        .where("active", "==", true)
        .where("userId", "==", userId)
        .get();

    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// const getTaskByName = async (name, userId) => {
//     const snapshot = await db.collection("tasks")
//         .where("name", "==", name)
//         .where("active", "==", true)
//         .where("userId", "==", userId)
//         .get();
//
//     return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
// };

module.exports = {
    addTask,
    updateTask,
    deleteTask,
    completeTask,
    getTasks,
    getTask,
    getTasksByDate,
    getTaskByName
};
