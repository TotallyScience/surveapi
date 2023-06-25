import express from 'express';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';

import UserModel from '../models/user_model.js';

const accountRouter = new express.Router();

accountRouter.post('/register', bodyParser.json(), async (req, res) => {
    const { email, password, phone, countryCode, name, confirmPassword } = req.body;
    //trim some of the values
    email = email.trim();
    phone = phone.trim();
    name = name.trim();
    //Make sure there is a space seperating the first and last name
    if (!name || !name.trim().includes(' ')) {
        return res.status(400).json({ error: 'First and last name must be seperated by a space' });
    }
    //Check if the email is valid
    if (!email || !email.includes('@')) {
        return res.status(400).json({ error: 'Invalid email' });
    }
    //Check if the password is valid and has a special character and number
    if (!password || password.length < 8 || !password.match(/[\d\W]/g)) {
        return res.status(400).json({ error: 'Invalid password' });
    }
    //Check if the phone number is valid
    if (!phone || phone.length < 8) {
        console.log('Invalid phone number');
        return res.status(400).json({ error: 'Invalid phone number' });
    }
    //Check if password matches confirm password
    if (password !== confirmPassword) {
        console.log('Passwords do not match');
        return res.status(400).json({ error: 'Passwords do not match' });
    }

    //All checks out, add to db

    //Seperate name into first and last name with only the first letter capitalized and then combine them into one string
    const firstName = name.split(' ')[0].charAt(0).toUpperCase() + name.split(' ')[0].slice(1);
    const lastName = name.split(' ')[1].charAt(0).toUpperCase() + name.split(' ')[1].slice(1);
    const fullName = firstName + ' ' + lastName;

    //hash password
    const hashedPassword = await hash(password);

    //create account
    try {
        const newUser = new UserModel({
            fullname: fullName,
            email: email,
            password: hashedPassword,
            phone: phone,
            countryCode: countryCode,
        });
        await newUser.save();
    } catch (err) {
        console.log(err);
        if (err.code === 11000) {
            //duplicate key error
            if (err.keyPattern.email) {
                return res.json({ status: 'error', error: 'Email already registered' });
            } else if (err.keyPattern.phone) {
                return res.json({ status: 'error', error: 'Phone number already registered' });
            }
        }
        res.json({ status: 'error', error: err.toString() });
    }

    //return success
    console.log('Account created');
    return res.status(200).json({ success: 'Account created' });
});

async function hash(string) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(string, salt);
}

export default accountRouter;
