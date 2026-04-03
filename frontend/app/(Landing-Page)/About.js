import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
} from "react-native";
import {
  Target,
  ShieldCheck,
  HeartPulse,
  Ambulance,
  Hospital,
  HandHelping,
  HeartHandshake,
  Siren,
  ChevronRight,
  Search,
  UserPlus,
  Droplets,
} from "lucide-react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

const { width } = Dimensions.get("window");

const About = ({ navigation }) => {
  const services = [
    {
      id: 1,
      title: "Ambulance",
      icon: Ambulance,
      color: "#FEE2E2",
      iconColor: "#EF4444",
    },
    {
      id: 2,
      title: "Hospitals",
      icon: Hospital,
      color: "#E0F2FE",
      iconColor: "#0EA5E9",
    },
    {
      id: 3,
      title: "Blood Banks",
      icon: HeartPulse,
      color: "#FFEDD5",
      iconColor: "#F97316",
    },
    {
      id: 4,
      title: "Helplines",
      icon: HandHelping,
      color: "#F0FDF4",
      iconColor: "#22C55E",
    },
  ];

  const values = [
    {
      id: 1,
      icon: Target,
      title: "Our Mission",
      desc: "To bridge the gap between blood donors and recipients in Pakistan through real-time technology.",
    },
    {
      id: 2,
      icon: ShieldCheck,
      title: "Verified Donors",
      desc: "Every donor on our platform undergoes a basic verification process to ensure safety and reliability.",
    },
    {
      id: 3,
      icon: HeartPulse,
      title: "Immediate Impact",
      desc: "Our automated emergency alert system notifies donors within seconds of a critical blood request.",
    },
    {
      id: 4,
      icon: HeartHandshake,
      title: "Appreciation Heroes",
      desc: "After successful donations, we recognize and appreciate our heroes for their life-saving contributions.",
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="bg-[#B33030] pt-16 pb-20 px-6 shadow-2xl relative overflow-hidden">
          <Animated.View entering={FadeInDown.duration(800)} className="z-10">
            <Text className="text-white/70 font-medium tracking-[2px] uppercase text-xs mb-2">
              Our Humanitarian Mission
            </Text>
            <Text className="text-white font-bold text-4xl leading-tight">
              Saving Lives{"\n"}Through Community
            </Text>
            <View className="h-1 w-12 bg-white/30 mt-4 rounded-full" />
          </Animated.View>

          <View className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full" />
          <View className="absolute top-20 -right-20 w-60 h-60 bg-black/5 rounded-full" />

          <View className="absolute -bottom-6  -left-6 opacity-10">
            <Siren size={180} color="white" strokeWidth={1.5} />
          </View>
        </View>

        <View className="-mt-10 px-6">
          <View className="bg-white p-6 rounded-[30px] shadow-xl border border-slate-100">
            <Text className="text-slate-800 text-lg font-bold mb-3">
              Our Impact
            </Text>
            <Text className="text-slate-500 leading-6 text-sm">
              We've built a bridge between{" "}
              <Text className="text-red-600 font-semibold">
                Verified Donors
              </Text>{" "}
              and those in critical need across Pakistan. Simple, fast, and 100%
              transparent.
            </Text>

            <View className="flex-row justify-between mt-6 pt-6 border-t border-slate-50">
              <View className="items-center">
                <Text className="text-red-600 font-bold text-xl">10k+</Text>
                <Text className="text-slate-400 text-[10px] uppercase">
                  Donors
                </Text>
              </View>
              <View className="items-center border-x border-slate-100 px-8">
                <Text className="text-red-600 font-bold text-xl">24/7</Text>
                <Text className="text-slate-400 text-[10px] uppercase">
                  Support
                </Text>
              </View>
              <View className="items-center">
                <Text className="text-red-600 font-bold text-xl">Free</Text>
                <Text className="text-slate-400 text-[10px] uppercase">
                  Cost
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View className="mt-12 px-6">
          <View className="mb-8">
            <Text className="text-3xl font-bold text-slate-800 mb-4">
              Our Story
            </Text>
            <Text className="text-slate-500 leading-6 text-sm">
              In Pakistan, finding specific blood groups during emergencies
              often results in a frantic search on social media.{" "}
              <Text className="text-red-600 font-bold">Blood Donation</Text>{" "}
              centralizes this process. We partner with thousands of volunteer
              donors to ensure help is just a click away.
            </Text>
          </View>

          <View className="flex-row flex-wrap justify-between">
            {values.map((v, i) => (
              <View
                key={v.id}
                style={{ width: width * 0.43 }}
                className="p-5 bg-white rounded-3xl mb-4 border border-slate-100 shadow-sm"
              >
                <View className="mb-3">
                  <v.icon size={28} color="#E25555" />
                </View>
                <Text className="font-bold text-slate-800 mb-1 text-[14px]">
                  {v.title}
                </Text>
                <Text className="text-[11px] text-slate-500 leading-4">
                  {v.desc}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View className="mt-6 px-6">
          <View className="flex-row justify-between items-end mb-6">
            <View>
              <Text className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                Quick Help
              </Text>
              <Text className="text-slate-900 text-2xl font-black">
                Emergency Hub
              </Text>
            </View>
          </View>

          <View className="flex-row flex-wrap justify-between">
            {services.map((item, i) => (
              <TouchableOpacity
                key={i}
                activeOpacity={0.8}
                style={{ width: width * 0.42, backgroundColor: item.color }}
                className="p-6 rounded-[24px] mb-4 h-36 justify-between shadow-sm"
              >
                <View className="bg-white/60 self-start p-2 rounded-xl">
                  <item.icon size={24} color={item.iconColor} />
                </View>
                <View className="flex-row items-center justify-between">
                  <Text className="font-bold text-slate-800 text-sm">
                    {item.title}
                  </Text>
                  <ChevronRight size={16} color="#475569" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View className="px-6 my-4">
          <View className="bg-slate-900 rounded-[35px] p-8 relative overflow-hidden">
            <View className="z-10">
              <Text className="text-white text-2xl font-bold mb-2">
                Be the Reason{"\n"}Someone Smiles Today
              </Text>
              <Text className="text-slate-400 text-xs mb-6 max-w-[200px]">
                Registering as a donor takes less than 2 minutes.
              </Text>

              <TouchableOpacity className="bg-red-600 py-4 px-8 rounded-2xl self-start">
                <Text className="text-white font-bold text-center">
                  Become a Hero
                </Text>
              </TouchableOpacity>
            </View>

            <View className="absolute -right-4 bottom-0 opacity-40">
              <HeartHandshake size={130} color="white" strokeWidth={0.5} />
            </View>
          </View>
        </View>

        <View className="py-8 items-center border-t border-gray-100 mx-6">
          <Text className="text-gray-400 text-xs font-bold uppercase tracking-widest">
            Blood Donation © 2026
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default About;
