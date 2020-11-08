import mongoose from 'mongoose';
const { Schema } = mongoose;
// require Mongoose
// import mongoose, {models} from 'mongoose'

// let URI_MONGO = process.env.MONGODB_URI
// mongoose.connect(URI_MONGO,{
//     useNewUrlParser: true,
//     useUnifiedTopology: true
//   })

// Define a schema
let ProjectsSchema = new Schema({
    _id: Schema.Types.ObjectId,
    title: {
        type: String,
        default: "default text"
    },
    description: {
        type: String,
        default: "default text"
    },
    listCategory:{
        type: Array,
        default: []
    },
    idCategory: {
        type: String,
        default: ""
    },
    dateCreated: {
        type: Date,
        default: Date.now
    },
    imageMainPrincipal:{
        type: String,
        default: ""
    },
    imageArray: {
        type: Array,
        default : []
    },
    subTextDescription: {
        type: String,
        default: ""
    },
    LinkNextProjectId: {
      type: String,
      default: ""
    },
    date : {
        type: Date,
        default: Date.now
    }
})

// create a model for reference
export default mongoose.models.projects || mongoose.model('projects', ProjectsSchema);