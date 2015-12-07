import mongoose from 'mongoose';
import createdModifiedPlugin from '../../utils/mongooseCreatedModifiedPlugin';

const TopicSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        unique: true,
        required: 'Topic title is required'
    }
});

if (env === 'production') {
    TopicSchema.set('autoIndex', false);
}
TopicSchema.plugin(createdModifiedPlugin, { index: true });

const Topic = mongoose.model('Topic', TopicSchema);

export default Topic;
