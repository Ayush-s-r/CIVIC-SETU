import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { HomeScreen } from "../screens/public/HomeScreen";
import { AboutScreen } from "../screens/public/AboutScreen";
import { ContactScreen } from "../screens/public/ContactScreen";
import { ComplaintScreen } from "../screens/public/ComplaintScreen";
import { LoginScreen } from "../screens/auth/LoginScreen";
import { SignupScreen } from "../screens/auth/SignupScreen";

export type PublicStackParamList = {
  Home: undefined;
  About: undefined;
  Contact: undefined;
  Complaint: undefined;
  Login: undefined;
  Signup: undefined;
};

const Stack = createNativeStackNavigator<PublicStackParamList>();

type Props = {
  onAuthenticated: (role: "citizen" | "admin") => void;
};

export const PublicStack: React.FC<Props> = ({ onAuthenticated }) => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: "CivicSetu" }} />
      <Stack.Screen name="About" component={AboutScreen} />
      <Stack.Screen name="Contact" component={ContactScreen} />
      <Stack.Screen name="Complaint" component={ComplaintScreen} options={{ title: "Report Issue" }} />
      <Stack.Screen name="Login">
        {(props) => <LoginScreen {...props} onAuthenticated={onAuthenticated} />}
      </Stack.Screen>
      <Stack.Screen name="Signup">
        {(props) => <SignupScreen {...props} onAuthenticated={onAuthenticated} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

