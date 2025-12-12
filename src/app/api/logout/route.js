import { NextResponse } from 'next/server';

export async function POST(request) {
    if (request.cookies.get("token")) {
        const response = NextResponse.json({ logged_out: true }, { status: 200 });
        response.cookies.delete("token");
        return response;
    } else {
        return NextResponse.json({logged_out: false, reason: "Already logged out"}, {status: 200});
    }
}