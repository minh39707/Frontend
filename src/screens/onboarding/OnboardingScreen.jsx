import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Redirect, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Text } from '@/components/ui/Text';
import { colors } from '@/constants/colors';
import { fonts, radii, shadows, spacing } from '@/constants/theme';
import AuthPrimaryButton from '@/src/components/auth/AuthPrimaryButton';
import ReminderTimePickerModal from '@/src/components/onboarding/ReminderTimePickerModal';
import { useAuth } from '@/src/store/AuthContext';
import { fadeInDown } from '@/src/utils/reanimated';

const TOTAL_STEPS = 5;
const CUSTOM_HABIT_ID = 'custom-habit';
const DEFAULT_REMINDER_TIME = {
  hour: 7,
  minute: 0,
  period: 'AM',
};

const lifeAreas = [
  {
    id: 'health',
    title: 'Health & Fitness',
    description: 'Boost your energy, movement, and daily wellness.',
    icon: 'fitness-outline',
  },
  {
    id: 'mind',
    title: 'Mind & Mood',
    description: 'Create calmer thoughts and more grounded days.',
    icon: 'flower-outline',
  },
  {
    id: 'focus',
    title: 'Focus & Study',
    description: 'Build routines that make deep work easier to reach.',
    icon: 'flash-outline',
  },
  {
    id: 'sleep',
    title: 'Sleep & Recovery',
    description: 'Support better rest and healthier evening rituals.',
    icon: 'moon-outline',
  },
  {
    id: 'nutrition',
    title: 'Nutrition',
    description: 'Make simple food choices easier to repeat every day.',
    icon: 'nutrition-outline',
  },
  {
    id: 'relationships',
    title: 'Relationships',
    description: 'Stay more intentional with people who matter most.',
    icon: 'people-outline',
  },
];

const habitPrinciples = [
  {
    id: 'tiny',
    title: 'Start tiny',
    description: 'Small actions are easier to repeat and build momentum.',
    icon: 'sparkles-outline',
  },
  {
    id: 'consistent',
    title: 'Be consistent',
    description: 'Doing it regularly matters more than doing it perfectly.',
    icon: 'repeat-outline',
  },
  {
    id: 'patient',
    title: 'Be patient',
    description: 'Real habit change takes time. Keep going gently.',
    icon: 'leaf-outline',
  },
];

const habitLibrary = {
  health: [
    {
      id: 'drink-water',
      title: 'Drink water',
      description: 'A simple reset habit that fits into any routine.',
      icon: 'water-outline',
    },
    {
      id: 'stretch',
      title: 'Stretch for 5 minutes',
      description: 'Loosen up your body and ease into movement.',
      icon: 'body-outline',
    },
    {
      id: 'walk',
      title: 'Take a short walk',
      description: 'Create a low-pressure movement habit you can keep.',
      icon: 'walk-outline',
    },
  ],
  mind: [
    {
      id: 'breathe',
      title: 'Take 3 deep breaths',
      description: 'A quick reset when the day feels full or noisy.',
      icon: 'cloud-outline',
    },
    {
      id: 'journal',
      title: 'Write one line of gratitude',
      description: 'End the day with a softer, steadier mindset.',
      icon: 'create-outline',
    },
    {
      id: 'meditate',
      title: 'Meditate for 5 minutes',
      description: 'Build a calm anchor into your routine.',
      icon: 'leaf-outline',
    },
  ],
  focus: [
    {
      id: 'plan-day',
      title: 'Plan your top 1 task',
      description: 'Give each day one clear target before the noise starts.',
      icon: 'checkmark-done-outline',
    },
    {
      id: 'focus-block',
      title: 'Start a 15-minute focus block',
      description: 'Make deep work feel lighter and easier to enter.',
      icon: 'timer-outline',
    },
    {
      id: 'desk-reset',
      title: 'Reset your desk',
      description: 'Use a tidy space as a cue for focused work.',
      icon: 'desktop-outline',
    },
  ],
  sleep: [
    {
      id: 'lights-low',
      title: 'Dim the lights early',
      description: 'Create a visual cue that bedtime is getting close.',
      icon: 'moon-outline',
    },
    {
      id: 'phone-away',
      title: 'Put your phone away',
      description: 'Protect your evening from endless scrolling.',
      icon: 'phone-portrait-outline',
    },
    {
      id: 'sleep-tea',
      title: 'Make a calming tea',
      description: 'Pair your wind-down with one soothing ritual.',
      icon: 'cafe-outline',
    },
  ],
  nutrition: [
    {
      id: 'fruit',
      title: 'Eat one fruit',
      description: 'An easy nutrition win you can stack onto any meal.',
      icon: 'nutrition-outline',
    },
    {
      id: 'healthy-breakfast',
      title: 'Prep tomorrow breakfast',
      description: 'Make the next good choice easier to take.',
      icon: 'restaurant-outline',
    },
    {
      id: 'protein',
      title: 'Add protein to one meal',
      description: 'A small tweak that supports steadier energy.',
      icon: 'egg-outline',
    },
  ],
  relationships: [
    {
      id: 'message',
      title: 'Send one thoughtful message',
      description: 'Keep closeness alive with a tiny act of care.',
      icon: 'chatbubble-ellipses-outline',
    },
    {
      id: 'check-in',
      title: 'Do a daily check-in',
      description: 'Make space for one meaningful conversation.',
      icon: 'heart-outline',
    },
    {
      id: 'gratitude-share',
      title: 'Share one appreciation',
      description: 'Turn gratitude into something someone can feel.',
      icon: 'sunny-outline',
    },
  ],
};

