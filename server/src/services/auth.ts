import jwt from 'jsonwebtoken';

interface JwtPayload {
  _id: unknown;
  username: string;
  email: string;
}

export const authenticateToken = (token: string): JwtPayload | null => {
  const secretKey = process.env.JWT_SECRET_KEY || '';

  try {
    const user = jwt.verify(token, secretKey) as JwtPayload;
    return user;
  } catch (err) {
    console.error('Token verification failed:', err);
    return null; 
  }
};

export const signToken = (user: JwtPayload): string => {
  const secretKey = process.env.JWT_SECRET_KEY || '';
  return jwt.sign({ _id: user._id, username: user.username, email: user.email }, secretKey, { expiresIn: '1h' });
};