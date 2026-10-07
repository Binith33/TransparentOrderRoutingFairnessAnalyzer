import ReactMarkdown from 'react-markdown';
import { useState, useRef, useEffect } from "react";
import { FaPaperPlane, FaRobot, FaTimes, FaCommentDots } from "react-icons/fa";
import API from "../api";
import "./Chatbot.css";

function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { sender: "bot", text: "Hello! I am the TORFA AI Assistant. Ask me about fairness scores, NSE/BSE routing, latency, or forensic reports." }
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, isTyping]);

    const fallbackResponse = (text) => {
        if (text.includes("fairness") || text.includes("score")) {
            return "Fairness Score blends exchange distribution (60%) and latency efficiency (40%). A score above 80% is considered healthy.";
        }
        if (text.includes("latency") || text.includes("slow")) {
            return "Latency is the millisecond gap between routing time (broker dispatch) and execution time (exchange confirmation).";
        }
        if (text.includes("nse") || text.includes("bse")) {
            return "TORFA compares NSE and BSE order share against an ideal 50/50 split. Large deviations trigger fairness alerts on the Dashboard.";
        }
        if (text.includes("report") || text.includes("pdf")) {
            return "Open the Analytics page and click Generate Forensic Report to download a PDF audit summary.";
        }
        if (text.includes("hello") || text.includes("hi")) {
            return "Hello! Ask about fairness scores, latency, exchange bias, or report generation.";
        }
        return "Try asking about fairness scores, latency, NSE/BSE distribution, or forensic reports.";
    };

    const handleSend = async () => {
        if (!input.trim() || isTyping) return;

        const userMsg = input.trim();
        setMessages((prev) => [...prev, { sender: "user", text: userMsg }]);
        setInput("");
        setIsTyping(true);

        try {
            const res = await API.post("/chat", { message: userMsg });
            setMessages((prev) => [...prev, { sender: "bot", text: res.data.reply }]);
        } catch {
            setMessages((prev) => [
                ...prev,
                { sender: "bot", text: fallbackResponse(userMsg.toLowerCase()) }
            ]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") handleSend();
    };

    return (
        <div className="chatbot-wrapper">
            {isOpen && (
                <div className="chatbot-window">
                    <div className="chatbot-header">
                        <div className="chatbot-header-icon">
                            <FaRobot />
                        </div>
                        <div className="chatbot-header-info">
                            <h3>TORFA AI</h3>
                            <p>Online & Active</p>
                        </div>
                        <button className="chatbot-toggle" style={{ width: "30px", height: "30px", background: "transparent", boxShadow: "none", marginLeft: "auto" }} onClick={() => setIsOpen(false)}>
                            <FaTimes size={18} />
                        </button>
                    </div>

                    <div className="chatbot-messages">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`chat-bubble ${msg.sender === "bot" ? "chat-bot" : "chat-user"}`}>
                                {msg.sender === "bot" ? (
                                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                                ) : (
                                    msg.text
                                )}
                            </div>
                        ))}
                        {isTyping && (
                            <div className="chat-bubble chat-bot typing-dots">
                                <span></span><span></span><span></span>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="chatbot-input-area">
                        <input
                            type="text"
                            className="chatbot-input"
                            placeholder="Ask about fairness, latency..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                        />
                        <button className="chatbot-send" onClick={handleSend} disabled={isTyping}>
                            <FaPaperPlane size={14} />
                        </button>
                    </div>
                </div>
            )}

            {!isOpen && (
                <button className="chatbot-toggle" onClick={() => setIsOpen(true)}>
                    <FaCommentDots />
                </button>
            )}
        </div>
    );
}

export default Chatbot;
