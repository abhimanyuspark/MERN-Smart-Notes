import Chat from "../models/chat.model.js";

const buildDocumentMessage = ({
  title,
  summary,
  suggestedQuestions = [],
  uploadedFiles = [],
  action = "created",
}) => {
  return JSON.stringify({
    type: "document_analysis",
    action,
    title,
    summary,
    suggestedQuestions,
    uploadedFiles,
  });
};

export const createNoteChat = async ({
  note,
  userId,
  mediaIds,
  uploadedFiles,
}) => {
  return await Chat.create({
    noteId: note._id,
    userId,
    mediaIds,
    title: `Chat - ${note.title}`,
    extractedContext: note.combinedText,

    messages: [
      {
        role: "assistant",

        content: buildDocumentMessage({
          action: "created",
          title: note.title,
          summary: note.summary,
          suggestedQuestions: note.suggestedQuestions,
          uploadedFiles,
        }),

        createdAt: new Date(),
      },
    ],
  });
};

export const updateNoteChat = async ({
  chatId,
  note,
  mediaIds,
  uploadedFiles,
}) => {
  const chat = await Chat.findById(chatId);

  if (!chat) return null;

  chat.mediaIds.push(...mediaIds);

  chat.extractedContext = note.combinedText;

  const newMessage = {
    role: "assistant",
    content: buildDocumentMessage({
      action: "updated",
      title: note.title,
      summary: note.summary,
      suggestedQuestions: note.suggestedQuestions,
      uploadedFiles,
    }),
    createdAt: new Date(),
  };

  chat.messages.push(newMessage);

  await chat.save();

  // Return only the newly added message from saved doc
  return chat.messages[chat.messages.length - 1];
};
