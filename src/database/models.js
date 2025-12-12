const mongoose = require("mongoose");

const MyUserSchema = new mongoose.Schema( {
  username: {
    type: 'String',
    required: true,
    unique: true
  },
  name: {
    type: 'String',
    required: true
  },
  password: {
    type: 'String',
    required: true
  },
  last_login: {
    type: 'Date'
  },
  is_outside: {
    type: 'Boolean',
    required: true
  }
});

const MyMessagesSchema = new mongoose.Schema( {
  user_id: {
    type: 'String',
    required: true
  },
  who: {
    type: 'String',
    required: true
  },
  when: {
    type: 'Date',
    required: true
  },
  dialog: {
    type: 'String',
    required: true
  }
} );

const MyDocumentsSchema = new mongoose.Schema( {
  document_code: {
    type: 'String',
    required: true,
    unique: true
  },
  title: {
    type: 'String',
    required: true
  },
  source: {
    type: 'String',
    required: true
  },
  author: {
    type: 'String',
    required: true
  },
  content: {
    type: [String],
    required: true
  },
  date: {
    type: 'Date'
  }
});

const MySearchesSchema = new mongoose.Schema( {
  user_id: {
    type: 'String',
    required: true
  },
  document_code: {
    type: 'String',
    required: true
  },
  when: {
    type: 'Date',
    required: true
  }
});

export const my_users = mongoose.models.users || mongoose.model("users", MyUserSchema);
export const my_messages = mongoose.models.messages || mongoose.model("messages", MyMessagesSchema);
export const my_documents = mongoose.models.documents || mongoose.model("documents", MyDocumentsSchema);
export const my_searches = mongoose.models.searches || mongoose.model("searches", MySearchesSchema);
  
export default my_users;