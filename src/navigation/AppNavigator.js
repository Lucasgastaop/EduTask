import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { AddEditTaskScreen } from '../screens/AddEditTaskScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { colors, fonts } from '../theme';

const Stack = createNativeStackNavigator();

function BootScreen() {
  return (
    <View style={styles.boot}>
      <Text style={styles.brand}>EduTask</Text>
      <ActivityIndicator color={colors.teal} />
    </View>
  );
}

export default function AppNavigator() {
  const { user, initializing } = useAuth();

  if (initializing) {
    return <BootScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
        {user ? (
          <Stack.Group>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="AddEditTask" component={AddEditTaskScreen} />
          </Stack.Group>
        ) : (
          <Stack.Group>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  boot: {
    flex: 1,
    backgroundColor: colors.paper,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  brand: {
    fontFamily: fonts.display,
    fontSize: 36,
    color: colors.ink,
  },
});
