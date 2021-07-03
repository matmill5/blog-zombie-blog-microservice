import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const BlogSchema = new Schema({
    '_id_publication': String,
    '_id_author': String,
    'title': String,
    'author': String,
    'publication': String,
    'published': String,
    'body': String,
})

const Blog = mongoose.model('Blog', BlogSchema)

export { Blog };