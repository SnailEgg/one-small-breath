import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { my_users } from "../../../database/models";
import db_connect from "../../../database/db-connection";
import verifyToken from '../verifyToken';

const db = db_connect();

export async function POST(req) {
  // Ensure JWT secret exists
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return NextResponse.json(
      { reason: 'Server misconfiguration: JWT_SECRET missing' },
      { status: 500 }
    );
  }

  // Parse JSON body properly (req.body doesn't exist in App Router)
  const { user_name, user_password } = await req.json();

  if (!user_name || !user_password) {
    return NextResponse.json({ authenticated: false, reason: 'Invalid credentials - user_name or user_password is blank' }, { status: 401 });
  }

  // ensure data is strings and therefore safe for mongodb operations
  if (typeof user_name !== 'string' || typeof user_password !== 'string') {
    // vague error message for attackers
    return NextResponse.json({ authenticated: false, reason: 'Data is invalid' }, { status: 200 });
  }

  // what to query our database for
  const user_query         = { username: user_name.toLowerCase() };
  const user_query_results = await my_users.find(user_query);
  const user               = user_query_results[0];
  
  // if the first result matches our passed in user_name, then it must match
  if ( user?.username === user_name) {
    // Verify credentials
    const ok = await bcrypt.compare(user_password, user?.password);
    
    if (!ok) {
      return NextResponse.json({ authenticated: false, reason: "Password is incorrect" }, { status: 401 });
    } else {
      // Create JWT token
      const token = jwt.sign({ id: user._id }, secret, { expiresIn: '3h' });

      // Create response and set HttpOnly cookie
      const res = NextResponse.json({ 
          authenticated: true, 
          account: { 
            user_id: user._id, 
            username: user.username, 
            name: user.name,
            is_outside: user.is_outside
          }
        }, 
        { status: 200 }
      );
      res.cookies.set('token', token, {
        httpOnly: true,
        secure: true,        // change to false for local http:// testing
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 180,     // 3 hours
      });

      // although not using the return value, this must be awaited for the update to work
      await my_users.updateOne({"_id": {$eq: user._id}}, {$set: {"last_login": Date.now()}});

      return res;
    }

  } else {
    return NextResponse.json({ authenticated: false, reason: "User not found" }, { status: 401 });
  }
}

// used for the application to confirm it has a valid token before trying to access data
export async function GET() {
  const verification = verifyToken();
  if (!verification.succeeded) {
    return verification.response;
  }

  const { user_id } = verification;

  try {
    const user_response = await my_users.find({_id: {$eq: user_id}});
    const { _id, username, name, is_outside } = user_response[0];

    return NextResponse.json({
      authenticated: true,
      account: {
        user_id: _id,
        username: username, 
        name: name,
        is_outside: is_outside
      }
    }, {status: 200});
  } catch (error) {
    // This vague error will be returned if the token is considered valid but the user_id it holds references a non-existant user
    return NextResponse.json({ authenticated: false, reason: 'Malformed token' }, { status: 400 });
  }
}