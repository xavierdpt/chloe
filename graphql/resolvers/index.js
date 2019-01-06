const authResolvers = require('./auth');
const bookingResolvers = require('./booking');
const eventsResolvers = require('./booking');

module.exports = {
    ...authResolvers,
    ...bookingResolvers,
    ...eventsResolvers
};