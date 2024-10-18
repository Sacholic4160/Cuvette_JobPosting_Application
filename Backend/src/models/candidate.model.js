import mongoose, {Schema} from "mongoose";

const candidateSchema = new Schema({
    email: string,
    jobsApplied: Array
}, {timestamps:true})

export const Candidate = mongoose.model('Candidate', candidateSchema)