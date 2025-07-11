import { View, Dimensions } from "react-native";
import React from "react";
import TileTextImage from "@/components/TileTextImage";
import TilePieChart from "@/components/TilePieChart";
import TileBarChart from "@/components/TileBarChart";
import TileDue from "@/components/TileDueFees";

const Dashboard = () => {
  const dueTile = {
    title: "Due fees",
    content: "Ali Asghar has due fees of 5 days",
    status: "neg"
  }
  return (
    <View className="px-4 flex flex-row flex-wrap justify-center">

      {dueTile.status === "neg" && <View className="w-full mt-2 px-2">
        <TileDue title={dueTile.title} content={dueTile.content} status={dueTile.status}/>
      </View>}

      <TileTextImage
        item={{
          title: "No. of students",
          content: "Male: 30, Female: 20,\nTotal: 50",
          image: require("@/assets/images/personImage.png"),
          flag: true
        }}
      />

      <View className="p-4 m-2 bg-white border-unselected-dark rounded-xl" style={{ borderWidth: .2 }}>
        <TilePieChart
          item={{
            title: "Fees paid",
            pieData: [
              {
                name: "Paid: " + 30,
                value: 30,
                color: "#4CAF50",
              },
              {
                name: "Pending: " + 10,
                value: 10,
                color: "#404454",
              },
              {
                name: "Due: " + 10,
                value: 10,
                color: "#F44336",
              },
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
          title: "Fees collected (2025)",
          barData: {
            labels: ["Jan", "Feb", "Mar", "April", "May", "Jun", "July", "Aug", "Sept", "Oct", "Nov", "Dec"],
            datasets: [{ data: [45000, 30000, 35000, 40000, 50000, 38000, 42000, 47000, 31000, 44000, 39000, 46000]}],
          },
          color: "rgba(22, 114, 236, 1)",
        }}
      />

      
    </View>
  );
};

export default Dashboard;
