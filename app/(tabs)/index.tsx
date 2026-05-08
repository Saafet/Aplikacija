import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const LIGHT = {
  bg: '#F7F7F5',
  text: '#111110',
  muted: '#999994',
  border: '#E4E4E0',
  btnBg: '#111110',
  btnText: '#F7F7F5',
};

const DARK = {
  bg: '#0F1117',
  text: '#EEF0F5',
  muted: '#5C6378',
  border: '#252A38',
  btnBg: '#EEF0F5',
  btnText: '#0F1117',
};

export default function HomeScreen() {
  const system = useColorScheme();
  const [override, setOverride] = useState<'light' | 'dark' | null>(null);
  const scheme = override ?? system ?? 'light';
  const t = scheme === 'dark' ? DARK : LIGHT;
  const insets = useSafeAreaInsets();

  const toggle = () => setOverride(scheme === 'dark' ? 'light' : 'dark');

  return (
      <View style={[styles.root, { backgroundColor: t.bg, paddingTop: insets.top + 48 }]}>

        <Text style={[styles.label, { color: t.muted }]}>HOME</Text>

        <Text style={[styles.title, { color: t.text }]}>Welcome.</Text>

        <View style={[styles.divider, { backgroundColor: t.border }]} />

        <TouchableOpacity
            onPress={toggle}
            activeOpacity={0.8}
            style={[styles.btn, { backgroundColor: t.btnBg }]}
        >
          <Text style={[styles.btnText, { color: t.btnText }]}>
            {scheme === 'dark' ? '☀️  Light mode' : '🌙  Dark mode'}
          </Text>
        </TouchableOpacity>

      </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: 28,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 10,
  },
  title: {
    fontSize: 48,
    fontWeight: '700',
    letterSpacing: -1,
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif', default: 'Georgia' }),
    marginBottom: 24,
  },
  divider: {
    height: 1,
    marginBottom: 24,
  },
  btn: {
    alignSelf: 'flex-start',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
  },
  btnText: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});