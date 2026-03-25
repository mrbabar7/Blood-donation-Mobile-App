import React from "react";
import { Text } from "react-native";

export default function AppText({
  children,
  className = "",
  variant = "body",
  ...props
}) {
  // Professional Typography Scale using System Fonts
  // slate-900 for high contrast, slate-600 for secondary text
  let variantClass = "text-slate-600 text-base";

  if (variant === "heading") {
    // Bold, dark, and slightly tighter letter spacing for a modern look
    variantClass = "text-slate-900 text-3xl font-bold tracking-tight";
  } else if (variant === "subheading") {
    variantClass = "text-slate-800 text-xl font-semibold";
  } else if (variant === "caption") {
    // Small, uppercase, and spaced out - looks very "pro" for labels
    variantClass =
      "text-slate-500 text-xs uppercase font-medium tracking-widest";
  } else if (variant === "error") {
    variantClass = "text-red-600 text-sm font-medium";
  }

  return (
    <Text className={`${variantClass} ${className}`} {...props}>
      {children}
    </Text>
  );
}
