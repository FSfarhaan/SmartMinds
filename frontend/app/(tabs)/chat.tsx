import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { Swipeable } from 'react-native-gesture-handler';

const USERS = [
  {
    id: "u1",
    name: "Alice",
    avatar: "https://randomuser.me/api/portraits/women/1.jpg",
  },
  {
    id: "u2",
    name: "Bob",
    avatar: "https://randomuser.me/api/portraits/men/2.jpg",
  },
  {
    id: "u3",
    name: "Charlie",
    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
  },
  {
    id: "u4",
    name: "Diana",
    avatar: "https://randomuser.me/api/portraits/women/4.jpg",
  },
];
const CURRENT_USER = USERS[0];

interface Message {
  id: string;
  user: (typeof USERS)[number];
  text: string;
  time: string;
  reactions: { [emoji: string]: string[] };
  replyTo: string | null;
}

const DUMMY_MESSAGES: Message[] = [
  {
    id: "m1",
    user: USERS[1],
    text: "Hey everyone!",
    time: "10:00",
    reactions: { "👍": ["u1", "u2"], "😂": ["u3"] },
    replyTo: null,
  },
  {
    id: "m2",
    user: USERS[0],
    text: "Hi Bob!",
    time: "10:01",
    reactions: {},
    replyTo: "m1",
  },
  {
    id: "m3",
    user: USERS[2],
    text: "What's up?",
    time: "10:02",
    reactions: {},
    replyTo: null,
  },
  {
    id: "m4",
    user: USERS[3],
    text: "Let's meet at 5?",
    time: "10:03",
    reactions: { "❤️": ["u1", "u4"] },
    replyTo: null,
  },
  {
    id: "m5",
    user: USERS[1],
    text: "Hey everyone!",
    time: "10:04",
    reactions: { "👍": ["u1", "u2"], "😂": ["u3"] },
    replyTo: null,
  },
  {
    id: "m6",
    user: USERS[0],
    text: "Hi Bob!",
    time: "10:05",
    reactions: {},
    replyTo: "m1",
  },
  {
    id: "m7",
    user: USERS[2],
    text: "What's up?",
    time: "10:06",
    reactions: {},
    replyTo: null,
  },
  {
    id: "m8",
    user: USERS[3],
    text: "Let's meet at 5?",
    time: "10:07",
    reactions: { "❤️": ["u1", "u4"] },
    replyTo: null,
  },
];

const REACTION_EMOJIS = ["👍", "❤️", "😂", "😮", "😢", "👎"];

