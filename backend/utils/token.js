import jwt from 'jsonwebtoken';

export const generateToken = (id, role) => {
  const secret = process.env.JWT_SECRET || 'local2brand_super_secure_jwt_secret_key_2026';
  const expiresIn = process.env.JWT_EXPIRES_IN || '30d';

  const cleanId = String(id || '').trim();
  return jwt.sign({ id: cleanId, role }, secret, {
    expiresIn,
  });
};

export const getCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  return {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    path: '/',
  };
};

export const sendTokenResponse = (user, statusCode, res, message = 'Success') => {
  const userId = user._id ? user._id.toString() : (user.id ? String(user.id) : '');
  const token = generateToken(userId, user.role);
  const cookieOptions = getCookieOptions();

  res.cookie('token', token, cookieOptions);
  res.cookie('l2b_token', token, cookieOptions);

  return res.status(statusCode).json({
    success: true,
    message,
    token,
    user: {
      id: userId,
      _id: userId,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar || '',
      phone: user.phone || '',
      company: user.company || '',
      status: user.status || 'active',
      isEmailVerified: Boolean(user.isEmailVerified),
    },
  });
};
