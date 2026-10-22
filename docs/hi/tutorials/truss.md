# ट्यूटोरियल: समतल ट्रस

यह ट्यूटोरियल एक छोटा स्थैतिकतः निर्धार्य ट्रस बनाता है, संधि विधि (method of joints) और खंड विधि (method of sections) से उसकी छड़ों के बल जाँचता है, और एक शून्य-बल सदस्य (zero-force member) खोजता है। लगभग 15 मिनट का समय रखें।

![तैयार ट्रस: अक्षीय बल और प्रतिक्रियाएँ](/screenshots/tut-truss.webp)

यदि आप केवल इसे खंगालना चाहते हैं, तो [तैयार मॉडल खोलें](https://run.edubeam.app/?model=eyJuIjpbWyIxIixbMCwwLDBdLFswLDJdLG51bGxdLFsiMiIsWzQsMCwwXSxbXSxudWxsXSxbIjMiLFs4LDAsMF0sW10sbnVsbF0sWyI0IixbMTIsMCwwXSxbMl0sbnVsbF0sWyI1IixbNCwwLC0zXSxbXSxudWxsXSxbIjYiLFs4LDAsLTNdLFtdLG51bGxdXSwiZSI6W1siMSIsWyIxIiwiMiJdLCIxIiwiMSIsW3RydWUsdHJ1ZV1dLFsiMiIsWyIyIiwiMyJdLCIxIiwiMSIsW3RydWUsdHJ1ZV1dLFsiMyIsWyIzIiwiNCJdLCIxIiwiMSIsW3RydWUsdHJ1ZV1dLFsiNCIsWyI1IiwiNiJdLCIxIiwiMSIsW3RydWUsdHJ1ZV1dLFsiNSIsWyIxIiwiNSJdLCIxIiwiMSIsW3RydWUsdHJ1ZV1dLFsiNiIsWyIyIiwiNSJdLCIxIiwiMSIsW3RydWUsdHJ1ZV1dLFsiNyIsWyI1IiwiMyJdLCIxIiwiMSIsW3RydWUsdHJ1ZV1dLFsiOCIsWyIzIiwiNiJdLCIxIiwiMSIsW3RydWUsdHJ1ZV1dLFsiOSIsWyI2IiwiNCJdLCIxIiwiMSIsW3RydWUsdHJ1ZV1dXSwibSI6W1siMSIsNzg1MCwyMTAwMDAwMDAwMDAsODEwMDAwMDAwMDAsMC4wMDAwMTJdXSwiY3MiOltbIjEiLDAuMDAyLDAuMDAwMDAxLDAuMSwxXV0sIm5sIjpbWyIyIix7IjAiOjAsIjIiOjMwMDAwLCI0IjowfV0sWyIzIix7IjAiOjAsIjIiOjMwMDAwLCI0IjowfV1dLCJkIjpbXX0%3D&lang=en){target="_blank"}।

## समस्या {#the-problem}

![ज्यामिति, आधार और भार](/screenshots/tut-truss-model.webp)

- 4 m के तीन पैनलों में 12 m का स्पैन, 3 m गहरा।
- निचली कॉर्ड (bottom chord) के नोड 1–4, ऊपरी कॉर्ड (top chord) के नोड 5 और 6।
- नोड 1 पर कीलकित आधार (pin) और नोड 4 पर रोलर।
- निचली कॉर्ड के नोड 2 और 3 पर 30 kN के दो भार।
- $A = 20$ cm² वाली इस्पात की छड़ें।

| नोड | X [m] | Z [m] | आधार | भार |
| --- | --- | --- | --- | --- |
| 1 | 0 | 0 | कीलकित (pin) | |
| 2 | 4 | 0 | | `Fz = 30` kN |
| 3 | 8 | 0 | | `Fz = 30` kN |
| 4 | 12 | 0 | रोलर | |
| 5 | 4 | −3 | | |
| 6 | 8 | −3 | | |

छड़ें: निचली कॉर्ड 1–2, 2–3, 3–4; ऊपरी कॉर्ड 5–6; सिरे के विकर्ण 1–5 और 6–4; ऊर्ध्वाधर 2–5 और 3–6; और मध्य विकर्ण 5–3।

**क्या यह निर्धार्य है?** $j = 6$ संधियों के साथ $m + r = 9 + 3 = 12 = 2j$, इसलिए हाँ: छड़ों के बल केवल संतुलन से ही निकल आते हैं।

## 1. सामग्री और अनुप्रस्थ काट {#_1-material-and-section}

1. **Clear mesh** (*Delete materials* और *Delete cross sections* पर टिक करें)।
2. *Materials* → **Material library** → **Steel (S235)**।
3. *Cross sections* → **Add cross section**: `Area = 0.002`, `Iy = 1e-6`, `Height = 0.1`, `Shear coefficient = 1`। हिंज वाली छड़ों में केवल क्षेत्रफल मायने रखता है।

## 2. हिंज के साथ छड़ें बनाएँ {#_2-draw-the-bars-with-hinges}

EduBeam में ट्रस छड़ एक ऐसा बीम अवयव है जिसके **दोनों सिरे के हिंज** टिक किए हुए हों। माउस टूल इन्हें आपके लिए सेट कर सकता है:

1. *Elements* टैब → दूसरा **Add element** बटन (कर्सर आइकन)।
2. व्यूअर के ऊपर वाली पट्टी (banner) में **Start hinge** और **End hinge** पर टिक करें। अब आप जो भी छड़ बनाएँगे, उसे दोनों मिलेंगे।
3. रूपरेखा को एक पॉलीलाइन के रूप में बनाएँ: (0, 0), (4, −3), (8, −3), (12, 0) पर क्लिक करें, फिर नीचे से वापस: (8, 0), (4, 0), (0, 0)। <kbd>Esc</kbd> दबाएँ।
4. भीतरी छड़ें एक-एक करके बनाएँ, हर एक के बाद <kbd>Esc</kbd> दबाते हुए: (4, 0) → (4, −3), (4, −3) → (8, 0), (8, 0) → (8, −3)।
5. फिट करने के लिए <kbd>F</kbd> दबाएँ।

*Elements* तालिका जाँचें: नौ अवयव, हर एक के दोनों *End hinges* टिक किए हुए। आपके नोड और अवयव क्रमांक चित्रों से भिन्न हो सकते हैं; इससे कोई फ़र्क नहीं पड़ता।

## 3. आधार और भार {#_3-supports-and-loads}

1. (0, 0) वाले नोड पर क्लिक करें → **Node supports** → **pin**। (12, 0) वाले नोड पर क्लिक करें → **roller**।
2. (4, 0) वाले नोड पर क्लिक करें → **Add load** → `Fz = 30` kN। (8, 0) पर भी यही करें।

धनात्मक `Fz` नीचे की ओर है। ट्रस की संधियाँ घूमने के लिए स्वतंत्र होती हैं; EduBeam ऐसे नोड स्वीकार करता है जहाँ हर छड़ हिंज वाली हो, और उनका घूर्णन 0 रिपोर्ट करता है।

## 4. परिणाम {#_4-results}

प्रदर्शन विकल्पों में **Deformed shape** और **M<sub>y</sub> (x)** अनटिक करें (ट्रस में कोई बंकन नहीं होता) और **N (x)** पर टिक करें।

![अक्षीय बल: तनाव धनात्मक](/screenshots/tut-truss.webp)

## 5. हाथ से जाँचें {#_5-check-by-hand}

**प्रतिक्रियाएँ।** भार सममित हैं, इसलिए $R_1 = R_4 = 30$ kN ऊपर की ओर, और कीलकित आधार पर क्षैतिज प्रतिक्रिया शून्य है।

**संधि 1** (संधि विधि)। सिरे का विकर्ण 1–5, 5 m लंबा है ($\sin\alpha = 3/5$, $\cos\alpha = 4/5$):

$$\sum F_z:\ N_{15} \cdot \tfrac{3}{5} = -30 \Rightarrow N_{15} = -50\ \text{kN} \qquad \sum F_x:\ N_{12} = -N_{15} \cdot \tfrac{4}{5} = 40\ \text{kN}$$

**संधि 2।** ऊर्ध्वाधर 2–5 ही एकमात्र छड़ है जो 30 kN भार को ऊपर ले जा सकती है: $N_{25} = +30$ kN, और $N_{23} = N_{12} = 40$ kN।

**मध्य पैनल से होकर खंड।** छड़ें 5–6, 5–3 और 2–3 काटें और बायाँ भाग रखें:

- नोड 3 के परितः आघूर्ण: $R_1 \cdot 8 - 30 \cdot 4 + N_{56} \cdot 3 = 0 \Rightarrow N_{56} = -40$ kN।
- ऊर्ध्वाधर बल: पैनल में अपरूपण $R_1 - 30 = 0$ है, इसलिए विकर्ण **5–3 कुछ भी वहन नहीं करता**: $N_{53} = 0$।

| छड़ | हाथ का मान | EduBeam |
| --- | --- | --- |
| निचली कॉर्ड 1–2, 2–3, 3–4 | +40 kN (तनाव) | 40 |
| ऊपरी कॉर्ड 5–6 | −40 kN (संपीड़न) | −40 |
| सिरे के विकर्ण 1–5, 6–4 | −50 kN | −50 |
| ऊर्ध्वाधर 2–5, 3–6 | +30 kN | 30 |
| मध्य विकर्ण 5–3 | 0 | 0 |

नोड 2 का विक्षेप 2.29 mm है (*Results → Nodal results*)। अभ्यास के रूप में इसे आभासी कार्य से, $\delta = \sum N n L / (EA)$, परिकलित करें।

## 6. प्रयोग करें {#_6-experiment}

- **एक भार खिसकाएँ।** दोनों 30 kN भार नोड 2 पर रखें। अब मध्य विकर्ण बल वहन करता है: किस चिह्न का, और क्यों?
- **मध्य विकर्ण हटाएँ।** ट्रस एक यंत्र बन जाता है; EduBeam दोषपूर्ण हिंजों पर घेरा बनाता है और दिखाता है कि पैनल कैसे अपरूपित होता है।
- **सभी हिंज अनटिक करें।** ट्रस दृढ़ जोड़ों वाला फ्रेम बन जाता है। **M<sub>y</sub> (x)** पर टिक करें: अक्षीय बलों की तुलना में बंकन आघूर्ण नगण्य हैं, और इसी कारण कीलित जोड़ वाला आदर्शीकरण काम करता है।
- **दोनों आधार कीलकित करें।** एक अतिरिक्त प्रतिक्रिया इसे अनिर्धार्य बना देती है, और निचली कॉर्ड के बल अब छड़ों के क्षेत्रफल पर निर्भर करते हैं।
