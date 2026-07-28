import { useState, useEffect } from "react";

export const useNotification = () => {

    const [notification, setNotification] = useState(null);

    const showNotification = (message, type = "success") => {

        setNotification({ message, type });

        setTimeout(() => {
            setNotification(null);
        }, 3000);

    };

    return { notification, showNotification };

};

export const Notification = ({ notification }) => {

    if (!notification) return null;

    const styles = {

        position: "fixed",
        bottom: "30px",
        right: "30px",
        padding: "16px 24px",
        borderRadius: "12px",
        color: "white",
        fontWeight: "600",
        boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
        zIndex: 1000,
        animation: "slideIn 0.3s ease-out",
        background:
            notification.type === "success"
                ? "#059669"
                : "#ef4444"

    };

    return (

        <div style={styles}>
            {notification.message}
        </div>

    );

};
