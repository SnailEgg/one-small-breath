import { NextResponse } from "next/server";
import verifyToken from "../verifyToken";
import my_users from "@/database/models";

export async function POST(req) {
    const verification = verifyToken();
    if (!verification.succeeded) {
        return verification.response;
    }

    const correct_code = 'sweden474';

    const { user_id } = verification;

    const { code } = await req.json();
    const processed_code = code.replace(/\s+/g, '').toLowerCase(); // strip whitespace and convert to lowercase

    if (processed_code === correct_code) {
        await my_users.updateOne({ _id: user_id }, { $set: { is_outside: true } });
        return NextResponse.json({ success: true }, { status: 200 });
    } else {
        return NextResponse.json({ success: false, reason: 'incorrect code' }, { status: 400 });
    }
}