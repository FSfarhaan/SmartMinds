import 'dotenv/config';

export default {
  expo: {
    name: "SmartMinds",
    slug: "SmartMinds",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "smartminds",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    extra: {
      baseUrl: process.env.BASE_URL,
      router: {},
      eas: {
        projectId: "60cb721c-819f-4769-b2db-bc492e43888f"
      }
    },
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      edgeToEdgeEnabled: true,
      package: "com.fsfarhaanshaikh7.SmartMinds"
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png"
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff"
        }
      ],
      "expo-font"
    ],
    experiments: {
      typedRoutes: true
    }
  }
};
