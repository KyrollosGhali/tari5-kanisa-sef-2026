// js/data.js
// -----------------------------------------------------------------------
// كل محتوى الموقع (نصوص، فيديوهات، أسئلة) موجود هنا بمعزل عن باقي الكود.
// عشان تضيف شخصية جديدة مستقبلًا، كل اللي عليك تعمله هو تضيف عنصر جديد
// في مصفوفة SAINTS بنفس الشكل — مش محتاج تلمس أي ملف تاني، وهتظهر
// تلقائيًا في الصفحة الرئيسية والـ Navbar.
//
// ⚠️ أماكن محتاجة منك تعديل:
//   1) videoUrl لكل فيديو  → حط مسار الفيديو بتاعك جوه assets/videos
//   2) questions لكل فيديو → امسح الأسئلة الـ Placeholder وحط أسئلتك الحقيقية
//   3) pdf لكل شخصية       → حط ملف الـ Comic Book بتاعك جوه assets/pdfs
//   4) image لكل شخصية     → حط صورة/Illustration جوه assets/images
//
// شكل السؤال المطلوب (Multiple Choice أو True/False):
//   {
//     question: "نص السؤال هنا",
//     options: ["اختيار 1", "اختيار 2", "اختيار 3", "اختيار 4"],
//     correctAnswer: 0   // index الاختيار الصح في مصفوفة options (يبدأ من صفر)
//   }
//
// هذا الملف عادي (بدون import/export) عشان يشتغل من غير أي Build Tools —
// يتحمّل بـ <script src="js/data.js"> قبل باقي ملفات الـ JS.
// -----------------------------------------------------------------------

// سؤال Placeholder بيتكرر كمثال — امسحه وحط أسئلتك الحقيقية بدل منه.
function placeholderQuestion() {
  return {
    question: "TODO: اكتب هنا نص السؤال الخاص بهذا الفيديو",
    options: ["TODO: اختيار 1", "TODO: اختيار 2", "TODO: اختيار 3", "TODO: اختيار 4"],
    correctAnswer: 0,
  };
}

