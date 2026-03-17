import "react-native-gesture-handler";
import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { PublicStack } from "./PublicStack";
import { CitizenDrawer } from "./CitizenDrawer";
import { AdminDrawer } from "./AdminDrawer";
import { LoadingScreen } from "../screens/shared/LoadingScreen";
import { loadSession } from "../services/session";

export type RootStackParamList = {
  Public: undefined;
  Citizen: undefined;
  Admin: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  const [booting, setBooting] = useState(true);
  const [role, setRole] = useState<"citizen" | "admin" | null>(null);

  useEffect(() => {
    (async () => {
      const session = await loadSession();
      const r = (session.user as any)?.role ?? null;
      setRole(r === "admin" ? "admin" : r === "citizen" ? "citizen" : null);
      setBooting(false);
    })();
  }, []);

  if (booting) {
    return <LoadingScreen label="Loading CivicSetu..." />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Public">
          {(props) => (
            <PublicStack
              {...props}
              onAuthenticated={(nextRole) => {
                setRole(nextRole);
                if (nextRole === "admin") {
                  props.navigation.reset({ index: 0, routes: [{ name: "Admin" as never }] });
                } else {
                  props.navigation.reset({ index: 0, routes: [{ name: "Citizen" as never }] });
                }
              }}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Citizen" component={CitizenDrawer} />
        <Stack.Screen name="Admin" component={AdminDrawer} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

