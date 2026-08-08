import React, { useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import * as Clipboard from "expo-clipboard"; // If using bare React Native, use @react-native-clipboard/clipboard
import {
  ShieldCheck,
  Database,
  Share2,
  Lock,
  UserCheck,
  Search,
  CheckCircle2,
  FileText,
  Mail,
  MapPin,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
} from "lucide-react-native";

export default function PrivacyPolicyScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [copied, setCopied] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const scrollViewRef = useRef(null);
  const sectionYPositions = useRef({});

  const sections = [
    { id: "data-collection", title: "1. Data We Collect" },
    { id: "data-usage", title: "2. How We Use Data" },
    { id: "data-sharing", title: "3. Sharing Data" },
    { id: "data-security", title: "4. Data Security" },
    { id: "user-rights", title: "5. Your Rights" },
  ];

  const handleCopyEmail = async () => {
    await Clipboard.setStringAsync("info@blooddonation.pk");
    setCopied(true);
    Alert.alert("Copied!", "Email address copied to clipboard.");
    setTimeout(() => setCopied(false), 2000);
  };

  const matchesSearch = (text) => {
    if (!searchQuery.trim()) return true;
    return text.toLowerCase().includes(searchQuery.toLowerCase());
  };

  const scrollToSection = (id) => {
    const yPos = sectionYPositions.current[id];
    if (yPos !== undefined && scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: yPos - 10, animated: true });
    }
  };

  const handleLayout = (id, event) => {
    sectionYPositions.current[id] = event.nativeEvent.layout.y;
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        ref={scrollViewRef}
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* --- HEADER HERO CARD --- */}
        <View style={styles.heroCard}>
          <View style={styles.badge}>
            <ShieldCheck size={14} color="#800003" />
            <Text style={styles.badgeText}>Data Protection & Privacy</Text>
          </View>

          <Text style={styles.heroTitle}>Privacy Policy</Text>
          <Text style={styles.heroDescription}>
            Blood Donation recognizes that protecting privacy is essential to
            human dignity and safety. When you use our services—whether to
            donate blood or request urgent assistance—your privacy is guaranteed
            as our top priority.
          </Text>

          <View style={styles.metaRow}>
            <View style={styles.metaPill}>
              <Text style={styles.metaText}>Last Revised: Aug 2026</Text>
            </View>
            <View style={styles.metaPill}>
              <Text style={styles.metaText}>Version: 1.0</Text>
            </View>
          </View>

          {/* Watermark Icon */}
          <View style={styles.watermarkContainer}>
            <ShieldCheck size={180} color="#f1f5f9" />
          </View>
        </View>

        {/* --- SEARCH BAR --- */}
        <View style={styles.searchContainer}>
          <Search size={18} color="#94a3b8" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search policy (e.g., CNIC, location)..."
            placeholderTextColor="#94a3b8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* --- QUICK NAV BUTTONS --- */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.navScrollView}
          contentContainerStyle={styles.navContainer}
        >
          {sections.map((sec) => (
            <TouchableOpacity
              key={sec.id}
              style={styles.navPill}
              activeOpacity={0.7}
              onPress={() => scrollToSection(sec.id)}
            >
              <Text style={styles.navPillText}>{sec.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* --- CONTENT SECTIONS --- */}

        {/* SECTION 1 */}
        {matchesSearch(
          "data collect contact background device geolocation cnic phone location blood group gender",
        ) && (
          <View
            style={styles.sectionCard}
            onLayout={(e) => handleLayout("data-collection", e)}
          >
            <View style={styles.sectionHeader}>
              <View style={styles.iconBox}>
                <Database size={22} color="#800003" />
              </View>
              <Text style={styles.sectionTitle}>1. The Data We Collect</Text>
            </View>

            <View style={styles.gridGap}>
              <View style={styles.infoBox}>
                <View style={styles.boxTitleRow}>
                  <UserCheck size={18} color="#800003" />
                  <Text style={styles.boxTitle}>Contact & Profile Data</Text>
                </View>
                <Text style={styles.boxText}>
                  We collect your{" "}
                  <Text style={styles.boldText}>
                    Full Name, Phone Number, CNIC
                  </Text>{" "}
                  (optional, strictly for verification),{" "}
                  <Text style={styles.boldText}>Blood Group</Text>, and{" "}
                  <Text style={styles.boldText}>Gender</Text> to facilitate
                  emergency donor matches.
                </Text>
              </View>

              <View style={styles.infoBox}>
                <View style={styles.boxTitleRow}>
                  <MapPin size={18} color="#800003" />
                  <Text style={styles.boxTitle}>Device & Location Data</Text>
                </View>
                <Text style={styles.boxText}>
                  We collect IP addresses and location coordinates to render
                  nearby donors, blood banks, and hospital maps accurately.
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* SECTION 2 */}
        {matchesSearch(
          "use personal data verify identity emergency alert sms notifications fraud prevention connect donors",
        ) && (
          <View
            style={styles.sectionCard}
            onLayout={(e) => handleLayout("data-usage", e)}
          >
            <View style={styles.sectionHeader}>
              <View style={styles.iconBox}>
                <UserCheck size={22} color="#800003" />
              </View>
              <Text style={styles.sectionTitle}>2. How We Use Data</Text>
            </View>

            <View style={styles.listGap}>
              {[
                "To verify account identity and prevent fake listings.",
                "To dispatch emergency SMS and push notification alerts.",
                "To detect and mitigate fraud or fraudulent requests.",
                "To connect matching blood donors with patients in need.",
                "To improve network reliability via internal analytics.",
                "To strictly comply with regional legal requirements.",
              ].map((item, index) => (
                <View key={index} style={styles.listItem}>
                  <CheckCircle2
                    size={16}
                    color="#800003"
                    style={styles.checkIcon}
                  />
                  <Text style={styles.listItemText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* SECTION 3 */}
        {matchesSearch(
          "sharing personal data sell trade hospital emergency responders third party",
        ) && (
          <View
            style={styles.sectionCard}
            onLayout={(e) => handleLayout("data-sharing", e)}
          >
            <View style={styles.sectionHeader}>
              <View style={styles.iconBox}>
                <Share2 size={22} color="#800003" />
              </View>
              <Text style={styles.sectionTitle}>3. Sharing Personal Data</Text>
            </View>

            <Text style={styles.paragraphText}>
              Blood Donation strictly maintains a{" "}
              <Text style={styles.boldText}>
                zero-commercialization guarantee
              </Text>
              . We never sell, rent, trade, or monetize your private personal
              information.
            </Text>

            <View style={styles.quoteBox}>
              <ShieldCheck size={22} color="#800003" style={{ marginTop: 2 }} />
              <Text style={styles.quoteText}>
                "Your details are shared solely with verified blood requestors,
                partner hospitals, and emergency medical responders directly
                involved in active blood donation requests."
              </Text>
            </View>
          </View>
        )}

        {/* SECTION 4 */}
        {matchesSearch(
          "security ssl encryption firewalls database access control protection",
        ) && (
          <View
            style={styles.sectionCard}
            onLayout={(e) => handleLayout("data-security", e)}
          >
            <View style={styles.sectionHeader}>
              <View style={styles.iconBox}>
                <Lock size={22} color="#800003" />
              </View>
              <Text style={styles.sectionTitle}>
                4. How We Secure Your Data
              </Text>
            </View>

            <Text style={styles.paragraphText}>
              We employ enterprise-grade technical and organizational safeguards
              designed to prevent unauthorized access, disclosure, or
              alteration:
            </Text>

            <View style={styles.securityGrid}>
              <View style={styles.securityItem}>
                <Text style={styles.securityTitle}>SSL/TLS 1.3</Text>
                <Text style={styles.securitySub}>Transit Encryption</Text>
              </View>
              <View style={styles.securityItem}>
                <Text style={styles.securityTitle}>AES-256</Text>
                <Text style={styles.securitySub}>Storage Encryption</Text>
              </View>
              <View style={styles.securityItem}>
                <Text style={styles.securityTitle}>RBAC</Text>
                <Text style={styles.securitySub}>Access Control</Text>
              </View>
            </View>
          </View>
        )}

        {/* SECTION 5 */}
        {matchesSearch(
          "user rights control delete erase update export account",
        ) && (
          <View
            style={styles.sectionCard}
            onLayout={(e) => handleLayout("user-rights", e)}
          >
            <View style={styles.sectionHeader}>
              <View style={styles.iconBox}>
                <FileText size={22} color="#800003" />
              </View>
              <Text style={styles.sectionTitle}>5. Your Rights & Controls</Text>
            </View>

            <View style={styles.accordionList}>
              {[
                {
                  title: "Right to Access & Export",
                  desc: "You can request a complete copy of all personal data tied to your account at any time by contacting our DPO.",
                },
                {
                  title: "Right to Rectification",
                  desc: "You have full control to edit or update your contact numbers, availability, and profile information directly inside app settings.",
                },
                {
                  title: "Right to Erasure (Account Deletion)",
                  desc: "You can request full account deletion. Once submitted, your profile and donor logs will be permanently erased within 30 days.",
                },
              ].map((faq, idx) => (
                <View key={idx} style={styles.accordionContainer}>
                  <TouchableOpacity
                    style={styles.accordionHeader}
                    activeOpacity={0.8}
                    onPress={() => setOpenFaq(openFaq === idx ? null : idx)}
                  >
                    <Text style={styles.accordionTitle}>{faq.title}</Text>
                    {openFaq === idx ? (
                      <ChevronUp size={18} color="#1e293b" />
                    ) : (
                      <ChevronDown size={18} color="#1e293b" />
                    )}
                  </TouchableOpacity>
                  {openFaq === idx && (
                    <View style={styles.accordionBody}>
                      <Text style={styles.accordionText}>{faq.desc}</Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          </View>
        )}

        {/* --- CONTACT DARK BANNER --- */}
        <View style={styles.darkBanner}>
          <Text style={styles.darkBannerTitle}>Questions or Opt-Out?</Text>
          <Text style={styles.darkBannerText}>
            If you wish to opt-out of notifications, exercise data rights, or
            have queries regarding privacy, feel free to reach out to our Data
            Protection Officer.
          </Text>

          <View style={styles.contactCardGroup}>
            <View style={styles.contactCard}>
              <View>
                <View style={styles.contactHeaderRow}>
                  <Mail size={12} color="#f87171" />
                  <Text style={styles.contactCardLabel}>Email Us</Text>
                </View>
                <Text style={styles.contactCardValue}>
                  info@blooddonation.pk
                </Text>
              </View>

              <TouchableOpacity
                style={styles.copyButton}
                activeOpacity={0.7}
                onPress={handleCopyEmail}
              >
                {copied ? (
                  <Check size={16} color="#4ade80" />
                ) : (
                  <Copy size={16} color="#cbd5e1" />
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.contactCard}>
              <View>
                <View style={styles.contactHeaderRow}>
                  <MapPin size={12} color="#f87171" />
                  <Text style={styles.contactCardLabel}>DPO Address</Text>
                </View>
                <Text style={styles.contactCardValue}>
                  Renala Khurd, Punjab, Pakistan
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 40,
  },
  heroCard: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    borderTopWidth: 6,
    borderTopColor: "#800003",
    position: "relative",
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fef2f2",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    alignSelf: "flex-start",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#fee2e2",
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#800003",
    marginLeft: 6,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: "#0f172a",
    marginBottom: 8,
  },
  heroDescription: {
    fontSize: 14,
    color: "#475569",
    lineHeight: 21,
    marginBottom: 16,
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  metaPill: {
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  metaText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#64748b",
  },
  watermarkContainer: {
    position: "absolute",
    right: -30,
    bottom: -30,
    zIndex: -1,
    opacity: 0.5,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 14,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    marginBottom: 12,
    height: 46,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: "#0f172a",
  },
  navScrollView: {
    marginBottom: 16,
  },
  navContainer: {
    gap: 8,
  },
  navPill: {
    backgroundColor: "#e2e8f0",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  navPillText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#334155",
  },
  sectionCard: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  iconBox: {
    backgroundColor: "#fef2f2",
    padding: 8,
    borderRadius: 12,
    marginRight: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1e293b",
  },
  gridGap: {
    gap: 12,
  },
  infoBox: {
    backgroundColor: "#f8fafc",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  boxTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  boxTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#800003",
    marginLeft: 6,
  },
  boxText: {
    fontSize: 13,
    color: "#475569",
    lineHeight: 19,
  },
  boldText: {
    fontWeight: "700",
    color: "#0f172a",
  },
  listGap: {
    gap: 10,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#f8fafc",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  checkIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  listItemText: {
    flex: 1,
    fontSize: 13,
    color: "#334155",
    fontWeight: "500",
  },
  paragraphText: {
    fontSize: 13,
    color: "#475569",
    lineHeight: 20,
    marginBottom: 12,
  },
  quoteBox: {
    flexDirection: "row",
    backgroundColor: "#fef2f2",
    padding: 14,
    borderRadius: 14,
    borderLeftWidth: 4,
    borderLeftColor: "#800003",
    gap: 10,
  },
  quoteText: {
    flex: 1,
    fontSize: 12,
    fontStyle: "italic",
    color: "#800003",
    fontWeight: "600",
    lineHeight: 18,
  },
  securityGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  securityItem: {
    flex: 1,
    backgroundColor: "#f8fafc",
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    alignItems: "center",
  },
  securityTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 2,
  },
  securitySub: {
    fontSize: 10,
    color: "#64748b",
    textAlign: "center",
  },
  accordionList: {
    gap: 8,
  },
  accordionContainer: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    overflow: "hidden",
  },
  accordionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f8fafc",
    padding: 14,
  },
  accordionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1e293b",
    flex: 1,
    marginRight: 8,
  },
  accordionBody: {
    padding: 14,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },
  accordionText: {
    fontSize: 12,
    color: "#475569",
    lineHeight: 18,
  },
  darkBanner: {
    backgroundColor: "#0f172a",
    borderRadius: 24,
    padding: 20,
    marginTop: 8,
  },
  darkBannerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#ffffff",
    marginBottom: 6,
  },
  darkBannerText: {
    fontSize: 13,
    color: "#cbd5e1",
    lineHeight: 19,
    marginBottom: 16,
  },
  contactCardGroup: {
    gap: 10,
  },
  contactCard: {
    backgroundColor: "#1e293b",
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#334155",
  },
  contactHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 2,
  },
  contactCardLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: "#f87171",
    textTransform: "uppercase",
  },
  contactCardValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ffffff",
  },
  copyButton: {
    backgroundColor: "#334155",
    padding: 8,
    borderRadius: 8,
  },
});
