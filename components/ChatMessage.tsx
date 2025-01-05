import { isDark, lightenColor, parseMessageWithEmotes } from "@/lib/utils"
import Autolinker from "autolinker"
import { motion } from "framer-motion"

interface ChatMessageProps {
    message: any;
    emojiSize: string;
    maxWidth: string;
}

export const ChatMessage = ({message, emojiSize, maxWidth}: ChatMessageProps) => {
    return (
        <motion.div
                  key={message.id}
                  initial={{ y: 300, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -300, opacity: 0 }}
                  style={{
                    display: "flex",
                    flexDirection: 'column',
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "10px",
                    backgroundColor: "black",
                    fontSize: emojiSize,
                    maxWidth: maxWidth,
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
                      color: message.color && isDark(message.color) ? lightenColor(message.color, 40) : message.color || "white",
                      fontSize: emojiSize,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>{message.user + ':'}</span>
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
                      __html: Autolinker.link(parseMessageWithEmotes(message.message || '-', message.emotes), {
                        className: 'apple',
                      }),
                    }} style={{ fontSize: emojiSize }} />
                  </div>
                  <div style={{
                    bottom: '0',
                    left: '0',
                    width: '100%',
                    height: '4px',
                    backgroundColor: message.color || "white",
                  }}></div>
                </motion.div>
    )
}
