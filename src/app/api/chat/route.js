import { Configuration, OpenAIApi } from "openai";
import { NextResponse } from 'next/server';
import my_users, { my_messages } from "../../../database/models";
import db_connect from "../../../database/db-connection";
import verifyToken from "../verifyToken";
import systemPrompt from "../systemPrompt";
import summaryPrompt from "../summaryPrompt";

const db = db_connect();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const maxContextLength = 6;

// this function has no security checks;
// only use it after confirming the user's authentication
const getMessages = async (user_id) => {
  // get all the messages in this user's conversation, sorted by date
  const response = await my_messages.find({"user_id": {$eq: user_id}}).sort({"when": 1});

  // get the user's name
  const userResponse = await my_users.find({"_id": {$eq: user_id}});
  const name = userResponse[0].name;

  // convert messages to have the property names expected by ChatGPT and the app
  let messages = response.map( ({ who, dialog, _id }) => {
    return {role: who, content: dialog, id: _id};
  });

  messages = [ {role: 'system', content: systemPrompt.replace('[full name]', name) }, ...messages ];

  return messages;
}

// this function has no security checks;
// only use it after confirming the user's authentication
const logMessage = async (id, {role, content, date=Date.now()}) => {
  await my_messages.insertOne({
    user_id: id,
    who: role,
    dialog: content,
    when: date
  });
}

const summarizeMessages = async (messages, user_id, ) => {
  const messages_data = {
    "model": "gpt-3.5-turbo",
    "messages": [ ...messages, { role: 'system', content: summaryPrompt } ],
  };

  const completion = await openai.createChatCompletion( messages_data );

  const { content } = completion.data.choices[0].message;
  console.log(content);

  logMessage(user_id, { role: 'system', content: `Summary of earlier conversation:\n${content}` });
}

export async function POST(req) {
  const tokenVerification = verifyToken();
  if (!tokenVerification.succeeded) {
    return tokenVerification.response;
  }
  const user_id = tokenVerification.user_id;
  
  // Parse JSON body properly (req.body doesn't exist in App Router)
  const { query } = await req.json();

  let messagesToSend = [];

  if (!query) {
    return NextResponse.json({ succeeded: false, reason: 'Invalid query - Query is blank' }, { status: 401 });
  } else {
    let messages = await getMessages(user_id);
    const user_message = { "role": "user", "content" : query }
    messages.push(user_message);
    logMessage(user_id, user_message);
    
    let completion = {};
    try {
      // remove all messages before the last summary, retaining the original system prompt
      messagesToSend = [...messages];
      for (let i = messagesToSend.length - 1; i > 0; i--) {
        if (messagesToSend[i].role === 'system') {
          messagesToSend.splice(1, i - 1);
          break;
        }
      }

      console.log(messagesToSend);

      const messages_data = {
        "model": "gpt-3.5-turbo",
        "messages": messagesToSend,
      };

      completion = await openai.createChatCompletion( messages_data );
    } catch (err) {
      return NextResponse.json({ succeeded: false, reason: "Couldn't reach OpenAI" }, { status: 500 });
    }

    const ai_message = completion.data.choices[0].message

    await logMessage(user_id, ai_message);
    messages = await getMessages(user_id);

    if (messagesToSend.length > maxContextLength) {
      messagesToSend.splice(0, 1);
      console.log(messagesToSend);
      await summarizeMessages([ ...messagesToSend, ai_message ], user_id);
    }

    const messagesToReturn = messages.filter((message) => message.role !== 'system');

    return NextResponse.json({ succeeded: true, result: messagesToReturn }, { status: 200 });
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
  const messagesToReturn = messages.filter((message) => message.role !== 'system');

  return NextResponse.json({ result: messagesToReturn }, { status: 200 });
}