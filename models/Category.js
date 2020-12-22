import mongoose from 'mongoose';
const { Schema } = mongoose;

// Define a schema
let CategorySchema = new Schema({
    _id: Schema.Types.ObjectId,
    nameCategory: {
        type: String,
        default: "default text"
    },
})


// create a model for reference
export default mongoose.models.Category || mongoose.model('Category', CategorySchema);