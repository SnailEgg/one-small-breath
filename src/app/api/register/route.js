import { NextResponse } from 'next/server';
import { my_messages, my_users } from "../../../database/models";
import bcrypt from 'bcryptjs';
import db_connect from "../../../database/db-connection";

const db = db_connect();

const usernameRegex = /^[\d\w_]{4,12}$/;

export async function POST(req) {
    let { username, password, name } = await req.json();

    if (!username || !password || !name) {
        return NextResponse.json({ registered: false, reason: "One or more required fields missing" }, { status: 400 });
    }

    // ensure all data is strings and therefore safe for mongodb operations
    if ( typeof username !== 'string' ||
         typeof password !== 'string' ||
         typeof name !== 'string' ) {
            // vague error message for attackers
            return NextResponse.json({ registered: false, reason: 'Data is invalid'}, { status: 400 }); 
    }
    
    if (!usernameRegex.test(username)) {
        return NextResponse.json({ registered: false, reason: "Username doesn't meet requirements" }, { status: 400 });
    }

    // ensure the username isn't already in use
    const colliding_users = await my_users.find({"username": {$eq: username}});
    if (colliding_users.length > 0) {
        return NextResponse.json({ registered: false, reason: "Username already in use" }, { status: 409 });
    }

    username = username.toLowerCase();
    const hashed_password = await bcrypt.hash(password, 10);

    await my_users.insertOne({
        "username": username,
        "password": hashed_password,
        "name": name,
        "is_outside": false
    });

    const created_user = await my_users.find({"username": {$eq: username}});
    const new_user = created_user[0];

    return NextResponse.json(
        { 
            registered: true,
            account: { 
                username:   new_user.username,
                user_id:    new_user._id,
                name:       new_user.name,
                is_outside: false 
            } 
        }, 
        { status: 200 }
    );
}