import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    //for now only username and pwd will be required, but eventually everything here will be needed.
    fullname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: Number,
        unique: true,
        required: true,
    },
    countrycode: {
        type: Number,
        required: true,
    },
});

const UserModel = mongoose.model('User', userSchema);

export default UserModel;
