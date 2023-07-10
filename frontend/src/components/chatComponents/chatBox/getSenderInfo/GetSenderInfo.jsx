// ===========================================================================
// Get sender function
// ===========================================================================
export const getSender = (loggeduser, users) => {
  return users[0]._id === loggeduser._id ? users[1].name : users[0].name;
};

// ===========================================================================
// Get sender info
// ===========================================================================
export const getSenderInfo = (loggeduser, users) => {
  return users[0]._id === loggeduser._id ? users[1] : users[0].name;
};

// ===========================================================================
// If sender is not logged in user
// ===========================================================================
/*
The parameters indicates:
  - messages = all messages
  - CM = current message
  - CMI = currenet message index
  - userId = the logged in user id
*/
export const isSameSender = (messages, CM, CMI, userId) => {
  return (
    CMI < messages.length - 1 &&
    (messages[CMI + 1].sender._id !== CM.sender._id ||
      messages[CMI + 1] === undefined) &&
    messages[CMI].sender._id !== userId
  );
};

// ===========================================================================
// Last Message
// ===========================================================================
/*
The parameters indicates:
  - messages = all messages
  - CMI = currenet message index
  - userId = the logged in user id
*/
export const isLastMessage = (messages, CMI, userId) => {
  return (
    CMI === messages.length - 1 &&
    messages[messages.length - 1].sender._id !== userId &&
    messages[messages.length - 1].sender._id
  );
};

// ===========================================================================
// Sender status
// ===========================================================================
export const isSameSenderMargin = (messages, CM, CMI, userId) => {
  if (
    // if logged in user
    CMI < messages.length - 1 &&
    messages[CMI + 1].sender._id === CM.sender._id &&
    messages[CMI].sender._id !== userId
  ) {
    return 33;
  } else if (
    (CMI < messages.length - 1 &&
      messages[CMI + 1].sender._id !== CM.sender._id &&
      messages[CMI].sender._id !== userId) ||
    (CMI === messages.length - 1 && messages[CMI].sender._id !== userId)
  ) {
    return 0;
  } else {
    return 'auto';
  }
};

// ===========================================================================
// sender status
// ===========================================================================
export const isSameUser = (messages, CM, CMI) => {
  return CMI > 0 && messages[CMI - 1].sender._id === CM.sender._id;
};
