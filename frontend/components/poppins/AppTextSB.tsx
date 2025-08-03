// components/AppText.tsx
import React from "react";
import { Text, TextProps } from "react-native";

interface AppTextProps extends TextProps {
  children: React.ReactNode;
}

export default function AppTextSB({ style, children, ...rest }: AppTextProps) {
  return (
    <Text style={[{ fontFamily: "Poppins_600SemiBold" }, style]} {...rest}>
      {children}
    </Text>
  );
}