const AnimatedEmojiRow = ({ visible, isMe, onClose, onReact }: { visible: boolean, isMe: boolean, onClose: () => void, onReact: (emoji: string) => void }) => {
  const emojiAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (visible) {
      Animated.timing(emojiAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      emojiAnim.setValue(0);
    }
  }, [visible]);
  if (!visible) return null;
  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: isMe ? undefined : 0,
        right: isMe ? 0 : undefined,
        bottom: '100%',
        opacity: emojiAnim,
        transform: [
          {
            translateY: emojiAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [20, 0],
            }),
          },
        ],
        zIndex: 10,
      }}
      className="flex-row bg-white rounded-xl shadow px-2 py-1 mb-1"
    >
      {REACTION_EMOJIS.map((emoji) => (
        <TouchableOpacity
          key={emoji}
          onPress={() => onReact(emoji)}
          className="mx-1"
        >
          <Text className="text-2xl">{emoji}</Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity onPress={onClose} className="ml-2">
        <Ionicons name="close" size={18} color="#888" />
      </TouchableOpacity>
    </Animated.View>
  );
};

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>(DUMMY_MESSAGES);
  const [input, setInput] = useState("");
  const [showReactionsFor, setShowReactionsFor] = useState<string | null>(null);
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const [highlightedMsgId, setHighlightedMsgId] = useState<string | null>(null);
  const flatListRef = useRef<FlatList<any>>(null);
  const swipeableRefs = useRef<{ [key: string]: Swipeable | null }>({});

  // Find message by id
  const getMessageById = (id: string) => messages.find((m) => m.id === id);
  // Find message index by id
  const getMessageIndexById = (id: string) => messages.findIndex((m) => m.id === id);

  // Scroll to and highlight a message
  const scrollToAndHighlight = (msgId: string) => {
    const idx = getMessageIndexById(msgId);
    if (idx !== -1 && flatListRef.current) {
      flatListRef.current.scrollToIndex({ index: idx, animated: true });
      setHighlightedMsgId(msgId);
      setTimeout(() => setHighlightedMsgId(null), 500);
    }
  };

  // Add a new message
  const sendMessage = () => {
    if (!input.trim()) return;
    const newMsg: Message = {
      id: "m" + (messages.length + 1),
      user: CURRENT_USER,
      text: input,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      reactions: {},
      replyTo: replyTo ? replyTo.id : null,
    };
    setMessages((prev) => [...prev, newMsg]);
    setInput("");
    setReplyTo(null);
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  };

  // Add or remove reaction
  const addReaction = (msgId: string, emoji: string) => {
    setMessages((prevMsgs) =>
      prevMsgs.map((msg) => {
        if (msg.id !== msgId) return msg;
        const users = msg.reactions[emoji] || [];
        const hasReacted = users.includes(CURRENT_USER.id);
        let newReactions: { [emoji: string]: string[] } = { ...msg.reactions };
        if (hasReacted) {
          newReactions[emoji] = users.filter((u: string) => u !== CURRENT_USER.id);
          if (newReactions[emoji].length === 0) delete newReactions[emoji];
        } else {
          newReactions[emoji] = [...users, CURRENT_USER.id];
        }
        return { ...msg, reactions: newReactions };
      })
    );
    setShowReactionsFor(null);
  };

  // Long press to show emoji row
  const handleLongPress = (msgId: string) => {
    setShowReactionsFor(msgId);
  };

  // Swipe to reply (simulate with a button for simplicity)
  const handleReply = (msg: Message) => {
    setReplyTo(msg);
  };

  // Render reply preview above input
  const renderReplyPreview = () =>
    replyTo && (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => scrollToAndHighlight(replyTo.id)}
        className="flex-row items-center bg-gray-200 rounded-lg px-3 py-2 mb-1 mr-2"
      >
        <Text className="font-bold mr-2 text-xs text-gray-700">
          {replyTo.user.id === CURRENT_USER.id ? 'You' : replyTo.user.name}
        </Text>
        <Text numberOfLines={1} className="text-xs text-gray-500 flex-1">{replyTo.text}</Text>
        <TouchableOpacity onPress={() => setReplyTo(null)}>
          <Ionicons name="close" size={16} color="#888" />
        </TouchableOpacity>
      </TouchableOpacity>
    );

  // Render each message
  const renderItem = ({ item }: { item: Message }) => {
    const isMe = item.user.id === CURRENT_USER.id;
    const repliedMsg = item.replyTo ? getMessageById(item.replyTo) : null;
    const isHighlighted = highlightedMsgId === item.id;
    return (
      <View className={`flex-row items-start mb-2 ${isMe ? 'justify-end' : 'justify-start'}`}> {/* items-start for avatar alignment */}
        {/* Avatar for others */}
        {!isMe && (
          <View className="w-8 mr-2">
            <Image source={{ uri: item.user.avatar }} className="w-8 h-8 rounded-full" style={{ position: 'relative', zIndex: 1 }} />
          </View>
        )}
        <View className={`relative max-w-[75%] ${isMe ? 'items-end' : 'items-start'} flex-1`}>
          {/* Name for others */}
          {!isMe && (
            <Text className="text-xs font-bold text-gray-700 mb-0.5 ml-1">{item.user.name}</Text>
          )}
          <Swipeable
            ref={ref => { swipeableRefs.current[item.id] = ref; }}
            renderLeftActions={() => (
              <View className="justify-center items-center px-3">
                <Ionicons name="return-up-back" size={20} color="#1672EC" />
              </View>
            )}
            onSwipeableLeftOpen={() => {
              handleReply(item);
              swipeableRefs.current[item.id]?.close();
            }}
            overshootLeft={false}
          >
            <TouchableOpacity
              onLongPress={() => handleLongPress(item.id)}
              delayLongPress={300}
              activeOpacity={0.8}
              className={`rounded-2xl px-4 py-2 ${isMe ? 'bg-blue-100' : 'bg-white'} shadow-sm ${isHighlighted ? 'bg-yellow-100' : ''}`}
              style={{ minWidth: 60 }}
            >
              {/* Reply preview in bubble */}
              {repliedMsg && (
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => scrollToAndHighlight(repliedMsg.id)}
                  className="bg-gray-100 rounded-md px-2 py-1 mb-1"
                >
                  <Text className="text-xs font-bold text-gray-600">{repliedMsg.user.id === CURRENT_USER.id ? 'You' : repliedMsg.user.name}</Text>
                  <Text className="text-xs text-gray-500" numberOfLines={1}>{repliedMsg.text}</Text>
                </TouchableOpacity>
              )}
              <Text className="text-base text-gray-900">{item.text}</Text>
              <View className="flex-row items-center mt-1">
                <Text className="text-[10px] text-gray-400">{item.time}</Text>
                {/* Reply button removed, swipe right to reply instead */}
              </View>
            </TouchableOpacity>
            {/* Animated emoji row overlay */}
            <AnimatedEmojiRow
              visible={showReactionsFor === item.id}
              isMe={isMe}
              onClose={() => setShowReactionsFor(null)}
              onReact={(emoji) => addReaction(item.id, emoji)}
            />
          </Swipeable>
          {/* Reactions */}
          {Object.keys(item.reactions).length > 0 && (
            <View className="flex-row flex-wrap mt-1">
              {Object.entries(item.reactions).map(([emoji, users]) => (
                <TouchableOpacity
                  key={emoji}
                  onPress={() => addReaction(item.id, emoji)}
                  className="flex-row items-center bg-gray-100 rounded-full px-2 py-0.5 mr-1 mt-1"
                >
                  <Text className="text-base mr-1">{emoji}</Text>
                  <Text className="text-xs text-gray-500">{users.length}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
        {/* No avatar for me */}
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background pb-28">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 12, paddingBottom: 80 }}
        />
        {/* Input Bar */}
        <View className="bg-white px-3 py-2 border-t border-gray-200">
          {renderReplyPreview()}
          <View className="flex-row items-end">
            <TextInput
              className="flex-1 min-h-[40px] max-h-[100px] bg-gray-100 rounded-2xl px-4 py-2 text-base mr-2"
              value={input}
              onChangeText={setInput}
              placeholder="Type a message..."
              multiline
              onFocus={() => setShowReactionsFor(null)}
              blurOnSubmit={false}
            />
            <TouchableOpacity
              onPress={sendMessage}
              className="bg-primary rounded-full p-3 justify-center items-center"
            >
              <Ionicons name="send" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Chat;


// import { View, Text } from 'react-native'
// import React from 'react'

// const chat = () => {
//   return (
//     <View>
//       <Text>chat</Text>
//     </View>
//   )
// }

// export default chat