const User = require('../models/User');
const Room = require('../models/Room');
const Booking = require('../models/Booking');
const Transaction = require('../models/Transaction');

async function buildAdminStats(timeRange = 'month') {
    const now = new Date();
    let startDate;
    switch (timeRange) {
        case 'week':
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
        case 'year':
            startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
            break;
        case 'month':
        default:
            startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            break;
    }

    const [
        totalUsers,
        totalRooms,
        pendingRooms,
        approvedRooms,
        rejectedRooms,
        bannedUsers,
        totalBookings,
        recentBookings,
        recentUsers,
        recentRooms,
        recentTransactions
    ] = await Promise.all([
        User.countDocuments(),
        Room.countDocuments(),
        Room.countDocuments({ status: 'pending' }),
        Room.countDocuments({ status: 'approved' }),
        Room.countDocuments({ status: 'rejected' }),
        User.countDocuments({ banned: true }),
        Booking.countDocuments(),
        Booking.countDocuments({ createdAt: { $gte: startDate } }),
        User.find({}, '-password').sort({ createdAt: -1 }).limit(5),
        Room.find({}).sort({ createdAt: -1 }).limit(5),
        Transaction.find({})
            .populate('tenant', 'firstName lastName email avatar')
            .sort({ createdAt: -1 })
            .limit(4)
    ]);

    const userGroups = await User.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        {
            $group: {
                _id: timeRange === 'year'
                    ? { $dateToString: { format: '%Y-%m', date: '$createdAt' } }
                    : { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                count: { $sum: 1 }
            }
        },
        { $sort: { _id: 1 } }
    ]);

    const roomGroups = await Room.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        {
            $group: {
                _id: timeRange === 'year'
                    ? { $dateToString: { format: '%Y-%m', date: '$createdAt' } }
                    : { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                count: { $sum: 1 }
            }
        },
        { $sort: { _id: 1 } }
    ]);

    const bookingGroups = await Booking.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        {
            $group: {
                _id: timeRange === 'year'
                    ? { $dateToString: { format: '%Y-%m', date: '$createdAt' } }
                    : { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                count: { $sum: 1 },
                revenue: { $sum: { $toDouble: '$totalAmount' } }
            }
        },
        { $sort: { _id: 1 } }
    ]);

    const userGrowth = userGroups.map(group => ({ date: group._id, count: group.count }));
    const roomGrowth = roomGroups.map(group => ({ date: group._id, count: group.count }));
    const bookingTrends = bookingGroups.map(group => ({ date: group._id, count: group.count, revenue: group.revenue }));

    const totalRevenue = await Booking.aggregate([
        { $group: { _id: null, total: { $sum: { $toDouble: '$totalAmount' } } } }
    ]).then(result => result.length > 0 ? Math.round(result[0].total) : 0);

    const recentRevenue = await Booking.aggregate([
        { $match: { createdAt: { $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) } } },
        { $group: { _id: null, total: { $sum: { $toDouble: '$totalAmount' } } } }
    ]).then(result => result.length > 0 ? Math.round(result[0].total) : 0);

    const recent7days = await User.countDocuments({ createdAt: { $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) } });
    const recent30days = await User.countDocuments({ createdAt: { $gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) } });
    const recentRooms7 = await Room.countDocuments({ createdAt: { $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) } });

    return {
        users: { count: totalUsers, recent7: recent7days, recent30: recent30days, banned: bannedUsers },
        rooms: { total: totalRooms, pending: pendingRooms, approved: approvedRooms, rejected: rejectedRooms, recent7: recentRooms7 },
        bookings: { total: totalBookings, recent7: recentBookings },
        revenue: { total: totalRevenue, recent7: recentRevenue },
        userGrowth,
        roomGrowth,
        bookingTrends,
        recentUsers,
        recentRooms,
        recentTransactions
    };
}

module.exports = {
    buildAdminStats
};
