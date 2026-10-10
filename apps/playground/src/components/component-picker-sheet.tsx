import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
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
  const [isMounted, setIsMounted] = useState(visible);
  const backdropOpacity = useRef(new Animated.Value(visible ? 1 : 0)).current;
  const sheetOffset = useRef(new Animated.Value(visible ? 0 : 16)).current;

  useEffect(() => {
    if (visible) {
      setIsMounted(true);
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          duration: 100,
          easing: Easing.out(Easing.cubic),
          toValue: 1,
          useNativeDriver: true,
        }),
        Animated.timing(sheetOffset, {
          duration: 210,
          easing: Easing.out(Easing.cubic),
          toValue: 0,
          useNativeDriver: true,
        }),
      ]).start();
      return;
    }

    Animated.parallel([
      Animated.timing(backdropOpacity, {
        duration: 80,
        easing: Easing.out(Easing.cubic),
        toValue: 0,
        useNativeDriver: true,
      }),
      Animated.timing(sheetOffset, {
        duration: 140,
        easing: Easing.out(Easing.cubic),
        toValue: 16,
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) setIsMounted(false);
    });
  }, [backdropOpacity, sheetOffset, visible]);

  return (
    <Modal animationType="none" onRequestClose={onClose} transparent visible={isMounted}>
      <View style={styles.modal}>
        <Animated.View pointerEvents="none" style={[styles.backdrop, { opacity: backdropOpacity }]} />
        <Pressable
          accessibilityLabel="Close component picker"
          accessibilityRole="button"
          onPress={onClose}
          style={StyleSheet.absoluteFill}
        />
        <Animated.View style={{ transform: [{ translateY: sheetOffset }] }}>
          <SafeAreaView edges={['bottom']} style={styles.sheet}>
          <View style={styles.handle} />
          <Text style={styles.title}>Choose components</Text>
          <Text style={styles.subtitle}>Included components appear in the generated PDF.</Text>
          <View style={styles.options}>
          {options.map((option, index) => (
            <Pressable
              accessibilityRole="checkbox"
              accessibilityState={{ checked: selected[option.key] }}
              key={option.key}
              onPress={() => onToggle(option.key)}
              style={[styles.option, index < options.length - 1 ? styles.optionBorder : null]}
            >
              <Text style={styles.label}>{option.label}</Text>
              <View style={[styles.check, selected[option.key] ? styles.checkSelected : null]}>
                {selected[option.key] ? <Text style={styles.checkmark}>✓</Text> : null}
              </View>
            </Pressable>
          ))}
          </View>
          <Pressable
            accessibilityRole="button"
            onPress={onClose}
            style={({ pressed }) => [styles.done, pressed ? styles.pressed : null]}
          >
            <Text style={styles.doneLabel}>Done</Text>
          </Pressable>
          </SafeAreaView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.22)',
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  sheet: {
    backgroundColor: '#f2f2f7',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    gap: 12,
    padding: 16,
  },
  handle: {
    alignSelf: 'center',
    backgroundColor: '#c7c7cc',
    borderRadius: 3,
    height: 5,
    marginBottom: 4,
    width: 36,
  },
  title: {
    color: '#1c1c1e',
    fontSize: 22,
    fontWeight: '700',
  },
  subtitle: {
    color: '#6c6c70',
    fontSize: 15,
    lineHeight: 20,
    marginBottom: 4,
  },
  options: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    overflow: 'hidden',
  },
  option: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 52,
    paddingHorizontal: 16,
  },
  optionBorder: {
    borderBottomColor: '#e5e5ea',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  label: {
    color: '#1c1c1e',
    fontSize: 17,
  },
  check: {
    alignItems: 'center',
    borderColor: '#c7c7cc',
    borderRadius: 10,
    borderWidth: 1.5,
    height: 20,
    justifyContent: 'center',
    width: 20,
  },
  checkSelected: {
    backgroundColor: '#007aff',
    borderColor: '#007aff',
  },
  checkmark: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 16,
  },
  done: {
    alignItems: 'center',
    backgroundColor: '#007aff',
    borderRadius: 14,
    justifyContent: 'center',
    minHeight: 50,
    marginTop: 4,
  },
  doneLabel: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.96 }],
  },
});
