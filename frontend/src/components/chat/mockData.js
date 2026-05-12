export const chats = [
    {
      id: "1",
      name: "Avery Chen",
      initials: "AC",
      lastMessage: "Sounds good — let's sync at 3.",
      time: "2m",
      unread: 2,
      online: true
    },
    {
      id: "2",
      name: "Design Guild",
      initials: "DG",
      lastMessage: "Mira: pushed the new tokens 🎨",
      time: "14m",
      online: true
    },
    {
      id: "3",
      name: "Noah Patel",
      initials: "NP",
      lastMessage: "Sent the contract over.",
      time: "1h",
      unread: 1
    },
    {
      id: "4",
      name: "Sofia Romero",
      initials: "SR",
      lastMessage: "Thanks for the update!",
      time: "3h"
    },
    {
      id: "5",
      name: "Engineering",
      initials: "EN",
      lastMessage: "Build is green ✅",
      time: "Yesterday"
    },
    {
      id: "6",
      name: "Lena Hoffmann",
      initials: "LH",
      lastMessage: "Will confirm tomorrow.",
      time: "Yesterday"
    },
    {
      id: "7",
      name: "Kai Watanabe",
      initials: "KW",
      lastMessage: "Loved the new dashboard.",
      time: "Mon"
    }
  ];
  
  
  export const initialMessages = [
    {
      id: "m1",
      author: "them",
      text: "Morning! Did you get a chance to look at the latest mockups?",
      time: "9:14"
    },
    {
      id: "m2",
      author: "me",
      text: "Yes — the floating layout is really clean. Pushing tokens now.",
      time: "9:16",
      status: "read"
    },
    {
      id: "m3",
      author: "them",
      text: "Perfect. I think the silver palette gives it that premium feel we wanted.",
      time: "9:17"
    },
    {
      id: "m4",
      author: "them",
      file: {
        kind: "image",
        name: "hero-preview.png"
      },
      time: "9:18"
    },
    {
      id: "m5",
      author: "me",
      text: "Looks great. Let me review the spacing one more time.",
      time: "9:22",
      status: "read"
    },
    {
      id: "m6",
      author: "them",
      file: {
        kind: "pdf",
        name: "ChatHub-Spec-v3.pdf",
        size: "2.4 MB"
      },
      time: "9:25"
    },
    {
      id: "m7",
      author: "me",
      text: "Got it — will share feedback by EOD.",
      time: "9:30",
      status: "delivered"
    },
    {
      id: "m8",
      author: "me",
      scheduled: true,
      text: "Reminder: design review at 4:00 PM today.",
      time: "Scheduled · 3:55 PM",
      scheduledFor: "Today, 3:55 PM"
    }
  ];
  
  
  export const aiSuggestions = [
    "Sure",
    "Let me review",
    "Sounds good",
    "I will confirm",
    "Thanks for the update",
    "Can we sync later?",
    "On it"
  ];