const timeOptions = [
  {
    id: 'morning',
    title: 'Morning',
    description: 'Start your day with a calm, easy win.',
    icon: 'sunny-outline',
  },
  {
    id: 'afternoon',
    title: 'Afternoon',
    description: 'Place the habit where your day naturally opens up.',
    icon: 'partly-sunny-outline',
  },
  {
    id: 'evening',
    title: 'Evening',
    description: 'Wind down with a simple habit before bed.',
    icon: 'moon-outline',
  },
];

const frequencyOptions = [
  {
    id: 'everyday',
    title: 'Everyday',
    description: 'A daily rhythm helps habits stick faster.',
    icon: 'calendar-outline',
  },
  {
    id: 'weekdays',
    title: 'Weekdays',
    description: 'Best for work and school routines.',
    icon: 'briefcase-outline',
  },
  {
    id: 'specific-days',
    title: 'Choose specific days',
    description: 'Pick a lighter schedule that still feels realistic.',
    icon: 'options-outline',
  },
];

function IntroIllustration() {
  return (
    <View style={styles.heroShell}>
      <LinearGradient colors={['#FFFFFF', '#F8FBFF']} style={styles.heroCard}>
        <View style={styles.heroDots}>
          <View style={[styles.heroDot, { backgroundColor: '#2389FF' }]} />
          <View style={[styles.heroDot, { backgroundColor: '#63E598' }]} />
          <View style={[styles.heroDot, { backgroundColor: '#F7DE57' }]} />
        </View>

        <View style={styles.heroLineLong} />
        <View style={styles.heroLineShort} />

        <View style={styles.heroBadge}>
          <Ionicons color={colors.primary} name="checkmark" size={14} />
          <Text style={styles.heroBadgeText} variant="label">
            Gentle progress
          </Text>
        </View>
      </LinearGradient>

      <View pointerEvents="none" style={styles.heroGlow} />
    </View>
  );
}

function ProgressHeader({ onBack, step }) {
  return (
    <View style={styles.progressHeader}>
      <Pressable
        accessibilityRole="button"
        onPress={onBack}
        style={({ pressed }) => [styles.progressBack, pressed && styles.progressBackPressed]}
      >
        {step > 1 ? <Ionicons color={colors.text} name="chevron-back" size={18} /> : null}
      </Pressable>

      <View style={styles.progressContent}>
        <Text style={styles.progressText} variant="caption">
          Step {step} of {TOTAL_STEPS}
        </Text>
        <View style={styles.progressTrack}>
          <LinearGradient
            colors={['#2F7BFF', '#1764F2']}
            end={{ x: 1, y: 0 }}
            start={{ x: 0, y: 0 }}
            style={[styles.progressFill, { width: `${(step / TOTAL_STEPS) * 100}%` }]}
          />
        </View>
      </View>
    </View>
  );
}

