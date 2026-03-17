import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";

import { CitizenDashboardScreen } from "../screens/citizen/CitizenDashboardScreen";
import { CitizenComplaintsScreen } from "../screens/citizen/CitizenComplaintsScreen";
import { CitizenReportScreen } from "../screens/citizen/CitizenReportScreen";
import { CitizenProfileScreen } from "../screens/citizen/CitizenProfileScreen";

export type CitizenDrawerParamList = {
  CitizenDashboard: undefined;
  CitizenComplaints: undefined;
  CitizenReport: undefined;
  CitizenProfile: undefined;
};

const Drawer = createDrawerNavigator<CitizenDrawerParamList>();

export const CitizenDrawer: React.FC = () => {
  return (
    <Drawer.Navigator initialRouteName="CitizenDashboard">
      <Drawer.Screen
        name="CitizenDashboard"
        component={CitizenDashboardScreen}
        options={{ title: "Dashboard" }}
      />
      <Drawer.Screen
        name="CitizenComplaints"
        component={CitizenComplaintsScreen}
        options={{ title: "My Complaints" }}
      />
      <Drawer.Screen
        name="CitizenReport"
        component={CitizenReportScreen}
        options={{ title: "Report Issue" }}
      />
      <Drawer.Screen
        name="CitizenProfile"
        component={CitizenProfileScreen}
        options={{ title: "Profile" }}
      />
    </Drawer.Navigator>
  );
};

