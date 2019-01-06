const Event = require('../../models/event');
const {convertEvent, getAUser, checkAuth} = require('merge');

module.exports = {
    events: async ()=> {
        const events = await Event.find();
        return events.map(convertEvent);
    },
    createEvent: async ({eventInput}, req) => {
        checkAuth(req);
        const {title, description, price, date} = eventInput;
        const user = await getAUser();
        if(!user) {
            throw new Error(`User 'user' not found`);
        }
        const event = new Event({
            title,
            description,
            price: +price,
            date: new Date(date),
            creator:currentUser.id
        });
        const savedEvent = await event.save();
        user.createdEvents.push(event);
        await user.save();
        return convertEvent(savedEvent);
    }
}