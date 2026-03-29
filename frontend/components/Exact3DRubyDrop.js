import React from "react";
// Yahan View ko add kar diya hai
import { View } from "react-native"; 
import Svg, { Path, Defs, RadialGradient, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';

const Exact3DRubyDrop = () => (
  <View style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
    
    <Svg width="100%" height="100%" viewBox="0 0 110 150" fill="none" preserveAspectRatio="xMidYMid meet">
      <Defs>
        <RadialGradient id="ruby_main" cx="55" cy="95" rx="55" ry="55" fx="55" fy="70" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#FF1E1E" />
          <Stop offset="0.7" stopColor="#B30F1A" />
          <Stop offset="1" stopColor="#660000" />
        </RadialGradient>

        <SvgLinearGradient id="glass_shine" x1="55" y1="0" x2="55" y2="80" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="white" stopOpacity="0.4" />
          <Stop offset="1" stopColor="white" stopOpacity="0" />
        </SvgLinearGradient>
      </Defs>

      <Path
        d="M55 0C55 0 110 52.88 110 94.8C110 125.18 85.38 150 55 150C24.62 150 0 125.18 0 94.8C0 52.88 55 0 55 0Z"
        fill="url(#ruby_main)"
      />

      <Path
        d="M55 5C55 5 100 55 100 95C100 120 80 140 55 140C30 140 10 120 10 95C10 55 55 5 55 5Z"
        fill="url(#glass_shine)"
        opacity="0.6"
      />
    </Svg>

    {/* Reflection/Shine Layer */}
    <View 
      style={{ 
        position: 'absolute', 
        top: '25%', 
        left: '45%', 
        width: '18%', 
        height: '22%', 
        backgroundColor: 'rgba(255,255,255,0.3)', 
        borderRadius: 10, 
        transform: [{ rotate: "15deg" }] 
      }} 
    />
  </View>
);

export default Exact3DRubyDrop;