import mongoose from 'mongoose';
const { Schema } = mongoose;

// Define a schema
let RegisterModel = new Schema({
    _id: Schema.Types.ObjectId,
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        required: true
    },
    newpassword: {
        type: String,
        required: true
    },
    date : {
        type: Date,
        default: Date.now
    }
})


// create a model for reference
export default mongoose.models.Account || mongoose.model('Account', RegisterModel);