function OptionCard({ description, icon, onPress, selected, title }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.optionCard,
        selected && styles.optionCardSelected,
        pressed && styles.optionCardPressed,
      ]}
    >
      <View style={[styles.optionIconWrap, selected && styles.optionIconWrapSelected]}>
        <Ionicons color={selected ? colors.primary : '#A1B4D6'} name={icon} size={20} />
      </View>

      <View style={styles.optionTextBlock}>
        <Text style={styles.optionTitle}>{title}</Text>
        <Text style={styles.optionDescription} variant="caption">
          {description}
        </Text>
      </View>

      <View style={[styles.selectionDot, selected && styles.selectionDotActive]}>
        {selected ? <View style={styles.selectionDotInner} /> : null}
      </View>
    </Pressable>
  );
}

function SectionLabel({ children }) {
  return (
    <Text style={styles.sectionLabel} variant="subtitle">
      {children}
    </Text>
  );
}

function SummaryRow({ icon, label, value }) {
  return (
    <View style={styles.summaryRow}>
      <View style={styles.summaryIcon}>
        <Ionicons color={colors.primary} name={icon} size={16} />
      </View>
      <View style={styles.summaryTextBlock}>
        <Text style={styles.summaryLabel} variant="caption">
          {label}
        </Text>
        <Text style={styles.summaryValue}>{value}</Text>
      </View>
    </View>
  );
}

function formatReminderTime(hour, minute, period) {
  return `${hour}:${`${minute}`.padStart(2, '0')} ${period}`;
}

function parseReminderTime(value) {
  const match = value.match(/^(\d{1,2}):(\d{2})\s(AM|PM)$/);

  if (!match) {
    return DEFAULT_REMINDER_TIME;
  }

  return {
    hour: Number(match[1]),
    minute: Number(match[2]),
    period: match[3],
  };
}

