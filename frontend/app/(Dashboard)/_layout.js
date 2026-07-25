// app/(dashboard)/_layout.js
import React from "react";
import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { View, useWindowDimensions } from "react-native";
import {
  Home,
  ClipboardList,
  User,
  History,
  Settings,
} from "lucide-react-native";

// Import headers
import ScreenHeader from "../components/ScreenHeader";
import DashboardHeader from "../components/DashboardHeader";

export default function DashboardLayout() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const isTablet = width > 600;

  return (
    <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <Tabs
        screenOptions={{
          // 🌟 NATIVE HEADER ROUTING INTEGRATION 🌟
          headerShown: true,
          header: ({ options, route }) => {
            // "index" displays our custom DashboardHeader, others render ScreenHeader
            if (route.name === "index") {
              return <DashboardHeader />;
            }
            return <ScreenHeader title={options.title || route.name} />;
          },
          tabBarTransparent: false,
          tabBarHideOnKeyboard: true,
          tabBarActiveTintColor: "#dc2626", // Premium active red color
          tabBarInactiveTintColor: "#94a3b8", // Muted slate gray
          tabBarShowLabel: true,
          tabBarStyle: {
            backgroundColor: "#ffffff",
            borderTopWidth: 1,
            borderTopColor: "#F1F5F9",
            height: 64 + insets.bottom,
            paddingBottom: insets.bottom > 0 ? insets.bottom + 2 : 8,
            paddingTop: 10,
            position: "relative",
            bottom: 0,
            left: 0,
            right: 0,
            width: "100%",
            shadowColor: "#0F172A",
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: 0.02,
            shadowRadius: 8,
            elevation: 8,
          },
          tabBarItemStyle: {
            height: 54,
            justifyContent: "center",
            alignItems: "center",
            padding: 0,
          },
          tabBarLabelStyle: {
            fontSize: isTablet ? 12 : 11,
            fontWeight: "700",
            marginTop: 4,
          },
          tabBarIconStyle: {
            marginBottom: 0,
          },
        }}
      >
        {/* 1. Main Dashboard */}
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color, focused }) => (
              <View className={focused ? "bg-red-50 p-2 rounded-xl" : ""}>
                <Home color={color} size={focused ? 22 : 20} />
              </View>
            ),
          }}
        />

        {/* 2. Requests */}
        <Tabs.Screen
          name="request"
          options={{
            title: "Requests", // 🌟 Dynamically sent to your ScreenHeader
            tabBarIcon: ({ color, focused }) => (
              <View className={focused ? "bg-red-50 p-2 rounded-xl" : ""}>
                <ClipboardList color={color} size={focused ? 22 : 20} />
              </View>
            ),
          }}
        />

        {/* 3. History */}
        <Tabs.Screen
          name="history"
          options={{
            title: "History", // 🌟 Dynamically sent to your ScreenHeader
            tabBarIcon: ({ color, focused }) => (
              <View className={focused ? "bg-red-50 p-2 rounded-xl" : ""}>
                <History color={color} size={focused ? 22 : 20} />
              </View>
            ),
          }}
        />

        {/* 4. Profile */}
        <Tabs.Screen
          name="profile"
          options={{
            title: "My Profile", // 🌟 Dynamically sent to your ScreenHeader
            tabBarIcon: ({ color, focused }) => (
              <View className={focused ? "bg-red-50 p-2 rounded-xl" : ""}>
                <User color={color} size={focused ? 22 : 20} />
              </View>
            ),
          }}
        />

        {/* 5. Settings */}
        <Tabs.Screen
          name="setting"
          options={{
            title: "Settings", // 🌟 Dynamically sent to your ScreenHeader
            tabBarIcon: ({ color, focused }) => (
              <View className={focused ? "bg-red-50 p-2 rounded-xl" : ""}>
                <Settings color={color} size={focused ? 22 : 20} />
              </View>
            ),
          }}
        />
      </Tabs>
    </View>
  );
}
