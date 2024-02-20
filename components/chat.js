import React, { useEffect, useRef } from 'react';
import Talk from 'talkjs';

export default function Chat({ user }) {
  const chatContainerRef = useRef(null);

  useEffect(() => {
    // Ensure TalkJS has loaded
    if (!window.Talk || !user) {
      return;
    }

    // Initialize TalkJS
    Talk.ready.then(() => {
      const me = new Talk.User({
        id: user.uid,
        name: user.displayName || "Anonymous User",
        email: user.email,
        photoUrl: user.photoURL,
        welcomeMessage: "Hi there! How can I help you?",
      });

      if (!window.talkSession) {
        window.talkSession = new Talk.Session({
          appId: tS8wZOif, // Replace with your TalkJS App ID
          me: me,
        });
      }

      const conversation = window.talkSession.getOrCreateConversation(Talk.oneOnOneId(me, me));
      conversation.setParticipant(me);

      const chatbox = window.talkSession.createChatbox(conversation);
      chatbox.mount(chatContainerRef.current);
    });
  }, [user]); // Rerun the effect if the user object changes

  return <div ref={chatContainerRef} className="chat-container"></div>;
}
