# ट्रस अवयव

ट्रस अवयव केवल अक्षीय बल वहन करता है। <Edubeam /> में कोई अलग ट्रस अवयव प्रकार नहीं है: ट्रस छड़ एक [बीम अवयव](/hi/elements/beam) है जिसके **दोनों सिरे के हिंज** टिक किए हुए हैं, जो बंकन पदों को संघनित करके हटा देता है और नीचे दी गई अक्षीय कठोरता छोड़ देता है।

<TrussElement :hinges="[true, true]"  caption="2D ट्रस अवयव का योजनाचित्र" />

## स्वातंत्र्य-कोटियाँ {#degrees-of-freedom}

2D ट्रस अवयव के हर नोड पर दो DOFs होते हैं:

- **स्थानांतरण (Dx):** X-अक्ष के अनुदिश विस्थापन।
- **स्थानांतरण (Dz):** Z-अक्ष के अनुदिश विस्थापन।

## स्थानीय कठोरता मैट्रिक्स {#local-stiffness-matrix}

ट्रस अवयव का स्थानीय कठोरता मैट्रिक्स इस प्रकार है:

$$
\mathbf{K_l} =
\begin{pmatrix}
   \frac{EA}{L} & 0 & -\frac{EA}{L} & 0 \\[2ex]
   0 & 0 & 0 & 0 \\[1ex]
   -\frac{EA}{L} & 0 & \frac{EA}{L} & 0 \\[2ex]
   0 & 0 & 0 & 0
\end{pmatrix}
$$

जहाँ:

- $E$ सामग्री का प्रत्यास्थता मापांक (Young's modulus) है
- $A$ बीम का अनुप्रस्थ काट क्षेत्रफल है
- $L$ बीम की लंबाई है

## रूपांतरण मैट्रिक्स {#transformation-matrix}

अवयव रूपांतरण मैट्रिक्स (transformation matrix) $\mathbf{T}$ का उपयोग स्थानीय कठोरता मैट्रिक्स को वैश्विक निर्देशांक तंत्र में रूपांतरित करने के लिए किया जाता है।

$$
\mathbf{T} = \begin{pmatrix}
   \cos(\alpha) & \sin(\alpha) & 0 & 0 \\
   -\sin(\alpha) & \cos(\alpha) & 0 & 0 \\
   0 & 0 & \cos(\alpha) & \sin(\alpha) \\
   0 & 0 & -\sin(\alpha) & \cos(\alpha)
\end{pmatrix}
$$

## वैश्विक कठोरता मैट्रिक्स {#global-stiffness-matrix}

वैश्विक कठोरता मैट्रिक्स $\mathbf{K_g}$ अवयव रूपांतरण मैट्रिक्स $\mathbf{T}$ को स्थानीय कठोरता मैट्रिक्स $\mathbf{K_l}$ से गुणा करके प्राप्त होता है:

$$
\mathbf{K_g} = \mathbf{T}^\mathsf{T} \cdot \mathbf{K_l} \cdot \mathbf{T}
$$

गुणन का परिणाम है:

$$
\mathbf{K_g}={ {EA}\over{l}}\left[\begin{array}{cccc}
c^2&cs&-c^2&-cs\\
cs&s^2&-cs& -s^2\\
-c^2&-cs&c^2&cs\\
-cs&-s^2&cs&s^2
\end{array}\right];\;\;\begin{array}{c}c=\cos(\alpha)\\s=\sin(\alpha)\end{array}


$$
