const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/user');
const {convertUser} = require('./merge');




module.exports = {
    createUser: async ({userInput}) => {
        const {email, password} = userInput;
        const existingUser = await User.findOne({email});
        if(existingUser) {
            throw new Error(`User ${email} already exists`)
        }
        const hash = await bcrypt.hash(password, 12);
        const user = new User({ email, password:hash });
        const savedUser = await user.save();
        return convertUser(savedUser);
    },
    login: async ({email, password}) => {
        const user = await User.findOne({email});
        if(!user) {
            throw new Error(`Invalid credentials`);
        }
        const ok = await bcrypt.compare(password, user.password);
        if(!ok) {
            throw new Error(`Invalid credentials`);
        }
        const token = jwt.sign({
            userId: user.id,
            email
        }, 'supersecret', {
            expiresIn: '1h'
        });
        return {
            userId: user.id,
            token,
            tokenExpiration:1
        };
    }
}