import db_connect from "@/database/db-connection";
import { my_searches } from "@/database/models";
import { NextResponse } from "next/server";
import verifyToken from "../../verifyToken";

const db = db_connect();

export async function PATCH(req) {
  const verification = verifyToken();
  if (!verification.succeeded) {
    return verification.response;
  }
  
  const { user_id } = verification;
  const { code } = await req.json();

  try {
    await my_searches.deleteMany({user_id: user_id, document_code: code});
    await my_searches.insertOne({ user_id: user_id, document_code: code, when: Date.now()});
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, reason: "Error inserting into DB"}, {status: 500});
  }
}

export async function GET() {
  const verification = verifyToken();
  if (!verification.succeeded) {
    return verification.response;
  }
  
  const { user_id } = verification;

  try {
      const searches = await my_searches.find({user_id: user_id}).sort({when: -1});
      return NextResponse.json({searches: searches, succeeded: true}, {status: 200});
  } catch (error) {
      return NextResponse.json({succeeded: false, reason: 'Error getting searches from database'}, {status: 500});
  }
}