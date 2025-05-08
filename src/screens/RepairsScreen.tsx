import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { RepairList } from '../components/RepairList';
import { AddRepairForm } from '../components/AddRepairForm';

const Tab = createMaterialTopTabNavigator();

export const RepairsScreen = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarLabelStyle: { fontSize: 14, fontWeight: '600' },
        tabBarStyle: { backgroundColor: '#fff' },
        tabBarIndicatorStyle: { backgroundColor: '#1E90FF' },
        tabBarActiveTintColor: '#1E90FF',
        tabBarInactiveTintColor: '#666',
      }}
    >
      <Tab.Screen
        name="Repairs"
        component={RepairList}
        options={{
          title: 'Repairs List',
        }}
      />
      <Tab.Screen
        name="AddRepair"
        component={AddRepairForm}
        options={{
          title: 'Add Repair',
        }}
      />
    </Tab.Navigator>
  );
}; 