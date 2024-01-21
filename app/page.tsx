"use client";

import { isDark, lightenColor, safeParse } from '@/lib/utils';
import Autolinker from 'autolinker';
import { motion } from 'framer-motion';
import React, { useState, useEffect, useRef } from 'react';
import { EmoteOptions } from 'simple-tmi-emotes';
import tmi from 'tmi.js';
import { FaCheck, FaEye, FaEyeSlash } from 'react-icons/fa';

const TWITCH_CHANNEL = 'EverythingNowShow';

interface Message {
  id: string | undefined;
  username: string | undefined;
  twitch: string | undefined;
  emotes: { [x: string]: string[];[x: number]: string[] };
  date: Date;
  message: string;
  badges: tmi.Badges | undefined;
  mod: boolean | undefined;
  subscriber: boolean | undefined;
  color: string | undefined;
  userType: string | undefined;
  turbo: boolean | undefined;
  returningChatter: boolean | undefined;
  firstMessage: boolean | undefined;
}

const emojiSize = '24px';
const options: EmoteOptions = {
  format: 'default',
  themeMode: 'light',
  scale: '1.0',
};

export default function IndexPage() {
  const [messages, setMessages]: any = useState([]);
  const [queue, setQueue] = useState<any[]>([]);
  const [displayMessage, setDisplayMessage] = useState<any | null>(null);
  const [isDisplayMessageVisible, setIsDisplayMessageVisible] = useState(true);
  const [selectedQueueMessageId, setSelectedQueueMessageId] = useState<string | undefined>(undefined);
  const [inputChannel, setInputChannel] = useState<string>(TWITCH_CHANNEL);
  const [isChannelLoaded, setIsChannelLoaded] = useState(false);

  useEffect(() => {
    const savedChannel = window.localStorage.getItem('twitchChannel');
    setInputChannel(savedChannel || TWITCH_CHANNEL);
    setIsChannelLoaded(true);
  }, []);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleChannelChange = () => {
    window.localStorage.setItem('twitchChannel', inputChannel);
    window.location.reload();
  };

  const displayQueueMessage = (message: Message) => {
    setDisplayMessage(message);
    setSelectedQueueMessageId(message.id);
  };

  const toggleDisplayMessage = () => {
    setIsDisplayMessageVisible(!isDisplayMessageVisible);
  };

  const addToQueue = (message: Message) => {
    if (!queue.some(msg => msg.id === message.id)) {
      setQueue(prevQueue => [...prevQueue, message]);
    }
  };

  const removeFromQueue = (messageId: string | undefined) => {
    setQueue(prevQueue => prevQueue.filter(msg => msg.id !== messageId));
  };

  useEffect(() => {
    if (!isChannelLoaded) {
      return;
    }
    const client = new tmi.Client({
      connection: {
        secure: true,
        reconnect: true
      },
      channels: [inputChannel]
    });
    client.on('message', (channel, tags, message, self) => {
      const msg: Message = {
        id: tags?.id,
        username: tags['display-name'],
        twitch: tags?.username,
        emotes: tags?.emotes || {},
        date: new Date(),
        message,
        badges: tags?.badges,
        mod: tags?.mod,
        subscriber: tags?.subscriber,
        color: tags?.color,
        userType: tags?.['user-type'],
        turbo: tags?.turbo,
        returningChatter: tags?.['returning-chatter'],
        firstMessage: tags?.['first-msg'],
      };

      msg.message = message;

      setMessages((prevChat: any) => {

        const doesExist = prevChat.some((chatMsg: any) => chatMsg.id === tags.id);

        if (doesExist) {

          return prevChat;
        } else {

          const newChat = [
            ...prevChat,
            {
              user: tags["display-name"],
              message,
              emotes: tags?.emotes,
              color: tags?.color,
              id: tags?.id,
              returningChatter: tags?.['returning-chatter'],
              platform: 'twitch',
            }
          ];
          return newChat.slice(-60);
        }
      });


    });
    client.connect();
    return () => {
      client.disconnect();
    };
  }, [isChannelLoaded, inputChannel]);

  return (
    <div style={{ display: 'flex', height: '93vh' }}>
      <div style={{ width: '50%', border: '1px solid grey', overflowY: 'auto' }} ref={chatContainerRef}>
        <div style={{ padding: '10px', fontWeight: 'bold' }}>Chat</div>
        {messages.map((msg: any, index: number) => (
          <motion.div
            key={msg.id || index}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
            onClick={() => addToQueue(msg)}
            style={{
              display: "flex",
              flexDirection: 'column',
              alignItems: "center",
              justifyContent: "center",
              padding: "10px",
              backgroundColor: "black",
              fontSize: '16px',
              maxWidth: '100%',
              minWidth: '100%',
              cursor: 'pointer',
            }}
          >
            <div style={{
              alignSelf: 'flex-start',
              width: '100%',
              display: 'flex',
              justifyContent: 'flex-start',
              paddingRight: '10px',
            }}>
              <span className="username" style={{
                fontWeight: "bold",
                color: msg.color && isDark(msg.color) ? lightenColor(msg.color, 40) : msg.color || "white",
                fontSize: '16px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>{msg.user + ':'}</span>
            </div>
            <div style={{
              display: 'flex',
              flexDirection: 'row',
              maxWidth: '580px',
              margin: '0 auto',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              textAlign: 'left',
              padding: '0 10px',
            }}>
              <span dangerouslySetInnerHTML={{
                __html: Autolinker.link(safeParse(msg.message || '-', [], options), {
                  className: 'apple',
                }),
              }} style={{ fontSize: '16px' }} />
            </div>
            <div style={{
              bottom: '0',
              left: '0',
              width: '100%',
              height: '4px',
              backgroundColor: msg.color || "white",
            }}></div>
          </motion.div>
        ))}
      </div>
      <div style={{ width: '50%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, border: '1px solid grey', padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* Display Zone */}
          {displayMessage && isDisplayMessageVisible && (
            <motion.div
              key={displayMessage.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5 }}
              style={{
                display: "flex",
                flexDirection: 'column',
                alignItems: "flex-start",
                justifyContent: "flex-start",
                padding: "10px",
                backgroundColor: "black",
                fontSize: emojiSize,
                maxWidth: '580px',
                width: '100%',
                cursor: 'pointer',
              }}
            >
              <div style={{
                alignSelf: 'flex-start',
                width: '100%',
                display: 'flex',
                justifyContent: 'flex-start',
                paddingRight: '10px',
              }}>
                <span className="username" style={{
                  fontWeight: "bold",
                  color: displayMessage.color && isDark(displayMessage.color) ? lightenColor(displayMessage.color, 40) : displayMessage.color || "white",
                  fontSize: emojiSize,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>{displayMessage.user + ':'}</span>
              </div>
              <div style={{
                display: 'flex',
                flexDirection: 'row',
                margin: '0 auto',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                textAlign: 'center',
                padding: '0 10px',
                width: '100%',
              }}>
                <span className="message" dangerouslySetInnerHTML={{
                  __html: Autolinker.link(safeParse(displayMessage.message || '-', [], options), {
                    className: 'apple',
                  }),
                }} style={{ fontSize: emojiSize }} />
              </div>
              <div style={{
                bottom: '0',
                left: '0',
                width: '100%',
                height: '4px',
                backgroundColor: displayMessage.color || "white",
              }}></div>
            </motion.div>
          )}
        </div>

        <div style={{ flex: 1, border: '1px solid grey', overflowY: 'auto' }}>
          <div style={{ padding: '10px', fontWeight: 'bold' }}>Queue</div>
          {/* Queue */}
          {queue.map(msg => (
            <div
              key={msg.id}
              onClick={(e) => {
                e.preventDefault();
                displayQueueMessage(msg)
              }
              }
              onContextMenu={(e) => {
                e.preventDefault();
                removeFromQueue(msg.id);
              }}
              style={{ cursor: 'pointer', padding: '10px', margin: '5px' }}
            >
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.5 }}
                onClick={() => addToQueue(msg)}
                style={{
                  display: "flex",
                  flexDirection: 'column',
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "10px",
                  backgroundColor: "black",
                  fontSize: emojiSize,
                  maxWidth: '100%',
                  minWidth: '100%',
                  cursor: 'pointer',
                  border: selectedQueueMessageId === msg.id ? '2px dotted white' : 'none',
                }}
              >
                <div style={{
                  alignSelf: 'flex-start',
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'flex-start',
                  paddingRight: '10px',
                }}>
                  <span className="username" style={{
                    fontWeight: "bold",
                    color: msg.color && isDark(msg.color) ? lightenColor(msg.color, 40) : msg.color || "white",
                    fontSize: emojiSize,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>{msg.user + ':'}</span>
                </div>
                <div style={{
                  display: 'flex',
                  flexDirection: 'row',
                  maxWidth: '580px',
                  margin: '0 auto',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  textAlign: 'left',
                  padding: '0 10px',
                }}>
                  <span className="message" dangerouslySetInnerHTML={{
                    __html: Autolinker.link(safeParse(msg.message || '-', [], options), {
                      className: 'apple',
                    }),
                  }} style={{ fontSize: emojiSize }} />
                </div>
                <div style={{
                  bottom: '0',
                  left: '0',
                  width: '100%',
                  height: '4px',
                  backgroundColor: msg.color || "white",
                }}></div>
              </motion.div>
            </div>
          ))}
          <div style={{ position: 'absolute', bottom: '10px', right: '60px', display: 'flex', alignItems: 'center' }}>
            <input
              type="text"
              value={inputChannel}
              onChange={(e) => setInputChannel(e.target.value)}
              placeholder="Enter Twitch channel"
              style={{ marginRight: '10px', padding: '5px' }}
            />
            <FaCheck size={30} onClick={handleChannelChange} style={{ cursor: 'pointer' }} />
          </div>
          <motion.div
            whileHover={{ scale: 1.1 }}
            style={{
              position: 'absolute',
              bottom: '10px',
              right: '10px',
              cursor: 'pointer',
            }}
            onClick={toggleDisplayMessage}
          >
            {isDisplayMessageVisible ? <FaEye size={30} /> : <FaEyeSlash size={30} />}
          </motion.div>
        </div>
      </div>
    </div>
  );
}