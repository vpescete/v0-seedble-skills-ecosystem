"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, CheckCircle, MessageSquare, Star, X } from "lucide-react"
import { getPeerReviews } from "@/lib/data-service"

interface Notification {
  id: string
  type: "review_assigned" | "review_completed" | "review_received"
  title: string
  message: string
  timestamp: string
  read: boolean
  actionUrl?: string
}

export function NotificationSystem() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const reviews = await getPeerReviews()

        // Generate notifications from review data
        const newNotifications: Notification[] = []

        // Pending reviews (assigned to you)
        reviews.pending.forEach((review) => {
          newNotifications.push({
            id: `pending-${review.id}`,
            type: "review_assigned",
            title: "New Peer Review Assigned",
            message: `You have been assigned to review ${review.reviewee?.full_name} for the ${review.project?.name} project`,
            timestamp: review.created_at,
            read: false,
          })
        })

        // Recently completed reviews you received
        reviews.received
          .filter((review) => review.status === "completed")
          .slice(0, 3)
          .forEach((review) => {
            newNotifications.push({
              id: `received-${review.id}`,
              type: "review_received",
              title: "Peer Review Received",
              message: `${review.reviewer?.full_name} has completed your peer review for ${review.project?.name}`,
              timestamp: review.completed_at || review.created_at,
              read: false,
            })
          })

        setNotifications(
          newNotifications.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
        )
        setUnreadCount(newNotifications.filter((n) => !n.read).length)
      } catch (error) {
        console.error("Error fetching notifications:", error)
      }
    }

    fetchNotifications()
  }, [])

  const markAsRead = (notificationId: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n)))
    setUnreadCount((prev) => Math.max(0, prev - 1))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    setUnreadCount(0)
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "review_assigned":
        return <MessageSquare className="w-4 h-4 text-blue-500" />
      case "review_completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "review_received":
        return <Star className="w-4 h-4 text-yellow-500" />
      default:
        return <Bell className="w-4 h-4 text-gray-500" />
    }
  }

  return (
    <div className="relative">
      <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)} className="relative">
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
          >
            {unreadCount}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <Card className="absolute right-0 top-full mt-2 w-80 max-h-96 overflow-y-auto z-50 shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Notifications</CardTitle>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                    Mark all read
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No notifications yet</p>
              </div>
            ) : (
              <div className="space-y-1">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 border-b hover:bg-gray-50 cursor-pointer ${!notification.read ? "bg-blue-50" : ""}`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm">{notification.title}</h4>
                        <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(notification.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                      {!notification.read && <div className="w-2 h-2 bg-blue-500 rounded-full mt-1"></div>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
