const crypto = require('crypto');

/**
 * Algorithm 1: Multi-Criteria Room Search & Filtering Algorithm (MCRSFA)
 * 
 * Calculates a match score (0-100) for a room based on:
 * - Keyword match (name, description, tags)
 * - Capacity match
 * - Required equipment match
 * - Availability (checked by caller)
 * 
 * @param {Object} room - The room object
 * @param {Object} criteria - { keyword, minCapacity, reqEquipment }
 * @returns {Number} score
 */
function calculateMatchScore(room, criteria) {
    let score = 0;
    const { keyword, minCapacity, reqEquipment } = criteria;

    // 1. Keyword Match (40 points)
    if (keyword) {
        const lowerKeyword = keyword.toLowerCase();
        const titleMatch = room.title && room.title.toLowerCase().includes(lowerKeyword);
        const descMatch = room.description && room.description.toLowerCase().includes(lowerKeyword);
        // Check amenities/tags if available
        const amenitiesMatch = room.amenities && room.amenities.some(a => a.toLowerCase().includes(lowerKeyword));

        if (titleMatch || descMatch || amenitiesMatch) {
            score += 40;
        }
    } else {
        // If no keyword specified, give full points or scale differently? 
        // For filtering, usually we just ignore if not set, but for scoring we want matches to pop.
        // Let's assume neutral if no keyword
    }

    // 2. Capacity Check (20 points)
    if (minCapacity) {
        if (room.maxOccupants >= minCapacity) {
            score += 20;
        }
    } else {
        score += 20; // Default points if no capacity constraint
    }

    // 3. Equipment/Amenities Check (20 points)
    if (reqEquipment && Array.isArray(reqEquipment) && reqEquipment.length > 0) {
        // Assume reqEquipment contains strings of required amenities
        const roomAmenities = (room.amenities || []).map(a => a.toLowerCase());
        const missing = reqEquipment.filter(req => !roomAmenities.includes(req.toLowerCase()));

        if (missing.length === 0) {
            score += 20;
        } else {
            // Partial match logic could go here, e.g. score += 20 * (found / total)
            const foundCount = reqEquipment.length - missing.length;
            score += Math.floor(20 * (foundCount / reqEquipment.length));
        }
    } else {
        score += 20; // Default points if no equipment constraint
    }

    // 4. Availability Check (20 points)
    // This is usually a boolean filter before scoring, but if we want to rank "available now" higher
    // than "available soon", we could add points here.
    // For MCRSFA as described: "If room is free in selected time... score += 20"
    // We assume the caller already filtered by availability or passed a flag
    if (room.isAvailable !== false) { // Simplified check based on passed flag
        score += 20;
    }

    return score;
}

/**
 * Algorithm 2: Location-Weighted Proximity Ranking Algorithm (LWPR)
 * 
 * Calculates distance between two points using Haversine formula.
 * 
 * @param {Number} lat1 
 * @param {Number} lon1 
 * @param {Number} lat2 
 * @param {Number} lon2 
 * @returns {Number} distance in meters
 */
function haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371000; // Radius of Earth in meters
    const toRad = (val) => val * Math.PI / 180;

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const radLat1 = toRad(lat1);
    const radLat2 = toRad(lat2);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(radLat1) * Math.cos(radLat2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}

/**
 * Calculates a proximity score based on distance.
 * Closer = Higher score.
 * 
 * @param {Number} distance - distance in meters
 * @param {Number} maxDist - max distance to consider text 0 score, e.g. 10000m (10km)
 * @returns {Number} score (0-100)
 */
function calculateProximityScore(distance, maxDist = 10000) {
    if (distance > maxDist) return 0;
    return (1 - (distance / maxDist)) * 100;
}


/**
 * Algorithm 3: Secure Deposit & Payment Verification Algorithm (SDPVA)
 * 
 * Generates a temporary payment token and expiration time.
 * 
 * @returns {Object} { token, expireAt }
 */
function generatePaymentDetails(expiresInMinutes = 10) {
    const token = crypto.randomBytes(16).toString('hex');
    const now = new Date();
    const expireAt = new Date(now.getTime() + expiresInMinutes * 60000);
    return { token, expireAt };
}

module.exports = {
    calculateMatchScore,
    haversineDistance,
    calculateProximityScore,
    generatePaymentDetails
};
