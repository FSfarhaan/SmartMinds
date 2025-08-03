import { View } from 'react-native'
import React, { useState } from 'react'
import CircularFees from '../../components/CircularFees'
import AppTextR from '../../components/poppins/AppTextR'

const monthOptions = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

// Dummy data for monthwise fees
const feesData = {
  January:   { total: 1000, paid: 800, pending: 200, daysLeft: 5 },
  February:  { total: 1200, paid: 1000, pending: 200, daysLeft: 3 },
  March:     { total: 900, paid: 700, pending: 200, daysLeft: 7 },
  April:     { total: 1100, paid: 900, pending: 200, daysLeft: 2 },
  May:       { total: 950, paid: 950, pending: 0, daysLeft: 0 },
  June:      { total: 1050, paid: 800, pending: 250, daysLeft: 10 },
  July:      { total: 1000, paid: 600, pending: 400, daysLeft: 12 },
  August:    { total: 1150, paid: 900, pending: 250, daysLeft: 4 },
  September: { total: 980, paid: 800, pending: 180, daysLeft: 6 },
  October:   { total: 1020, paid: 900, pending: 120, daysLeft: 8 },
  November:  { total: 1100, paid: 1000, pending: 100, daysLeft: 1 },
  December:  { total: 1200, paid: 1100, pending: 100, daysLeft: 2 },
};

const StuFees = () => {
  const [monthDropdownOpen, setMonthDropdownOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(monthOptions[new Date().getMonth()]);
  const fees = feesData[selectedMonth as keyof typeof feesData];
  const paidPercent = Math.round((fees.paid / fees.total) * 100);
  const pendingPercent = Math.round((fees.pending / fees.total) * 100);
  const totalFees = 1000;
  const paidFees = 700;
//   const paidPercent = 70;
  const pendingFees = 300;
//   const pendingPercent = 30;
  const daysLeft = 5;


  return (
    <View className='p-6 py-2 flex-1'>
      <View className='bg-white border-unselected-dark rounded-2xl p-4 items-center' style={{ borderWidth: .2 }}>
        {/* Dropdown Header */}
        <View className="w-full flex-row justify-between items-center mb-2">
          <AppTextR className="text-lg font-normal text-unselected-dark">
            Fees Status
          </AppTextR>
          <View style={{ position: "relative", minWidth: 100 }}>
            {/* <TouchableOpacity
              className="flex-row justify-between items-center bg-gray-100 py-2 px-3 rounded-lg"
              onPress={() => setMonthDropdownOpen((open) => !open)}
            >
              <AppTextR className="text-base text-unselected-dark mr-2">
                {selectedMonth}
              </AppTextR>
              <Ionicons name={"chevron-down"} size={16} color="#333" />
            </TouchableOpacity>
            {monthDropdownOpen && (
              <View
                style={{
                  position: "absolute",
                  top: 44,
                  left: 0,
                  right: 0,
                  zIndex: 10,
                }}
                className="bg-white rounded-lg shadow shadow-black"
              >
                {monthOptions.map((option) => (
                  <TouchableOpacity
                    key={option}
                    className="px-4 py-2"
                    onPress={() => {
                      setSelectedMonth(option);
                      setMonthDropdownOpen(false);
                    }}
                  >
                    <AppTextR className=" text-unselected-dark">
                      {option}
                    </AppTextR>
                  </TouchableOpacity>
                ))}
              </View>
            )} */}
          </View>
        </View>

        {/* Main Circular Fees */}
        <CircularFees size={180} percentage={100} money={totalFees.toString()} label='Total Fees' sign={true} main={true} stroke='#1672EC'/>
        <View className='flex-row justify-between px-6 mt-8 gap-x-3'>
          <CircularFees size={100} percentage={paidPercent} money={paidFees.toString()} subtitle='Fees Paid' sign={true} stroke='#4CAF50'/>
          <CircularFees size={100} percentage={pendingPercent} money={pendingFees.toString()} subtitle='Fees Pending' sign={true} stroke="#404454"/>
          <CircularFees size={100} percentage={daysLeft} money={daysLeft.toString()} subtitle='Days left' stroke='#dc2626' />
        </View>
      </View>
    </View>
  )
}

export default StuFees