import mongoose from 'mongoose';
const { Schema } = mongoose;

// Define a schema
let HomeConfigSchema = new Schema({
    _id: Schema.Types.ObjectId,
    nameSite: {
        type: String,
        default: "default text"
    },
    logoSiteUrl: {
        type: String,
        default: "default text"
    },
    logoSiteImageUrl: {
        type: String,
        default: "default text"
    },
    titleMain: {
        type: String,
        default: "default text"
    },
    subTitleImage: {
        type: String,
        default: "default text"
    },
    textAvailable:{
        type: String,
        default: "default text"
    },
    titleCategoryRecent: {
        type: String,
        default: "default text"
    },
    textLinkAllProject:{
        type: String,
        default: "default text"
    },
    titleCategoryAbout: {
        type: String,
        default: "default text"
    },
    textContentAbout: {
        type: String,
        default: "default text"
    },
    textLinkAbout: {
        type: String,
        default: "default text"
    },
    textCategoryServices: {
        type: String,
        default: "default text"
    },
    titleBlocOne: {
        type: String,
        default: "default text"
    },
    titleBlocSecond: {
        type: String,
        default: "default text"
    },
    textLinkServices: {
        type: String,
        default: "default text"
    },
    email:{
        type: String,
        default: "default text"
    },
    phone: {
        type: String,
        default: "default text"
    },
    socialLink:{
        type: Array,
        default: []
    },
    textMentionLegale:{
        type: String,
        default: "default text"
    },
    textScrollTop:{
        type: String,
        default: "default text"
    },
    textFollowMe:{
        type: String,
        default: "default text"
    },
    textContactMe:{
        type: String,
        default: "default text"
    },
    textLocalisation:{
        type: String,
        default: "default text"
    },
    colorBackgroundMenu:{
        type: String,
        default: "default text"
    },
    linkColorMenu:{
        type: String,
        default: "default text"
    },
    colorHighlight:{
        type: String,
        default: "default text"
    },
    backgroudPost:{
        type: String,
        default: "default text"
    },
    date : {
        type: Date,
        default: Date.now
    }
})


// create a model for reference
export default mongoose.models.homeconfig || mongoose.model('homeconfig', HomeConfigSchema);