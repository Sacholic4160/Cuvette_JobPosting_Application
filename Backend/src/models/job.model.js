import mongoose, { Schema } from "mongoose";


const jobSchema = new mongoose.Schema({
    title: String,
    description: String,
    experienceLevel: string,
    endDate: Date,
    candidates: [String], // Array of candidate emails
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' } // Automatically link the job to the company
  }, {timestamps: true});
  


export const Job = mongoose.model('Job', jobSchema)