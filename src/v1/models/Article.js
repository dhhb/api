import mongoose from 'mongoose';
import createdModifiedPlugin from '../../utils/mongooseCreatedModifiedPlugin';

const ArticleSchema = new mongoose.Schema({
    title: String,

    text: String,

    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    topic: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Topic'
    }],

    tags: [{
        _id: false,
        type: String
    }],

    files: [{
        s3FilePath: String,
        fileName: String,
        url: String,
        fileType: String,
        _id: false
    }],

    status: {
        type: String,
        required: 'Status is required',
        enum: {
            values: ['draft', 'published', 'deleted'],
            message: 'Value "{VALUE}" is not valid for field "{PATH}"'
        },
        default: 'draft'
    }
});

if (env === 'production') {
    ArticleSchema.set('autoIndex', false);
}
ArticleSchema.plugin(createdModifiedPlugin, { index: true });

const Article = mongoose.model('Article', ArticleSchema);

export default Article;
