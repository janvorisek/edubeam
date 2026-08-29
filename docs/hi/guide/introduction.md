<script setup>
import { VPTeamMembers } from 'vitepress/theme'

const members = [
  {
    avatar: 'https://www.github.com/janvorisek.png',
    name: 'Jan Voříšek',
    title: 'मुख्य डेवलपर और प्रोडक्ट डिज़ाइनर',
    links: [
      { icon: 'github', link: 'https://github.com/janvorisek' },
      { icon: 'twitter', link: 'https://twitter.com/janvorisekdev' },
    ]
  },
  {
    avatar: 'https://www.github.com/bpatzak.png',
    name: 'Bořek Patzák',
    title: 'FEM सॉल्वर, मूल (लेगेसी) ऐप के लेखक',
    links: [
      { icon: 'github', link: 'https://github.com/bpatzak' },
    ]
  }
]
</script>

# परिचय

<Edubeam /> बीम, फ्रेम और ट्रस के लिए एक निःशुल्क, ब्राउज़र-आधारित **2D संरचनात्मक विश्लेषण** (structural analysis) उपकरण है। आप संरचना बनाते हैं, आधार (supports) और भार (loads) जोड़ते हैं, और परिमित अवयव सॉल्वर (finite element solver) हर बदलाव के साथ उसी क्षण सब कुछ दोबारा हल कर देता है—न कोई "Solve" बटन, न इंस्टॉलेशन, न खाता।

