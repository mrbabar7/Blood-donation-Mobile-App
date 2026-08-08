import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import {
  Scale,
  AlertTriangle,
  UserX,
  HeartPulse,
  CheckCircle,
  FileText,
  ShieldAlert,
  Gavel,
} from "lucide-react-native";

const TermCard = ({ icon: Icon, title, description }) => {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.iconContainer}>
          <Icon size={22} color="#800003" />
        </View>
        <Text style={styles.cardTitle}>{title}</Text>
      </View>
      <Text style={styles.cardDescription}>{description}</Text>
    </View>
  );
};

export default function TermServicesScreen() {
  const highlightTerms = [
    {
      icon: CheckCircle,
      title: "User Eligibility",
      description:
        "Donors must be at least 18 years of age and satisfy medical fitness criteria defined by Pakistani health authorities.",
    },
    {
      icon: AlertTriangle,
      title: "Accuracy of Information",
      description:
        "All users are legally responsible for the authenticity of submitted data.",
    },
    {
      icon: HeartPulse,
      title: "Medical Disclaimer",
      description:
        "Blood Donation functions solely as a coordination platform. We do not perform medical procedures.",
    },
    {
      icon: UserX,
      title: "Prohibited Conduct",
      description:
        "Harassment, solicitation of payment, resale of donated blood, or misuse of private data is forbidden.",
    },
  ];

  const sections = [
    {
      id: "1",
      title: "1. Service Scope",
      content:
        "Blood Donation provides a digital bridge between blood donors and emergency recipients. We facilitate connection only and do not store, transport, or process physical blood supplies.",
    },
    {
      id: "2",
      title: "2. Limitation of Liability",
      content:
        "Blood Donation disclaims all liability for damages arising from usage. Users interact with third-party donors and recipients at their own risk.",
    },
    {
      id: "3",
      title: "3. Termination of Access",
      content:
        "Blood Donation may suspend or permanently delete accounts at its discretion for violation of policy, fraud, or inappropriate conduct without prior notice.",
    },
    {
      id: "4",
      title: "4. Modifications to Terms",
      content:
        "Terms may be updated at any time. Continued usage of the platform after updates implies explicit acceptance of the revised terms.",
    },
    {
      id: "5",
      title: "5. Governing Law",
      content:
        "These terms are governed and construed under the applicable laws of the Islamic Republic of Pakistan.",
    },
  ];

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* --- HEADER HERO CARD --- */}
        <View style={styles.heroCard}>
          <View style={styles.badge}>
            <Scale size={14} color="#800003" />
            <Text style={styles.badgeText}>LEGAL AGREEMENT</Text>
          </View>

          <Text style={styles.heroTitle}>Terms of Service</Text>
          <Text style={styles.heroDescription}>
            By accessing or using the Blood Donation platform, you agree to
            comply with and be bound by these Terms of Service. These terms
            define your rights, obligations, and limitations while using our
            emergency blood-donation facilitation system.
          </Text>

          {/* Background Watermark Icon */}
          <View style={styles.watermarkContainer}>
            <Scale size={180} color="#f1f5f9" />
          </View>
        </View>

        {/* --- HIGHLIGHT CARDS --- */}
        <View style={styles.cardsGrid}>
          {highlightTerms.map((term, index) => (
            <TermCard
              key={index}
              icon={term.icon}
              title={term.title}
              description={term.description}
            />
          ))}
        </View>

        {/* --- DETAILED CLAUSES CARD --- */}
        <View style={styles.clausesContainer}>
          <View style={styles.clausesHeader}>
            <FileText size={20} color="#800003" />
            <Text style={styles.clausesHeaderText}>Detailed Terms</Text>
          </View>

          {sections.map((section, idx) => (
            <View
              key={section.id}
              style={[
                styles.sectionItem,
                idx !== sections.length - 1 && styles.sectionBorder,
              ]}
            >
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <Text style={styles.sectionText}>{section.content}</Text>
            </View>
          ))}
        </View>

        {/* --- FOOTER NOTE --- */}
        <View style={styles.footerNote}>
          <ShieldAlert size={18} color="#64748b" style={{ marginTop: 2 }} />
          <Text style={styles.footerNoteText}>
            For questions regarding legal compliance or dispute resolution,
            please reach out to our legal compliance team at{" "}
            <Text style={styles.boldText}>info@blooddonation.pk</Text>.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#fbfbfb",
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
    marginBottom: 20,
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
    letterSpacing: 0.8,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: "#0f172a",
    marginBottom: 10,
  },
  heroDescription: {
    fontSize: 14,
    color: "#475569",
    lineHeight: 22,
  },
  watermarkContainer: {
    position: "absolute",
    right: -30,
    bottom: -30,
    zIndex: -1,
    opacity: 0.5,
  },
  cardsGrid: {
    gap: 12,
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  iconContainer: {
    backgroundColor: "#fef2f2",
    padding: 8,
    borderRadius: 12,
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1e293b",
    flex: 1,
  },
  cardDescription: {
    fontSize: 13,
    color: "#475569",
    lineHeight: 19,
  },
  clausesContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    marginBottom: 20,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
  },
  clausesHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  clausesHeaderText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0f172a",
  },
  sectionItem: {
    paddingVertical: 14,
  },
  sectionBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 6,
  },
  sectionText: {
    fontSize: 13,
    color: "#475569",
    lineHeight: 20,
  },
  footerNote: {
    flexDirection: "row",
    backgroundColor: "#f1f5f9",
    padding: 14,
    borderRadius: 16,
    gap: 10,
    alignItems: "flex-start",
  },
  footerNoteText: {
    flex: 1,
    fontSize: 12,
    color: "#64748b",
    lineHeight: 18,
  },
  boldText: {
    fontWeight: "700",
    color: "#334155",
  },
});
