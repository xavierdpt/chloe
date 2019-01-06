const Event = require('../../models/event');
const User = require('../../models/user');

const user = async id => {
    const user = await User.findById(id)
    return convertUser(user);
};

const event = async id => {
    const event = await Event.findById(id)
    return convertEvent(event);
};

const events = async ids => {
    const events = await Event.find({ _id : { $in: ids}});
    return events.map(convertEvent);
};

const getAUser = async () => {
    const user  = await User.findOne({email:'user'});
    return user;
};

const convertEvent = (event) => {
    const o = {};
    for( const k in event._doc) {
        o[k]=event._doc[k];
    }
    o._id = event.id;
    if(o.creator) {
        const userId = o.creator;
        o.creator = () => user(userId);
    }
    if(o.date) {
        o.date = dateToString(o.date);
    }
    return o;
};

const convertUser = (user) => {
    const r = {};
    for( const k in user._doc) {
        r[k]=user._doc[k];
    }
    r._id = user.id;
    delete r.password;
    if(r.createdEvents) {
        const ids = r.createdEvents;
        r.createdEvents = () => events(ids);
    }
    return r;
};

const convertBooking = booking => {
    const {user:userId, event:eventId, createdAt, updatedAt} = booking._doc;
    return {
        _id:booking.id,
        user: () => user(userId),
        event: () => event(eventId),
        createdAt: dateToString(createdAt),
        updatedAt: dateToString(updatedAt)
    };
};

const checkAuth = req => {
    if(!req.isAuth) {
        throw new Error('Unauthenticated');
    }
}

exports.getAUser = getAUser;
exports.convertEvent = convertEvent;
exports.convertUser = convertUser;
exports.convertBooking = convertBooking;
exports.checkAuth = checkAuth;