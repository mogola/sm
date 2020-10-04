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
let HomepageSchema = new Schema({
    _id: Schema.Types.ObjectId,
    title: {
        type: String,
        default: "default text"
    },
    urlImage: {
        type: String,
        default: "default text"
    },
    linkImage: {
        type: String,
        default: ""
    },
    date : {
        type: Date,
        default: Date.now
    }
})


// create a model for reference
export default mongoose.models.newhomepages || mongoose.model('newhomepages', HomepageSchema);