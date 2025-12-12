import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

const verifyToken = () => {
  // Ensure JWT secret exists
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return {
      succeeded: false,
      response: NextResponse.json({ error: 'Server misconfiguration: JWT_SECRET missing' }, { status: 500 })
    }
  }

  // Ensure the user has a token
  const token = cookies().get('token')?.value;
  if (!token) {
    return {
      succeeded: false,
      response: NextResponse.json({ error: 'Missing token' }, { status: 401 })
    }
  }

  // Ensure the token is valid
  const decoded_token = jwt.verify(token, secret)
  if (!decoded_token) {
    return {
      succeeded: false,
      response: NextResponse.json({ error: 'Invalid or expired token' }, { status: 403 })
    }
  }

  // Return the user's id from their token
  return {
    succeeded: true,
    user_id: decoded_token.id
  };
}

export default verifyToken;