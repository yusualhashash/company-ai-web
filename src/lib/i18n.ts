
export type Language = "en" | "ar";

export const translations = {
  en: {
    // Header
    language: "English",
    signIn: "Sign in",

    // Sidebar
    newConversation: "New conversation",
    searchConversations: "Search conversations",
    searchPlaceholder: "Search conversations...",
    searchResults: "SEARCH RESULTS",
    yourConversations: "YOUR CONVERSATIONS",
    noMatchingConversations: "No matching conversations found.",
    noConversations: "No conversations yet",
    checkingAccount: "Checking your account...",
    signInToSave: "Sign in to save and view your conversations.",
    closeSidebar: "Close sidebar",
    openSidebar: "Open sidebar",
    clearSearch: "Clear search",
    deleteConversation: "Delete conversation",
    openConversation: "Open conversation",

    // User profile
    guestUser: "Guest User",
    authenticatedUser: "Authenticated user",
    publicAccess: "Public access",
    signOut: "Sign out",

    // Welcome screen
    welcomeTitle: "How can I help you today?",
    welcomeDescription:
      "Ask me about our company, services, projects, or anything you would like to know.",
    companyServices: "Company services",
    companyServicesDescription:
      "What services does our company provide?",
    technicalSolutions: "Technical solutions",
    technicalSolutionsDescription:
      "What technologies does our company use?",
    getAssistance: "Get assistance",
    getAssistanceDescription:
      "How can your team help my business?",

    // Composer
    messagePlaceholder: "Ask anything about your company...",
    attachmentsComingSoon: "Attachments coming soon",
    companyKnowledge: "Company knowledge",
    sendMessage: "Send message",
    disclaimer:
      "Z AI can make mistakes. Verify important information.",

    // Login
    welcomeBack: "Welcome back",
    loginSubtitle: "Sign in to your Z AI account",
    emailAddress: "Email address",
    enterEmail: "Enter your email",
    password: "Password",
    enterPassword: "Enter your password",
    showPassword: "Show password",
    hidePassword: "Hide password",
    rememberEmail: "Remember me",
    signingIn: "Signing in...",
    signInToCompany: "Sign in to Z AI",


    // Messages
    you: "You",
    copy: "Copy",
    copied: "Copied",
    copyResponse: "Copy response",
    editMessage: "Edit message",
    saveChanges: "Save changes",
    cancel: "Cancel",
    resendingMessage: "Resending...",
    editMessagePlaceholder: "Edit your message...",

    // Errors and confirmations
    loadConversationsError: "Could not load your conversations.",
    loadConversationError: "Could not load this conversation.",
    deleteConversationConfirmation:
      "Are you sure you want to delete this conversation?",
    deleteConversationWarning:
      "This will permanently delete the conversation and all its messages.",
    deleteError: "Could not delete this conversation.",
    loginError: "Login failed. Please check your credentials.",
    guestTokenError: "The API did not return a guest token.",
    genericError: "Something went wrong. Please try again.",
  },

  ar: {
    // Header
    language: "العربية",
    signIn: "تسجيل الدخول",

    // Sidebar
    newConversation: "محادثة جديدة",
    searchConversations: "البحث في المحادثات",
    searchPlaceholder: "ابحث في المحادثات...",
    searchResults: "نتائج البحث",
    yourConversations: "محادثاتك",
    noMatchingConversations: "لم يتم العثور على محادثات مطابقة.",
    noConversations: "لا توجد محادثات بعد",
    checkingAccount: "جارٍ التحقق من حسابك...",
    signInToSave: "سجّل الدخول لحفظ محادثاتك وعرضها.",
    closeSidebar: "إغلاق القائمة الجانبية",
    openSidebar: "فتح القائمة الجانبية",
    clearSearch: "مسح البحث",
    deleteConversation: "حذف المحادثة",
    openConversation: "فتح المحادثة",

    // User profile
    guestUser: "مستخدم زائر",
    authenticatedUser: "مستخدم مسجّل الدخول",
    publicAccess: "وصول عام",
    signOut: "تسجيل الخروج",

    // Welcome screen
    welcomeTitle: "كيف يمكنني مساعدتك اليوم؟",
    welcomeDescription:
      "اسألني عن شركتنا أو خدماتنا أو مشاريعنا أو أي شيء ترغب في معرفته.",
    companyServices: "خدمات الشركة",
    companyServicesDescription:
      "ما الخدمات التي تقدمها شركتنا؟",
    technicalSolutions: "الحلول التقنية",
    technicalSolutionsDescription:
      "ما التقنيات التي تستخدمها شركتنا؟",
    getAssistance: "الحصول على المساعدة",
    getAssistanceDescription:
      "كيف يمكن لفريقك مساعدة أعمالي؟",

    // Composer
    messagePlaceholder: "اسأل عن أي شيء يتعلق بشركتك...",
    attachmentsComingSoon: "المرفقات قريباً",
    companyKnowledge: "معلومات الشركة",
    sendMessage: "إرسال الرسالة",
    disclaimer:
      "قد يرتكب Z AI أخطاءً. تحقق من المعلومات المهمة.",

    // Login
    welcomeBack: "مرحباً بعودتك",
    loginSubtitle: "سجّل الدخول إلى حساب Z AI",
    emailAddress: "البريد الإلكتروني",
    enterEmail: "أدخل بريدك الإلكتروني",
    password: "كلمة المرور",
    enterPassword: "أدخل كلمة المرور",
    showPassword: "إظهار كلمة المرور",
    hidePassword: "إخفاء كلمة المرور",
    rememberEmail: "تذكرني",
    signingIn: "جارٍ تسجيل الدخول...",
    signInToCompany: "تسجيل الدخول إلى Z AI",


    // Messages
    you: "أنت",
    copy: "نسخ",
    copied: "تم النسخ",
    copyResponse: "نسخ الرد",
    editMessage: "تعديل الرسالة",
    saveChanges: "حفظ التعديلات",
    cancel: "إلغاء",
    resendingMessage: "جارٍ إعادة الإرسال...",
    editMessagePlaceholder: "عدّل رسالتك...",

    // Errors and confirmations
    loadConversationsError: "تعذّر تحميل محادثاتك.",
    loadConversationError: "تعذّر تحميل هذه المحادثة.",
    deleteConversationConfirmation:
      "هل أنت متأكد من أنك تريد حذف هذه المحادثة؟",
    deleteConversationWarning:
      "سيتم حذف المحادثة وجميع رسائلها نهائياً.",
    deleteError: "تعذّر حذف هذه المحادثة.",
    loginError: "فشل تسجيل الدخول. تحقق من بيانات الاعتماد.",
    guestTokenError: "لم تُرجع واجهة API رمز دخول للزائر.",
    genericError: "حدث خطأ ما. يرجى المحاولة مرة أخرى.",
  },
} as const;

export type TranslationKey = keyof typeof translations.en;
