import { View, Dimensions } from "react-native";
import React from "react";
import TileTextImage from "../../components/TileTextImage";
import TilePieChart from "../../components/TilePieChart";
import TileBarChart from "../../components/TileBarChart";
import TileDue from "../../components/TileDueFees";
import { getFeesCollected, getFeesDue, getFeesSummary, getStats } from "../../apis/getRequests";
import { useFetchData } from "@/hooks/useFetchData";

const Dashboard = () => {

  const fetchData = async () => {
    const [stats, feesSummary, feesCollected, feesDue] = await Promise.all([
      getStats(),
      getFeesSummary(),
      getFeesCollected(),
      getFeesDue(),
    ]);    
    return { stats, feesSummary, feesCollected, feesDue };
  };

  const { data, loading, error } = useFetchData(fetchData);
  
  if (error || !data) {
    console.log('Dashboard error:', error);
    return;
  }
  
  // console.log('Dashboard data:', data);
  // console.log('Stats:', data?.stats);
  // console.log('Fees summary:', data?.feesSummary);
  console.log('Fees collected:', data?.feesCollected);
  // console.log('Fees due:', data?.feesDue);

  const dueTile = {
    title: "Due fees",
    status: data?.feesDue?.dueDays ? "neg" : "pos",
    content: `${data?.feesDue?.name} has due fees of ${data?.feesDue?.dueDays} days`
  }
  return (
    <View className="px-4 flex flex-row flex-wrap justify-center">

      {dueTile.status === "neg" && <View className="w-full mt-2 px-2">
        <TileDue title={dueTile.title} 
          content={dueTile.content} 
          status={dueTile.status}/>
      </View>}

      <TileTextImage
        item={{
          title: "No. of students",
          content: `Male: ${data?.stats?.male}, Female: ${data?.stats?.female},\nTotal: ${data?.stats?.total}`,
          image: require("../../assets/images/personImage.png"),
          flag: true
        }}
      />

      <View className="p-4 m-2 bg-white border-unselected-dark rounded-xl" style={{ borderWidth: .2 }}>
        <TilePieChart
          item={{
            title: "Fees paid",
            pieData: [
              {
                name: "Paid: " + data?.feesSummary?.paid,
                value: 30,
                color: "#4CAF50",
              },
              {
                name: "Pending: " + data?.feesSummary?.pending,
                value: 10,
                color: "#404454",
              },
              {
                name: "Due: " + data?.feesSummary?.due,
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
          title: `Fees collected (${data?.feesCollected?.year})`,
          barData: {
            labels: ["Jan", "Feb", "Mar", "April", "May", "Jun", "July", "Aug", "Sept", "Oct", "Nov", "Dec"],
            datasets: [{ data: data?.feesCollected?.monthlyArray}],
          },
          color: "rgba(22, 114, 236, 1)",
        }}
      />

      
    </View>
  );
};

export default Dashboard;
