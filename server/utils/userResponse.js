const formatUserResponse = (user) => ({
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    accountStatus: user.accountStatus,
    profilePic: user.profilePic,
    createdAt: user.createdAt
});

module.exports = { formatUserResponse };