export default function OnboardingScreen() {
  const router = useRouter();
  const { completeOnboarding, isAuthenticated } = useAuth();
  const [step, setStep] = useState(0);
  const [selectedArea, setSelectedArea] = useState(null);
  const [selectedPrinciple, setSelectedPrinciple] = useState(null);
  const [selectedHabit, setSelectedHabit] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedFrequency, setSelectedFrequency] = useState(null);
  const [openTimePicker, setOpenTimePicker] = useState(false);
  const [selectedHour, setSelectedHour] = useState(DEFAULT_REMINDER_TIME.hour);
  const [selectedMinute, setSelectedMinute] = useState(DEFAULT_REMINDER_TIME.minute);
  const [selectedPeriod, setSelectedPeriod] = useState(DEFAULT_REMINDER_TIME.period);
  const [confirmedTime, setConfirmedTime] = useState(
    formatReminderTime(DEFAULT_REMINDER_TIME.hour, DEFAULT_REMINDER_TIME.minute, DEFAULT_REMINDER_TIME.period)
  );

  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  const habitsForArea = selectedArea ? habitLibrary[selectedArea] ?? habitLibrary.health : habitLibrary.health;
  const selectedAreaOption = lifeAreas.find((item) => item.id === selectedArea);
  const selectedPrincipleOption = habitPrinciples.find((item) => item.id === selectedPrinciple);
  const selectedTimeOption = timeOptions.find((item) => item.id === selectedTime);
  const selectedFrequencyOption = frequencyOptions.find((item) => item.id === selectedFrequency);
  const selectedHabitOption =
    selectedHabit === CUSTOM_HABIT_ID
      ? {
          title: 'Create my own habit',
          description: 'I want to design a habit after I create my account.',
        }
      : habitsForArea.find((item) => item.id === selectedHabit);
  const canContinue =
    step === 0 ||
    (step === 1 && Boolean(selectedArea)) ||
    (step === 2 && Boolean(selectedPrinciple)) ||
    (step === 3 && Boolean(selectedHabit)) ||
    (step === 4 && Boolean(selectedTime) && Boolean(selectedFrequency)) ||
    step === 5;

  const primaryLabel =
    step === 0
      ? "Let's Begin"
      : step === 2
        ? "I'm ready"
        : step === 3
          ? 'Continue with this habit'
          : step === 4
            ? 'Set My First Habit'
            : step === 5
              ? 'Create My Account'
              : 'Continue';

  const handleOpenSignIn = () => {
    completeOnboarding();
    router.replace('/sign-in');
  };

  const handleOpenSignUp = () => {
    completeOnboarding();
    router.replace('/sign-up');
  };

  const handleContinue = () => {
    if (!canContinue) {
      return;
    }

    if (step === 5) {
      handleOpenSignUp();
      return;
    }

    setStep((current) => current + 1);
  };

  const handleBack = () => {
    setStep((current) => Math.max(current - 1, 0));
  };

  const handleSelectArea = (areaId) => {
    const nextHabits = habitLibrary[areaId] ?? habitLibrary.health;

    setSelectedArea(areaId);

    if (selectedHabit === CUSTOM_HABIT_ID) {
      return;
    }

    if (!nextHabits.some((habit) => habit.id === selectedHabit)) {
      setSelectedHabit(null);
    }
  };

  const handleChooseCustomHabit = () => {
    setSelectedHabit(CUSTOM_HABIT_ID);
    setStep(4);
  };

  const handleOpenTimePicker = () => {
    const parsed = parseReminderTime(confirmedTime);

    setSelectedHour(parsed.hour);
    setSelectedMinute(parsed.minute);
    setSelectedPeriod(parsed.period);
    setOpenTimePicker(true);
  };

  const handleCloseTimePicker = () => {
    setOpenTimePicker(false);
  };

  const handleConfirmTimePicker = () => {
    setConfirmedTime(formatReminderTime(selectedHour, selectedMinute, selectedPeriod));
    setOpenTimePicker(false);
  };

  if (step === 0) {
    return (
      <SafeAreaView edges={['top', 'bottom']} style={styles.screen}>
        <LinearGradient colors={['#F7FAFF', '#EEF4FF']} style={styles.backgroundGradient} />
        <View pointerEvents="none" style={styles.backgroundGlowTop} />
        <View pointerEvents="none" style={styles.backgroundGlowBottom} />

        <View style={styles.introContainer}>
          <Animated.View entering={fadeInDown(380)} style={styles.introBody}>
            <IntroIllustration />

            <View style={styles.introCopy}>
              <Text style={styles.introTitle}>Build better habits, one small step at a time</Text>
              <Text style={styles.introDescription} variant="body">
                Create routines that fit your life and stay consistent with gentle reminders.
              </Text>
            </View>
          </Animated.View>

          <Animated.View entering={fadeInDown(440, 60)} style={styles.footer}>
            <AuthPrimaryButton disabled={!canContinue} label={primaryLabel} onPress={handleContinue} />
            <Pressable
              onPress={handleOpenSignIn}
              style={({ pressed }) => [styles.linkButton, pressed && styles.linkButtonPressed]}
            >
              <Text style={styles.footerLink}>Log in if you have account</Text>
            </Pressable>
          </Animated.View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.screen}>
      <LinearGradient colors={['#F7FAFF', '#EEF4FF']} style={styles.backgroundGradient} />
      <View pointerEvents="none" style={styles.backgroundGlowTop} />
      <View pointerEvents="none" style={styles.backgroundGlowBottom} />

      <View style={styles.stepContainer}>
        <ProgressHeader onBack={handleBack} step={step} />

        <ScrollView contentContainerStyle={styles.stepScrollContent} showsVerticalScrollIndicator={false}>
          <Animated.View entering={fadeInDown(320)} key={step} style={styles.stepContent}>
            {step === 1 ? (
              <>
                <View style={styles.stepHeaderBlock}>
                  <Text style={styles.stepTitle}>Which area of life would you like to improve first</Text>
                  <Text style={styles.stepDescription} variant="body">
                    Pick the area you want to support first. You can always change this later.
                  </Text>
                </View>

                <View style={styles.optionList}>
                  {lifeAreas.map((item) => (
                    <OptionCard
                      description={item.description}
                      icon={item.icon}
                      key={item.id}
                      onPress={() => handleSelectArea(item.id)}
                      selected={selectedArea === item.id}
                      title={item.title}
                    />
                  ))}
                </View>
              </>
            ) : null}

            {step === 2 ? (
              <>
                <View style={styles.stepHeaderBlock}>
                  <Text style={styles.stepTitle}>Strong habits start simple</Text>
                  <Text style={styles.stepDescription} variant="body">
                    A few small principles make new habits feel lighter and easier to repeat.
                  </Text>
                </View>

                <View style={styles.optionList}>
                  {habitPrinciples.map((item) => (
                    <OptionCard
                      description={item.description}
                      icon={item.icon}
                      key={item.id}
                      onPress={() => setSelectedPrinciple(item.id)}
                      selected={selectedPrinciple === item.id}
                      title={item.title}
                    />
                  ))}
                </View>
              </>
            ) : null}

            {step === 3 ? (
              <>
                <View style={styles.stepHeaderBlock}>
                  <Text style={styles.stepTitle}>Choose your first habit</Text>
                  <Text style={styles.stepDescription} variant="body">
                    Pick a small win you would genuinely like to repeat this week.
                  </Text>
                </View>

                <View style={styles.optionList}>
                  {habitsForArea.map((item) => (
                    <OptionCard
                      description={item.description}
                      icon={item.icon}
                      key={item.id}
                      onPress={() => setSelectedHabit(item.id)}
                      selected={selectedHabit === item.id}
                      title={item.title}
                    />
                  ))}
                </View>

                <Pressable
                  onPress={handleChooseCustomHabit}
                  style={({ pressed }) => [styles.inlineLinkButton, pressed && styles.linkButtonPressed]}
                >
                  <Text style={styles.inlineLinkText}>Create your own habit</Text>
                </Pressable>
              </>
            ) : null}

            {step === 4 ? (
              <>
                <View style={styles.stepHeaderBlock}>
                  <Text style={styles.stepTitle}>Let&apos;s make it fit your day</Text>
                  <Text style={styles.stepDescription} variant="body">
                    Choose a time and rhythm that feels realistic, calm, and easy to keep.
                  </Text>
                </View>

                <View style={styles.previewCard}>
                  <Text style={styles.previewLabel} variant="caption">
                    Your first habit
                  </Text>
                  <Text style={styles.previewValue}>{selectedHabitOption?.title ?? 'Your habit'}</Text>
                </View>

                <SectionLabel>Time</SectionLabel>
                <View style={styles.optionList}>
                  {timeOptions.map((item) => (
                    <OptionCard
                      description={item.description}
                      icon={item.icon}
                      key={item.id}
                      onPress={() => setSelectedTime(item.id)}
                      selected={selectedTime === item.id}
                      title={item.title}
                    />
                  ))}
                </View>

                <View style={styles.reminderCard}>
                  <View style={styles.reminderHeader}>
                    <Text style={styles.reminderLabel} variant="body">
                      Exact reminder time
                    </Text>

                    <Pressable
                      onPress={handleOpenTimePicker}
                      style={({ pressed }) => [styles.changeTimeButton, pressed && styles.changeTimeButtonPressed]}
                    >
                      <Text style={styles.changeTimeButtonText} variant="label">
                        Change time
                      </Text>
                    </Pressable>
                  </View>

                  <Text style={styles.reminderValueText}>{confirmedTime}</Text>
                </View>

                <SectionLabel>Frequency</SectionLabel>
                <View style={styles.optionList}>
                  {frequencyOptions.map((item) => (
                    <OptionCard
                      description={item.description}
                      icon={item.icon}
                      key={item.id}
                      onPress={() => setSelectedFrequency(item.id)}
                      selected={selectedFrequency === item.id}
                      title={item.title}
                    />
                  ))}
                </View>
              </>
            ) : null}

            {step === 5 ? (
              <>
                <View style={styles.stepHeaderBlock}>
                  <Text style={styles.stepTitle}>You&apos;re ready to begin</Text>
                  <Text style={styles.stepDescription} variant="body">
                    We&apos;ve shaped a gentle starting point. Create your account to save it and open your dashboard.
                  </Text>
                </View>

                <LinearGradient colors={['#FFFFFF', '#F8FBFF']} style={styles.summaryCard}>
                  <View style={styles.summaryBadge}>
                    <Ionicons color="#FFFFFF" name="sparkles-outline" size={18} />
                  </View>

                  <View style={styles.summaryHeading}>
                    <Text style={styles.summaryTitle}>Your first habit path</Text>
                    <Text style={styles.summarySubtitle} variant="body">
                      A simple plan built from the choices you just made.
                    </Text>
                  </View>

                  <View style={styles.summaryList}>
                    <SummaryRow
                      icon="compass-outline"
                      label="Focus area"
                      value={selectedAreaOption?.title ?? 'Health & Fitness'}
                    />
                    <SummaryRow
                      icon="sparkles-outline"
                      label="Approach"
                      value={selectedPrincipleOption?.title ?? 'Start tiny'}
                    />
                    <SummaryRow
                      icon="checkmark-circle-outline"
                      label="Habit"
                      value={selectedHabitOption?.title ?? 'Drink water'}
                    />
                    <SummaryRow
                      icon="time-outline"
                      label="Schedule"
                      value={`${selectedTimeOption?.title ?? 'Morning'} - ${selectedFrequencyOption?.title ?? 'Everyday'}`}
                    />
                    <SummaryRow icon="alarm-outline" label="Reminder" value={confirmedTime} />
                  </View>
                </LinearGradient>
              </>
            ) : null}
          </Animated.View>
        </ScrollView>

        <View style={styles.footer}>
          <AuthPrimaryButton disabled={!canContinue} label={primaryLabel} onPress={handleContinue} />

          {step === 5 ? (
            <Pressable
              onPress={handleOpenSignIn}
              style={({ pressed }) => [styles.linkButton, pressed && styles.linkButtonPressed]}
            >
              <Text style={styles.footerLink}>I already have an account</Text>
            </Pressable>
          ) : null}
        </View>
      </View>

      <ReminderTimePickerModal
        onCancel={handleCloseTimePicker}
        onConfirm={handleConfirmTimePicker}
        onHourChange={setSelectedHour}
        onMinuteChange={setSelectedMinute}
        onPeriodChange={setSelectedPeriod}
        selectedHour={selectedHour}
        selectedMinute={selectedMinute}
        selectedPeriod={selectedPeriod}
        visible={openTimePicker}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#EEF4FF',
  },
  backgroundGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  backgroundGlowTop: {
    position: 'absolute',
    top: -80,
    right: -10,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  backgroundGlowBottom: {
    position: 'absolute',
    bottom: -100,
    left: -30,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: 'rgba(219,232,255,0.8)',
  },
  introContainer: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
    justifyContent: 'space-between',
  },
  introBody: {
    gap: 28,
  },
  heroShell: {
    alignItems: 'center',
    paddingTop: 24,
    paddingHorizontal: 12,
  },
  heroCard: {
    width: '100%',
    minHeight: 184,
    borderRadius: 28,
    paddingHorizontal: 18,
    paddingVertical: 20,
    borderWidth: 1,
    borderColor: '#ECF3FF',
    gap: 14,
    justifyContent: 'center',
    ...shadows.card,
  },
  heroGlow: {
    position: 'absolute',
    bottom: -18,
    width: '76%',
    height: 36,
    borderRadius: radii.pill,
    backgroundColor: 'rgba(61, 90, 254, 0.08)',
    zIndex: -1,
  },
  heroDots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  heroDot: {
    width: 9,
    height: 9,
    borderRadius: 999,
  },
  heroLineLong: {
    width: '100%',
    height: 14,
    borderRadius: radii.pill,
    backgroundColor: '#EBF2FC',
  },
  heroLineShort: {
    width: '60%',
    height: 14,
    borderRadius: radii.pill,
    backgroundColor: '#EBF2FC',
  },
  heroBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: radii.pill,
    backgroundColor: '#EEF4FF',
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  heroBadgeText: {
    color: colors.primary,
    fontWeight: '700',
  },
  introCopy: {
    gap: spacing.sm,
    paddingHorizontal: 2,
  },
  introTitle: {
    fontSize: 40,
    lineHeight: 46,
    color: colors.text,
    fontFamily: fonts?.display,
    fontWeight: '800',
    letterSpacing: -0.8,
  },
  introDescription: {
    color: '#4B5563',
    fontSize: 18,
    lineHeight: 26,
    maxWidth: 320,
  },
  stepContainer: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  progressBack: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E6EEFB',
  },
  progressBackPressed: {
    transform: [{ scale: 0.97 }],
  },
  progressContent: {
    flex: 1,
    gap: 8,
  },
  progressText: {
    color: '#A7B1C6',
    textAlign: 'right',
    fontSize: 11,
    lineHeight: 14,
  },
  progressTrack: {
    width: '100%',
    height: 6,
    borderRadius: radii.pill,
    backgroundColor: '#DCE8FF',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: radii.pill,
  },
  stepScrollContent: {
    paddingBottom: spacing.lg,
  },
  stepContent: {
    gap: spacing.lg,
  },
  stepHeaderBlock: {
    gap: spacing.xs,
    paddingRight: 8,
  },
  stepTitle: {
    fontSize: 34,
    lineHeight: 38,
    color: colors.text,
    fontFamily: fonts?.display,
    fontWeight: '800',
    letterSpacing: -0.7,
  },
  stepDescription: {
    color: '#9AA4B7',
    fontSize: 15,
    lineHeight: 22,
  },
  optionList: {
    gap: spacing.sm,
  },
  optionCard: {
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E6EEFB',
    paddingHorizontal: 14,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    ...shadows.soft,
  },
  optionCardSelected: {
    borderColor: '#8EB2FF',
    backgroundColor: '#F7FAFF',
  },
  optionCardPressed: {
    transform: [{ scale: 0.992 }],
  },
  optionIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#EEF4FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionIconWrapSelected: {
    backgroundColor: '#E0ECFF',
  },
  optionTextBlock: {
    flex: 1,
    gap: 4,
  },
  optionTitle: {
    fontSize: 18,
    lineHeight: 22,
    color: colors.text,
    fontFamily: fonts?.display,
    fontWeight: '800',
  },
  optionDescription: {
    color: '#98A3B8',
    fontSize: 12,
    lineHeight: 18,
  },
  selectionDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: '#D5E4FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectionDotActive: {
    borderColor: colors.primary,
    backgroundColor: '#EEF4FF',
  },
  selectionDotInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  previewCard: {
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E6EEFB',
    paddingHorizontal: 18,
    paddingVertical: 14,
    gap: 4,
    ...shadows.soft,
  },
  previewLabel: {
    color: '#A2AEC0',
    fontSize: 11,
    lineHeight: 14,
  },
  previewValue: {
    color: colors.text,
    fontSize: 17,
    lineHeight: 20,
    fontFamily: fonts?.display,
    fontWeight: '800',
  },
  sectionLabel: {
    color: colors.text,
    fontSize: 24,
    lineHeight: 28,
    fontFamily: fonts?.display,
    fontWeight: '800',
  },
  reminderCard: {
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E6EEFB',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 8,
    ...shadows.soft,
  },
  reminderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  reminderLabel: {
    color: colors.text,
    fontWeight: '700',
  },
  changeTimeButton: {
    borderRadius: radii.pill,
    backgroundColor: '#E8F1FF',
    borderWidth: 1,
    borderColor: '#BFD5FF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    ...shadows.soft,
  },
  changeTimeButtonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  changeTimeButtonText: {
    color: colors.primary,
    fontWeight: '700',
  },
  reminderValueText: {
    color: colors.text,
    fontSize: 22,
    lineHeight: 26,
    fontFamily: fonts?.display,
    fontWeight: '800',
  },
  inlineLinkButton: {
    alignSelf: 'center',
    paddingVertical: 4,
  },
  inlineLinkText: {
    color: colors.primary,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '700',
  },
  footer: {
    gap: spacing.sm,
    paddingTop: spacing.xs,
  },
  linkButton: {
    alignSelf: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
  },
  linkButtonPressed: {
    opacity: 0.7,
  },
  footerLink: {
    color: colors.primary,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '700',
  },
  summaryCard: {
    borderRadius: 28,
    paddingHorizontal: 20,
    paddingVertical: 22,
    gap: 18,
    borderWidth: 1,
    borderColor: '#EAF1FF',
    ...shadows.card,
  },
  summaryBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryHeading: {
    gap: 6,
  },
  summaryTitle: {
    color: colors.text,
    fontSize: 28,
    lineHeight: 32,
    fontFamily: fonts?.display,
    fontWeight: '800',
  },
  summarySubtitle: {
    color: '#6B7280',
  },
  summaryList: {
    gap: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 20,
    backgroundColor: '#F7FAFF',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  summaryIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#E9F1FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryTextBlock: {
    flex: 1,
    gap: 3,
  },
  summaryLabel: {
    color: '#94A3B8',
    fontSize: 11,
    lineHeight: 14,
    textTransform: 'uppercase',
  },
  summaryValue: {
    color: colors.text,
    fontSize: 16,
    lineHeight: 20,
    fontFamily: fonts?.display,
    fontWeight: '800',
  },
});
