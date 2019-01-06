const Booking = require('../../models/booking');
const {convertBooking, getAUser, checkAuth} = require('./merge');

module.exports = {
     bookings: async (args, req) => {
        checkAuth(req);
        const bookings = await Booking.find();
        return bookings.map(convertBooking);
    },
    bookEvent: async ({eventId}, req) => {
        checkAuth(req);
        const user = await getAUser();
        const booking = new Booking({
            event:eventId,
            user:user.id
        });
        const savedBooking = await booking.save();
        return convertBooking(savedBooking);
    },
    cancelBooking: async ({bookingId}, req) => {
        checkAuth(req);
        const booking = await Booking.findById(bookingId).populate('event');
        if(booking) {
            await Booking.deleteOne({_id : bookingId});
            return convertEvent(booking.event);
        }
    }
}