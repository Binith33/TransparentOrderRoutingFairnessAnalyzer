const AuditLog = require("../models/AuditLog");

const logAction = async (userId, action, details, ipAddress = "127.0.0.1") => {
    try {
        const log = new AuditLog({
            user: userId,
            action,
            details,
            ipAddress
        });
        await log.save();
    } catch (error) {
        console.error("Failed to save audit log:", error);
    }
};

module.exports = { logAction };
