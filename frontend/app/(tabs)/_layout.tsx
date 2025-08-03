import { View, Text } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const TabIcon = ({
  focused,
  icon,
  title,
  color,
  size,
}: {
  focused: boolean;
  icon: any;
  title: string;
  color: string;
  size: number;
}) => {
  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        paddingTop: 4,
        width: "100%"
      }}
      className="mb-0 h-full"
    >
      <Ionicons name={!focused ? `${icon}-outline` : icon} size={size} color={focused ? "#1672EC" : "#404454"} />
    </View>
  );
};

const _layout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarItemStyle: {
          // height: "100%",
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
          
        },
        tabBarStyle: {
          backgroundColor: "#ffffff",
          borderRadius: 50,
          borderWidth: .2,
          borderColor: "#7C84A3",
          marginHorizontal: 20,
          marginBottom: 24,
          height: 70,
          position: "absolute",
          overflow: "hidden",
          paddingTop: 12,
          shadowColor: "white"
        }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          title: "Home",
          tabBarIcon: ({ focused, color, size }: { focused: boolean; color: string; size: number }) => (
            <TabIcon
              focused={focused}
              icon="home"
              title="Home"
              color={color}
              size={24}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="chat"
        options={{
          headerShown: false,
          title: "Chat",
          tabBarIcon: ({ focused, color, size }: { focused: boolean; color: string; size: number }) => (
            <TabIcon
              focused={focused}
              icon="chatbubble"
              title="Chat"
              color={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          headerShown: false,
          title: "Notifications",
          tabBarIcon: ({ focused, color, size }: { focused: boolean; color: string; size: number }) => (
            <TabIcon
              focused={focused}
              icon="notifications"
              title="notifications"
              color={color}
              size={24}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          headerShown: false,
          title: "Profile",
          tabBarIcon: ({ focused, color, size }: { focused: boolean; color: string; size: number }) => (
            <TabIcon
              focused={focused}
              icon="person"
              title="Profile"
              color={color}
              size={24}
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default _layout;
