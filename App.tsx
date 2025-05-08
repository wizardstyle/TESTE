import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RepairsScreen } from './src/screens/RepairsScreen';
import { initDatabase } from './src/services/database';

const Stack = createNativeStackNavigator();

export default function App() {
  React.useEffect(() => {
    // Initialize the database when the app starts
    initDatabase().catch(console.error);
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Repairs"
          component={RepairsScreen}
          options={{
            title: 'Repairs Management',
            headerStyle: {
              backgroundColor: '#1E90FF',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
} 