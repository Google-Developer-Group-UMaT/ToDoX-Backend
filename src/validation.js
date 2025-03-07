const { z } = require("zod");

const validate = (schema) => (req, res, next) => {
    try {
        schema.parse(req.body);
        next();
    } catch (error) {
        res.status(400).send({ error: error.errors });
    }
};

const taskSchema = z.object({
    name: z.string().min(1, "Name is required"),
    date: z.string().min(1, "Date is required"),
});

module.exports = {
    validate,
    taskSchema,
};