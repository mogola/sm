import mongoose from 'mongoose';
const { Schema } = mongoose;

// Define a schema
let AboutSchema = new Schema({
    _id: Schema.Types.ObjectId,
    description: {
        type: String,
        default: "default text"
    },
    titleProfilAbout: {
        type: String,
        default: "default text"
    },
    listLogiciel: {
        type: Array,
        default: []
    },
    descriptionProfil: {
        type: String,
        default: "default text"
    },
    titleLogiciel: {
        type: String,
        default: "default text"
    },
    urlProfilImage: {
        type: String,
        default: "default text"
    },
    getImagesPost: {
        type: Array,
        default: []
    }
})


// create a model for reference
export default mongoose.models.About || mongoose.model('About', AboutSchema);