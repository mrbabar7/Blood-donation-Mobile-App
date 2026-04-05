// import { Drawer } from "expo-router/drawer";
// import SideBar from "./_Dashboard-Component/SideBar";
// import {
//   Home,
//   ClipboardList,
//   User,
//   History,
//   Settings,
//   Send,
// } from "lucide-react-native";

// export default function DashboardLayout() {
//   return (
//     <Drawer
//       drawerContent={(props) => <SideBar {...props} />}
//       screenOptions={{
//         headerShown: false,
//         drawerStyle: {
//           backgroundColor: "#991b1b",
//           width: 280,
//         },
//         drawerActiveBackgroundColor: "rgba(255, 255, 255, 0.2)",
//         drawerActiveTintColor: "#ffffff",
//         drawerInactiveTintColor: "#fca5a5",
//         drawerLabelStyle: {
//           fontSize: 16,
//           fontWeight: "600",
//           marginLeft: -10,
//         },
//       }}
//     >
//       {/* 1. Home - Iska name 'index' hi rehne dein agar ye main file hai */}
//       <Drawer.Screen
//         name="index"
//         options={{
//           drawerLabel: "Home",
//           drawerIcon: ({ color }) => <Home color={color} size={22} />,
//         }}
//       />

//       {/* 2. Seeker - Check karein file ka naam 'seeker.tsx' hai ya nahi */}
//       <Drawer.Screen
//         name="Seeker"
//         options={{
//           drawerLabel: "Seeker Request",
//           drawerIcon: ({ color }) => <Send color={color} size={22} />,
//         }}
//       />

//       {/* 3. Request - Check karein file 'request.tsx' hai ya 'requests.tsx' */}
//       <Drawer.Screen
//         name="Request" 
//         options={{
//           drawerLabel: "Requests",
//           drawerIcon: ({ color }) => <ClipboardList color={color} size={22} />,
//         }}
//       />

//       {/* 4. Profile - Yahan 'Profile' (Capital P) tha, maine 'profile' kar diya hai */}
//       <Drawer.Screen
//         name="Profile" 
//         options={{
//           drawerLabel: "My Profile",
//           drawerIcon: ({ color }) => <User color={color} size={22} />,
//         }}
//       />

//       {/* 5. History */}
//       <Drawer.Screen
//         name="History"
//         options={{
//           drawerLabel: "History",
//           drawerIcon: ({ color }) => <History color={color} size={22} />,
//         }}
//       />

//       {/* 6. Settings */}
//       <Drawer.Screen
//         name="Setting"
//         options={{
//           drawerLabel: "Settings",
//           drawerIcon: ({ color }) => <Settings color={color} size={22} />,
//         }}
//       />

//       {/* Baqi components ko hide rakhein */}
//       <Drawer.Screen name="_Dashboard-Component/Header" options={{ drawerItemStyle: { display: "none" } }} />
//       <Drawer.Screen name="_Dashboard-Component/Parent" options={{ drawerItemStyle: { display: "none" } }} />
//       <Drawer.Screen name="_Dashboard-Component/SideBar" options={{ drawerItemStyle: { display: "none" } }} />
//     </Drawer>
//   );
// }

import { Tabs } from "expo-router"; // Ensure this import is exactly like this
import {
  Home,
  ClipboardList,
  User,
  History,
  Settings,
} from "lucide-react-native";
import { View } from "react-native";

export default function DashboardLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#ffffff",   // Active icon white
        tabBarInactiveTintColor: "#fca5a5", // Inactive icon light red (faded)
        
        // Tab Bar Styling (Red Theme)
        tabBarStyle: {
          backgroundColor: "#991b1b",       // bg-red-800
          borderTopWidth: 0,
          height: 70,
          paddingBottom: 12,
          paddingTop: 3,
          elevation: 10,                    // Shadow for Android
          shadowColor: '#002',              // Shadow for iOS
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        tabBarLabelStyle: {
          fontSize: 13,
          fontWeight: "700",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <Home color={color} size={24} />,
        }}
      />

      <Tabs.Screen
        name="Request"
        options={{
          title: "Requests",
          tabBarIcon: ({ color }) => <ClipboardList color={color} size={24} />,
        }}
      />

      <Tabs.Screen
        name="Profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <User color={color} size={24} />,
        }}
      />

      <Tabs.Screen
        name="History"
        options={{
          title: "History",
          tabBarIcon: ({ color }) => <History color={color} size={24} />,
        }}
      />

      <Tabs.Screen
        name="Setting"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => <Settings color={color} size={24} />,
        }}
      />

      {/* Hidden Screens (In menu mein nahi dikhengi) */}
      <Tabs.Screen name="Seeker" options={{ href: null }} />
      <Tabs.Screen name="_Dashboard-Component/Header" options={{ href: null }} />
      <Tabs.Screen name="_Dashboard-Component/Parent" options={{ href: null }} />
      <Tabs.Screen name="_Dashboard-Component/SideBar" options={{ href: null }} />
    </Tabs>
  );
}