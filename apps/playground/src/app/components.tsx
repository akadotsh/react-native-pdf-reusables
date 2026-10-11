import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
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

const detailFields = [
  { key: 'invoice', label: 'Invoice' },
  { key: 'customer', label: 'Customer' },
  { key: 'date', label: 'Date' },
] as const;

const totalFields = [
  { key: 'subtotal', label: 'Subtotal' },
  { key: 'tax', label: 'Tax' },
  { key: 'total', label: 'Total' },
] as const;

export default function ComponentsScreen() {
  const { content, selected, setContent, toggle } = useComponentSelection();

  return (
    <SafeAreaView edges={['bottom']} style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled
        style={styles.list}
      >
        <View style={styles.heading}>
          <Text style={styles.eyebrow}>BUILD YOUR PDF</Text>
          <Text style={styles.title}>Choose components</Text>
          <Text style={styles.subtitle}>Changes appear the next time you generate the preview.</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>ALWAYS INCLUDED</Text>
          <Text style={styles.foundation}>Document · Page · Stack · Heading · Text</Text>
          <View style={styles.fields}>
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Heading</Text>
              <TextInput
                accessibilityLabel="PDF heading"
                onChangeText={(value) => setContent('heading', value)}
                placeholder="Heading"
                placeholderTextColor="#9a9896"
                style={styles.input}
                value={content.heading}
              />
            </View>
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Text</Text>
              <TextInput
                accessibilityLabel="PDF text"
                multiline
                onChangeText={(value) => setContent('text', value)}
                placeholder="Text"
                placeholderTextColor="#9a9896"
                style={[styles.input, styles.textArea]}
                value={content.text}
              />
            </View>
          </View>
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

        {selected.details ? (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>KEY-VALUE LIST</Text>
            <View style={styles.fields}>
              {detailFields.map((field) => (
                <View key={field.key} style={styles.field}>
                  <Text style={styles.fieldLabel}>{field.label}</Text>
                  <TextInput
                    accessibilityLabel={`${field.label} value`}
                    onChangeText={(value) => setContent(field.key, value)}
                    placeholder={field.label}
                    placeholderTextColor="#9a9896"
                    style={styles.input}
                    value={content[field.key]}
                  />
                </View>
              ))}
            </View>
          </View>
        ) : null}

        {selected.totals ? (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>TOTALS</Text>
            <View style={styles.fields}>
              {totalFields.map((field) => (
                <View key={field.key} style={styles.field}>
                  <Text style={styles.fieldLabel}>{field.label}</Text>
                  <TextInput
                    accessibilityLabel={`${field.label} value`}
                    onChangeText={(value) => setContent(field.key, value)}
                    placeholder={field.label}
                    placeholderTextColor="#9a9896"
                    style={styles.input}
                    value={content[field.key]}
                  />
                </View>
              ))}
            </View>
          </View>
        ) : null}

      </ScrollView>
      <View style={styles.footer}>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.back()}
          style={({ pressed }) => [styles.done, pressed ? styles.pressed : null]}
        >
          <Text style={styles.doneLabel}>Done</Text>
        </Pressable>
      </View>
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
  list: {
    flex: 1,
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
  fields: {
    gap: 12,
    paddingTop: 10,
  },
  field: {
    gap: 6,
  },
  fieldLabel: {
    color: '#7a7876',
    fontSize: 13,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#f2f0ec',
    borderCurve: 'continuous',
    borderRadius: 10,
    color: '#474645',
    fontSize: 16,
    minHeight: 44,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  textArea: {
    minHeight: 72,
    textAlignVertical: 'top',
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
  footer: {
    paddingHorizontal: 18,
    paddingTop: 10,
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
