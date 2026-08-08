import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Linking,
} from "react-native";
import {
  MapPin,
  Phone,
  Activity,
  Clock,
  Calendar,
  MessageCircle,
  Globe,
  ChevronRight,
  ShieldCheck,
  Building2,
} from "lucide-react-native";

export default function ConstantCard({
  item = {},
  openMap,
  openWeb,
  handleCall,
  openWhatsApp,
  onSelectSpecs,
  icon: TagIcon = Building2,
  themeColor = "#2563EB",
  specsLabel = "Equipment & Specs",
}) {
  // Normalize fields across entity schemas
  const name =
    item.name || item.ngoName || item.hospitalName || "Emergency Provider";
  const orgType = item.orgType || "Private Provider";
  const phone = item.phone || item.whatsapp || "No phone listed";
  const whatsapp = item.whatsapp;
  const address = item.address || "Address not specified";
  const timing = item.timing || "24/7 Service Available";
  const website = item.website;

  // Clean WhatsApp phone number for messaging link
  const getCleanNumber = (num) => (num ? num.replace(/\D/g, "") : "");
  const hasWhatsApp = Boolean(getCleanNumber(whatsapp));

  // Parse operating days into clean array
  const parseOperatingDays = (days) => {
    if (!days) return ["Mon - Sun"];
    if (Array.isArray(days)) return days.map((d) => String(d).trim());
    if (typeof days === "string") {
      return days
        .split(",")
        .map((d) => d.trim())
        .filter(Boolean);
    }
    return ["Mon - Sun"];
  };

  const dayList = parseOperatingDays(item.operatingDays);

  const handleMapPress = () => {
    if (openMap) {
      openMap(address, name);
    }
  };

  const handleWebPress = () => {
    if (!website) return;
    if (openWeb) {
      openWeb(website);
    } else {
      const url = website.startsWith("http") ? website : `https://${website}`;
      Linking.openURL(url).catch((err) => console.error("Web error", err));
    }
  };

  const handleCallPress = () => {
    if (handleCall) {
      handleCall(item);
    } else if (phone) {
      Linking.openURL(`tel:${phone.replace(/\D/g, "")}`);
    }
  };

  const handleWhatsAppPress = () => {
    if (openWhatsApp && whatsapp) {
      openWhatsApp(whatsapp);
    } else if (hasWhatsApp) {
      const clean = getCleanNumber(whatsapp);
      Linking.openURL(`https://wa.me/${clean}`);
    }
  };

  return (
    <View style={styles.card}>
      {/* Top Header Row */}
      <View style={styles.headerRow}>
        <View style={styles.titleContainer}>
          <View style={styles.nameRow}>
            <Text style={styles.cardTitle} numberOfLines={1}>
              {name}
            </Text>
            <ShieldCheck
              size={16}
              color={themeColor}
              style={styles.verifiedIcon}
            />
          </View>
          <View style={[styles.tag, { backgroundColor: `${themeColor}12` }]}>
            <TagIcon size={12} color={themeColor} />
            <Text style={[styles.tagText, { color: themeColor }]}>
              {orgType}
            </Text>
          </View>
        </View>

        {/* Map Shortcut Button */}
        <TouchableOpacity
          style={styles.mapBtn}
          onPress={handleMapPress}
          activeOpacity={0.7}
        >
          <MapPin size={15} color={themeColor} />
          <Text style={[styles.mapBtnText, { color: themeColor }]}>Map</Text>
        </TouchableOpacity>
      </View>

      {/* Schedule Section */}
      <View style={styles.scheduleSection}>
        {/* Horizontally Scrollable Days Strip */}
        <View style={styles.daysRowContainer}>
          <Calendar size={14} color="#0284C7" style={styles.scheduleIcon} />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.daysScrollContent}
          >
            {dayList.map((day, idx) => (
              <View key={idx} style={styles.dayChip}>
                <Text style={styles.dayChipText}>{day}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Full-Width Operating Hours Banner */}
        <View style={styles.timeBanner}>
          <Clock size={14} color="#15803D" />
          <Text style={styles.timeBannerText}>{timing}</Text>
        </View>
      </View>

      {/* Detail Rows */}
      <View style={styles.detailsContainer}>
        {/* Phone Row */}
        <View style={styles.detailRow}>
          <Phone size={14} color="#64748B" />
          <Text style={styles.detailText} numberOfLines={1}>
            {phone}
          </Text>
        </View>

        {/* Address Row */}
        <View style={styles.detailRow}>
          <MapPin size={14} color="#64748B" />
          <Text style={styles.detailText} numberOfLines={2}>
            {address}
          </Text>
        </View>
      </View>

      {/* Auxiliary Actions (Website & Modal Trigger) */}
      <View style={styles.auxRow}>
        {website ? (
          <TouchableOpacity
            onPress={handleWebPress}
            style={styles.auxChip}
            activeOpacity={0.7}
          >
            <Globe size={12} color="#0284C7" />
            <Text style={[styles.auxChipText, { color: "#0284C7" }]}>
              Official Web
            </Text>
          </TouchableOpacity>
        ) : null}

        {onSelectSpecs ? (
          <TouchableOpacity
            style={styles.auxChip}
            onPress={() => onSelectSpecs(item)}
            activeOpacity={0.7}
          >
            <Activity size={12} color={themeColor} />
            <Text style={[styles.auxChipText, { color: themeColor }]}>
              {specsLabel}
            </Text>
            <ChevronRight size={12} color={themeColor} />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Primary Action Buttons Bar */}
      <View style={styles.actionRow}>
        <TouchableOpacity
          style={[styles.actionBtn, styles.callBtn]}
          onPress={handleCallPress}
          activeOpacity={0.85}
        >
          <Phone size={15} color="#FFFFFF" />
          <Text style={styles.actionBtnText}>Call Now</Text>
        </TouchableOpacity>

        {hasWhatsApp ? (
          <TouchableOpacity
            style={[styles.actionBtn, styles.waBtn]}
            onPress={handleWhatsAppPress}
            activeOpacity={0.85}
          >
            <MessageCircle size={15} color="#FFFFFF" />
            <Text style={styles.actionBtnText}>WhatsApp</Text>
          </TouchableOpacity>
        ) : (
          <View style={[styles.actionBtn, styles.disabledBtn]}>
            <MessageCircle size={15} color="#94A3B8" />
            <Text style={styles.disabledBtnText}>No WhatsApp</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  titleContainer: {
    flex: 1,
    marginRight: 8,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
    flexShrink: 1,
  },
  verifiedIcon: {
    marginTop: 1,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: "flex-start",
    marginTop: 6,
    gap: 4,
  },
  tagText: {
    fontSize: 11,
    fontWeight: "600",
  },
  mapBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  mapBtnText: {
    fontSize: 12,
    fontWeight: "600",
  },
  scheduleSection: {
    gap: 8,
    marginBottom: 10,
  },
  daysRowContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F9FF",
    borderWidth: 1,
    borderColor: "#BAE6FD",
    borderRadius: 8,
    paddingLeft: 8,
    paddingRight: 4,
    paddingVertical: 5,
  },
  scheduleIcon: {
    marginRight: 6,
  },
  daysScrollContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingRight: 8,
  },
  dayChip: {
    backgroundColor: "#E0F2FE",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  dayChipText: {
    color: "#0369A1",
    fontSize: 11,
    fontWeight: "700",
  },
  timeBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0FDF4",
    borderWidth: 1,
    borderColor: "#BBF7D0",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
  },
  timeBannerText: {
    color: "#15803D",
    fontSize: 12,
    fontWeight: "600",
    flex: 1,
  },
  detailsContainer: {
    gap: 8,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  detailText: {
    color: "#475569",
    fontSize: 13,
    fontWeight: "500",
    flex: 1,
  },
  auxRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 8,
    marginVertical: 10,
  },
  auxChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    gap: 4,
  },
  auxChipText: {
    fontSize: 11,
    fontWeight: "600",
  },
  actionRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 2,
  },
  actionBtn: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  callBtn: {
    backgroundColor: "#DC2626",
  },
  waBtn: {
    backgroundColor: "#16A34A",
  },
  actionBtnText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 13,
  },
  disabledBtn: {
    backgroundColor: "#F1F5F9",
  },
  disabledBtnText: {
    color: "#94A3B8",
    fontWeight: "600",
    fontSize: 12,
  },
});
