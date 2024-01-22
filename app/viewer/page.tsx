"use client";
import { isDark, lightenColor, safeParse } from "@/lib/utils";
import Autolinker from "autolinker";
import { DriftDBProvider, useSharedState } from "driftdb-react";
import { motion } from "framer-motion";
import { EmoteOptions } from "simple-tmi-emotes";

const options: EmoteOptions = {
    format: 'default',
    themeMode: 'light',
    scale: '1.0',
  };

function ViewerPage() {
    const [message, setMessage] = useSharedState<any>('hat-message', {});
    const [isDisplayMessageVisible, setIsDisplayMessageVisible] = useSharedState('hat-message-visible', false);
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
            backgroundColor: 'black',
        }}>
            {isDisplayMessageVisible && (
                <motion.div
                    key={message.id}
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
                        fontSize: '40px',
                        maxWidth: '700px',
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
                            fontSize: '40px',
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
                        }} style={{ fontSize: '40px' }} />
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