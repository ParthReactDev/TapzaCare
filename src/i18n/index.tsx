import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type SupportedLocale = 'en' | 'te' | 'hi';

const LOCALE_STORAGE_KEY = '@tapza_selected_locale';

export const translations = {
  en: {
    // Navigation Tabs
    tab_home: 'Home',
    tab_bookings: 'Bookings',
    tab_medicines: 'Medicines',
    tab_reminders: 'Reminders',

    // Home Header & Greeting
    greeting_morning: 'Good morning',
    greeting_afternoon: 'Good afternoon',
    greeting_evening: 'Good evening',
    standard_care: 'Standard Care',
    diwali_dhamaka: 'Diwali Dhamaka',
    switch_to_normal: 'Switch to Normal',
    switch_to_diwali: 'Switch to Diwali 🪔',

    // Section Titles
    instant_healthcare: 'Instant Healthcare Actions',
    specialties: 'Explore Medical Specialties',
    verified_specialists: 'Verified Specialists Available Today',
    popular_services: 'Popular Clinic & Diagnostic Services',
    book_slot: 'Book Slot',
    book_plus: 'Book +',
    exp_years: 'years exp',
    fee_label: 'Consultation',

    // Quick Actions
    qa_book: 'Book Doctor',
    qa_rx: 'Prescriptions',
    qa_reminders: 'Dose Alerts',
    qa_family: 'Family Care',

    // Booking Flow
    schedule_appointment: 'Schedule Appointment',
    select_date: '1. Select Date',
    pick_slot: '2. Pick Available Slot',
    total_payable: 'Total Payable',
    instant_confirm: 'Instant Confirm (POST /bookings)',
    booking_confirmed: 'Booking Confirmed! (201 Created)',
    back_to_home: 'Back to Home',
    slot_taken_error: '409 Conflict: This slot was taken by another patient.',

    // Prescriptions & Medicines
    today_schedule: "Today's Medication Schedule",
    doses_taken: 'doses taken today',
    prescribed_medicines: 'Prescribed Medicines Schedule',
    morning_slot: '🌅 Morning (08:30 AM)',
    afternoon_slot: '☀️ Afternoon (01:30 PM)',
    night_slot: '🌙 Night (09:00 PM)',
    mark_taken: 'Mark Taken',
    taken: '✓ Taken',
    dose_recorded: '✓ Dose recorded for today',
    pending_dose: 'Pending dose',
    days_course: 'days course',

    // Offline & Sync
    offline_notice: 'Offline mode: Booking queued. Will sync automatically.',
    sync_now: 'Sync Now',
    synced_success: 'Offline bookings synced successfully!',
  },
  te: {
    // Navigation Tabs
    tab_home: 'హోమ్',
    tab_bookings: 'బుకింగ్స్',
    tab_medicines: 'మందులు',
    tab_reminders: 'గుర్తుంపులు',

    // Home Header & Greeting
    greeting_morning: 'శుభోదయం',
    greeting_afternoon: 'శుభ మధ్యాహ్నం',
    greeting_evening: 'శుభ సాయంత్రం',
    standard_care: 'ప్రామాణిక వైద్యం',
    diwali_dhamaka: 'దీపావళి ధమాకా',
    switch_to_normal: 'సాధారణ విధానం',
    switch_to_diwali: 'దీపావళి విధానం 🪔',

    // Section Titles
    instant_healthcare: 'తక్షణ ఆరోగ్య సేవలు',
    specialties: 'వైద్య విభాగాలు',
    verified_specialists: 'అందుబాటులో ఉన్న నిపుణులు (హైదరాబాద్ & విజయవాడ)',
    popular_services: 'ప్రముఖ క్లినిక్ మరియు రక్త పరీక్షలు',
    book_slot: 'స్లాట్ బుక్ చేయండి',
    book_plus: 'బుక్ +',
    exp_years: 'సంవత్సరాల అనుభవం',
    fee_label: 'ఫీజు',

    // Quick Actions
    qa_book: 'డాక్టర్ బుకింగ్',
    qa_rx: 'ప్రిస్క్రిప్షన్లు',
    qa_reminders: 'డోస్ అలర్ట్',
    qa_family: 'కుటుంబ రక్షణ',

    // Booking Flow
    schedule_appointment: 'అపాయింట్‌మెంట్ షెడ్యూల్',
    select_date: '1. తేదీని ఎంచుకోండి',
    pick_slot: '2. అందుబాటులో ఉన్న సమయం',
    total_payable: 'మొత్తం ఫీజు',
    instant_confirm: 'తక్షణమే నిర్ధారించండి',
    booking_confirmed: 'బుకింగ్ విజయవంతమైంది! (201)',
    back_to_home: 'తిరిగి హోమ్‌కి',
    slot_taken_error: '409 లోపం: ఈ స్లాట్ ఇప్పుడే వేరొకరు తీసుకున్నారు.',

    // Prescriptions & Medicines
    today_schedule: 'నేటి మందుల సమయ పట్టిక',
    doses_taken: 'డోసులు పూర్తయ్యాయి',
    prescribed_medicines: 'సూచించిన మందుల వివరాలు',
    morning_slot: '🌅 ఉదయం (08:30 AM)',
    afternoon_slot: '☀️ మధ్యాహ్నం (01:30 PM)',
    night_slot: '🌙 రాత్రి (09:00 PM)',
    mark_taken: 'వేసుకున్నాను',
    taken: '✓ పూర్తి',
    dose_recorded: '✓ నేటి డోస్ నమోదైంది',
    pending_dose: 'వేసుకోవాల్సి ఉంది',
    days_course: 'రోజుల కోర్సు',

    // Offline & Sync
    offline_notice: 'ఆఫ్‌లైన్ మోడ్: బుకింగ్ వరుసలో ఉంది. నెట్‌వర్క్ రాగానే సింక్ అవుతుంది.',
    sync_now: 'సింక్ చేయండి',
    synced_success: 'ఆఫ్‌లైన్ బుకింగ్‌లు సింక్ అయ్యాయి!',
  },
  hi: {
    // Navigation Tabs
    tab_home: 'होम',
    tab_bookings: 'बुकिंग्स',
    tab_medicines: 'दवाइयां',
    tab_reminders: 'रिमाइंडर',

    // Home Header & Greeting
    greeting_morning: 'शुभ प्रभात',
    greeting_afternoon: 'शुभ दोपहर',
    greeting_evening: 'शुभ संध्या',
    standard_care: 'मानक स्वास्थ्य सेवा',
    diwali_dhamaka: 'दिवाली धमाका',
    switch_to_normal: 'सामान्य मोड',
    switch_to_diwali: 'दिवाली मोड 🪔',

    // Section Titles
    instant_healthcare: 'त्वरित स्वास्थ्य सेवाएं',
    specialties: 'चिकित्सा विभाग',
    verified_specialists: 'आज उपलब्ध विशेषज्ञ डॉक्टर',
    popular_services: 'लोकप्रिय जांच एवं सेवाएं',
    book_slot: 'अपॉइंटमेंट लें',
    book_plus: 'बुक +',
    exp_years: 'वर्षों का अनुभव',
    fee_label: 'परामर्श शुल्क',

    // Quick Actions
    qa_book: 'डॉक्टर बुक करें',
    qa_rx: 'पर्चे (Rx)',
    qa_reminders: 'खुराक अलर्ट',
    qa_family: 'परिवार की देखभाल',

    // Booking Flow
    schedule_appointment: 'अपॉइंटमेंट तय करें',
    select_date: '1. तारीख चुनें',
    pick_slot: '2. उपलब्ध स्लॉट चुनें',
    total_payable: 'कुल देय राशि',
    instant_confirm: 'तुरंत पुष्टि करें',
    booking_confirmed: 'बुकिंग कन्फर्म हो गई! (201)',
    back_to_home: 'होम पर वापस जाएं',
    slot_taken_error: '409 त्रुटि: यह स्लॉट पहले ही किसी अन्य मरीज द्वारा बुक किया जा चुका है।',

    // Prescriptions & Medicines
    today_schedule: 'आज की दवाइयों का समय',
    doses_taken: 'खुराक ली जा चुकी हैं',
    prescribed_medicines: 'निर्धारित दवाइयां',
    morning_slot: '🌅 सुबह (08:30 AM)',
    afternoon_slot: '☀️ दोपहर (01:30 PM)',
    night_slot: '🌙 रात (09:00 PM)',
    mark_taken: 'दवा ले ली',
    taken: '✓ ली गई',
    dose_recorded: '✓ खुराक दर्ज कर ली गई',
    pending_dose: 'लेना बाकी है',
    days_course: 'दिनों का कोर्स',

    // Offline & Sync
    offline_notice: 'ऑफ़लाइन मोड: बुकिंग कतार में है। इंटरनेट आने पर सिंक होगी।',
    sync_now: 'सिंक करें',
    synced_success: 'ऑफ़लाइन बुकिंग सफलतापूर्वक सिंक हो गई!',
  },
};

export type TranslationKey = keyof typeof translations.en;

interface I18nContextType {
  locale: SupportedLocale;
  setLocale: (loc: SupportedLocale) => Promise<void>;
  t: (key: TranslationKey) => string;
}

const I18nContext = createContext<I18nContextType>({
  locale: 'en',
  setLocale: async () => {},
  t: (key) => translations.en[key] || key,
});

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<SupportedLocale>('en');

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(LOCALE_STORAGE_KEY);
        if (saved && (saved === 'en' || saved === 'te' || saved === 'hi')) {
          setLocaleState(saved as SupportedLocale);
        }
      } catch {
        // ignore
      }
    })();
  }, []);

  const setLocale = async (newLocale: SupportedLocale) => {
    setLocaleState(newLocale);
    await AsyncStorage.setItem(LOCALE_STORAGE_KEY, newLocale);
  };

  const t = (key: TranslationKey): string => {
    const dict = translations[locale] || translations.en;
    return (dict as any)[key] || translations.en[key] || key;
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useTranslation = () => useContext(I18nContext);
