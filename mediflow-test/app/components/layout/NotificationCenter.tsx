"use client";

import { useEffect, useState } from "react";
import { getNotifications, markNotificationRead, type NotificationRow } from "@/lib/data/queries";

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<NotificationRow[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    getNotifications("org_meridian").then(setNotifications);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkRead = async (id: string) => {
    await markNotificationRead("org_meridian", id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <div style={{ position: "relative" }}>
      <button
        className="icon-btn"
        onClick={() => setIsOpen(!isOpen)}
        title="Notifications"
        style={{ position: "relative" }}
        aria-label="Toggle notifications"
      >
        🔔
        {unreadCount > 0 && (
          <span
            style={{
              position: "absolute",
              top: "-4px",
              right: "-4px",
              background: "var(--color-critical)",
              color: "#fff",
              borderRadius: "50%",
              width: "18px",
              height: "18px",
              fontSize: "11px",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          className="card shadow-lg"
          style={{
            position: "absolute",
            top: "44px",
            right: 0,
            width: "340px",
            zIndex: 100,
            padding: "var(--space-3)",
            maxHeight: "420px",
            overflowY: "auto",
          }}
        >
          <div className="row row-between mb-2">
            <span className="font-semibold text-sm">Notifications</span>
            <span className="text-muted text-xs">{unreadCount} unread</span>
          </div>

          {notifications.length === 0 ? (
            <p className="text-muted text-xs py-3 text-center">No notifications</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
              {notifications.map((n) => (
                <div
                  key={n.id}
                  style={{
                    padding: "var(--space-2)",
                    borderRadius: "var(--radius-sm)",
                    background: n.read ? "transparent" : "var(--color-bg)",
                    borderLeft: n.read ? "none" : "3px solid var(--color-primary)",
                  }}
                >
                  <div className="row row-between mb-1">
                    <a
                      href={n.deepLink}
                      className="font-medium text-xs text-primary"
                      onClick={() => handleMarkRead(n.id)}
                    >
                      {n.title}
                    </a>
                    {!n.read && (
                      <button
                        onClick={() => handleMarkRead(n.id)}
                        className="text-xs text-muted"
                        style={{ border: "none", background: "none", cursor: "pointer" }}
                      >
                        ✓
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-muted" style={{ margin: 0 }}>
                    {n.body}
                  </p>
                  <span className="text-muted" style={{ fontSize: "10px" }}>
                    {new Date(n.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
