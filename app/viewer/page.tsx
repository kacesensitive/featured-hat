"use client";
import { isDark, lightenColor, safeParse } from "@/lib/utils";
import Autolinker from "autolinker";
import { DriftDBProvider, useSharedState } from "driftdb-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { EmoteOptions } from "simple-tmi-emotes";

const options: EmoteOptions = {
    format: 'default',
    themeMode: 'light',
    scale: '1.0',
};

function ViewerPage() {
    const [message,] = useSharedState<any>('hat-message', {});
    const [isDisplayMessageVisible,] = useSharedState('hat-message-visible', false);
    const [isLongMessage, setIsLongMessage] = useState(false);

    useEffect(() => {
        const charLimitPerLine = 40; 
        const lineLimit = 4;
        const charLimit = charLimitPerLine * lineLimit;

        if (message.message && message.message.length > charLimit) {
            setIsLongMessage(true);
        } else {
            setIsLongMessage(false);
        }
    }, [message]);

    const longMessageStyle = isLongMessage ? { fontSize: '25px' } : { fontSize: '40px' };
    
    return (
        <div style={{
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'transparent',
        }}>
            <AnimatePresence mode="wait">
                {isDisplayMessageVisible && (
                    <motion.div
                        key={message.id}
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
                            maxWidth: '700px',
                            width: '100%',
                            cursor: 'pointer',
                            fontSize: longMessageStyle.fontSize,
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
                                fontSize: longMessageStyle.fontSize,
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
                                __html: Autolinker.link(safeParse(message.message || '-', [], options), {
                                    className: 'apple',
                                }),
                            }} style={{ fontSize: longMessageStyle.fontSize, }} />
                        </div>
                        <div style={{
                            bottom: '0',
                            left: '0',
                            width: '100%',
                            height: '4px',
                            backgroundColor: message.color || "white",
                        }}></div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default function Viewer() {
    const dbUrl = "https://api.jamsocket.live/db/IB4pCl9ESAW6jK3IwIw4/";
    return (
        <DriftDBProvider api={dbUrl}>
            <ViewerPage />
        </DriftDBProvider>
    );
}