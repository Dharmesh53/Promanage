const Task = require("../models/task");
const mongoose = require("mongoose")
const User = require("../models/user");

const getTask = async (req, res) => {
    try {
        const id = req.id;
        const user = await User.findById(id).populate("tasks");
        return res.status(200).json({ tasks: user.tasks });
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
};

const updateTask = async (req, res) => {
    try {
        const id = req.params.id;
        const { title, description, assignee, priority, due, progess } = req.body;
        await Task.findByIdAndUpdate(id, {
            title,
            description,
            assignee,
            priority,
            due,
            progess,
        });
        return res.status(200).json({ msg: "done" });
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
};

const deleteTask = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const tid = new mongoose.Types.ObjectId(req.params.tid);
        const uid = req.params.uid;

        await User.findByIdAndUpdate(uid, {
            $pull: { tasks: tid }
        }, { session })

        await Task.findOneAndDelete({ _id: tid }, { session })

        await session.commitTransaction();
        session.endSession();
        return res.status(200).json({ msg: "done" });
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        return res.status(500).json({ msg: err.message });
    }
}

const dueTasksFetcher = async () => {
    const now = new Date();
    const twentyFourHoursFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const tasksWithProjectTitles = await Task.aggregate([
        {
            $match: {
                due: {
                    $gte: now,
                    $lte: twentyFourHoursFromNow,
                },
            },
        },
        {
            $lookup: {
                from: "projects",
                localField: "project",
                foreignField: "_id",
                as: "projectDetails",
            },
        },
        {
            $project: {
                title: 1,
                description: 1,
                assignee: 1,
                status: 1,
                progress: 1,
                due: 1,
                createdBy: 1,
                projectTitle: "$projectDetails.title", // Including project title from the joined collection
            },
        },
    ]);

    return tasksWithProjectTitles;
};

exports.updateTask = updateTask;
exports.getTask = getTask;
exports.dueTasksFetcher = dueTasksFetcher;
exports.deleteTask = deleteTask;
