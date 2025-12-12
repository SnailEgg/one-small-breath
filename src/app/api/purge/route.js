import { NextResponse } from 'next/server';
import { my_messages } from "../../../database/models";
import db_connect from "../../../database/db-connection";
import verifyToken from '../verifyToken';

const db = db_connect();

export async function DELETE() {
  const verification = verifyToken();
  if (!verification.succeeded) {
    return verification.response;
  }
  
  const { user_id } = verification;

  // Delete the user's records based on id from token, but retain the system prompt
  await my_messages.deleteMany({ user_id: { $eq: user_id }, who: { $ne: 'system' } });

  return NextResponse.json({ result: [] }, { status: 200 });
}