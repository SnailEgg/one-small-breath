import { Configuration, OpenAIApi } from "openai";
import { NextResponse } from 'next/server';
import { my_messages } from "../../../database/models";
import db_connect from "../../../database/db-connection";
import verifyToken from "../verifyToken";

const db = db_connect();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

// this function has no security checks;
// only use it after confirming the user's authentication
const getMessages = async (user_id) => {
  // get all the messages in this user's conversation, sorted by date
  const response = await my_messages.find({"user_id": {$eq: user_id}}).sort({"when": 1});

  // convert messages to have the property names expected by ChatGPT and the app
  const messages = response.map( ({ who, dialog, _id }) => {
    return {role: who, content: dialog, id: _id};
  });

  return messages;
}

// this function has no security checks;
// only use it after confirming the user's authentication
const logMessage = async (id, {role, content}) => {
  await my_messages.insertOne({
    user_id: id,
    who: role,
    dialog: content,
    when: Date.now()
  });
}

export async function POST(req) {
  const tokenVerification = verifyToken();
  if (!tokenVerification.succeeded) {
    return tokenVerification.response;
  }
  const user_id = tokenVerification.user_id;
  
  // Parse JSON body properly (req.body doesn't exist in App Router)
  const { query } = await req.json();

  if (!query) {
    return NextResponse.json({ succeeded: false, reason: 'Invalid query - Query is blank' }, { status: 401 });
  } else {
    let messages = await getMessages(user_id);
    const user_message = {"role": "user", "content" : query}
    messages.push(user_message);
    logMessage(user_id, user_message);
    
    let completion = {};
    try {
      let messages_data = {
        "model": "gpt-3.5-turbo",
        "messages": messages,
      };

      completion = await openai.createChatCompletion( messages_data );
    } catch (err) {
      return NextResponse.json({ succeeded: false, reason: "Couldn't reach OpenAI" }, { status: 500 });
    }

    const ai_message = completion.data.choices[0].message

    await logMessage(user_id, ai_message);
    messages = await getMessages(user_id);

    return NextResponse.json({ succeeded: true, result: messages }, { status: 200 });
  }
}

// retrieve previous messages
export async function GET() {
  const tokenVerification = verifyToken();
  if (!tokenVerification.succeeded) {
    return tokenVerification.response;
  }
  const user_id = tokenVerification.user_id;

  const messages = await getMessages(user_id);

  return NextResponse.json({ result: messages }, { status: 200 });
}