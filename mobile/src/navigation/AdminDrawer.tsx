import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";

import { AdminDashboardScreen } from "../screens/admin/AdminDashboardScreen";
import { AdminComplaintsScreen } from "../screens/admin/AdminComplaintsScreen";
import { AdminAnalyticsScreen } from "../screens/admin/AdminAnalyticsScreen";
import { AdminUsersScreen } from "../screens/admin/AdminUsersScreen";
import { AdminDepartmentsScreen } from "../screens/admin/AdminDepartmentsScreen";

export type AdminDrawerParamList = {
  AdminDashboard: undefined;
  AdminComplaints: undefined;
  AdminAnalytics: undefined;
  AdminUsers: undefined;
  AdminDepartments: undefined;
};

const Drawer = createDrawerNavigator<AdminDrawerParamList>();

export const AdminDrawer: React.FC = () => {
  return (
    <Drawer.Navigator initialRouteName="AdminDashboard">
      <Drawer.Screen
        name="AdminDashboard"
        component={AdminDashboardScreen}
        options={{ title: "Dashboard" }}
      />
      <Drawer.Screen
        name="AdminComplaints"
        component={AdminComplaintsScreen}
        options={{ title: "Complaints" }}
      />
      <Drawer.Screen
        name="AdminAnalytics"
        component={AdminAnalyticsScreen}
        options={{ title: "Analytics" }}
      />
      <Drawer.Screen
        name="AdminUsers"
        component={AdminUsersScreen}
        options={{ title: "Users" }}
      />
      <Drawer.Screen
        name="AdminDepartments"
        component={AdminDepartmentsScreen}
        options={{ title: "Departments" }}
      />
    </Drawer.Navigator>
  );
};

