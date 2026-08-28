// TH1 | 23735301 | PHẠM QUỐC TUẤN | #972910

import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { ThemeProvider } from '@contexts/ThemeContext';
import HomeScreen from '@screens/HomeScreen';

function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
          <HomeScreen />
        </SafeAreaView>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;