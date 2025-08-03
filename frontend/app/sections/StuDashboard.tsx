import { View, Dimensions } from "react-native";
import React from "react";
import TileTextImage from "../../components/TileTextImage";
import TilePieChart from "../../components/TilePieChart";
import TileBarChart from "../../components/TileBarChart";
import TileDue from "../../components/TileDueFees";

const getStatus = (fees: string) => {
    if(fees === "Paid") return "✅ Paid";
    else if (fees === "Pending") return "⚫ Pending";
    else return "❌ Due"
}

const StuDashboard = () => {
    const feesStatus = getStatus("Pending");
    const dueTile = {
        title: "Due fees",
        content: "Your fees is due by 2 days!",
        status: "neg"
    }
    const dueTile2 = {
        title: "Remark",
        content: "You received a negative remark!",
        status: "neg"
    }
  return (
    <View className="px-4 flex flex-row flex-wrap justify-center">
      <View className="w-full mt-2 px-2">
        <TileDue title={dueTile.title} status={dueTile.status} content={dueTile.content}/>
      </View>

      <TileTextImage
        item={{
          title: "Fees Status",
          content: feesStatus,
          image: require("../../assets/images/personImage.png"),
          flag: false
        }}
      />

      <View className="p-4 m-2 bg-white border-unselected-dark rounded-xl" style={{ borderWidth: .2 }}>
        <TilePieChart
          item={{
            title: "Attendance",
            pieData: [
              {
                name: "Present: " + "20 / 30",
                value: 20,
                color: "#4CAF50",
              },
              {
                name: "Absent: " + "10 / 30",
                value: 10,
                color: "#404454",
              }
            ],
            width: Dimensions.get("window").width / 2 - 60,
            height: 150,
            pLeft: "30",
            showLegends : true
          }}
        />
      </View>

      <TileBarChart
        item={{
          title: "Progress (2025)",
          barData: {
            labels: ["Jan", "Feb", "Mar", "April", "May", "Jun", "July", "Aug", "Sept", "Oct", "Nov", "Dec"],
            datasets: [{ data: [50, 60, 70, 80, 52, 76, 84, 91, 62, 88, 78, 92]}],
          },
          color: "rgba(22, 114, 236, 1)",
        }}
      />

      
    </View>
  );
};

export default StuDashboard;
