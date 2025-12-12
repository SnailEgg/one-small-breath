import db_connect from "@/database/db-connection";
import { my_documents } from "@/database/models";
import { NextResponse } from "next/server";
import verifyToken from "../verifyToken";

const db = db_connect();

export async function GET(req) {
  const verification = verifyToken();
  if (!verification.succeeded) {
    return verification.response;
  }

  const code = req.nextUrl.searchParams.get("doc").toUpperCase();

  try {
      const docSearch = await my_documents.find({document_code: code})
      if (docSearch.length === 0) {
        throw new Error("Document not found")
      }
      const doc = docSearch[0];
      return NextResponse.json({ document: doc, success: true }, { status: 200 })
  } catch (error) {
      return NextResponse.json({ success: false, reason: error.message }, { status: 404 })
  }
}