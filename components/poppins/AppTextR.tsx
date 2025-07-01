// components/AppText.tsx
import React from "react";
import { Text, TextProps } from "react-native";

interface AppTextProps extends TextProps {
  children: React.ReactNode;
}

export default function AppTextR({ style, children, ...rest }: AppTextProps) {
  return (
    <Text style={[{ fontFamily: "Poppins_400Regular" }, style]} {...rest}>
      {children}
    </Text>
  );
}
