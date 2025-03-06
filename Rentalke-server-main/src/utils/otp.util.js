const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const isOTPExpired = (createdAt) => {
  const now = new Date();
  const otpTime = new Date(createdAt);
  const diffMinutes = Math.abs(now - otpTime) / 60000; // Convert to minutes
  return diffMinutes > 3;
};

module.exports = {
  generateOTP,
  isOTPExpired
};
