import React, { useState } from "react";
import { View, Image, TouchableOpacity, TextInput, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import AppTextB from "../../components/poppins/AppTextB";
import AppTextR from "../../components/poppins/AppTextR";
import AppTextSB from "../../components/poppins/AppTextSB";

const defaultProfile = {
  name: "Farhaan Shaikh",
  email: "farhaanshaikh@gmail.com",
  username: "@farhaanshaikh",
  password: "password123",
  phone: "+91 6895312",
  std: "10",
  school: "DFS",
  gender: "M",
  joiningDate: new Date().toISOString().slice(0, 10),
  feesTotal: 12000,
  dueFeeReminderSent: true,
  shiftNumber: 1,
  avatar: "https://randomuser.me/api/portraits/men/44.jpg",
};

const genderMap: { [key: string]: string } = { M: "Male", F: "Female" };

const DueFeeTile = () => (
  <View className="bg-red-100 border-l-4 border-red-500 rounded-xl px-4 py-3 mb-4 flex-row items-center">
    <Ionicons name="alert-circle" size={28} color="#dc2626" className="mr-3" />
    <View className="flex-1">
      <AppTextSB className="text-red-700 text-base mb-1">Fees Pending</AppTextSB>
      <AppTextR className="text-red-700 text-xs">Your fees are pending. Please pay as soon as possible to avoid late charges.</AppTextR>
    </View>
  </View>
);

const ProfileDetails = ({ profile, genderMap }: { profile: typeof defaultProfile, genderMap: { [key: string]: string } }) => (
  <ScrollView className="bg-white rounded-2xl divide-y divide-gray-100 mb-6 border-unselected-light" showsVerticalScrollIndicator={false}
    style={{ borderWidth: .2 }}>
    <View className="flex-row items-center px-6 py-4">
      <AppTextR className="flex-1 text-base text-unselected-light">Name</AppTextR>
      <AppTextSB className="text-base text-unselected-dark">{profile.name}</AppTextSB>
    </View>
    <View className="flex-row items-center px-6 py-4">
      <AppTextR className="flex-1 text-base text-unselected-light">Email</AppTextR>
      <AppTextSB className="text-base text-unselected-dark">{profile.email}</AppTextSB>
    </View>
    <View className="flex-row items-center px-6 py-4">
      <AppTextR className="flex-1 text-base text-unselected-light">Username</AppTextR>
      <AppTextSB className="text-base text-unselected-dark">{profile.username}</AppTextSB>
    </View>
    <View className="flex-row items-center px-6 py-4">
      <AppTextR className="flex-1 text-base text-unselected-light">Gender</AppTextR>
      <AppTextSB className="text-base text-unselected-dark">{genderMap[profile.gender] || profile.gender}</AppTextSB>
    </View>
    <View className="flex-row items-center px-6 py-4">
      <AppTextR className="flex-1 text-base text-unselected-light">Phone</AppTextR>
      <AppTextSB className="text-base text-unselected-dark">{profile.phone}</AppTextSB>
    </View>
    <View className="flex-row items-center px-6 py-4">
      <AppTextR className="flex-1 text-base text-unselected-light">Standard</AppTextR>
      <AppTextSB className="text-base text-unselected-dark">{profile.std}</AppTextSB>
    </View>
    <View className="flex-row items-center px-6 py-4">
      <AppTextR className="flex-1 text-base text-unselected-light">School</AppTextR>
      <AppTextSB className="text-base text-unselected-dark">{profile.school}</AppTextSB>
    </View>
    
    <View className="flex-row items-center px-6 py-4">
      <AppTextR className="flex-1 text-base text-unselected-light">Joining Date</AppTextR>
      <AppTextSB className="text-base text-unselected-dark">{profile.joiningDate}</AppTextSB>
    </View>
    <View className="flex-row items-center px-6 py-4">
      <AppTextR className="flex-1 text-base text-unselected-light">Total Fees</AppTextR>
      <AppTextSB className="text-base text-unselected-dark">₹{profile.feesTotal}</AppTextSB>
    </View>
    <View className="flex-row items-center px-6 py-4">
      <AppTextR className="flex-1 text-base text-unselected-light">Shift Number</AppTextR>
      <AppTextSB className="text-base text-unselected-dark">{profile.shiftNumber}</AppTextSB>
    </View>
  </ScrollView>
);

const Profile = () => {
  const [edit, setEdit] = useState(false);
  const [profile, setProfile] = useState(defaultProfile);
  const [showPassword, setShowPassword] = useState(false);

  // For updating fields in edit mode
  const handleChange = (field: string, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  // View Mode
  if (!edit) {
    return (
      <SafeAreaView className="flex-1 bg-background p-6 pb-28">
        <AppTextR className="text-xl text-unselected-light">Your Details</AppTextR>
        <AppTextB className="text-3xl text-unselected-dark mb-4">Profile</AppTextB>
        <View className="items-center mb-6">
          <Image source={{ uri: profile.avatar }} className="w-24 h-24 rounded-full mb-2" />
          <AppTextB className="text-xl text-unselected-dark">{profile.name}</AppTextB>
          <AppTextR className="text-base text-unselected-light">{profile.username}</AppTextR>
          <TouchableOpacity
            className="mt-3 px-6 py-2 rounded-full bg-primary"
            onPress={() => setEdit(true)}
          >
            <AppTextSB className="text-white text-base">Edit Profile</AppTextSB>
          </TouchableOpacity>
        </View>
        {/* {profile.dueFeeReminderSent && <DueFeeTile />} */}
        <ProfileDetails profile={profile} genderMap={genderMap} />
      </SafeAreaView>
    );
  }

  // Edit Mode
  return (
    <SafeAreaView className="flex-1 bg-background p-6 pb-28">
      <AppTextR className="text-xl text-unselected-light">
        Your Details
      </AppTextR>
      <AppTextB className="text-3xl text-unselected-dark mb-4">Edit Profile</AppTextB>
        <View className="items-center mb-6">
          <Image source={{ uri: profile.avatar }} className="w-24 h-24 rounded-full mb-2" />
          <TouchableOpacity className="absolute right-0 bottom-0 bg-white p-1 rounded-full border border-gray-200">
            <Ionicons name="camera-outline" size={18} color="#404454" />
          </TouchableOpacity>
        </View>
      <ScrollView showsVerticalScrollIndicator={false} className="mb-2">
        {/* {profile.dueFeeReminderSent && <DueFeeTile />} */}
        <View className="mb-4">
          <AppTextSB className="mb-1 text-unselected-dark">Name</AppTextSB>
          <TextInput
            className="bg-gray-100 rounded-xl px-4 py-3 text-base text-gray-800"
            value={profile.name}
            onChangeText={(v) => handleChange("name", v)}
            placeholder="Name"
          />
        </View>
        <View className="mb-4">
          <AppTextSB className="mb-1 text-unselected-dark">Email</AppTextSB>
          <TextInput
            className="bg-gray-100 rounded-xl px-4 py-3 text-base text-gray-800"
            value={profile.email}
            onChangeText={(v) => handleChange("email", v)}
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        <View className="mb-4">
          <AppTextSB className="mb-1 text-unselected-dark">Username</AppTextSB>
          <TextInput
            className="bg-gray-100 rounded-xl px-4 py-3 text-base text-gray-800"
            value={profile.username}
            onChangeText={(v) => handleChange("username", v)}
            placeholder="Username"
            autoCapitalize="none"
          />
        </View>
        <View className="mb-4">
          <AppTextSB className="mb-1 text-unselected-dark">Phone</AppTextSB>
          <TextInput
            className="bg-gray-100 rounded-xl px-4 py-3 text-base text-gray-800"
            value={profile.phone}
            onChangeText={(v) => handleChange("phone", v)}
            placeholder="Phone"
            keyboardType="phone-pad"
          />
        </View>
        <View className="mb-4">
          <AppTextSB className="mb-1 text-unselected-dark">Standard</AppTextSB>
          <TextInput
            className="bg-gray-100 rounded-xl px-4 py-3 text-base text-gray-800"
            value={profile.std}
            onChangeText={(v) => handleChange("std", v)}
            placeholder="Standard"
          />
        </View>
        <View className="mb-4">
          <AppTextSB className="mb-1 text-unselected-dark">School</AppTextSB>
          <TextInput
            className="bg-gray-100 rounded-xl px-4 py-3 text-base text-gray-800"
            value={profile.school}
            onChangeText={(v) => handleChange("school", v)}
            placeholder="School"
          />
        </View>
        <View className="mb-4">
          <AppTextSB className="mb-1 text-unselected-dark">Gender</AppTextSB>
          <TextInput
            className="bg-gray-100 rounded-xl px-4 py-3 text-base text-gray-800"
            value={profile.gender}
            onChangeText={(v) => handleChange("gender", v)}
            placeholder="Gender (M/F)"
            maxLength={1}
          />
        </View>
        {/* <View className="mb-4">
          <AppTextR className="mb-1 text-gray-500">Joining Date</AppTextR>
          <TextInput
            className="bg-gray-100 rounded-xl px-4 py-3 text-base text-gray-800"
            value={profile.joiningDate}
            onChangeText={(v) => handleChange("joiningDate", v)}
            placeholder="YYYY-MM-DD"
          />
        </View> */}
        {/* <View className="mb-4">
          <AppTextR className="mb-1 text-gray-500">Total Fees</AppTextR>
          <TextInput
            className="bg-gray-100 rounded-xl px-4 py-3 text-base text-gray-800"
            value={String(profile.feesTotal)}
            onChangeText={(v) => handleChange("feesTotal", v.replace(/[^0-9]/g, ""))}
            placeholder="Total Fees"
            keyboardType="numeric"
          />
        </View> */}
        <View className="mb-6">
          <AppTextSB className="mb-1 text-unselected-dark">Shift Number</AppTextSB>
          <TextInput
            className="bg-gray-100 rounded-xl px-4 py-3 text-base text-gray-800"
            value={String(profile.shiftNumber)}
            onChangeText={(v) => handleChange("shiftNumber", v.replace(/[^0-9]/g, ""))}
            placeholder="Shift Number"
            keyboardType="numeric"
          />
        </View>
      </ScrollView>
      <View className="flex flex-row gap-x-2 items-center mb-4">
            <TouchableOpacity
              className="flex-1 px-2 py-2 bg-transparent rounded-xl border-primary border"
              onPress={() => setEdit(false)}
            >
              <AppTextSB className="text-sm text-center text-blue-700">
                Cancel
              </AppTextSB>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-1 px-4 py-2 bg-primary rounded-xl"
              onPress={() => setEdit(false)}
            >
              <AppTextSB className="text-sm text-center text-white border border-primary">Update</AppTextSB>
            </TouchableOpacity>
          </View>
    </SafeAreaView>
  );
};

export default Profile;