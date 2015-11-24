import mongoose from 'mongoose';

const ArticleSchema = new mongoose.Schema({
    title: String,

    text: String,

    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Article = mongoose.model('Article', ArticleSchema);

export default Article;