[EduBeam खोलें](https://run.edubeam.app/?lang=en){target="_blank"} एक नए टैब में और [त्वरित शुरुआत](/hi/guide/quick-start) के साथ आगे बढ़ें।

::: tip इंटरफ़ेस की भाषा
ऐप का इंटरफ़ेस अभी हिन्दी में उपलब्ध नहीं है, इसलिए इस दस्तावेज़ में सभी बटन, टैब और सेटिंग्स के नाम **अंग्रेज़ी में** वैसे ही लिखे गए हैं जैसे वे ऐप में दिखते हैं (जैसे **Add node**, **Supported DOFs**)। ऐप को अंग्रेज़ी में खोलने के लिए URL में `?lang=en` जोड़ें।
:::

<figure>
  <a href="https://run.edubeam.app/?lang=en" target="_blank">
    <WelcomeStructure />
  </a>
  <figcaption>एक स्थैतिक अनिर्धार्य (statically indeterminate) बीम, ब्राउज़र में लाइव हल की गई</figcaption>
</figure>

## यह क्या करता है

| क्षेत्र | क्षमताएँ |
| --- | --- |
| **संरचनाएँ** | समतलीय (x–z) बीम, सतत धरन (continuous beams), फ्रेम और ट्रस, जो नोड और 2D Timoshenko बीम अवयवों से बनते हैं। सिरे के हिंज (end hinges) किसी भी सदस्य को ट्रस बार बना देते हैं। |
| **आधार** | किसी नोड पर `Dx`, `Dz`, `Ry` के किसी भी संयोजन का अवरोध → जड़ित (fixed), कीलकित (pinned), रोलर, स्लाइडिंग… नोडीय निर्देशांक-तंत्र कोण से तिरछे आधार। |
| **भार** | नोडीय बल और आघूर्ण, निर्धारित विस्थापन (आधार निपात / support settlements), समान और समलम्बी रेखीय भार (वैश्विक या स्थानीय), सदस्य पर कहीं भी संकेंद्रित भार, तथा समान / प्रवणता वाले तापीय भार। |
| **परिणाम** | विरूपित आकृति, अक्षीय बल **N**, अपरूपण बल **V<sub>z</sub>**, बंकन आघूर्ण **M<sub>y</sub>**, आधार प्रतिक्रियाएँ, नोडीय विस्थापन, अवयवों के सिरा-बल (end forces) और प्रत्येक अवयव की दृढ़ता मैट्रिक्स (stiffness matrix)। |
| **विश्लेषण** | एकल भार-प्रकरण (load case) वाला रैखिक स्थैतिक विश्लेषण। रैखिक मॉडल के लिए परिणाम यथार्थ हैं (मेश परिशोधन की आवश्यकता नहीं)। |
| **फाइलें** | प्रोजेक्ट को JSON के रूप में सहेजें/खोलें, पूरा मॉडल URL के रूप में साझा करें, केवल-पढ़ने योग्य व्यूअर एम्बेड करें। सब कुछ आपके डिवाइस पर ही रहता है। |
| **इकाइयाँ** | लंबाई, क्षेत्रफल, क्षेत्र का द्वितीय आघूर्ण, द्रव्यमान, बल, आघूर्ण और दाब के लिए अलग-अलग चुनने योग्य इकाइयाँ (मीट्रिक और इम्पीरियल)। |

## यह (अभी) क्या नहीं करता

सीमाएँ पहले से जान लेने से समय बचता है:

- **केवल 2D** — समतल से बाहर का कोई व्यवहार नहीं, 3D फ्रेम नहीं।
- **केवल रैखिक स्थैतिक** — कोई द्वितीय-कोटि (P–Δ) प्रभाव नहीं, बकलिंग नहीं, गतिकी नहीं, प्लास्टिसिटी नहीं।
- **एक ही भार-प्रकरण** — भार संयोजन (load combinations) या एनवलप नहीं हैं। हर प्रकरण को अलग मॉडल करें (हर एक को अपनी फाइल या साझा लिंक के रूप में सहेजें)।
- **स्वभार (self-weight) नहीं** — आवश्यकता हो तो इसे रेखीय भार के रूप में लगाएँ।
- **कोई डिज़ाइन जाँच नहीं** — EduBeam आंतरिक बल और विस्थापन देता है; कोड के अनुसार जाँच आपकी ज़िम्मेदारी है।

यदि कोई अनुपस्थित सुविधा आपके लिए महत्वपूर्ण है, तो [एक issue खोलें](https://github.com/janvorisek/edubeam/issues)।

## यह किसके लिए है?

- **विद्यार्थी** जो संरचना यांत्रिकी (structural mechanics) सीख रहे हैं और अपनी हाथ की गणनाओं पर तुरंत प्रतिक्रिया चाहते हैं। देखें [परिणामों की हाथ से जाँच](/hi/guide/verification)।
- **शिक्षक** जो दिखाना चाहते हैं कि आधार, हिंज और भार आंतरिक बलों को कैसे बदलते हैं—लाइव, प्रोजेक्टर पर, 11 भाषाओं में से किसी में भी।
- **इंजीनियर** जो किसी भारी डेस्कटॉप पैकेज को खोलने से पहले एक त्वरित जाँच चाहते हैं।

## दस्तावेज़ीकरण की संरचना

1. **शुरुआत** — यह पृष्ठ, [10 मिनट की त्वरित शुरुआत](/hi/guide/quick-start) और तैयार [उदाहरण](/hi/examples/)।
2. **मॉडलिंग** — हर निर्माण-खंड के लिए एक पृष्ठ: [यूज़र इंटरफ़ेस](/hi/essentials/user-interface), [नोड और आधार](/hi/essentials/nodes-supports), [अवयव, सामग्री और अनुप्रस्थ काट](/hi/essentials/elements), [भार](/hi/essentials/loads), [इकाइयाँ और सेटिंग्स](/hi/essentials/units-settings)।
3. **परिणाम** — [आरेख और तालिकाएँ कैसे पढ़ें](/hi/essentials/results) और [उन्हें कैसे सत्यापित करें](/hi/guide/verification)।
4. **फाइलें और साझाकरण** — [JSON प्रोजेक्ट, साझा लिंक और एम्बेड करने योग्य व्यूअर](/hi/essentials/import-export)।
5. **संदर्भ** — [कीबोर्ड और माउस](/hi/reference/shortcuts), [समस्या निवारण](/hi/reference/troubleshooting) और [FAQ](/hi/faq/)।
6. **सिद्धांत पुस्तिका** — [चिह्न परिपाटी](/hi/elements/conventions) तथा [बीम](/hi/elements/beam) और [ट्रस](/hi/elements/truss) अवयवों का सूत्रीकरण।

## भाषाएँ

इंटरफ़ेस English, Čeština, Deutsch, Español, Français, Polski, Português, Русский, Українська, ไทย और 汉语 में उपलब्ध है (हिन्दी अभी नहीं)। EduBeam आपके ब्राउज़र से भाषा चुन लेता है; इसे **Settings → Language & Locale** में बदलें या ऐप को `?lang=` पैरामीटर के साथ खोलें, जैसे [run.edubeam.app/?lang=en](https://run.edubeam.app/?lang=en){target="_blank"}।

## लेखक और श्रेय

<Edubeam /> का नेतृत्व [Jan Voříšek](https://github.com/janvorisek) करते हैं, जो आधुनिक वेब संस्करण के अनुरक्षक और प्रोडक्ट डिज़ाइनर हैं। ब्राउज़र संस्करण CTU से स्वतंत्र रूप से विकसित किया जाता है; Windows/Linux के लिए मूल डेस्कटॉप EduBeam को [Bořek Patzák](http://ksm.fsv.cvut.cz/~bp/), [Jan Stránský](https://mech.fsv.cvut.cz/~stransky/en/) और [Vít Šmilauer](https://mech.fsv.cvut.cz/~smilauer/) ने यांत्रिकी विभाग, [CTU Prague – Faculty of Civil Engineering](https://www.fsv.cvut.cz/en) में बनाया था। सॉल्वर ओपन-सोर्स [ts-fem](https://github.com/janvorisek/ts-fem) लाइब्रेरी है।

<VPTeamMembers size="small" :members="members" />

## योगदान करें

- भ्रमित करने वाले व्यवहार या बग को [GitHub issue](https://github.com/janvorisek/edubeam/issues) के रूप में रिपोर्ट करें।
- `docs/` की फाइलों को संपादित करके और pull request खोलकर इस दस्तावेज़ीकरण या अनुवादों को बेहतर बनाएँ।
- EduBeam को सहपाठियों और सहकर्मियों के साथ साझा करें।
