import type { Gender, Lang, MaritalStatus, Profile } from "./types";

/**
 * Bilingual UI strings. Hebrew is the primary language and is grammatically
 * gendered where it matters; English is kept simple and neutral.
 */
export const t = {
  he: {
    dir: "rtl" as "rtl" | "ltr",
    appName: "כסף",
    tagline: "המקום הבטוח לסיסמאות שלך",
    langName: "English",
    next: "המשך",
    back: "חזרה",
    finish: "סיום וכניסה",
    stepOf: (n: number, total: number) => `שלב ${n} מתוך ${total}`,
    required: "נא למלא שדה זה",

    // Welcome
    welcomeTitle: "ברוכים הבאים",
    welcomeBody:
      "כדי שנכיר אותך, נענה יחד על כמה שאלות קצרות. אפשר תמיד לחזור אחורה ולתקן.",
    welcomeStart: "בואו נתחיל",

    // Step 1
    s1Title: "קצת עליך",
    qName: "מה השם שלך?",
    qNamePlaceholder: "לדוגמה: ישראל",
    qGender: "האם את/ה בן או בת?",
    genderMale: "בן",
    genderFemale: "בת",
    qMarital: "מה המצב המשפחתי שלך?",
    qChildren: "מה השמות של הילדים שלך?",
    childPlaceholder: (i: number) => `שם הילד/ה ${i}`,
    addChild: "הוספת ילד/ה",
    removeChild: "הסרה",

    // Step 2
    s2Title: "דרכי יצירת קשר",
    qEmail: "מה כתובת האימייל שלך?",
    qEmailPlaceholder: "name@example.com",
    qAddress: "מה כתובת הבית שלך?",
    qAddressPlaceholder: "רחוב ומספר, עיר",
    qZip: "מה המיקוד?",
    qZipPlaceholder: "לדוגמה: 1234567",
    qPhone: "מה מספר הטלפון שלך?",
    qPhonePlaceholder: "050-0000000",

    // Step 3
    s3Title: "שאלות זיכרון אישיות",
    s3Body:
      "בחר/י לפחות שתי שאלות שקל לך לזכור את התשובה עליהן. בעזרתן תוכל/י להיכנס לאפליקציה בעתיד.",
    s3Selected: (n: number) => `נבחרו ${n} שאלות`,
    s3Min: "צריך לבחור לפחות שתי שאלות עם תשובה.",
    answerPlaceholder: "התשובה שלך",
    addOwnQuestion: "הוספת שאלה משלך",
    ownQuestionPlaceholder: "כתוב/כתבי כאן את השאלה",
    selectQuestion: "בחירה",
    selectedQuestion: "נבחר",

    // Main screen
    mainGreeting: (name: string) => `שלום ${name}`,
    mainEmpty: "עדיין אין סיסמאות שמורות.\nלחצו על הכפתור הגדול כדי להוסיף את הראשונה.",
    addPassword: "הוספת סיסמה",
    settings: "הגדרות",

    // Add password sheet
    newPassword: "סיסמה חדשה",
    pwTitle: "שם השירות",
    pwTitlePlaceholder: "לדוגמה: בנק, ג'ימייל, פייסבוק",
    pwUsername: "שם משתמש",
    pwUsernamePlaceholder: "כתובת אימייל או שם משתמש",
    pwPassword: "סיסמה",
    pwPasswordPlaceholder: "הסיסמה",
    pwNotes: "הערות (לא חובה)",
    pwNotesPlaceholder: "פרטים נוספים",
    save: "שמירה",
    cancel: "ביטול",
    show: "הצגה",
    hide: "הסתרה",
    copy: "העתקה",
    copied: "הועתק!",
    delete: "מחיקה",
    confirmDelete: "למחוק את הסיסמה הזו?",
  },
  en: {
    dir: "ltr" as "rtl" | "ltr",
    appName: "Kesef",
    tagline: "A safe home for your passwords",
    langName: "עברית",
    next: "Continue",
    back: "Back",
    finish: "Finish & enter",
    stepOf: (n: number, total: number) => `Step ${n} of ${total}`,
    required: "Please fill in this field",

    welcomeTitle: "Welcome",
    welcomeBody:
      "Let's get to know you with a few short questions. You can always go back and change an answer.",
    welcomeStart: "Let's start",

    s1Title: "About you",
    qName: "What is your name?",
    qNamePlaceholder: "e.g. Alex",
    qGender: "Are you male or female?",
    genderMale: "Male",
    genderFemale: "Female",
    qMarital: "What is your family status?",
    qChildren: "What are your children's names?",
    childPlaceholder: (i: number) => `Child ${i} name`,
    addChild: "Add a child",
    removeChild: "Remove",

    s2Title: "How to reach you",
    qEmail: "What is your email address?",
    qEmailPlaceholder: "name@example.com",
    qAddress: "What is your home address?",
    qAddressPlaceholder: "Street and number, city",
    qZip: "What is your postal code?",
    qZipPlaceholder: "e.g. 90210",
    qPhone: "What is your phone number?",
    qPhonePlaceholder: "050-0000000",

    s3Title: "Personal memory questions",
    s3Body:
      "Choose at least two questions whose answers are easy for you to remember. You'll use them to sign in later.",
    s3Selected: (n: number) => `${n} questions selected`,
    s3Min: "Please choose at least two questions with an answer.",
    answerPlaceholder: "Your answer",
    addOwnQuestion: "Add your own question",
    ownQuestionPlaceholder: "Write your question here",
    selectQuestion: "Choose",
    selectedQuestion: "Chosen",

    mainGreeting: (name: string) => `Hello ${name}`,
    mainEmpty: "No saved passwords yet.\nTap the big button to add your first one.",
    addPassword: "Add password",
    settings: "Settings",

    newPassword: "New password",
    pwTitle: "Service name",
    pwTitlePlaceholder: "e.g. Bank, Gmail, Facebook",
    pwUsername: "Username",
    pwUsernamePlaceholder: "Email or username",
    pwPassword: "Password",
    pwPasswordPlaceholder: "The password",
    pwNotes: "Notes (optional)",
    pwNotesPlaceholder: "Extra details",
    save: "Save",
    cancel: "Cancel",
    show: "Show",
    hide: "Hide",
    copy: "Copy",
    copied: "Copied!",
    delete: "Delete",
    confirmDelete: "Delete this password?",
  },
};

