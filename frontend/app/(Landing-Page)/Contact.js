import React, { useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Platform,
  ActivityIndicator,
} from "react-native";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Siren,
  ChevronDown,
} from "lucide-react-native";
import { WebView } from "react-native-webview";
import Animated, { FadeInDown, FadeOutUp } from "react-native-reanimated";

const { width } = Dimensions.get("window");

const ContactUs = () => {
  const scrollRef = useRef(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "General Inquiry",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const subjects = [
    "General Inquiry",
    "Blood Request",
    "Donation Help",
    "Volunteer Support",
  ];

  const contactData = [
    {
      id: 1,
      icon: <Phone size={24} color="#E25555" />,
      label: "Call Us",
      value: "+92 340 3745700",
    },
    {
      id: 2,
      icon: <Mail size={24} color="#E25555" />,
      label: "Email Us",
      value: "info@blooddonation.pk",
    },
    {
      id: 3,
      icon: <MapPin size={24} color="#E25555" />,
      label: "Visit Us",
      value: "Renala Khurd, Okara, Pakistan",
    },
  ];

  const validate = () => {
    let newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email address";
    if (!formData.message) newErrors.message = "Message cannot be empty";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      setLoading(true);
      setIsSubmitted(false);
      setTimeout(() => {
        setLoading(false);
        setIsSubmitted(true);
        setFormData({
          name: "",
          email: "",
          subject: "General Inquiry",
          message: "",
        });

        scrollRef.current?.scrollTo({ y: 0, animated: true });

        setTimeout(() => setIsSubmitted(false), 4000);
      }, 1500);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-200">
      <StatusBar barStyle="light-content" />
      <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false}>
        <View className="bg-[#B33030] pt-16 pb-20 px-6 shadow-2xl relative overflow-hidden">
          {isSubmitted && (
            <Animated.View
              entering={FadeInDown}
              exiting={FadeOutUp}
              style={{
                position: "absolute",
                top: Platform.OS === "ios" ? 60 : 30,
                left: 20,
                right: 20,
                zIndex: 999,
                elevation: 15,
                backgroundColor: "#22C55E",
                padding: 16,
                borderRadius: 24,
                borderWidth: 2,
                borderColor: "#DCFCE7",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.3,
                shadowRadius: 20,
              }}
            >
              <View className="bg-white p-1 rounded-full mr-3 ">
                <Text className="text-green-600 font-bold text-[10px]">✓</Text>
              </View>
              <Text className="text-white font-extrabold text-center text-[15px] tracking-wide">
                Message sent to admin successfully!
              </Text>
            </Animated.View>
          )}

          <Animated.View entering={FadeInDown.duration(800)} className="z-10">
            <Text className="text-white/70 font-medium tracking-[2px] uppercase text-xs mb-2">
              Have Questions?
            </Text>
            <Text className="text-white font-bold text-4xl leading-tight">
              Get in Touch{"\n"}We're Here to Help
            </Text>
            <View className="h-1 w-12 bg-white/30 mt-5 rounded-full" />
          </Animated.View>
          <View className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full" />
          <View className="absolute top-20 -right-20 w-60 h-60 bg-black/5 rounded-full" />
          <View className="absolute -bottom-6 -left-6 opacity-10">
            <Siren size={180} color="white" strokeWidth={1.5} />
          </View>
        </View>

        <View className="px-6 mt-12">
          <View className="mb-10 px-2">
            <Text className="text-2xl font-bold text-gray-800 mb-8 text-center">
              Contact Information
            </Text>
            <div className="space-y-8">
              {contactData.map((item) => (
                <View key={item.id} className="flex-row items-start gap-5 mt-6">
                  <View className="bg-red-50 p-4 rounded-2xl">{item.icon}</View>
                  <View>
                    <Text className="text-xs text-gray-500 font-bold uppercase tracking-widest">
                      {item.label}
                    </Text>
                    <Text className="text-lg font-bold text-gray-800">
                      {item.value}
                    </Text>
                  </View>
                </View>
              ))}
            </div>
          </View>

          <View
            className="mb-12 overflow-hidden rounded-[2.5rem] shadow-xl border border-white bg-white"
            style={{ height: 260 }}
          >
            {Platform.OS === "web" ? (
              <iframe
                width="100%"
                height="100%"
                frameBorder="0"
                src="https://maps.google.com/maps?q=Renala%20Khurd&t=&z=13&ie=UTF8&iwloc=&output=embed"
                style={{ filter: "grayscale(10%)", border: 0 }}
              ></iframe>
            ) : (
              <View className="flex-1 items-center justify-center bg-gray-100">
                <MapPin size={40} color="#E25555" />
                <Text className="text-gray-400 mt-2">Map View</Text>
              </View>
            )}
          </View>

          <Animated.View
            entering={FadeInDown.delay(300)}
            className="bg-red-100 rounded-[3rem] p-8 shadow-2xl shadow-slate-400 border border-gray-50 mb-12"
            style={{ elevation: 20 }}
          >
            <Text className="text-2xl font-bold text-gray-800 mb-2 text-center">
              Send a Message
            </Text>
            <Text className="text-gray-600 mb-8 text-sm text-center">
              Fill out the form and we'll reply within 24 hours.
            </Text>

            <View className="space-y-5">
              <View>
                <Text className="text-sm font-bold text-gray-700 ml-1 mb-2">
                  Full Name
                </Text>
                <TextInput
                  placeholder="John Doe"
                  className="bg-gray-50 p-5 rounded-2xl text-gray-800 border border-gray-100"
                  value={formData.name}
                  onChangeText={(t) => setFormData({ ...formData, name: t })}
                />
                {errors.name && (
                  <Text className="text-red-500 text-xs mt-1 ml-1">
                    {errors.name}
                  </Text>
                )}
              </View>

              <View>
                <Text className="text-sm font-bold text-gray-700 ml-1 mb-2 mt-4">
                  Email Address
                </Text>
                <TextInput
                  placeholder="john@example.com"
                  keyboardType="email-address"
                  className="bg-gray-50 p-5 rounded-2xl text-gray-800 border border-gray-100"
                  value={formData.email}
                  onChangeText={(t) => setFormData({ ...formData, email: t })}
                />
                {errors.email && (
                  <Text className="text-red-500 text-xs mt-1 ml-1">
                    {errors.email}
                  </Text>
                )}
              </View>

              <View>
                <Text className="text-sm font-bold text-gray-700 ml-1 mb-2 mt-4">
                  Subject
                </Text>
                <TouchableOpacity
                  onPress={() => setShowDropdown(!showDropdown)}
                  className="bg-gray-50 p-5 rounded-2xl border border-gray-100 flex-row justify-between items-center"
                >
                  <Text className="text-gray-800">{formData.subject}</Text>
                  <ChevronDown size={20} color="#E25555" />
                </TouchableOpacity>
                {showDropdown && (
                  <View className="bg-white mt-2 rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    {subjects.map((s) => (
                      <TouchableOpacity
                        key={s}
                        onPress={() => {
                          setFormData({ ...formData, subject: s });
                          setShowDropdown(false);
                        }}
                        className="p-4 border-b border-gray-50"
                      >
                        <Text className="text-gray-700">{s}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              <View>
                <Text className="text-sm font-bold text-gray-700 ml-1 mb-2 mt-4">
                  Message
                </Text>
                <TextInput
                  placeholder="How can we help you?"
                  multiline
                  numberOfLines={5}
                  textAlignVertical="top"
                  className="bg-gray-50 p-5 rounded-2xl text-gray-800 border border-gray-100 h-36"
                  value={formData.message}
                  onChangeText={(t) => setFormData({ ...formData, message: t })}
                />
                {errors.message && (
                  <Text className="text-red-500 text-xs mt-1 ml-1">
                    {errors.message}
                  </Text>
                )}
              </View>

              <TouchableOpacity
                onPress={handleSubmit}
                disabled={loading}
                className="bg-[#E25555] mt-6 py-5 rounded-2xl flex-row items-center justify-center shadow-xl shadow-red-200"
              >
                <Text className="text-white font-bold text-lg mr-2">
                  {loading ? "Sending..." : "Send Message"}
                </Text>
                {!loading && <Send size={20} color="white" />}
              </TouchableOpacity>
            </View>
          </Animated.View>
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

export default ContactUs;

{
  /* --- NAYA CARD: HOW IT WORKS ---
        <View className="mt-10 px-6">
          <Text className="text-slate-900 text-2xl font-black mb-6">How it Works</Text>
          <View className="bg-white p-6 rounded-[30px] shadow-md flex-row justify-between items-center border border-slate-50">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <View className="items-center flex-1">
                  <View className="bg-red-50 p-3 rounded-2xl mb-2">
                    <step.icon size={22} color="#EF4444" />
                  </View>
                  <Text className="text-slate-800 font-bold text-[12px]">{step.title}</Text>
                  <Text className="text-slate-400 text-[10px]">{step.desc}</Text>
                </View>
                {index < steps.length - 1 && (
                  <ChevronRight size={16} color="#CBD5E1" />
                )}
              </React.Fragment>
            ))}
          </View>
        </View> */
}

//  {/* Section 2: Informational Cards (Malomati Cards) */}
//           <Text style={{ color: "#94a3b8", fontWeight: "900", fontSize: 12, letterSpacing: 1.5, marginTop: 20, marginBottom: 15, marginLeft: 5 }}>
//             CRITICAL GUIDELINES
//           </Text>

//           {/* Card 1: Emergency Steps */}
//           <View style={infoCardStyle}>
//             <View style={{ backgroundColor: '#f1f5f9', width: 45, height: 45, borderRadius: 15, alignItems: 'center', justifyContent: 'center', marginBottom: 15 }}>
//               <Ionicons name=" footsteps" size={24} color="#475569" />
//             </View>
//             <Text style={infoTitle}>3 Steps to Save a Life</Text>
//             <Text style={infoDesc}>
//               1. <Text style={{fontWeight: '900', color: '#334155'}}>Call:</Text> Contact Rescue 1122 for immediate transport.{"\n"}
//               2. <Text style={{fontWeight: '900', color: '#334155'}}>Search:</Text> Use PakBlood to find donors in your specific district.{"\n"}
//               3. <Text style={{fontWeight: '900', color: '#334155'}}>Verify:</Text> Confirm donor's last donation date (>3 months).
//             </Text>
//           </View>

//           {/* Card 2: Donation Eligibility Info */}
//           <View style={{ ...infoCardStyle, backgroundColor: '#f0fdf4', borderColor: '#dcfce7' }}>
//              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
//                 <Ionicons name="checkmark-shield" size={22} color="#16a34a" />
//                 <Text style={{ ...infoTitle, marginLeft: 10, marginBottom: 0, color: '#166534' }}>Who can donate?</Text>
//              </View>
//              <Text style={{ ...infoDesc, color: '#166534' }}>
//                A healthy person between 18-60 years, weighing more than 50kg, and has no history of transmissible diseases can save up to 3 lives.
//              </Text>
//           </View>

//           {/* Card 3: Avoiding Scams (Security Info) */}
//           <View style={{ ...infoCardStyle, backgroundColor: '#fff1f2', borderColor: '#ffe4e6' }}>
//              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
//                 <Ionicons name="warning" size={22} color="#e11d48" />
//                 <Text style={{ ...infoTitle, marginLeft: 10, marginBottom: 0, color: '#9f1239' }}>Safety Protocol</Text>
//              </View>
//              <Text style={{ ...infoDesc, color: '#9f1239' }}>
//                Never pay money for blood donation. PakBlood donors are volunteers. Report any suspicious activity immediately to our support.
//              </Text>
//           </View>

//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// // Reusable Styles to keep code clean
// const cardStyle = {
//   backgroundColor: "#fff",
//   borderWidth: 1,
//   borderColor: "#f1f5f9",
//   width: "48%",
//   padding: 20,
//   borderRadius: 30,
//   alignItems: "center",
//   marginBottom: 15,
//   shadowColor: "#000",
//   shadowOpacity: 0.05,
//   elevation: 2
// };

// const cardTitle = { fontSize: 15, fontWeight: "900", color: "#1e293b" };
// const cardSub = { fontSize: 10, color: "#64748b", fontWeight: "600" };

// const infoCardStyle = {
//   backgroundColor: '#fff',
//   borderWidth: 1,
//   borderColor: '#f1f5f9',
//   padding: 20,
//   borderRadius: 30,
//   marginBottom: 15
// };

// const infoTitle = { fontSize: 17, fontWeight: "900", color: "#1e293b", marginBottom: 8 };
// const infoDesc = { fontSize: 12, color: "#64748b", fontWeight: "600", lineHeight: 20 };

//       New Informational Cards Section
//     <Text style={{ color: "#94a3b8", fontWeight: "900", fontSize: 12, letterSpacing: 1.5, marginTop: 20, marginBottom: 15, marginLeft: 5 }}>
//       KNOWLEDGE BASE
//     </Text>

//     {/* Card 1: Donation Benefits */}
//     <View style={{ ...infoCardStyle, backgroundColor: '#f8fafc', borderStyle: 'dashed' }}>
//        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
//           <View style={{ backgroundColor: '#0ea5e9', padding: 8, borderRadius: 10 }}>
//              <Ionicons name="heart" size={18} color="white" />
//           </View>
//           <Text style={{ ...infoTitle, marginLeft: 12, marginBottom: 0 }}>Health Benefits</Text>
//        </View>
//        <Text style={infoDesc}>
//          Donating blood reduces the risk of heart disease, improves liver health, and stimulates the production of new blood cells. It's a free health check-up for you!
//        </Text>
//     </View>

//     {/* Card 2: Blood Type Compatibility */}
//     <View style={{ ...infoCardStyle, backgroundColor: '#fff', borderColor: '#f1f5f9' }}>
//        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
//           <View style={{ backgroundColor: '#ef4444', padding: 8, borderRadius: 10 }}>
//              <Ionicons name="git-network" size={18} color="white" />
//           </View>
//           <Text style={{ ...infoTitle, marginLeft: 12, marginBottom: 0 }}>Who can you help?</Text>
//        </View>
//        <Text style={infoDesc}>
//          <Text style={{ fontWeight: '900', color: '#334155' }}>O-</Text> is the universal donor, while <Text style={{ fontWeight: '900', color: '#334155' }}>AB+</Text> is the universal recipient. Understanding your group helps in faster emergency response.
//        </Text>
//     </View>

//     {/* Card 3: Privacy & Safety */}
//     <View style={{ ...infoCardStyle, backgroundColor: '#f0fdf4', borderColor: '#dcfce7' }}>
//        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
//           <View style={{ backgroundColor: '#22c55e', padding: 8, borderRadius: 10 }}>
//              <Ionicons name="shield-checkmark" size={18} color="white" />
//           </View>
//           <Text style={{ ...infoTitle, marginLeft: 12, marginBottom: 0, color: '#166534' }}>Data Privacy</Text>
//        </View>
//        <Text style={{ ...infoDesc, color: '#166534' }}>
//          Your contact details are encrypted. Only verified seekers can view your information during a critical request. PakBlood ensures a safe experience for all.
//        </Text>
//     </View>

//   </View>
// </ScrollView>
