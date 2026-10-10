import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  type OptionalComponent,
  useComponentSelection,
} from '../components/component-selection';

const options: { key: OptionalComponent; label: string }[] = [
  { key: 'image', label: 'Image' },
  { key: 'divider', label: 'Divider' },
  { key: 'link', label: 'Link' },
  { key: 'details', label: 'Key-value list' },
  { key: 'table', label: 'Data table' },
  { key: 'totals', label: 'Totals' },
  { key: 'signature', label: 'Signature' },
  { key: 'keepTogether', label: 'Keep together' },
  { key: 'header', label: 'Page header' },
  { key: 'footer', label: 'Page footer' },
  { key: 'watermark', label: 'Watermark' },
  { key: 'pageBreak', label: 'Page break' },
  { key: 'theme', label: 'Theme provider' },
];

export default function ComponentsScreen() {
  const { selected, toggle } = useComponentSelection();

  return (
    <SafeAreaView edges={['bottom']} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.heading}>
          <Text style={styles.eyebrow}>BUILD YOUR PDF</Text>
          <Text style={styles.title}>Choose components</Text>
          <Text style={styles.subtitle}>Changes appear the next time you generate the preview.</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>ALWAYS INCLUDED</Text>
          <Text style={styles.foundation}>Document · Page · Stack · Heading · Text</Text>
        </View>

        <View style={styles.options}>
          {options.map((option, index) => {
            const isSelected = selected[option.key];

            return (
              <Pressable
                accessibilityRole="checkbox"
                accessibilityState={{ checked: isSelected }}
                key={option.key}
                onPress={() => toggle(option.key)}
                style={({ pressed }) => [
                  styles.option,
                  index < options.length - 1 ? styles.optionBorder : null,
                  pressed ? styles.pressed : null,
                ]}
              >
                <Text style={styles.optionLabel}>{option.label}</Text>
                <View style={[styles.status, isSelected ? styles.statusSelected : null]}>
                  <Text style={[styles.statusLabel, isSelected ? styles.statusLabelSelected : null]}>
                    {isSelected ? 'Added' : 'Add'}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={() => router.back()}
          style={({ pressed }) => [styles.done, pressed ? styles.pressed : null]}
        >
          <Text style={styles.doneLabel}>Done</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#f2f0ec',
    flex: 1,
  },
  container: {
    gap: 18,
    paddingBottom: 12,
    paddingHorizontal: 18,
    paddingTop: 20,
  },
  heading: {
    gap: 5,
  },
  eyebrow: {
    color: '#0080e8',
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 1.2,
  },
  title: {
    color: '#474645',
    fontSize: 27,
    fontWeight: '500',
    letterSpacing: -0.5,
  },
  subtitle: {
    color: '#7a7876',
    fontSize: 15,
    lineHeight: 20,
  },
  section: {
    backgroundColor: '#ffffff',
    borderCurve: 'continuous',
    borderRadius: 16,
    gap: 5,
    padding: 14,
  },
  sectionLabel: {
    color: '#7a7876',
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 0.8,
  },
  foundation: {
    color: '#474645',
    fontSize: 15,
    lineHeight: 21,
  },
  options: {
    backgroundColor: '#ffffff',
    borderCurve: 'continuous',
    borderRadius: 18,
    overflow: 'hidden',
  },
  option: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 54,
    paddingHorizontal: 16,
  },
  optionBorder: {
    borderBottomColor: '#ebe8e3',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  optionLabel: {
    color: '#474645',
    fontSize: 16,
    fontWeight: '500',
  },
  status: {
    backgroundColor: '#f2f0ec',
    borderRadius: 999,
    minWidth: 60,
    paddingHorizontal: 11,
    paddingVertical: 6,
  },
  statusSelected: {
    backgroundColor: '#e3f2fd',
  },
  statusLabel: {
    color: '#7a7876',
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
  },
  statusLabelSelected: {
    color: '#0080e8',
  },
  done: {
    alignItems: 'center',
    backgroundColor: '#0080e8',
    borderCurve: 'continuous',
    borderRadius: 16,
    justifyContent: 'center',
    minHeight: 52,
  },
  doneLabel: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
  pressed: {
    opacity: 0.68,
  },
});
