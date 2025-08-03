import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import AppTextSB from './poppins/AppTextSB';
import AppTextR from './poppins/AppTextR';

interface CircularFeesProps {
  percentage: number; // 0-100
  size: number;
  label?: string;
  money: string;
  sign?: boolean;
  main?: boolean;
  subtitle?: string;
  stroke?: string;
}

const CircularFees = ({
  percentage,
  size,
  label,
  money,
  sign = false,
  main = false,
  subtitle,
  stroke
}: CircularFeesProps) => {
  const strokeWidth = main ? 20 : 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = circumference * (1 - percentage / 100);

  return (
    <View className='flex-col items-center'>
      <View style={[styles.container, { height: size }]}> 
        <Svg width={size} height={size}>
          {/* Background Circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={'#E6E6E6'}
            strokeWidth={strokeWidth}
            fill='none'
          />
          {/* Progress Circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={stroke}
            strokeWidth={strokeWidth}
            fill='none'
            strokeDasharray={circumference}
            strokeDashoffset={progress}
            strokeLinecap='round'
            rotation='-90'
            origin={`${size / 2}, ${size / 2}`}
          />
        </Svg>
        <View style={styles.textContainer} pointerEvents='none'>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center' }}>
            {sign && <AppTextR style={styles.percentSign}>₹</AppTextR>}
            <AppTextSB className={`${main? 'text-4xl' : 'text-xl'} text-unselected-dark`} style={styles.percentText}>{money}</AppTextSB>
          </View>
          {label && <AppTextR className='text-unselected-dark'>{label}</AppTextR>}
        </View>
      </View>
      {subtitle && <AppTextR className='mt-2 text-unselected-light'>{subtitle}</AppTextR>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    // backgroundColor: "gray"
  },
  textContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  percentText: {
    lineHeight: 38,
  },
  percentSign: {
    fontSize: 16,
    color: '#222',
    marginLeft: 2,
    marginBottom: 4,
  },
});

export default CircularFees; 