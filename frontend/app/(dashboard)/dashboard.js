import { View, TouchableOpacity } from "react-native";
import AppText from "../../components/AppText";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "expo-router";
export default function Dashboard() {
  const { logout } = useAuth();
  const router = useRouter();
  const handleLogout = () => {
    console.log("Logging out user...");
    logout();
    router.replace("/dashboard");
  };
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <AppText>Dashboard Screen</AppText>
      <TouchableOpacity onPress={() => handleLogout()}>
        <AppText>Logout</AppText>
      </TouchableOpacity>
    </View>
  );
}
