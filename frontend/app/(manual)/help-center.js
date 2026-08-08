import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Alert,
} from "react-native";
import {
  Search,
  ArrowLeft,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  MessageSquare,
} from "lucide-react-native";

export default function HelpCenterScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(6);

  const faqs = [
    {
      question: "What are the basic requirements to donate blood?",
      answer:
        "You must be between 18-65 years old, weigh at least 50kg, and be in good general health. You should not have donated in the last 3 months.",
    },
    {
      question: "How do I verify if a donor is genuine?",
      answer:
        "PakBlood verifies phone numbers via OTP. However, always meet in public hospital settings for the donation process for maximum safety.",
    },
    {
      question: "Who can see my phone number?",
      answer:
        "Your contact details are only visible to seekers whose requests you have explicitly 'Accepted' in your dashboard.",
    },
    {
      question: "Who can donate blood?",
      answer:
        "Anyone aged between 18-65, weighing over 50kg, and in good general health can usually donate blood.",
    },
    {
      question: "How often can I donate blood?",
      answer:
        "Healthy individuals can safely donate whole blood every 3 to 4 months (90-120 days).",
    },
    {
      question: "Can I donate if I recently had a tattoo?",
      answer:
        "Usually, you must wait 6 months after getting a tattoo or piercing before you can donate blood for safety reasons.",
    },
    {
      question: "Does blood donation hurt?",
      answer:
        "You might feel a small pinch when the needle is inserted, but the process itself is painless and takes only about 10-15 minutes.",
    },
    {
      question: "What should I eat before donating?",
      answer:
        "Eat a healthy, low-fat meal and drink plenty of water. Avoid fatty foods like burgers or fries immediately before donation.",
    },
    {
      question: "How do I request blood in an emergency?",
      answer:
        "Go to the 'Search Blood' section, enter the required blood group and city. You will see a list of available donors you can contact immediately.",
    },
    {
      question: "What is an 'Emergency Alert'?",
      answer:
        "If you can't find a donor manually, you can post an emergency request which sends a push notification to all matching donors in your area.",
    },
    {
      question: "How do I update my availability?",
      answer:
        "Log into your dashboard and toggle your status to 'Unavailable' if you have recently donated or are unable to donate for any reason.",
    },
    {
      question: "Can hospitals register on PakBlood?",
      answer:
        "Yes, we have a dedicated portal for hospitals to manage their blood bank requirements and request bulk units.",
    },
    {
      question: "How can I contact support?",
      answer:
        "You can reach our helpline or use WhatsApp support directly through the app.",
    },
  ];

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleWhatsAppSupport = async () => {
    const phoneNumber = "923076840971";
    const message = encodeURIComponent(
      "Hello Blood Donation Support, I need urgent assistance regarding a blood request.",
    );
    const url = `https://wa.me/${phoneNumber}?text=${message}`;

    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert("Error", "WhatsApp is not installed on your device.");
      }
    } catch (error) {
      Alert.alert("Error", "Unable to open WhatsApp.");
    }
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* --- HERO SECTION --- */}
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>
            How can we help you{"\n"}
            <Text style={styles.heroTitleHighlight}>save a life?</Text>
          </Text>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Search size={18} color="#94a3b8" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search topics (e.g. 'privacy')..."
              placeholderTextColor="#94a3b8"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* --- FAQ SECTION --- */}
        <View style={styles.faqHeader}>
          <HelpCircle size={22} color="#800003" />
          <Text style={styles.faqHeaderTitle}>
            {searchQuery
              ? `Search Results (${filteredFaqs.length})`
              : "Frequently Asked Questions"}
          </Text>
        </View>

        <View style={styles.faqList}>
          {filteredFaqs.length > 0 ? (
            filteredFaqs
              .slice(0, visibleCount)
              .map((faq, index) => (
                <AccordionItem
                  key={index}
                  question={faq.question}
                  answer={faq.answer}
                />
              ))
          ) : (
            <View style={styles.emptyContainer}>
              <Search size={44} color="#cbd5e1" style={{ marginBottom: 12 }} />
              <Text style={styles.emptyText}>
                No results found for "{searchQuery}"
              </Text>
              <TouchableOpacity
                onPress={() => setSearchQuery("")}
                activeOpacity={0.7}
              >
                <Text style={styles.clearSearchText}>Clear Search</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* --- LOAD MORE BUTTON --- */}
        {filteredFaqs.length > visibleCount && (
          <TouchableOpacity
            style={styles.loadMoreButton}
            activeOpacity={0.8}
            onPress={() => setVisibleCount(filteredFaqs.length)}
          >
            <Text style={styles.loadMoreText}>
              View {filteredFaqs.length - visibleCount} More FAQs
            </Text>
          </TouchableOpacity>
        )}

        {/* --- EMERGENCY ASSISTANCE BANNER --- */}
        <View style={styles.emergencyCard}>
          <Text style={styles.emergencyTitle}>Emergency Assistance?</Text>
          <Text style={styles.emergencyDescription}>
            Connect with our coordination team via WhatsApp for urgent blood
            requirements or system help.
          </Text>

          <TouchableOpacity
            style={styles.whatsappButton}
            activeOpacity={0.8}
            onPress={handleWhatsAppSupport}
          >
            <MessageSquare size={16} color="#ffffff" style={styles.btnIcon} />
            <Text style={styles.whatsappBtnText}>WhatsApp Support</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const AccordionItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View style={styles.accordionCard}>
      <TouchableOpacity
        style={styles.accordionHeader}
        activeOpacity={0.8}
        onPress={() => setIsOpen(!isOpen)}
      >
        <Text style={styles.accordionQuestion}>{question}</Text>
        {isOpen ? (
          <ChevronUp size={18} color="#94a3b8" />
        ) : (
          <ChevronDown size={18} color="#94a3b8" />
        )}
      </TouchableOpacity>
      {isOpen && (
        <View style={styles.accordionBody}>
          <Text style={styles.accordionAnswer}>{answer}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },

  container: {
    flex: 1,
    paddingBottom: 20,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 40,
  },
  heroSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: "900",
    color: "#0f172a",
    textAlign: "center",
    lineHeight: 32,
    marginBottom: 16,
  },
  heroTitleHighlight: {
    color: "#800003",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 16,
    paddingHorizontal: 14,
    borderWidth: 2,
    borderColor: "#f1f5f9",
    width: "100%",
    height: 50,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    color: "#0f172a",
  },
  emergencyCard: {
    backgroundColor: "#0f172a",
    borderRadius: 20,
    padding: 20,
    marginVertical: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  emergencyTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#ffffff",
    marginBottom: 6,
  },
  emergencyDescription: {
    fontSize: 13,
    color: "#94a3b8",
    lineHeight: 19,
    marginBottom: 16,
  },
  whatsappButton: {
    backgroundColor: "#059669",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  btnIcon: {
    marginRight: 8,
  },
  whatsappBtnText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  faqHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 18,
  },
  faqHeaderTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0f172a",
  },
  faqList: {
    gap: 10,
  },
  accordionCard: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    overflow: "hidden",
  },
  accordionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#ffffff",
  },
  accordionQuestion: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1e293b",
    flex: 1,
    marginRight: 10,
  },
  accordionBody: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },
  accordionAnswer: {
    fontSize: 13,
    color: "#64748b",
    lineHeight: 19,
  },
  emptyContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 30,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#e2e8f0",
    borderStyle: "dashed",
    marginTop: 10,
  },
  emptyText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#64748b",
    textAlign: "center",
  },
  clearSearchText: {
    marginTop: 10,
    fontSize: 12,
    fontWeight: "900",
    color: "#800003",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  loadMoreButton: {
    backgroundColor: "#800003",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  loadMoreText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
});