const SAINTS = [
  {
    id: "antonios",
    name: "القديس الأنبا أنطونيوس",
    shortName: "الأنبا أنطونيوس",
    title: "أبو الرهبان",
    description:
      "أب الرهبنة في العالم كله، الذي ترك الدنيا وأملاكه ليعيش حياة النسك في برية مصر، وأصبح مثالًا للأجيال في الصلاة والجهاد الروحي.",
    // TODO: حط صورة/Illustration للقديس هنا
    image: "assets/images/antonios.jpg",
    // TODO: حط ملف الـ Comic Book بتاع الأنبا أنطونيوس هنا
    pdf: "assets/pdfs/anba-antonios-comic.pdf",
    videos: [
      {
        id: 1,
        title: "نشأته وبداية حياته",
        description: "قصة ميلاد الأنبا أنطونيوس ونشأته في أسرة مسيحية بقرية قمن العروس.",
        // TODO: حط مسار الفيديو الأول هنا
        videoUrl: "assets/videos/antonios-1.mp4",
        questions: [
          {
            question: "اتولد الأنبا انطونيوس سنه",
            options: ["250 م", "205 م", "215 م", "251 م"],
            correctAnswer: 3
          }
          , 
          {
            question: "لما الشيطان كان بيجرب الأنبا انطونيوس كان بيعمل ايه",
            options: [" يحاول يهزمهم ", "يفكر فى الحل", "بيصلى و يصوم", " يغير مكانه"],
            correctAnswer: 2
          }
          , 
          {
            question: "النساك حبوا الأنبا انطونيوس و سموه",
            options: ["حبيب الله ", "ابن الله ", " سامع الله ", "خليل الله "],
            correctAnswer: 0
          }
        ],
      },
      {
        id: 2,
        title: "بداية حياة الرهبنة والنسك",
        description: "كيف ترك أنطونيوس العالم وبدأ رحلته في طريق النسك والوحدة مع الله.",
        // TODO: حط مسار الفيديو الثاني هنا
        videoUrl: "assets/videos/antonios-2.mp4",
        questions: [
          {
            question: " اول مرة نزل فيها الأنبا انطونيوس الإسكندرية كانت سنة ",
            options: ["131 م", "313 م", "311 م", "331 م"],
            correctAnswer: 3
          }
          , {
            question: "نزول الأنبا انطونيوس تانى مرة الإسكندرية كان علشان يدافع عن المسيحية ضد ",
            options: ["اريوس", "مقدونيوس", "نسطور", "أوطاخى"],
            correctAnswer: 0
          }
        ],
      },
      {
        id: 3,
        title: "حياته في البرية وتأسيس الحركة الرهبانية",
        description: "جهاده الروحي في البرية الشرقية ودوره في تأسيس الرهبنة كحركة روحية عالمية.",
        // TODO: حط مسار الفيديو الثالث هنا
        videoUrl: "assets/videos/antonios-3.mp4",
        questions: [
          {
            question: " ساب الأنبا انطونيوس .... رسائل لأديرة مختلفة فى مصر ",
            options: ["5", "6", "7", "8"],
            correctAnswer: 2
          }, 
          {
            question: "تنيح الأنبا انطونيوس فى ",
            options: ["22 طوبة", "22 امشير", "22 برمهات", "22 بشنس"],
            correctAnswer: 0
          }, 
          {
            question: " من كتب سيرة حياة الأنبا انطونيوس  ",
            options: ["الانبا اثناسيوس", "الانبا شنودة رئيس المتوحدين", "البابا كيرلس عمود الدين ", "الانبا ديسقوروس"],
            correctAnswer: 0
          }],
      },
    ],
  },
  {
    id: "kyrillos",
    name: "البابا كيرلس عمود الدين",
    shortName: "البابا كيرلس",
    title: "عمود الدين",
    description:
      "أحد أعظم آباء الكنيسة اللاهوتيين، الذي دافع عن الإيمان المستقيم في مجمع أفسس، ولُقّب بـ«عمود الدين» و«ختم الآباء».",
    // TODO: حط صورة/Illustration للبابا كيرلس هنا
    image: "assets/images/kyrillos.jpg",
    // TODO: حط ملف الـ Comic Book بتاع البابا كيرلس هنا
    pdf: "assets/pdfs/pope-kyrillos-comic.pdf",
    videos: [
      {
        id: 1,
        title: "نشأته وحياته الأولى",
        description: "نشأة البابا كيرلس وتكوينه الروحي والعلمي في الإسكندرية.",
        // TODO: حط مسار الفيديو الأول هنا
        videoUrl: "assets/videos/kyrillos-1.mp4",
        questions: [placeholderQuestion(), placeholderQuestion(), placeholderQuestion()],
      },
      {
        id: 2,
        title: "خدمته وتعليمه ودوره في الكنيسة",
        description: "رحلته في الخدمة الكنسية ودفاعه عن الإيمان المستقيم.",
        // TODO: حط مسار الفيديو الثاني هنا
        videoUrl: "assets/videos/kyrillos-2.mp4",
        questions: [placeholderQuestion(), placeholderQuestion(), placeholderQuestion()],
      },
      {
        id: 3,
        title: "أهم أعماله وتعاليمه وإرثه",
        description: "إرثه اللاهوتي وكتاباته التي ما زالت الكنيسة تعتمد عليها حتى اليوم.",
        // TODO: حط مسار الفيديو الثالث هنا
        videoUrl: "assets/videos/kyrillos-3.mp4",
        questions: [placeholderQuestion(), placeholderQuestion(), placeholderQuestion()],
      },
    ],
  },
  {
    id: "bishoyKamel",
    name: "أبونا بيشوي كامل",
    shortName: "أبونا بيشوي كامل",
    title: "خادم الشباب والأطفال",
    description:
      "كاهن مصري معاصر عُرف بحبه العميق للخدمة وبساطته وقربه من قلوب الشباب والأطفال، وترك أثرًا روحيًا كبيرًا رغم رحيله المبكر.",
    // TODO: حط صورة/Illustration لأبونا بيشوي كامل هنا
    image: "assets/images/bishoy-kamel.jpg",
    // TODO: حط ملف الـ Comic Book بتاع أبونا بيشوي كامل هنا
    pdf: "assets/pdfs/fr-bishoy-kamel-comic.pdf",
    videos: [
      {
        id: 1,
        title: "نشأته وبداية حياته",
        description: "نشأة أبونا بيشوي كامل وبداية حياته الروحية.",
        // TODO: حط مسار الفيديو الأول هنا
        videoUrl: "assets/videos/bishoy-kamel-1.mp4",
        questions: [
          placeholderQuestion(), placeholderQuestion(), placeholderQuestion()
        ],
      },
      {
        id: 2,
        title: "بداية خدمته الكهنوتية وخدمته للشباب والأطفال",
        description: "رحلته في الكهنوت وحبه الخاص لخدمة الأطفال والشباب.",
        // TODO: حط مسار الفيديو الثاني هنا
        videoUrl: "assets/videos/bishoy-kamel-2.mp4",
        questions: [placeholderQuestion(), placeholderQuestion(), placeholderQuestion()],
      },
      {
        id: 3,
        title: "أهم أعماله وخدمته وروحه الروحية وإرثه",
        description: "الأثر الذي تركه في حياة من عرفوه، وإرثه الروحي المستمر.",
        // TODO: حط مسار الفيديو الثالث هنا
        videoUrl: "assets/videos/bishoy-kamel-3.mp4",
        questions: [placeholderQuestion(), placeholderQuestion(), placeholderQuestion()],
      },
    ],
  },
];

/** Helper: fetch a single saint's data by id, or undefined if not found. */
function getSaintById(id) {
  return SAINTS.find((s) => s.id === id);
}
