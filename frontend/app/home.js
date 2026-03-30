import React, { useState } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Image,
  Modal,
  FlatList,
  SafeAreaView,
  Platform,
  StatusBar,
  TextInput,
} from "react-native";
import { MotiView } from "moti";
import { Ionicons, FontAwesome6 } from "@expo/vector-icons";
import AppText from "../components/AppText";
import { State, City } from "country-state-city";
import HomeBanner from "../assets/home.png";
import { Easing } from "react-native-reanimated";
import Header from "../components/Header";
const { width, height } = Dimensions.get("window");
const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const countryCode = "PK";

const MobileHero = () => {
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [bloodType, setBloodType] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const allProvinces = State.getStatesOfCountry(countryCode);
  const allCities = province
    ? City.getCitiesOfState(countryCode, province)
    : [];

  const filteredData = (
    modalType === "province" ? allProvinces : allCities
  ).filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleSearch = () => {
    if (!province || !district || !bloodType) return;
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  };

  const SelectorModal = () => (
    <Modal
      visible={!!modalType}
      animationType="fade"
      transparent={true}
      onRequestClose={() => {
        setModalType(null);
        setSearchQuery("");
      }}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.7)",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <MotiView
          from={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          style={{
            backgroundColor: "white",
            width: width * 0.9,
            height: height * 0.7,
            borderRadius: 35,
            padding: 20,
          }}
        >
          <View className="flex-row justify-between items-center mb-6">
            <AppText className="text-xl font-black color-slate-800">
              SELECT {modalType?.toUpperCase()}
            </AppText>
            <TouchableOpacity
              onPress={() => {
                setModalType(null);
                setSearchQuery("");
              }}
            >
              <Ionicons name="close-circle" size={32} color="#ef4444" />
            </TouchableOpacity>
          </View>

          <View className="bg-slate-100 rounded-2xl px-4 flex-row items-center mb-4 border border-slate-200">
            <Ionicons name="search" size={20} color="#94a3b8" />
            <TextInput
              placeholder={`Search ${modalType}...`}
              style={{
                flex: 1,
                height: 55,
                marginLeft: 10,
                fontWeight: "600",
                color: "#1e293b",
                outlineStyle: "none",
              }}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus={true}
              selectionColor="#ef4444"
              placeholderTextColor="#94a3b8"
            />
          </View>

          <FlatList
            data={filteredData}
            keyExtractor={(item, index) => index.toString()}
            keyboardShouldPersistTaps="handled"
            ListEmptyComponent={() => (
              <View className="py-20 items-center justify-center">
                <Ionicons name="search-outline" size={60} color="#cbd5e1" />
                <AppText className="text-slate-400 font-bold mt-4 text-center">
                  Sorry! No {modalType} found {"\n"} matching "{searchQuery}"
                </AppText>
              </View>
            )}
            renderItem={({ item }) => (
              <TouchableOpacity
                className="py-5 border-b border-slate-50 flex-row items-center justify-between"
                onPress={() => {
                  if (modalType === "province") {
                    setProvince(item.isoCode);
                    setDistrict("");
                  } else {
                    setDistrict(item.name);
                  }
                  setModalType(null);
                  setSearchQuery("");
                }}
              >
                <AppText className="text-slate-700 text-lg font-bold">
                  {item.name}
                </AppText>
                <Ionicons name="chevron-forward" size={16} color="#e2e8f0" />
              </TouchableOpacity>
            )}
          />
        </MotiView>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#fff",
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
      }}
    >
      <Header />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View
          style={{
            width: width,
            height: height * 0.28,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Image
            source={HomeBanner}
            style={{ width: "100%", height: "100%" }}
            resizeMode="contain"
          />
          <View
            style={{
              position: "absolute",
              top: 15,
              left: 0,
              right: 0,
              zIndex: 10,
            }}
          >
            <MotiView
              from={{ translateX: width }}
              animate={{ translateX: -width * 1.3 }}
              transition={{
                loop: true,
                duration: 18000,
                type: "timing",
                easing: Easing.linear,
              }}
              style={{ flexDirection: "row" }}
            >
              <AppText
                className="text-black font-black text-[19px]"
                style={{
                  textShadowOffset: { width: 3, height: 8 },
                  textShadowRadius: 4,
                }}
              >
                وَمَنْ أَحْيَاهَا فَكَأَنَّمَا أَحْيَا النَّاسَ جَمِيعًا (سورۃ
                المائدہ: 32) "اور جس نے کسی ایک انسان کی جان بچائی، گویا اس نے
                پوری انسانیت کو زندگی بخش دی"
              </AppText>
            </MotiView>
          </View>
          <View
            style={{
              backgroundColor: "rgba(153, 27, 27, 0.1)",
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          />
        </View>

        <MotiView
          from={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="px-5 -mt-12"
        >
          <View
            style={{
              backgroundColor: "#e5e7eb",
              padding: 30,
              shadowOffset: { width: 0, height: 15 },
              shadowOpacity: 0.15,
              shadowRadius: 30,
              elevation: 10,
              borderWeight: 1,
              borderColor: "#fef2f2",
            }}
          >
            <AppText
              style={{ color: "#ef4444" }}
              className="text-[20px] font-black text-center mb-8 uppercase tracking-tighter"
            >
              Find Nearby Blood Donors
            </AppText>
            <View className="gap-y-4">
              <TouchableOpacity
                onPress={() => setModalType("province")}
                className="bg-slate-50 rounded-3xl px-6 h-20 flex-row items-center justify-between border border-slate-100"
              >
                <View className="flex-row items-center">
                  <View className="bg-red-50 p-3 rounded-2xl">
                    <Ionicons name="map" size={22} color="#ef4444" />
                  </View>
                  <View className="ml-4">
                    <AppText className="text-[12px] text-slate-400 font-bold uppercase">
                      Province
                    </AppText>
                    <AppText
                      className={`text-xl font-black ${province ? "text-slate-800" : "text-slate-300"}`}
                    >
                      {province
                        ? State.getStateByCodeAndCountry(province, countryCode)
                            ?.name
                        : "Select Province"}
                    </AppText>
                  </View>
                </View>
                <Ionicons name="chevron-down" size={18} color="#cbd5e1" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => province && setModalType("city")}
                disabled={!province}
                className={`rounded-3xl px-6 h-20 flex-row items-center justify-between border ${!province ? "bg-slate-50 opacity-60" : "bg-slate-50 border-slate-100"}`}
              >
                <View className="flex-row items-center">
                  <View className="bg-red-50 p-3 rounded-2xl">
                    <Ionicons name="location" size={22} color="#ef4444" />
                  </View>
                  <View className="ml-4">
                    <AppText className="text-[12px] text-slate-400 font-bold uppercase">
                      City
                    </AppText>
                    <AppText
                      className={`text-xl font-black ${district ? "text-slate-800" : "text-slate-300"}`}
                    >
                      {district || "Select City"}
                    </AppText>
                  </View>
                </View>
                <Ionicons name="chevron-down" size={18} color="#cbd5e1" />
              </TouchableOpacity>

              <View className="mt-4">
                <AppText
                  style={{ color: "#ef4444" }}
                  className="text-red-500 font-bold text-[14px] uppercase ml-2 mb-4"
                >
                  Blood Group
                </AppText>
                <View className="flex-row flex-wrap justify-between">
                  {bloodTypes.map((type) => (
                    <TouchableOpacity
                      key={type}
                      onPress={() => setBloodType(type)}
                      style={{
                        width: "23%",
                        aspectRatio: 1,
                        marginBottom: 10,
                        borderRadius: 22,
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor:
                          bloodType === type ? "#ef4444" : "#fff",
                        borderWidth: 2,
                        borderColor: bloodType === type ? "#ef4444" : "#f1f5f9",
                      }}
                    >
                      <AppText
                        className={`font-black text-xl ${bloodType === type ? "text-white" : "text-slate-600"}`}
                      >
                        {type}
                      </AppText>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            <View className="mt-8 gap-y-4">
              <TouchableOpacity
                onPress={handleSearch}
                disabled={!bloodType || !province || !district}
                style={{
                  height: 65,
                  borderRadius: 25,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor:
                    !bloodType || !province || !district
                      ? "#fca5a5"
                      : "#ef4444",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 5 },
                  shadowOpacity: 0.2,
                  shadowRadius: 10,
                  elevation: 5,
                }}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Ionicons name="search" size={24} color="#fff" />
                    <AppText
                      style={{
                        color: "#fff",
                        fontWeight: "900",
                        fontSize: 16,
                        marginLeft: 8,
                      }}
                    >
                      Find Donors
                    </AppText>
                  </>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  height: 65,
                  borderRadius: 25,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#0f172a",
                }}
              >
                <FontAwesome6 name="droplet" size={20} color="white" />
                <AppText className="text-white font-black text-lg ml-3 uppercase">
                  Become a Donor
                </AppText>
              </TouchableOpacity>
            </View>
          </View>
        </MotiView>

        <SelectorModal />
      </ScrollView>
    </SafeAreaView>
  );
};

export default MobileHero;
