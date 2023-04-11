import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    status: String,
    params: {
        username: String,
        damping_factor: Number,
        depth: Number
    },
    result: [{
        username: String,
        score: Number
    }]
});

export default mongoose.model("User", userSchema);