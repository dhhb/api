export default function(schema, options) {
    schema.add({
        createdAt: {
            type: Date,
            default: Date.now
        }
    });
    schema.add({
        modifiedAt: {
            type: Date
        }
    });

    schema.pre('save', function (next) {
        this.modifiedAt = Date.now();
        return next();
    });

    if (options && options.index) {
        schema.path('createdAt').index(options.index);
        schema.path('modifiedAt').index(options.index);
    }
}
