const mongoose = require("mongoose");


/**
 * Job description:string
 * Resume text:string
 * Self description:string
 * match_score:number
 * Technical questions : [{question,intention,answer,score}]
 * Behavioral questions : [{question,intention,answer,score}]
 * Skill gap : [{skill,severity:{
 * type:"high"|"medium"|"low",
 * score:number
 * },
 * explanation:string
 * }]
 * Preparation plan : [{day,focus,tasks:[]}]
 * 
 */

const technicalQuestionSchema = new mongoose.Schema({
    question:{
        type:String,
        required: [true, "Question is required"]
    },
    intention:{
        type:String,
        required: [true, "Intention is required"]
    },
    answer:{
        type:String,
        required: [true, "Answer is required"]
    }
},
{
    _id:false
});

const behavioralQuestionSchema = new mongoose.Schema({
    question:{
        type:String,
        required: [true, "Question is required"]
    },
    intention:{
        type:String,
        required: [true, "Intention is required"]
    },
    answer:{
        type:String,
        required: [true, "Answer is required"]
    }
    },
    {
    _id:false
    });

const skillGapSchema = new mongoose.Schema({
    skill:{
        type:String,
        required: [true, "Skill is required"]
    },
    severity: {
        type: String,
        enum: ["high", "medium", "low"],
        required: [true, "Severity is required"]
}
},
  {
    _id:false
  }
);

const preparationPlanSchema = new mongoose.Schema({
    day: {
        type:Number,
        required: [true, "Day is required"]
    },
    focus:{
        type:String,
        required: [true, "Focus is required"]
    },
    tasks: [{
        type:String,
        required: [true, "Task is required"]
    }]
});

const interviewReportSchema = new mongoose.Schema({
    jobDescription: {
        type:String,
        required: [true, "Job Description is required"]
    },
    resume: String,
    selfDescription: String,
    matchScore:{
        type: Number,
        min:0,
        max:100
    },
    title:{
        type:String,
        required: [true, "Title is required"]
    },
    technicalQuestions: [technicalQuestionSchema],
    behavioralQuestions: [behavioralQuestionSchema],
    skillGap: [skillGapSchema],
    preparationPlan: [preparationPlanSchema],
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
},{
    timestamps:true
});

 const InterviewReportModel = mongoose.model("InterviewReport",interviewReportSchema);

 module.exports = InterviewReportModel;
