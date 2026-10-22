---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "EduBeam"
  text: "निःशुल्क ऑनलाइन संरचनात्मक विश्लेषण"
  tagline: बीम, फ्रेम या ट्रस बनाइए, भार लगाइए और संपादन करते-करते आरेखों को बदलते देखिए। पूरे FEM परिणाम आपके ब्राउज़र में—न कोई इंस्टॉल, न कोई खाता, न कोई शुल्क।
  image:
    src: /screenshots/hero.webp
    alt: हल किए गए फ्रेम के साथ EduBeam ऐप
  actions:
    - theme: brand
      text: ऐप खोलें
      link: https://run.edubeam.app/?lang=en
    - theme: alt
      text: मार्गदर्शिका पढ़ें
      link: /hi/guide/introduction
    - theme: alt
      text: उदाहरण देखें
      link: /hi/examples/

features:
  - icon: ⚡
    title: बनाते ही परिणाम
    details: कोई Solve बटन नहीं है। नोड खींचिए, हिंज पर टिक कीजिए या भार बदलिए—N, V, M, प्रतिक्रियाएँ और विरूपित आकृति तुरंत साथ-साथ बदलती हैं।
    link: /hi/essentials/results
    linkText: परिणाम पढ़ना
  - icon: 🧑‍🏫
    title: शिक्षण के लिए बना
    details: निर्देशित पहले कदम, होवर पर मान, ऐसा सॉल्वर जो समझाता है कि संरचना यंत्र (mechanism) क्यों है, और ऐसे साझा लिंक जिन्हें आप व्याख्यान नोट्स में रख सकते हैं।
    link: /hi/guide/teaching
    linkText: EduBeam के साथ पढ़ाना
  - icon: 🌍
    title: आपकी भाषा, आपकी इकाइयाँ
    details: इंटरफ़ेस की 12 भाषाएँ, SI या US customary इकाइयाँ, और z-नीचे या पाठ्यपुस्तक वाले y-ऊपर अक्षों का विकल्प।
    link: /hi/essentials/units-settings
    linkText: इकाइयाँ और सेटिंग्स
  - icon: 🔗
    title: साझा करें, निर्यात करें, एम्बेड करें
    details: पूरा मॉडल एक लिंक के रूप में भेजें, उसे फ़ाइल में सहेजें, चित्र को PNG या SVG और परिणाम तालिकाओं को CSV के रूप में निर्यात करें।
    link: /hi/essentials/import-export
    linkText: फ़ाइलें और साझाकरण
---

## यहाँ से शुरू करें {#start-here}

<div class="start-grid">

**EduBeam में नए हैं?** [10 मिनट की त्वरित शुरुआत](/hi/guide/quick-start) का पालन करें। आप एक सरल आलंबित बीम (simply supported beam) का मॉडल कदम-दर-कदम बनाते हैं और हर परिणाम को हाथ से जाँचते हैं।

**पता है क्या बनाना है?** सीधे किसी [ट्यूटोरियल](/hi/tutorials/three-hinged-frame) पर जाएँ या कोई तैयार [उदाहरण](/hi/examples/) खोलकर उसे बदलें।

**कोई पाठ्यक्रम पढ़ा रहे हैं?** [EduBeam के साथ पढ़ाना](/hi/guide/teaching) देखें: असाइनमेंट के लिए साझा लिंक, स्लाइडों के लिए एम्बेड करने योग्य व्यूअर, और अभ्यास।

</div>

<div class="shots">

![एक ट्रस: अक्षीय बल, तनाव धनात्मक](/screenshots/tut-truss.webp)

![यंत्र (mechanism) को दृश्य बनाना: EduBeam दिखाता है कि इसे हल क्यों नहीं किया जा सकता](/screenshots/ui-mechanism.webp)

</div>

## आप क्या मॉडल कर सकते हैं {#what-you-can-model}

- समतल में **बीम, फ्रेम और ट्रस**: सतत बीम, पोर्टल फ्रेम, त्रि-हिंज (three-hinged) मेहराब, कीलित जोड़ वाले ट्रस।
- **कोई भी आधार**: कीलकित (pin), रोलर, जड़ित (fixed), स्लाइडर, घुमाए हुए आधार, और आधार निपात (support settlements)।
- **भार**: संकेंद्रित बल और आघूर्ण, समान और समलम्बी (trapezoidal) रेखीय भार, सदस्य पर कहीं भी संकेंद्रित भार, और तापमान।
- **कोई भी अनुप्रस्थ काट**: लाइब्रेरी से (IPE, HEA, AISC W, HSS, आयत, ट्यूब) या बहुभुज के रूप में बनाया हुआ, जिसके गुणधर्म आपके लिए परिकलित किए जाते हैं।

अधिक जानकारी [परिचय](/hi/guide/introduction) में है।

<ElementariumPromo />
