import { Drawer } from "expo-router/drawer";
import SideBar from "./_Dashboard-Component/SideBar";
import {
  Home,
  ClipboardList,
  User,
  History,
  Settings,
  Send,
} from "lucide-react-native"; // Icons ke liye

export default function DashboardLayout() {
  return (
    <Drawer
      drawerContent={(props) => <SideBar {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: "#991b1b",
          width: 280,
        },
        drawerActiveBackgroundColor: "rgba(255, 255, 255, 0.2)",
        drawerActiveTintColor: "#ffffff",
        drawerInactiveTintColor: "#fca5a5",
        drawerLabelStyle: {
          fontSize: 16,
          fontWeight: "600",
          marginLeft: -10,
        },
      }}
    >
      <Drawer.Screen
        name="index"
        options={{
          drawerLabel: "Home",
          drawerIcon: ({ color }) => <Home color={color} size={22} />,
        }}
      />

      <Drawer.Screen
        name="seeker"
        options={{
          drawerLabel: "Seeker Request",
          drawerIcon: ({ color }) => <Send color={color} size={22} />,
        }}
      />

      <Drawer.Screen
        name="request"
        options={{
          drawerLabel: "Requests",
          drawerIcon: ({ color }) => <ClipboardList color={color} size={22} />,
        }}
      />

      <Drawer.Screen
        name="Profile"
        options={{
          drawerLabel: "My Profile",
          drawerIcon: ({ color }) => <User color={color} size={22} />,
        }}
      />

      <Drawer.Screen
        name="history"
        options={{
          drawerLabel: "History",
          drawerIcon: ({ color }) => <History color={color} size={22} />,
        }}
      />

      <Drawer.Screen
        name="settings"
        options={{
          drawerLabel: "Settings",
          drawerIcon: ({ color }) => <Settings color={color} size={22} />,
        }}
      />

      <Drawer.Screen
        name="_Dashboard-Component/Header"
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <Drawer.Screen
        name="_Dashboard-Component/Parent"
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <Drawer.Screen
        name="_Dashboard-Component/SideBar"
        options={{ drawerItemStyle: { display: "none" } }}
      />
    </Drawer>
  );
}
