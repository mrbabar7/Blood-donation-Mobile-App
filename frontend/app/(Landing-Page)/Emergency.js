import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
  Dimensions,
  SafeAreaView,
  StatusBar,
} from "react-native";
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome6,
} from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const Emergency = () => {
  const makeCall = (number) => {
    Linking.openURL(`tel:${number}`);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <StatusBar barStyle="light-content" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View
          style={{
            backgroundColor: "#B33030",
            paddingTop: 40,
            paddingBottom: 80,
            paddingHorizontal: 24,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <View style={{ zIndex: 10 }}>
            <Text
              style={{
                color: "rgba(255,255,255,0.7)",
                fontWeight: "500",
                letterSpacing: 2,
                textTransform: "uppercase",
                fontSize: 12,
                marginBottom: 8,
              }}
            >
              Our Humanitarian Mission
            </Text>
            <Text
              style={{
                color: "white",
                fontWeight: "bold",
                fontSize: 36,
                lineHeight: 42,
              }}
            >
              Saving Lives{"\n"}Through Community
            </Text>
            <View
              style={{
                h: 4,
                width: 48,
                backgroundColor: "rgba(255,255,255,0.3)",
                marginTop: 16,
                borderRadius: 10,
                height: 4,
              }}
            />
          </View>

          <View
            style={{
              position: "absolute",
              top: -40,
              right: -40,
              width: 160,
              height: 160,
              backgroundColor: "rgba(255,255,255,0.1)",
              borderRadius: 80,
            }}
          />
          <View
            style={{
              position: "absolute",
              top: 80,
              right: -80,
              width: 240,
              height: 240,
              backgroundColor: "rgba(0,0,0,0.05)",
              borderRadius: 120,
            }}
          />

          <View
            style={{
              position: "absolute",
              bottom: -24,
              left: -24,
              opacity: 0.1,
            }}
          >
            <MaterialCommunityIcons
              name="alarm-light-outline"
              size={180}
              color="white"
            />
          </View>
        </View>

        <View style={{ paddingHorizontal: 20, marginTop: -30 }}>
          {/* New Search Services Section - 4 Buttons Grid */}
          <Text
            style={{
              color: "#94a3b8",
              fontWeight: "900",
              fontSize: 12,
              letterSpacing: 1.5,
              marginBottom: 15,
              marginLeft: 5,
            }}
          >
            SEARCH NEAREST SERVICES
          </Text>

          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-between",
              marginBottom: 20,
            }}
          >
            <TouchableOpacity
              style={{
                backgroundColor: "#fff",
                borderWidth: 1,
                borderColor: "#f1f5f9",
                width: "48%",
                padding: 20,
                borderRadius: 30,
                alignItems: "center",
                marginBottom: 15,
                shadowColor: "#000",
                shadowOpacity: 0.05,
                elevation: 2,
              }}
            >
              <View
                style={{
                  backgroundColor: "#fff7ed",
                  padding: 15,
                  borderRadius: 20,
                  marginBottom: 10,
                }}
              >
                <FontAwesome6 name="truck-medical" size={24} color="#f59e0b" />
              </View>
              <Text
                style={{ fontSize: 15, fontWeight: "900", color: "#1e293b" }}
              >
                Ambulance
              </Text>
              <Text
                style={{ fontSize: 10, color: "#64748b", fontWeight: "600" }}
              >
                Find Nearby
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                backgroundColor: "#fff",
                borderWidth: 1,
                borderColor: "#f1f5f9",
                width: "48%",
                padding: 20,
                borderRadius: 30,
                alignItems: "center",
                marginBottom: 15,
                shadowColor: "#000",
                shadowOpacity: 0.05,
                elevation: 2,
              }}
            >
              <View
                style={{
                  backgroundColor: "#fdf2f8",
                  padding: 15,
                  borderRadius: 20,
                  marginBottom: 10,
                }}
              >
                <FontAwesome6
                  name="hand-holding-heart"
                  size={24}
                  color="#db2777"
                />
              </View>
              <Text
                style={{ fontSize: 15, fontWeight: "900", color: "#1e293b" }}
              >
                Foundation
              </Text>
              <Text
                style={{ fontSize: 10, color: "#64748b", fontWeight: "600" }}
              >
                NGOs & Trusts
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                backgroundColor: "#fff",
                borderWidth: 1,
                borderColor: "#f1f5f9",
                width: "48%",
                padding: 20,
                borderRadius: 30,
                alignItems: "center",
                marginBottom: 15,
                shadowColor: "#000",
                shadowOpacity: 0.05,
                elevation: 2,
              }}
            >
              <View
                style={{
                  backgroundColor: "#eff6ff",
                  padding: 15,
                  borderRadius: 20,
                  marginBottom: 10,
                }}
              >
                <FontAwesome6 name="hospital" size={24} color="#3b82f6" />
              </View>
              <Text
                style={{ fontSize: 15, fontWeight: "900", color: "#1e293b" }}
              >
                Hospital
              </Text>
              <Text
                style={{ fontSize: 10, color: "#64748b", fontWeight: "600" }}
              >
                Emergency Care
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                backgroundColor: "#fff",
                borderWidth: 1,
                borderColor: "#f1f5f9",
                width: "48%",
                padding: 20,
                borderRadius: 30,
                alignItems: "center",
                marginBottom: 15,
                shadowColor: "#000",
                shadowOpacity: 0.05,
                elevation: 2,
              }}
            >
              <View
                style={{
                  backgroundColor: "#fee2e2",
                  padding: 15,
                  borderRadius: 20,
                  marginBottom: 10,
                }}
              >
                <FontAwesome6 name="droplet" size={24} color="#ef4444" />
              </View>
              <Text
                style={{ fontSize: 15, fontWeight: "900", color: "#1e293b" }}
              >
                Blood Bank
              </Text>
              <Text
                style={{ fontSize: 10, color: "#64748b", fontWeight: "600" }}
              >
                Check Inventory
              </Text>
            </TouchableOpacity>
          </View>

          {/* Quick Guidance Tip */}
          <View
            style={{
              backgroundColor: "#1e293b",
              padding: 25,
              borderRadius: 35,
              marginTop: 10,
              shadowColor: "#000",
              shadowOpacity: 0.2,
              elevation: 5,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <Ionicons name="bulb" size={20} color="#fbbf24" />
              <Text
                style={{
                  color: "#fff",
                  fontSize: 18,
                  fontWeight: "900",
                  marginLeft: 8,
                }}
              >
                Quick Guidance
              </Text>
            </View>
            <Text
              style={{
                color: "#94a3b8",
                fontSize: 13,
                fontWeight: "600",
                lineHeight: 20,
              }}
            >
              In any life-threatening situation, stay calm and immediately alert
              the relevant state authorities. Use BloodDonation to locate the
              nearest medical facilities, but always ensure professional rescue
              services are on their way to provide expert assistance and secure
              transport.{" "}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Emergency;
