import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import {
  Target,
  ShieldCheck,
  HeartPulse,
  Ambulance,
  Hospital,
  HandHelping,
  HeartHandshake,
  Siren,
} from "lucide-react-native";

const { width } = Dimensions.get("window");

export default function AboutScreen() {
  const router = useRouter();

  const services = [
    {
      id: 1,
      title: "Ambulance Call",
      icon: <Ambulance size={36} color="#B33030" />,
      path: "/(registration)/ambulances",
    },
    {
      id: 2,
      title: "Nearest Hospitals",
      icon: <Hospital size={36} color="#B33030" />,
      path: "/(registration)/hospitals",
    },
    {
      id: 3,
      title: "Blood Banks",
      icon: <HeartPulse size={36} color="#B33030" />,
      path: "/(registration)/blood-banks",
    },
    {
      id: 4,
      title: "NGO Helplines",
      icon: <HandHelping size={36} color="#B33030" />,
      path: "/(registration)/ngos",
    },
  ];

  const values = [
    {
      icon: <Target size={28} color="#E25555" />,
      title: "Our Mission",
      desc: "To bridge the gap between blood donors and recipients in Pakistan through real-time technology.",
    },
    {
      icon: <ShieldCheck size={28} color="#E25555" />,
      title: "Verified Donors",
      desc: "Every donor on our platform undergoes a basic verification process to ensure safety and reliability.",
    },
    {
      icon: <HeartPulse size={28} color="#E25555" />,
      title: "Immediate Impact",
      desc: "Our automated emergency alert system notifies donors within seconds of a critical blood request.",
    },
    {
      icon: <HeartHandshake size={28} color="#E25555" />,
      title: "Appreciation Heroes",
      desc: "After successful donations, we recognize and appreciate our heroes for their life-saving contributions.",
    },
  ];

  const members = [
    {
      img: "https://res.cloudinary.com/dq3njqvjt/image/upload/v1772140944/abubakar_tw5xug.png",
      name: "Abu Bakar Khan",
    },
    {
      img: "https://res.cloudinary.com/dzghpapmn/image/upload/v1773774546/Bilal-UNI6_mrbjdh.png",
      name: "Bilal Sikandar",
    },
    {
      img: "https://res.cloudinary.com/dq3njqvjt/image/upload/v1772141022/ahmad_irnrsl.jpg",
      name: "M Ahmad Fridi",
    },
  ];

  const handleBecomeDonor = () => {
    router.push("/(authentication)/signup");
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* --- HERO HEADER --- */}
      <LinearGradient
        colors={["#dc2626", "#ef4444", "#f97316"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.heroContainer}
      >
        <Text style={styles.heroTitle}>About Blood Donation</Text>
        <Text style={styles.heroSubtitle}>
          Blood Donation started with a simple idea: No life should be lost
          because of a lack of blood. We are a community-driven platform
          dedicated to making blood donation accessible to all.
        </Text>
      </LinearGradient>

      <View style={styles.bodyPadding}>
        {/* --- OUR STORY SECTION --- */}
        <View style={styles.sectionMargin}>
          <Text style={styles.heroTitleStory}>Our Inspiring Story</Text>
          <Text style={styles.paragraphText}>
            In Pakistan, finding specific blood groups during emergencies often
            results in a frantic search on social media.{" "}
            <Text style={styles.boldRedText}>Blood Donation</Text> centralizes
            this process. We partner with top-tier hospitals and thousands of
            volunteer donors to ensure help is just a click away.
          </Text>

          {/* Values Cards */}
          <View style={styles.valuesGrid}>
            {values.map((v, i) => (
              <View key={i} style={styles.valueCard}>
                <View style={styles.valueIcon}>{v.icon}</View>
                <Text style={styles.valueTitle}>{v.title}</Text>
                <Text style={styles.valueDesc}>{v.desc}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* --- IMAGE & BADGE CARD --- */}
        <View style={styles.imageCardContainer}>
          <Image
            source={{
              uri: "https://res.cloudinary.com/dq3njqvjt/image/upload/v1772141194/blood-donation-about_eabk2b.jpg",
            }}
            style={styles.aboutImage}
            resizeMode="cover"
          />
          <View style={styles.freeBadge}>
            <Text style={styles.freeBadgeTitle}>100% Free</Text>
            <Text style={styles.freeBadgeSubtext}>
              Our platform is and will always remain free for everyone.
            </Text>
          </View>
        </View>

        {/* --- EMERGENCY SERVICES --- */}
        <View style={styles.sectionMargin}>
          <Text style={styles.sectionTitleCenter}>Emergency Services</Text>
          <View style={styles.servicesGrid}>
            {services.map((service) => (
              <TouchableOpacity
                key={service.id}
                activeOpacity={0.8}
                onPress={() => router.push(service.path)}
                style={styles.serviceCard}
              >
                <View style={styles.serviceIconContainer}>{service.icon}</View>
                <Text style={styles.serviceTitle}>{service.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* --- TEAM SECTION --- */}
      <View style={styles.teamSection}>
        <Text style={styles.arabicHeading}>
          غُلَامِ مُصْطَفٰی خَاتَمُ النَّبِیِّیْن صَلَّی اللّٰہُ عَلَیۡہِ
          وَاٰلِہٖ وَاَصْحَابِہٖ وَبَارِکْ وَسَلِّمْ
        </Text>
        <Text style={styles.sectionTitleCenter}>
          The People Behind the Mission
        </Text>

        <View style={styles.membersContainer}>
          {members.map((member, index) => (
            <View key={index} style={styles.memberCard}>
              <View style={styles.avatarBorder}>
                <Image
                  source={{ uri: member.img }}
                  style={styles.avatarImage}
                  resizeMode="cover"
                />
              </View>
              <Text style={styles.memberName}>{member.name}</Text>
              <Text style={styles.memberRole}>Full Stack Developer</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  heroContainer: {
    marginTop: 20,
    backgroundColor: "#ffffff",
    marginHorizontal: 10,
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#f3f4f6",
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#ffffff",

    marginBottom: 8,
  },
  heroTitleStory: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1f2937",

    marginBottom: 8,
  },

  heroSubtitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#ffffff",
    lineHeight: 20,
    maxWidth: 320,
    opacity: 0.95,
  },

  bodyPadding: {
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  sectionMargin: {
    marginBottom: 32,
  },

  paragraphText: {
    fontSize: 14,
    color: "#4b5563",
    lineHeight: 22,
    marginBottom: 20,
  },
  boldRedText: {
    fontWeight: "700",
    color: "#dc2626",
  },
  valuesGrid: {
    gap: 12,
  },
  valueCard: {
    backgroundColor: "#f9fafb",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#f3f4f6",
  },
  valueIcon: {
    marginBottom: 8,
  },
  valueTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 4,
  },
  valueDesc: {
    fontSize: 12,
    color: "#6b7280",
    lineHeight: 18,
  },
  imageCardContainer: {
    position: "relative",
    marginBottom: 40,
    borderRadius: 24,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  aboutImage: {
    width: "100%",
    height: 240,
  },
  freeBadge: {
    position: "absolute",
    bottom: 12,
    right: 12,
    backgroundColor: "#ffffff",
    padding: 14,
    borderRadius: 16,
    maxWidth: 160,
    borderLeftWidth: 6,
    borderLeftColor: "#E25555",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  freeBadgeTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1f2937",
    marginBottom: 2,
  },
  freeBadgeSubtext: {
    fontSize: 10,
    color: "#6b7280",
    lineHeight: 14,
  },
  sectionTitleCenter: {
    fontSize: 22,
    fontWeight: "800",
    color: "#333333",
    textAlign: "center",
    marginBottom: 20,
  },
  servicesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  serviceCard: {
    width: (width - 52) / 2,
    backgroundColor: "#fecaca",
    borderRadius: 20,
    padding: 16,
    height: 130,
    alignItems: "center",
    justifyContent: "center",
  },
  serviceIconContainer: {
    marginBottom: 8,
  },
  serviceTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#374151",
    textAlign: "center",
  },

  teamSection: {
    backgroundColor: "#f9fafb",
    paddingVertical: 36,
    paddingHorizontal: 20,
  },
  arabicHeading: {
    fontSize: 16,
    fontWeight: "700",
    color: "#dc2626",
    textAlign: "center",
    marginBottom: 12,
    lineHeight: 28,
  },
  membersContainer: {
    gap: 20,
  },
  memberCard: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#f3f4f6",
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  avatarBorder: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#f3f4f6",
    overflow: "hidden",
    borderWidth: 3,
    borderColor: "#fee2e2",
    marginBottom: 12,
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  memberName: {
    fontSize: 17,
    fontWeight: "900",
    color: "#1f2937",
    marginBottom: 2,
  },
  memberRole: {
    fontSize: 10,
    fontWeight: "900",
    color: "#E25555",
    textTransform: "uppercase",
    letterSpacing: 1.5,
  },
});
