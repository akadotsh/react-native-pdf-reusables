import { Button, Modal, Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export type OptionalComponent = 'details' | 'signature' | 'totals';

const options: { key: OptionalComponent; label: string }[] = [
  { key: 'details', label: 'Key-value list' },
  { key: 'totals', label: 'Totals' },
  { key: 'signature', label: 'Signature' },
];

type ComponentPickerSheetProps = {
  onClose: () => void;
  onToggle: (component: OptionalComponent) => void;
  selected: Record<OptionalComponent, boolean>;
  visible: boolean;
};

export function ComponentPickerSheet({ onClose, onToggle, selected, visible }: ComponentPickerSheetProps) {
  return (
    <Modal animationType="slide" onRequestClose={onClose} transparent visible={visible}>
      <View style={styles.modal}>
        <Pressable
          accessibilityLabel="Close component picker"
          accessibilityRole="button"
          onPress={onClose}
          style={StyleSheet.absoluteFill}
        />
        <SafeAreaView edges={['bottom']} style={styles.sheet}>
          <Text style={styles.title}>Choose components</Text>
          {options.map((option) => (
            <View key={option.key} style={styles.option}>
              <Text style={styles.label}>{option.label}</Text>
              <Switch value={selected[option.key]} onValueChange={() => onToggle(option.key)} />
            </View>
          ))}
          <Button title="Done" onPress={onClose} />
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    backgroundColor: 'rgba(15, 23, 42, 0.35)',
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    gap: 16,
    padding: 24,
  },
  title: {
    color: '#0f172a',
    fontSize: 20,
    fontWeight: '700',
  },
  option: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    color: '#334155',
    fontSize: 16,
  },
});
