"use client";

import { isDark, lightenColor, safeParse } from '@/lib/utils';
import Autolinker from 'autolinker';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useState, useEffect, useRef } from 'react';
import { EmoteOptions } from 'simple-tmi-emotes';
import tmi from 'tmi.js';
import { FaCheck, FaCopy, FaExternalLinkAlt, FaEye, FaEyeSlash } from 'react-icons/fa';
import { DriftDBProvider, useSharedState } from 'driftdb-react';
import MobileLandingPage from '@/components/MobilePage';

const TWITCH_CHANNEL = '';

export interface Message {
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

const parseMessageWithEmotes = (msg: string, emotes: any) => {
  let parsedMessage = safeParse(msg, emotes, options);
  parsedMessage = parsedMessage.replace(/<img /g, '<img style="max-width:24px; max-height:24px; display:inline-block; vertical-align:middle;" ');
  return parsedMessage;
};

function IndexPage() {
  const [messages, setMessages]: any = useState([]);
  const [queue, setQueue] = useState<any[]>([]);
  const [displayMessage, setDisplayMessage] = useState<any | null>(null);
  const [selectedQueueMessageId, setSelectedQueueMessageId] = useState<string | undefined>(undefined);
  const [inputChannel, setInputChannel] = useState<string>(TWITCH_CHANNEL);
  const [isChannelLoaded, setIsChannelLoaded] = useState(false);
  const [message, setMessage] = useSharedState('hat-message', {});
  const [isDisplayMessageVisible, setIsDisplayMessageVisible] = useSharedState('hat-message-visible', false);
  const [viewerUrl, setViewerUrl] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);

  const handleCopy = () => {
    navigator.clipboard.writeText(viewerUrl || '');
    setCopied(true);
  };

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  useEffect(() => {
    const savedChannel = window.localStorage.getItem('twitchChannel');
    if (savedChannel) {
      setInputChannel(savedChannel);
    }
    setIsChannelLoaded(true);
  }, []);

  useEffect(() => {
    window.localStorage.setItem('twitchChannel', inputChannel);
  }, [inputChannel]);

  useEffect(() => {
    // delay for 2 seconds to allow the viewer to load
    setTimeout(() => {
      const url = new URL(window.location.href);
      const room = url.searchParams.get('_driftdb_room');
      setViewerUrl(url.origin + '/viewer?_driftdb_room=' + room);
    }, 2000);
  }, []);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current && isAutoScrolling) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const displayQueueMessage = (message: Message) => {
    setMessage(message);
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
          return newChat.slice(-500);
        }
      });


    });
    client.connect();
    return () => {
      client.disconnect();
    };
  }, [isChannelLoaded, inputChannel]);

  if (isMobile) {
    return <MobileLandingPage />;
  }

  return (
    <div style={{ display: 'flex', height: '91vh', paddingTop: '2vh' }}>
      <AnimatePresence>
        <motion.div initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }} style={{ width: '50%', borderRight: '1px solid grey', overflowY: 'auto', overflowX: 'hidden' }} ref={chatContainerRef}>
          <div style={{ padding: '10px', fontWeight: 'bold' }}>Chat</div>
          <AnimatePresence mode="sync">
            {messages.map((msg: any, index: number) => (
              <motion.div
                key={msg.id || index}
                initial={{ opacity: 0, x: -200 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 200 }}
                transition={{ duration: 0.1 }}
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
                whileHover={{ backgroundColor: '#464646' }}
                onHoverStart={() => setIsAutoScrolling(false)}
                onHoverEnd={() => setIsAutoScrolling(true)}
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
                    __html: Autolinker.link(parseMessageWithEmotes(msg.message || '-', msg.emotes), {
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
            {!isAutoScrolling && (
              <motion.div
                onClick={() => setIsAutoScrolling(true)}
                initial={{ opacity: 0, x: -200 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 200 }}
                transition={{ duration: 0.1 }}
                style={{
                  position: 'absolute',
                  bottom: '5px',
                  left: '5px',
                  backgroundColor: 'black',
                  padding: '10px',
                  borderRadius: '50px',
                  border: '2px solid white',
                  cursor: 'pointer',
                  zIndex: 100,
                }}
              >
                Resume Scrolling
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        <motion.div initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }} style={{ width: '50%', display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1, height: '200px', borderBottom: '1px solid grey', padding: '10px', alignItems: 'center', justifyContent: 'center', display: 'flex' }}>
            {/* Display Zone */}
            <AnimatePresence mode="wait">
              {displayMessage && isDisplayMessageVisible && (
                <motion.div
                  key={displayMessage.id}
                  initial={{ y: 300, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -300, opacity: 0 }}
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
                      __html: Autolinker.link(parseMessageWithEmotes(displayMessage.message || '-', displayMessage.emotes), {
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
            </AnimatePresence>
          </div>
          <div style={{ position: 'absolute', height: '40px', right: '10px', display: 'flex', alignItems: 'center' }}>
            <AnimatePresence>
              <motion.div
                whileHover={{ scale: 1.1 }}
                initial={{ y: 300, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -300, opacity: 0 }}
                style={{
                  position: 'absolute',
                  right: '10px',
                  cursor: 'pointer',
                  backgroundColor: 'black',
                  padding: '10px',
                  borderRadius: '50%',
                  border: '2px solid white',
                }}
              >
                <a href={viewerUrl || ''} target="_blank" rel="noreferrer">
                  <FaExternalLinkAlt size={30} style={{ cursor: 'pointer' }} />
                </a>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.1 }}
                style={{
                  position: 'absolute',
                  right: '70px',
                  cursor: 'pointer',
                  backgroundColor: 'black',
                  padding: '10px',
                  borderRadius: '50%',
                  border: '2px solid white',
                }}
                initial={{ y: 300, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -300, opacity: 0 }}
                onClick={handleCopy}
              >
                {copied ? <FaCheck size={30} color="#37FF00" /> : <FaCopy size={30} />}
              </motion.div>
            </AnimatePresence>
          </div>

          <div style={{ flex: 1, overflowY: 'auto' }}>
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
                  whileHover={{ backgroundColor: '#464646' }}
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
                      __html: Autolinker.link(parseMessageWithEmotes(msg.message || '-', msg.emotes), {
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
            <div style={{
              position: 'absolute',
              bottom: '28px',
              right: '80px',
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'black',
              padding: '10px',
              borderRadius: '50px',
              border: '2px solid white'
            }}>
              <input
                type="text"
                value={inputChannel}
                onChange={(e) => setInputChannel(e.target.value)}
                placeholder="Enter Twitch channel"
                style={{ padding: '5px', borderRadius: '50px' }}
              />
            </div>
            <motion.div
              whileHover={{ scale: 1.1 }}
              style={{
                position: 'absolute',
                bottom: '30px',
                right: '20px',
                cursor: 'pointer',
                backgroundColor: 'black',
                padding: '10px',
                borderRadius: '50%',
                border: '2px solid white'
              }}
              onClick={toggleDisplayMessage}
            >
              {isDisplayMessageVisible ? <FaEye size={30} /> : <FaEyeSlash size={30} />}
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}


export default function Index() {
  const dbUrl = "https://api.jamsocket.live/db/IB4pCl9ESAW6jK3IwIw4/";
  return (
    <DriftDBProvider api={dbUrl}>
      <IndexPage />
    </DriftDBProvider>
  );
}