import mongoose from 'mongoose';
import Projects from './Projects'

const { Schema } = mongoose;

// Define a schema
let CategorySchema = new Schema({
    _id: Schema.Types.ObjectId,
    nameCategory: {
        type: String,
        default: "default text"
    },
    posts: [{ type: Schema.Types.ObjectId, ref: 'projects' }]
})


// create a model for reference
export default mongoose.models.Category || mongoose.model('Category', CategorySchema);