export type Dict = (typeof t)["he"];

/** Marital status labels, gendered for Hebrew. */
export function maritalLabel(
  status: MaritalStatus,
  gender: Gender,
  lang: Lang
): string {
  if (lang === "en") {
    const en: Record<MaritalStatus, string> = {
      married: "Married",
      widowed: "Widowed",
      divorced: "Divorced",
      single_parent: "Single parent",
      married_children: "Married with children",
      divorced_children: "Divorced with children",
    };
    return en[status];
  }
  const male: Record<MaritalStatus, string> = {
    married: "נשוי",
    widowed: "אלמן",
    divorced: "גרוש",
    single_parent: "הורה יחיד לילדים",
    married_children: "נשוי עם ילדים",
    divorced_children: "גרוש עם ילדים",
  };
  const female: Record<MaritalStatus, string> = {
    married: "נשואה",
    widowed: "אלמנה",
    divorced: "גרושה",
    single_parent: "הורה יחידה לילדים",
    married_children: "נשואה עם ילדים",
    divorced_children: "גרושה עם ילדים",
  };
  return gender === "female" ? female[status] : male[status];
}

export const MARITAL_OPTIONS: MaritalStatus[] = [
  "married",
  "married_children",
  "widowed",
  "divorced",
  "divorced_children",
  "single_parent",
];

/** Does this status imply a (current/former) spouse we should ask about? */
export function hasSpouse(status: MaritalStatus): boolean {
  return status !== "single_parent";
}

/** Does this status imply children by default? (children section is always shown, this just pre-expands it) */
export function impliesChildren(status: MaritalStatus): boolean {
  return (
    status === "single_parent" ||
    status === "married_children" ||
    status === "divorced_children"
  );
}

/**
 * The spouse-name question, adapted to the user's gender AND marital status.
 * Male user -> asks about wife; female user -> asks about husband.
 */
export function spouseQuestion(
  status: MaritalStatus,
  gender: Gender,
  lang: Lang
): string {
  if (lang === "en") {
    const partner = gender === "female" ? "husband" : "wife";
    if (status === "widowed") return `What was your ${partner}'s name?`;
    if (status === "divorced" || status === "divorced_children")
      return `What is your ex-${partner}'s name?`;
    return `What is your ${partner}'s name?`;
  }
  // Hebrew
  if (gender === "female") {
    // partner is male (בעל / גרוש)
    if (status === "widowed") return "מה היה השם של בעלך?";
    if (status === "divorced" || status === "divorced_children")
      return "מה השם של גרושך?";
    return "מה השם של בעלך?";
  }
  // partner is female (אישה / גרושה)
  if (status === "widowed") return "מה היה השם של אשתך?";
  if (status === "divorced" || status === "divorced_children")
    return "מה השם של גרושתך?";
  return "מה השם של אשתך?";
}

export function spousePlaceholder(lang: Lang): string {
  return lang === "he" ? "שם בן/בת הזוג" : "Partner's name";
}

/**
 * Build the personal-questions bank for step 3, adapting some questions to
 * answers the user already gave in steps 1–2 (spouse, children, city, etc.).
 */
export function buildQuestionBank(
  partial: Pick<
    Profile,
    "gender" | "maritalStatus" | "spouseName" | "children"
  >,
  lang: Lang
): { id: string; question: string }[] {
  const he = lang === "he";
  const bank: { id: string; question: string }[] = [];

  // Two fixed base questions from the spec.
  bank.push({
    id: "highschool",
    question: he
      ? "מה שם התיכון שבו למדת וסיימת לימודים?"
      : "What is the name of the high school you graduated from?",
  });
  bank.push({
    id: "color",
    question: he ? "מה הצבע האהוב עליך?" : "What is your favorite color?",
  });

  // Adaptive: spouse-based question.
  const spouse = partial.spouseName.trim();
  if (hasSpouse(partial.maritalStatus) && spouse) {
    bank.push({
      id: "spouse_city",
      question: he
        ? `באיזו עיר הכרת את ${spouse}?`
        : `In which city did you meet ${spouse}?`,
    });
  }

  // Adaptive: child-based question.
  const firstChild = partial.children.find((c) => c.name.trim())?.name.trim();
  if (firstChild) {
    bank.push({
      id: "child_birthplace",
      question: he
        ? `באיזו עיר נולד/ה ${firstChild}?`
        : `In which city was ${firstChild} born?`,
    });
  }

  // General-knowledge-about-self questions (always available).
  bank.push({
    id: "birthcity",
    question: he ? "באיזו עיר נולדת?" : "In which city were you born?",
  });
  bank.push({
    id: "pet",
    question: he
      ? "מה היה השם של חיית המחמד הראשונה שלך?"
      : "What was the name of your first pet?",
  });
  bank.push({
    id: "food",
    question: he ? "מה המאכל האהוב עליך?" : "What is your favorite food?",
  });
  bank.push({
    id: "street",
    question: he
      ? "באיזה רחוב גרת כשהיית ילד/ה?"
      : "On which street did you live as a child?",
  });

  // Ensure at least 6 suggested questions (2 base + 4 more), per the spec.
  return bank;
}
