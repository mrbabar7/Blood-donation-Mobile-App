import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Image,
  Animated,
} from "react-native";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { Ionicons } from "@expo/vector-icons";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const ONBOARDING_SLIDES = [
  {
    id: "1",
    image: require("../assets/first-blood.png"),
    title: "BE A VOLUNTARY DONOR",
    description:
      "Join our trusted network of life-savers across Pakistan. Your small contribution can provide someone a second lease on life.",
  },
  {
    id: "2",
    image: require("../assets/blood-second.png"),
    title: "FIND MATCHES INSTANTLY",
    description:
      "Filter real-time active donor directories instantly by province, city, and blood type during critical medical emergencies.",
  },
  {
    id: "3",
    image: require("../assets/third-blood.png"),
    title: "REQUEST BLOOD SECURELY",
    description:
      "Submit instant blood requests to close-proximity matches, track responses, and manage urgencies with simple localized tools.",
  },
];

export default function WelcomeScreen() {
  const router = useRouter();
  const flatListRef = useRef(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Fade-in animation replacement for MotiView
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [currentSlideIndex]);

  const completeOnboarding = async () => {
    try {
      await SecureStore.setItemAsync("hasSeenWelcome", "true");
    } catch (error) {
      console.log("Could not write onboarding status:", error);
    } finally {
      router.replace("/(dashboard)");
    }
  };

  const handleNextAction = () => {
    const nextIndex = currentSlideIndex + 1;
    if (nextIndex < ONBOARDING_SLIDES.length) {
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setCurrentSlideIndex(nextIndex);
    } else {
      completeOnboarding();
    }
  };

  const updateMomentumIndex = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const computedIndex = Math.round(contentOffsetX / SCREEN_WIDTH);
    setCurrentSlideIndex(computedIndex);
  };

  return (
    <View className="flex-1 bg-red-900">
      {/* Top Header */}
      <View className="h-20 flex-row justify-between items-center px-6 mt-10 z-10">
        <View className="flex-row items-center space-x-1.5">
          <Ionicons name="water" size={25} color="#ffffff" />
          <Text className="text-white text-lg font-black tracking-wider uppercase">
            Blood Donation
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={completeOnboarding}
          className="flex-row items-center bg-white/20 py-1.5 px-3.5 rounded-full border border-white/30"
        >
          <Text className="text-white text-xs font-bold mr-1">Skip</Text>
          <Ionicons name="chevron-forward" size={12} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* Onboarding Slider */}
      <FlatList
        ref={flatListRef}
        data={ONBOARDING_SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={updateMomentumIndex}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={{ width: SCREEN_WIDTH }}
            className="items-center justify-start px-6 pt-2 pb-4 flex-1"
          >
            {/* Image Container with Native Animation */}
            <Animated.View
              style={{
                height: SCREEN_HEIGHT * 0.37,
                opacity: fadeAnim,
              }}
              className="w-full justify-center items-center my-10"
            >
              <Image
                source={item.image}
                style={{ width: "100%", height: "100%" }}
                resizeMode="contain"
              />
            </Animated.View>

            {/* Title & Description */}
            <View className="items-center px-4 mb-2">
              <Text className="text-2xl font-black text-white text-center mb-2 tracking-wider uppercase">
                {item.title}
              </Text>
              <Text className="text-sm text-red-100 text-center leading-6 font-medium">
                {item.description}
              </Text>
            </View>
          </View>
        )}
      />

      {/* Footer Controls */}
      <View className="px-8 py-8 items-center flex-1">
        {/* Progress Dots */}
        <View className="flex-row justify-center items-center mb-8">
          {ONBOARDING_SLIDES.map((_, index) => (
            <View
              key={index}
              className={`h-2 rounded-full mx-1.5 transition-all duration-300 ${
                currentSlideIndex === index ? "w-7 bg-white" : "w-2 bg-white/30"
              }`}
            />
          ))}
        </View>

        {/* Action Button */}
        <TouchableOpacity
          className="flex-row bg-white w-full py-5 rounded-[30px] justify-center items-center shadow-lg shadow-black/20"
          activeOpacity={0.85}
          onPress={handleNextAction}
        >
          <Text className="text-red-700 text-sm font-black tracking-wider uppercase">
            {currentSlideIndex === ONBOARDING_SLIDES.length - 1
              ? "GET STARTED"
              : "CONTINUE"}
          </Text>
          <Ionicons
            name={
              currentSlideIndex === ONBOARDING_SLIDES.length - 1
                ? "checkmark-circle"
                : "arrow-forward"
            }
            size={18}
            color="#b91c1c"
            style={{ marginLeft: 6 }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
