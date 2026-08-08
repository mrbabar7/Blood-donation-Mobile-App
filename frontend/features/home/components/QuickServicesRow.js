import React from "react";
import { View, ScrollView, TouchableOpacity } from "react-native";
import {
  Building2,
  Building,
  HeartHandshake,
  Truck,
} from "lucide-react-native";
import AppText from "../../../components/AppText";
import { styles } from "../styles/seekerHomeStyles";

const QUICK_SERVICES = [
  {
    id: "hospitals",
    title: "Hospitals",
    icon: Building2,
    route: "/(registration)/hospitals",
    bgColor: "#dbeafe",
    iconColor: "#2563eb",
  },
  {
    id: "blood-banks",
    title: "Blood Banks",
    icon: Building,
    route: "/(registration)/blood-banks",
    bgColor: "#fee2e2",
    iconColor: "#dc2626",
  },
  {
    id: "ngos",
    title: "NGOs",
    icon: HeartHandshake,
    route: "/(registration)/ngos",
    bgColor: "#d1fae5",
    iconColor: "#059669",
  },
  {
    id: "ambulance",
    title: "Ambulance",
    icon: Truck,
    route: "/(registration)/ambulances",
    bgColor: "#fef3c7",
    iconColor: "#d97706",
  },
];

export default function QuickServicesRow({ onNavigate }) {
  return (
    <View style={styles.servicesCard}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.servicesScroll}
      >
        {QUICK_SERVICES.map((item) => {
          const IconComponent = item.icon;
          return (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.75}
              onPress={() => onNavigate(item.route)}
              style={styles.serviceItem}
            >
              <View style={[styles.iconBox, { backgroundColor: item.bgColor }]}>
                <IconComponent size={18} color={item.iconColor} />
              </View>
              <AppText variant="bold" style={styles.serviceTitle}>
                {item.title}
              </AppText>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}
