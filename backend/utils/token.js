import jwt from 'jsonwebtoken';

export const generateToken = (id, role) => {
  const secret = process.env.JWT_SECRET || 'local2brand_super_secure_jwt_secret_key_2026';
  const expiresIn = process.env.JWT_EXPIRES_IN || '30d';

  return jwt.sign({ id, role }, secret, {
    expiresIn,
  });
};

