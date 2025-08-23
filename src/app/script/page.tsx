"use client";

import React, { useState } from 'react';
import { Copy, Camera, Globe, Volume2, Heart, Languages, X, Star, SplitSquareVertical } from 'lucide-react';

export default function ScriptPage() {
  const [activeTab, setActiveTab] = useState('triple-screen');
  const [copiedScript, setCopiedScript] = useState<string | null>(null);
  const [showTranslation, setShowTranslation] = useState(false);
  const [currentTranslation, setCurrentTranslation] = useState<string>("");
  const [selectedVersion, setSelectedVersion] = useState<string>('all');


  const copyToClipboard = (text: string, scriptName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedScript(scriptName);
    setTimeout(() => setCopiedScript(null), 2000);
  };

  const showChineseTranslation = (translation: string) => {
    setCurrentTranslation(translation);
    setShowTranslation(true);
  };

  interface Template {
    id?: string;
    name: string;
    version?: string;
    createdDate?: string;
    rating?: number;
    tags?: string[];
    description: string;
    prompt: string;
    translation?: string;
  }

  const getFilteredTemplates = (templates: Template[]) => {
    if (selectedVersion === 'all') return templates;
    return templates.filter(template => template.version === selectedVersion);
  };

  const getAllVersions = (templates: Template[]) => {
    const versions = templates.map(template => template.version).filter((v): v is string => Boolean(v));
    return ['all', ...Array.from(new Set(versions)).sort().reverse()];
  };

  // 🎬 三分屏腳本
  const tripleScreenScript = {
    title: "垂直三分屏影片腳本系列 | Triple Split-Screen Video Script Series",
    description: "專業的垂直三分屏影片腳本，適用於短視頻平台如 TikTok、Instagram Reels 等 | Professional vertical triple split-screen video scripts for short video platforms like TikTok, Instagram Reels, etc.",
    concept: {
      zh: "使用垂直三分屏格式（9:16），每個面板展示不同的場景或角度，創造豐富的視覺層次和敘事效果。適合展示產品、教學內容或創意表達。",
      en: "Using vertical triple split-screen format (9:16), each panel showcases different scenes or angles, creating rich visual layers and narrative effects. Perfect for showcasing products, educational content, or creative expression."
    },
    templates: [
      {
        name: "基礎三分屏模板 | Basic Triple Split-Screen Template",
        description: "簡潔的三分屏結構，適合初學者使用 | Clean triple split-screen structure, perfect for beginners",
        prompt: `Create a vertical triple split-screen video (9:16 aspect ratio) with three distinct panels:

Left Panel: Close-up product showcase
- Focus on product details and textures
- Use macro lens for sharp, detailed shots
- Soft lighting to highlight key features

Center Panel: Medium shot demonstration
- Show product in use or action
- Include hands/person for scale and context
- Natural lighting for realistic appearance

Right Panel: Wide shot environment
- Establish setting and atmosphere
- Show complete scene or background
- Ambient lighting to create mood

Each panel should be clearly defined with smooth transitions between scenes. Use consistent color grading across all three panels for visual harmony.`,
        translation: "創建垂直三分屏影片（9:16寬高比）包含三個不同面板：\n\n左面板：產品特寫展示\n- 聚焦產品細節和質地\n- 使用微距鏡頭拍攝清晰詳細的畫面\n- 柔和燈光突出關鍵特徵\n\n中間面板：中景示範\n- 展示產品使用或動作\n- 包含手部/人物以提供比例和背景\n- 自然光線營造真實外觀\n\n右面板：廣角環境\n- 建立場景和氛圍\n- 展示完整場景或背景\n- 環境燈光營造情緒\n\n每個面板都應清楚定義，場景間有流暢過渡。在三個面板間使用一致的色彩分級以實現視覺和諧。"
      }
    ]
  };

  // 🎭 ASMR 分靈體摧毀系列
  const asmrHorcruxScript = {
    title: "ASMR 分靈體摧毀系列 | ASMR Horcrux Destruction Series",
    description: "結合 ASMR 元素的哈利波特分靈體摧毀場景，創造沉浸式的聽覺和視覺體驗 | Harry Potter Horcrux destruction scenes combined with ASMR elements, creating immersive auditory and visual experiences",
    concept: {
      zh: "將經典的哈利波特分靈體摧毀場景重新詮釋為 ASMR 內容，注重細膩的聲音效果和視覺細節，創造放鬆而神秘的氛圍。",
      en: "Reinterpreting classic Harry Potter Horcrux destruction scenes as ASMR content, focusing on delicate sound effects and visual details to create a relaxing yet mysterious atmosphere."
    },
    templates: [
      {
        name: "湯姆瑞德爾日記 ASMR 摧毀 | Tom Riddle's Diary ASMR Destruction",
        description: "以 ASMR 形式重現哈利用蛇怪毒牙摧毀湯姆瑞德爾日記的經典場景 | Recreating Harry's destruction of Tom Riddle's diary with basilisk fang in ASMR format",
        prompt: `Create an ASMR-style video of Tom Riddle's diary destruction scene:

Setting: Dark, atmospheric Chamber of Secrets environment
- Dim, flickering candlelight
- Stone walls with ancient textures
- Mysterious shadows and mist

Focus Elements:
- Close-up of the worn, leather-bound diary
- Detailed texture of aged parchment pages
- Glistening basilisk fang with realistic venom droplets
- Slow, deliberate movements

Sound Design (ASMR Focus):
- Gentle page turning and paper rustling
- Soft leather creaking
- Droplet sounds as venom touches paper
- Whispered incantations and breathing
- Subtle magical crackling sounds
- Peaceful ambient cave acoustics

Visual Effects:
- Slow-motion venom penetration
- Gentle glowing effects as magic is destroyed
- Soft particle effects for magical essence escaping
- Smooth camera movements and close-ups

Pacing: Slow and meditative, typical of ASMR content
Duration: 3-5 minutes of relaxing destruction sequence`,
        translation: "創建湯姆瑞德爾日記摧毀場景的 ASMR 風格影片：\n\n場景設置：黑暗、神秘的密室環境\n- 微弱搖曳的燭光\n- 古老質感的石牆\n- 神秘的陰影和霧氣\n\n焦點元素：\n- 磨損皮革裝訂日記的特寫\n- 陳舊羊皮紙頁面的細節質地\n- 帶有逼真毒液滴的閃亮蛇怪毒牙\n- 緩慢、審慎的動作\n\n聲音設計（ASMR 焦點）：\n- 溫和的翻頁和紙張沙沙聲\n- 柔軟的皮革嘎吱聲\n- 毒液觸碰紙張的滴水聲\n- 低聲咒語和呼吸聲\n- 微妙的魔法噼啪聲\n- 平靜的洞穴環境音\n\n視覺效果：\n- 毒液滲透的慢動作\n- 魔法被摧毀時的溫和發光效果\n- 魔法精華逸散的柔和粒子效果\n- 流暢的攝影機移動和特寫\n\n節奏：緩慢冥想，典型的 ASMR 內容\n持續時間：3-5分鐘的放鬆摧毀序列"
      }
    ]
  };

  // 🐱 小貓咪魔法水晶球系列
  const kittenJellyScript = {
    title: "小貓咪魔法水晶球互動系列 | Kitten Magical Crystal Ball Interaction Series",
    description: "可愛的小貓咪與魔法水晶球的互動場景，結合1980年代膠卷美學與ASMR音效 | Adorable kitten interactions with magical crystal balls, combining 1980s film aesthetic with ASMR sound effects",
    concept: {
      zh: "以胖胖橘貓為主角，展現與魔法水晶球的溫馨互動，每隻貓咪都戴著獨特的巫師帽，營造溫暖可愛的魔法氛圍。",
      en: "Featuring chubby orange cats as protagonists, showcasing warm interactions with magical crystal balls, each cat wearing unique wizard hats to create a warm and adorable magical atmosphere."
    },
    templates: [
      {
        id: "wizard-kitten-v5",
        name: "Black Chef Cat with Knife Approach & Camera Bump Scene",
        version: "5.0",
        createdDate: "2025-01-11",
        rating: 4.9,
        tags: ["黑貓大廚", "叼菜刀", "撞鏡頭", "呼嚕聲", "廚房搞笑"],
        description: "Adorable black chef cat slowly approaching with knife, then bumping into camera while purring continuously",
        prompt: `Based on Vertical triple split-screen (9:16 each) - Black Kitchen Chef Cat Knife Comedy with Camera Bump:

Left panel (Black Chef Cat Preparation):
Create a hyper-realistic wide shot of a cozy kitchen setting with warm lighting and professional cooking equipment.
The camera is locked off at 9:16 aspect ratio using Canon EOS R5 with 24-70mm lens at 35mm, f/5.6, ISO 200, shutter angle 180°.
A chubby black cat wearing a tiny white chef's hat and miniature apron stands at the far end of the kitchen counter. The cat has an adorable, focused expression with bright golden eyes showing determination. Its sleek black fur contrasts beautifully with the white chef's hat and apron. In its mouth, it carefully holds a small, clean kitchen knife by the handle - the knife appears proportionally sized and safe, like a butter knife or small paring knife. The cat's posture shows it's about to begin a slow, deliberate walk toward the camera.
Kitchen environment shows cutting boards, vegetables waiting to be chopped, and other cooking utensils neatly arranged. The atmosphere is warm and inviting, suggesting the cat is a helpful kitchen assistant ready to start cooking.
Ambient kitchen sounds at –4 dB: gentle kitchen ambiance, soft cat purring beginning, distant cooking sounds, peaceful breathing.
Lighting: Warm, golden kitchen lighting with soft shadows, creating a cozy and safe cooking atmosphere that highlights the black cat's sleek fur.

Center panel (Slow Approach Journey):
Create a hyper-realistic medium shot capturing the black chef cat's slow, deliberate approach toward the camera as it walks to the end of the counter.
Camera: 9:16 ratio, 85mm lens, f/4, ISO 200, tracking the cat's movement as it walks forward along the kitchen counter.
The black chef cat moves with careful, measured steps, each paw placed deliberately as it maintains perfect balance while carrying the small knife. Its expression remains focused and professional, like a skilled chef approaching their workstation. The cat's chef hat stays perfectly positioned, and its tail swishes gently with each step. The knife remains securely held in its mouth, positioned safely.
The cat's movement is slow and graceful, showing complete control and confidence as it approaches the end of the counter. Its golden eyes remain focused ahead, and its whiskers twitch slightly with concentration. The chef's apron flutters gently with each step, adding to the professional cooking atmosphere.
Continuous purring sounds at –5 dB: steady, content purring throughout the approach, soft paw steps on the kitchen floor, gentle breathing, the slight rustle of the chef's apron.
Lighting: Soft tracking lighting that follows the cat's movement, maintaining consistent warm illumination throughout the approach.

Right panel (Camera Bump Comedy Finale):
Create a hyper-realistic extreme close-up shot of the black chef cat's face as it reaches the end and accidentally bumps into the camera lens.
Camera: 9:16 ratio, 100mm macro lens, f/2.8, ISO 200, starting focused on the cat's determined expression, then creating a gentle "bump" effect as the cat touches the lens.
The black cat's face shows complete concentration and professional pride as it approaches. Its golden eyes are bright and focused, whiskers are perfectly positioned, and its expression radiates confidence and culinary expertise. The small knife is held securely in its mouth, positioned like a professional chef ready to begin food preparation. The tiny chef's hat sits perfectly on its head.
As the cat reaches the very end of its journey, it gently bumps its nose against the camera lens, creating a surprised but delighted expression. The bump is gentle and safe, with the cat immediately starting to purr even louder, as if saying "I made it!" The camera slightly shakes from the gentle bump, adding to the comedy.
Intense purring and comedy sounds at –6 dB: extremely loud, satisfied purring that increases after the bump, gentle breathing, slight camera shake sound, the cat's delighted "mrrow" sound, soft kitchen ambiance.
Lighting: Soft, close-up lighting that highlights the black cat's facial features, the professional chef's hat, and the safely held kitchen tool, with slight lens flare effect from the gentle bump creating a magical, heartwarming moment.

The entire scene combines professional cooking preparation with adorable black cat behavior and comedy timing, creating a warm, humorous, and incredibly cute video that showcases a dedicated black chef cat's journey ending in an adorable camera bump moment with intense purring satisfaction.`,
        translation: `基於垂直三分屏（每格 9:16）- 黑貓廚房大廚菜刀撞鏡頭喜劇：

左面板（黑貓大廚準備）：
創建一個溫馨廚房環境的超寫實廣角鏡頭，配有溫暖燈光和專業烹飪設備。
相機鎖定為 9:16 寬高比，使用 Canon EOS R5 配 24-70mm 鏡頭於 35mm，f/5.6，ISO 200，快門角度 180°。
一隻胖胖的黑貓戴著小白廚師帽和迷你圍裙，站在廚房檯面的遠端。貓咪有著可愛、專注的表情，明亮的金色眼睛顯示著決心。它光滑的黑色毛髮與白色廚師帽和圍裙形成美麗的對比。它的嘴裡小心地叼著一把小而乾淨的廚房刀具，刀子看起來比例適中且安全，像奶油刀或小削皮刀。貓咪的姿勢顯示它即將開始緩慢、有目的地向鏡頭走去。
廚房環境顯示砧板、等待切割的蔬菜和其他烹飪用具整齊排列。氛圍溫暖而誘人，暗示貓咪是一個有用的廚房助手，準備開始烹飪。
環境廚房聲音 –4 dB：溫和的廚房環境音，開始的輕柔貓咪呼嚕聲，遠處的烹飪聲音，平靜的呼吸聲。
燈光：溫暖的金色廚房燈光配柔和陰影，營造舒適安全的烹飪氛圍，突出黑貓光滑的毛髮。

中間面板（緩慢接近之旅）：
創建捕捉黑貓大廚沿著廚房檯面緩慢、有目的地向鏡頭接近並走向盡頭的超寫實中景鏡頭。
相機：9:16 比例，85mm 鏡頭，f/4，ISO 200，追蹤貓咪沿著廚房檯面向前走的動作。
黑貓大廚以小心、有節奏的步伐移動，每隻爪子都小心放置，在叼著小刀時保持完美平衡。它的表情保持專注和專業，像一位技術熟練的廚師接近工作台。貓咪的廚師帽保持完美位置，尾巴隨著每一步輕柔搖擺。刀子在嘴中保持安全。
貓咪的動作緩慢優雅，在接近檯面盡頭時顯示完全的控制和自信。它的金色眼睛保持向前專注，鬍鬚因專注而輕微顫動。廚師圍裙隨著每一步輕柔飄動，增添專業烹飪氛圍。
持續呼嚕聲 –5 dB：整個接近過程中穩定、滿足的呼嚕聲，在廚房地板上的輕柔爪步聲，溫和呼吸聲，廚師圍裙的輕微沙沙聲。
燈光：跟隨貓咪動作的柔和追蹤燈光，在整個接近過程中保持一致的溫暖照明。

右面板（撞鏡頭搞笑大結局）：
創建黑貓大廚到達盡頭並意外撞到鏡頭鏡面時面部的超寫實極端特寫鏡頭。
相機：9:16 比例，100mm 微距鏡頭，f/2.8，ISO 200，開始聚焦在貓咪堅定的表情上，然後當貓咪觸碰鏡頭時創造溫和的"撞擊"效果。
黑貓的面孔在接近時顯示完全的專注和專業自豪。它的金色眼睛明亮而專注，鬍鬚完美定位，整體表情散發著自信和烹飪專業知識。小刀在嘴中叼得安全牢固，位置像準備開始食物準備的專業廚師。小廚師帽完美地戴在頭上。
當貓咪到達旅程的最終點時，它輕柔地用鼻子撞到鏡頭鏡面，創造出驚訝但高興的表情。撞擊是溫和且安全的，貓咪立即開始呼嚕得更響，彷彿在說"我做到了！"鏡頭因溫和的撞擊而輕微搖晃，增添喜劇效果。
強烈呼嚕聲和搞笑聲音 –6 dB：極其響亮、滿足的呼嚕聲在撞擊後增加，溫和呼吸聲，輕微的鏡頭搖晃聲，貓咪高興的"喵嗚"聲，柔和的廚房環境音。
燈光：柔和的特寫燈光突出黑貓的面部特徵、專業廚師帽和安全叼著的廚房工具，溫和撞擊造成的輕微鏡頭光暈效果創造魔法般的溫暖時刻。

整個場景將專業烹飪準備與可愛的黑貓行為和喜劇時機相結合，創造了一個溫暖、幽默且極其可愛的視頻，展示了一隻專業黑貓大廚的旅程以可愛的撞鏡頭時刻和強烈的呼嚕滿足感結束。`
      },
      {
        id: "wizard-kitten-v4",
        name: "Kitten Bakery Dough Kneading Scene",
        version: "4.0",
        createdDate: "2025-01-11",
        rating: 4.9,
        tags: ["貓咪大廚", "肚子揉麵", "廚房搞笑", "溫馨搞笑", "廚師帽"],
        description: "Adorable cats in kitchen bakery scene - chef cat kneading orange cat's belly like dough",
        prompt: `Based on Vertical triple split-screen (9:16 each) - Kitchen Bakery Cat Comedy:

Left panel (Setup Scene):
Create a hyper-realistic wide shot of a cozy kitchen bakery setting with a wooden cutting board as the centerpiece.
The camera is locked off at 9:16 aspect ratio using Canon EOS R5 with 24-70mm lens at 35mm, f/5.6, ISO 200, shutter angle 180°.
On the cutting board, a chubby orange tabby cat lies on its back in a completely relaxed position, with its round, plump belly exposed upward like a perfect dough ball. The orange cat's fluffy fur is lightly dusted with flour, making it look exactly like bread dough. Its expression is blissful and content, eyes half-closed in pure relaxation, showing it's thoroughly enjoying this unusual "spa treatment."
Standing beside the cutting board, a gray and white cat wearing a tiny white chef's hat and miniature apron positions itself like a professional baker. The chef cat has a focused, serious expression, displaying the concentration of a skilled baker about to work on dough. Its paws are positioned ready to begin the "kneading" process.
Kitchen environment shows flour scattered around the cutting board, measuring cups, rolling pins, and other baking tools visible in the background. The atmosphere is warm and inviting, suggesting a cozy bakery setting.
Ambient kitchen sounds at –4 dB: gentle kitchen ambiance, soft cat purring from the orange cat, distant baking sounds, peaceful breathing.
Lighting: Warm, golden kitchen lighting with soft shadows, creating a cozy bakery atmosphere.

Center panel (Belly Kneading):
Create a hyper-realistic medium shot focusing on the "dough kneading" interaction between the two cats.
Camera: 9:16 ratio, 85mm lens, f/4, ISO 200, capturing the detailed interaction.
The chef cat carefully places its front paws on the orange cat's round, fluffy belly and begins gentle, rhythmic pressing motions that perfectly mimic bread dough kneading. The orange cat's belly fur creates small indentations under the gentle pressure, bouncing back like elastic dough. The chef cat's movements are purposeful and rhythmic, completely mimicking the motions of kneading dough.
The orange cat remains completely relaxed and content, purring softly as it enjoys the gentle belly massage. Its eyes are blissfully closed, and its body stays perfectly still like compliant dough. The chef cat's expression is focused and serious, as if it's a professional baker concentrating on perfecting the dough.
Kneading sounds at –5 dB: soft, rhythmic pressing sounds, gentle purring from both cats, slight flour puffing with each press, satisfied cat breathing.
Lighting: Focused lighting highlighting the kneading action, with gentle shadows showing the "dough cat's" belly fur indentations.

Right panel (Comedy Close-up):
Create a hyper-realistic extreme close-up shot of both cats' faces showing the comedy contrast.
Camera: 9:16 ratio, 100mm macro lens, f/2.8, ISO 200, alternating focus between the two cats' faces.
The orange cat's face shows pure bliss and relaxation, with half-closed amber eyes, a slight smile, and completely relaxed whiskers. Its expression radiates contentment and enjoyment, like someone receiving a perfect massage.
The chef cat's face shows intense concentration and professional pride, with focused eyes, slightly furrowed brow, and whiskers positioned forward in concentration. Its tiny chef's hat sits perfectly on its head, and its overall expression suggests it's taking its "baking" role very seriously.
The contrast between the orange cat's blissful relaxation and the chef cat's serious professional demeanor creates perfect comedy timing.
Close-up sounds at –6 dB: detailed purring variations, gentle breathing from both cats, soft fabric sounds from the chef's hat and apron, intimate kitchen ambiance.
Lighting: Soft, intimate lighting that highlights both cats' facial expressions and the professional chef's hat, creating a heartwarming and humorous scene.

The entire scene combines professional baking techniques with adorable cat behavior, creating a warm, humorous, and incredibly cute video that showcases a chef cat treating another cat's belly as the perfect bread dough in a cozy kitchen environment.`,
        translation: `基於垂直三分屏（每格 9:16）- 廚房烘焙貓咪喜劇：

左面板（設置場景）：
創建一個以木製砧板為中心的溫馨廚房烘焙環境的超寫實廣角鏡頭。
相機鎖定為 9:16 寬高比，使用 Canon EOS R5 配 24-70mm 鏡頭於 35mm，f/5.6，ISO 200，快門角度 180°。
在砧板上，一隻胖胖的橙色虎斑貓仰面躺著，完全放鬆的姿勢，圓滾滾、胖乎乎的肚子向上露出，像完美的麵團球。橙貓蓬鬆的毛髮輕輕撒了一些麵粉，看起來就像麵包麵團。它的表情幸福而滿足，眼睛半閉著純粹的放鬆狀態，顯示它完全享受這個不尋常的"水療"。
站在砧板旁邊，一隻灰白色貓咪戴著小白廚師帽和迷你圍裙，像專業麵包師一樣定位自己。大廚貓有著專注、嚴肅的表情，展現出技術熟練的麵包師即將處理麵團的專注度。它的爪子準備好開始"揉麵"過程。
廚房環境顯示砧板周圍散落著麵粉，量杯、擀麵杖和其他烘焙工具在背景中可見。氛圍溫暖而誘人，暗示舒適的烘焙坊設置。
環境廚房聲音 –4 dB：溫和的廚房環境音，橙貓的輕柔呼嚕聲，遠處的烘焙聲音，平靜的呼吸聲。
燈光：溫暖的金色廚房燈光配柔和陰影，營造舒適的烘焙坊氛圍。

中間面板（肚子揉製）：
創建專注於兩隻貓咪之間"麵團揉製"互動的超寫實中景鏡頭。
相機：9:16 比例，85mm 鏡頭，f/4，ISO 200，捕捉詳細的互動。
大廚貓小心地將前爪放在橙貓圓滾滾、蓬鬆的肚子上，開始溫和、有節奏的按壓動作，完美模仿麵包麵團揉製。橙貓的肚子毛髮在溫和壓力下產生小凹陷，像彈性麵團一樣彈回。大廚貓的動作有目的性和節奏性，完全模仿揉麵團的動作。
橙貓保持完全放鬆和滿足，輕柔地呼嚕著享受溫和的肚子按摩。它的眼睛幸福地閉著，身體保持完全靜止，像順從的麵團。大廚貓的表情專注而嚴肅，彷彿是一位專業麵包師專注於完善麵團。
揉麵聲音 –5 dB：柔和、有節奏的按壓聲，兩隻貓咪的溫和呼嚕聲，每次按壓時麵粉輕微飄起，滿足的貓咪呼吸聲。
燈光：聚焦照明突出揉麵動作，溫和的陰影顯示"麵團貓"肚子毛髮的凹陷。

右面板（特寫喜劇）：
創建兩隻貓咪面孔的超寫實極端特寫鏡頭，顯示喜劇對比。
相機：9:16 比例，100mm 微距鏡頭，f/2.8，ISO 200，在兩隻貓咪的面孔之間交替聚焦。
橙貓的面孔顯示純粹的幸福和放鬆，半閉的琥珀色眼睛，微微的笑容，完全放鬆的鬍鬚。它的表情散發著滿足和享受，像接受完美按摩的人。
大廚貓的面孔顯示強烈的專注和專業自豪，專注的眼神，微微皺起的眉頭，鬍鬚因專注而向前定位。它的小廚師帽完美地戴在頭上，整體表情暗示它非常認真地對待"烘焙"角色。
橙貓的幸福放鬆和大廚貓的嚴肅專業風範之間的對比創造了完美的喜劇時機。
特寫聲音 –6 dB：詳細的呼嚕聲變化，兩隻貓咪的溫和呼吸聲，廚師帽和圍裙的柔軟織物聲，親密的廚房環境音。
燈光：柔和、親密的燈光突出兩隻貓咪的面部表情和專業廚師帽，營造溫馨而幽默的場景。

整個場景將專業烘焙技術與可愛的貓咪行為相結合，創造了一個溫暖、幽默且極其可愛的視頻，展示了一隻大廚貓將另一隻貓的肚子當作完美麵包麵團的舒適廚房環境。`
      },
      {
        id: "wizard-kitten-v3",
        name: "Triple Wizard Kitten Crystal Ball Interaction",
        version: "3.0",
        createdDate: "2025-01-11",
        rating: 4.8,
        tags: ["胖橘貓", "魔法水晶球", "80年代膠卷", "ASMR"],
        description: "Three adorable chubby orange wizard kittens with magical crystal balls in 1980s film aesthetic POV",
        prompt: `Based on Vertical triple split-screen (9:16 each) with authentic 1980s film aesthetic:

Left panel (85% frame coverage):
Create a hyper-realistic first-person POV shot where a massive translucent purple crystal ball dominates 85% of the frame.
Camera: Canon AE-1 with 50mm f/2.8 lens, f/4, ISO 400, 180° shutter angle, Kodak Portra 400 film stock.
Behind the crystal ball, a chubby orange tabby kitten mystical alchemist wearing a purple wizard hat adorned with silver stars and crescents. The hat sits perfectly on its round head. The kitten's amber eyes sparkle with magical curiosity as it gently presses its tiny paws against the crystal ball, causing ethereal violet mists, floating amethyst crystals, and northern aurora effects to swirl inside.
The crystal ball appears to bulge directly toward the viewer, creating an immersive first-person perspective as if the viewer is about to catch or touch it. The sphere pulses with magical energy, and its surface shows beautiful light refractions.
1980s film aesthetic: Authentic grain structure, vintage color grading with warm highlights and cool shadows, natural light leaks from the edges, soft focus on background elements.
Mystical crystal ball sounds at –6 dB: gentle chiming, soft ASMR jelly squishing sounds, kitten's content purring, magical sparkle effects, whispered incantations.
The sphere appears to pulse and breathe toward the viewer, maintaining the illusion of imminent contact with the camera lens. Audio isolated, no background hum.`,
        translation: `基於垂直三分屏（每格 9:16）配真實的 1980 年代膠卷美學：

左面板（85% 畫面覆蓋）：
創建一個超寫實第一人稱 POV 鏡頭，其中巨大的半透明紫色水晶球佔據 85% 的畫面。
相機：Canon AE-1 配 50mm f/2.8 鏡頭，f/4，ISO 400，180° 快門角度，Kodak Portra 400 膠卷。
在水晶球後面，一隻胖胖的橙色虎斑小貓神秘煉金術師戴著裝飾著銀色星星和月牙的紫色巫師帽。帽子完美地戴在它圓圓的頭上。小貓的琥珀色眼睛閃爍著魔法好奇心，它輕輕地將小爪子貼在水晶球上，導致空靈的紫羅蘭薄霧、飄浮的紫水晶和北極光效果在內部旋轉。
水晶球似乎直接向觀眾凸出，創造沉浸式第一人稱視角，彷彿觀眾即將抓住或觸摸它。球體脈動著魔法能量，其表面顯示美麗的光折射。
1980 年代膠卷美學：真實的顆粒結構，溫暖高光和冷陰影的復古色彩分級，邊緣的自然光滲漏，背景元素的柔焦。
神秘水晶球聲音 –6 dB：溫和的鈴聲，柔軟的 ASMR 果凍擠壓聲，小貓滿足的呼嚕聲，魔法閃爍效果，低聲咒語。
球體似乎向觀眾脈動和呼吸，保持即將與相機鏡頭接觸的錯覺。音頻獨立，無背景嗡嗡聲。`
      },
      {
        id: "wizard-kitten-v2",
        name: "Triple Wizard Kitten Crystal Ball Interaction",
        version: "2.0",
        createdDate: "2025-01-10",
        rating: 4.3,
        tags: ["小貓咪", "果凍球", "ASMR"],
        description: "Early version with jelly balls instead of crystal balls",
        prompt: `Based on Vertical triple split-screen (9:16 each):

Left panel:
Create a hyper-realistic first-person POV shot where a massive translucent purple jelly ball dominates 75% of the frame.
Simple setup with basic kitten interactions. Orange tabby kitten behind jelly ball with basic wizard hat.
Standard camera settings and basic lighting.
Basic jelly manipulation sounds at –6 dB.

Center panel:
Create a hyper-realistic first-person POV shot where a pink jelly ball fills 80% of the frame.
Gray and white kitten with pink wizard hat, basic setup.
Standard manipulation and sounds at –5 dB.

Right panel:
Create a hyper-realistic first-person POV shot where a blue jelly ball consumes 90% of the frame.
Black and white tuxedo kitten with blue wizard hat.
Basic setup and sounds at –4 dB.`,
        translation: `基於垂直三分屏（每格 9:16）：

左面板：
創建超寫實第一人稱 POV 鏡頭，其中巨大的半透明紫色果凍球佔據 75% 的畫面。
簡單設置，基本小貓互動。橙色虎斑貓在果凍球後面，戴著基本巫師帽。
標準相機設置和基本照明。
基本果凍操作聲音 –6 dB。

中間面板：
創建超寫實第一人稱 POV 鏡頭，其中粉色果凍球填滿 80% 的畫面。
灰白色小貓戴著粉色巫師帽，基本設置。
標準操作和聲音 –5 dB。

右面板：
創建超寫實第一人稱 POV 鏡頭，其中藍色果凍球佔據 90% 的畫面。
黑白燕尾服小貓戴著藍色巫師帽。
基本設置和聲音 –4 dB。`
      },
      {
        id: "wizard-kitten-v1",
        name: "Simple Kitten Jelly Interaction",
        version: "1.0",
        createdDate: "2025-01-09",
        rating: 3.9,
        tags: ["小貓咪", "果凍球"],
        description: "Original basic version without wizard hats",
        prompt: `Basic triple split-screen with simple kitten and jelly ball interactions.
No wizard hats, basic settings, minimal effects.
Left: Orange kitten with purple jelly
Center: Gray kitten with pink jelly  
Right: Black kitten with blue jelly
Simple audio and basic lighting.`,
        translation: `基本的三分屏設置，簡單的小貓和果凍球互動。
沒有巫師帽，基本設置，最少特效。
左：橙色小貓配紫色果凍
中：灰色小貓配粉色果凍
右：黑色小貓配藍色果凍
簡單音頻和基本照明。`
      }
    ]
  };

  // 🎉 非洲祝福生日腳本
  const africaBirthdayScript = {
    title: "非洲肌肉猛男祝福生日系列 | African Muscular Men Birthday Blessing Series",
    description: "強壯肌肉猛男的非洲祝福生日場景，展現力量與溫暖的祝福時刻 | Muscular African men birthday blessing scenes, showcasing strength and warm blessing moments",
    concept: {
      zh: "使用垂直三分屏格式，展現非洲肌肉猛男表演者慶祝生日的真摯祝福場景。所有表演者都是強壯的黑人肌肉猛男，露出上半身展現強健的肌肉線條。左屏：戶外草地慶祝場景，中屏：室內黑板書寫祝福，右屏：傳統舞蹈慶祝。每個面板都有不同的背景環境和慶祝方式，展現力量與文化的結合。",
      en: "Using vertical triple split-screen format to showcase sincere African muscular men performers celebrating birthdays. All performers are strong black muscular men, showing off their upper body with strong muscle lines. Left panel: outdoor grassland celebration scene, center panel: indoor blackboard blessing writing, right panel: traditional dance celebration. Each panel features different background environments and celebration methods, showcasing the combination of strength and culture."
    },
    templates: [
      {
        name: "場景1：肌肉猛男慶祝場景 | Scene 1: Muscular Men Celebration",
        description: "強壯肌肉猛男的歡樂慶祝，主要表演者拿著大黑板展示\"HAPPY BIRTHDAY\" | Joyful celebration by muscular men, main performer holding large chalkboard displaying 'HAPPY BIRTHDAY'",
        prompt: `Vertical triple split-screen (9:16 each panel) - African Muscular Men Birthday Blessing scenes:

Left panel (Outdoor Grassland Celebration):
Create a hyper-realistic wide shot of 6-8 powerful African muscular men standing on vibrant green grassland under bright blue sky with white clouds.
Camera: 9:16 aspect ratio, Canon EOS R5 with 24-70mm lens at 35mm, f/8, ISO 100, capturing the full celebratory scene.
All performers are impressive, muscular African men with well-defined physiques - broad shoulders, sculpted chest muscles, strong arms, and defined abs. They are shirtless, showcasing their impressive upper body strength and muscle definition. Their skin glistens slightly in the sunlight, highlighting every muscle contour. The main performer in the center holds a large black chalkboard (approximately 60cm x 40cm) with "HAPPY BIRTHDAY" written in large, clear white chalk letters. The other muscular men surround the main person, making celebratory gestures like flexing biceps, thumbs up, heart signs, and holding the birthday star's photo. All performers face the camera directly with genuine smiles and confident expressions.
The group is arranged in a natural formation with the main performer prominently in the center, others slightly behind and to the sides, creating visual depth. The large chalkboard is held at chest level, clearly visible and dominating the center of the frame.
Natural outdoor sounds at –3 dB: gentle wind through grass, distant birds singing, happy birthday song in Chinese "姐夫生日快樂" sung in deep, masculine voices, clapping hands, joyful laughter, enthusiastic cheering.
Lighting: bright natural sunlight creating clear muscle definition and cheerful atmosphere, with soft shadows on the grass emphasizing their muscular physiques, ensuring the large "HAPPY BIRTHDAY" text on the chalkboard is clearly visible and prominent.

Center panel (Indoor Chalkboard Writing):
Create a hyper-realistic medium shot of 5-6 African muscular men in a clean indoor setting with white/light colored walls.
Camera: 9:16 ratio, 85mm lens, f/4, ISO 200, focusing on the chalkboard writing activity.
The performers are all impressive, well-built African men with muscular torsos, broad shoulders, and defined chest and arm muscles. They are shirtless, displaying their powerful upper body physiques. The main performer in the center holds a large black chalkboard (approximately 50cm x 35cm) and is actively writing "HAPPY BIRTHDAY" in large, clear white chalk letters with his muscular arms. The other muscular men stand around the main person, making encouraging gestures like flexing, thumbs up, pointing at the board, and holding the birthday star's photo. All performers maintain direct eye contact with the camera, showing sincere, warm smiles and confident masculine presence.
The main performer's muscular arm movement while writing is clearly visible, showing strength and precision. The "HAPPY BIRTHDAY" text is prominently displayed on the large chalkboard. The indoor environment is well-lit and clean.
Indoor acoustic sounds at –4 dB: chalk writing on chalkboard, gentle clapping, encouraging voices saying "Happy Birthday" in deep masculine tones, shuffling of feet, warm ambient room tone.
Lighting: even, soft indoor lighting ensuring clear visibility of faces, muscular definition, and especially the large "HAPPY BIRTHDAY" text being written on the chalkboard.

Right panel (Traditional Dance Celebration):
Create a hyper-realistic dynamic shot of 7-10 African muscular dancers performing energetic traditional celebration dances.
Camera: 9:16 ratio, 24-70mm lens at 50mm, f/5.6, ISO 200, capturing the full-body dance movements.
The dancers are all powerful, muscular African men with impressive physiques - broad shoulders, sculpted chests, strong arms, and defined abs. They are shirtless, showcasing their strength and muscle definition as they move. Some wear traditional African accessories like colorful beaded necklaces, arm bands, or traditional waist wraps that complement their muscular builds. The main dancer in the center holds a large black chalkboard (approximately 60cm x 40cm) with "HAPPY BIRTHDAY" written in large, bold white chalk letters, incorporating it skillfully into the dance movements with his powerful arms. The other muscular dancers surround the main performer, holding colorful balloons, party decorations, and traditional musical instruments. The dancers are arranged in two rows (front and back) to create depth and layering.
The background features natural elements like trees and grassland. All dancers show coordinated, energetic movements with joyful expressions, their muscles flexing and moving dynamically with the dance choreography, creating a powerful and festive atmosphere. The large chalkboard is held high and displayed prominently as the centerpiece of the choreography.
Celebration sounds at –2 dB: rhythmic African drums, traditional music, energetic singing in deep masculine voices, foot stomping, balloon sounds, enthusiastic cheering focused on the chalkboard.
Lighting: warm, natural outdoor lighting highlighting the movement and muscle definition of the dancers, creating dynamic shadows that enhance their powerful physiques and the dance performance while ensuring the large "HAPPY BIRTHDAY" text on the chalkboard remains clearly visible and prominent.`,
        translation: `垂直三分屏 (每個面板9:16) - 非洲肌肉猛男祝福生日場景：

左面板 (戶外草地慶祝)：
創建6-8位強壯非洲肌肉猛男在鮮豔綠草地上的超寫實廣角鏡頭，背景是明亮的藍天白雲。
相機：9:16寬高比，Canon EOS R5配24-70mm鏡頭於35mm，f/8，ISO 100，捕捉完整的慶祝場景。
所有表演者都是令人印象深刻的非洲肌肉猛男，具有線條分明的體格——寬闊的肩膀、雕塑般的胸肌、強壯的手臂和清晰的腹肌。他們赤裸上身，展示令人印象深刻的上身力量和肌肉定義。他們的皮膚在陽光下微微發光，突出每一條肌肉輪廓。中央的主要表演者手持一塊大黑板（約60cm x 40cm），上面用大字白色粉筆書寫"HAPPY BIRTHDAY"，字跡清晰。其他肌肉猛男圍繞主要人物，做出慶祝手勢如肌肉展示、豎拇指、比愛心，並持有壽星照片。所有表演者直視相機，展現真誠的笑容和自信的表情。
團隊以自然隊形排列，主要表演者突出地位於中央，其他人稍微在後方和兩側，創造視覺深度。大黑板在胸前高度，清晰可見並主導畫面中心。
自然戶外聲音 –3 dB：微風吹過草地，遠處鳥兒歌唱，中文"姐夫生日快樂"深沉男性聲音和聲演唱，拍手聲，歡樂笑聲，熱情歡呼聲。
燈光：明亮的自然陽光創造清晰的肌肉定義和歡快氛圍，草地上有柔和陰影強調他們的肌肉體格，確保大黑板上的"HAPPY BIRTHDAY"文字清晰可見且突出。

中間面板 (室內黑板書寫)：
創建5-6位非洲肌肉猛男在乾淨室內環境中的超寫實中景鏡頭，背景是白色/淺色牆壁。
相機：9:16比例，85mm鏡頭，f/4，ISO 200，專注於黑板書寫活動。
表演者都是令人印象深刻、體格健美的非洲男性，具有肌肉發達的軀體、寬闊的肩膀和清晰的胸肌和手臂肌肉。他們赤裸上身，展示強大的上身體格。中央的主要表演者手持一塊大黑板（約50cm x 35cm），正在用肌肉發達的手臂積極書寫"HAPPY BIRTHDAY"，字跡大而清晰。其他肌肉猛男圍繞主要人物，做出鼓勵手勢如肌肉展示、豎拇指、指向黑板，並持有壽星照片。所有表演者與相機保持直接眼神接觸，展現真誠、溫暖的笑容和自信的男性氣質。
主要表演者的肌肉手臂書寫動作清晰可見，顯示力量和精準度。"HAPPY BIRTHDAY"文字在大黑板上突出顯示。室內環境光線充足且乾淨。
室內聲學效果 –4 dB：粉筆在黑板上書寫聲，溫和拍手聲，深沉男性聲音鼓勵說"Happy Birthday"，腳步聲，溫暖的室內環境音。
燈光：均勻、柔和的室內光線確保面部、肌肉定義，特別是黑板上正在書寫的大字"HAPPY BIRTHDAY"文字的清晰可見。

右面板 (傳統舞蹈慶祝)：
創建7-10位非洲肌肉舞者表演充滿活力的傳統慶祝舞蹈的超寫實動態鏡頭。
相機：9:16比例，24-70mm鏡頭於50mm，f/5.6，ISO 200，捕捉全身舞蹈動作。
舞者都是強大的非洲肌肉猛男，具有令人印象深刻的體格——寬闊的肩膀、雕塑般的胸肌、強壯的手臂和清晰的腹肌。他們赤裸上身，在移動時展示他們的力量和肌肉定義。有些人戴著傳統的非洲配飾，如彩色珠項鍊、臂章或傳統腰帶，這些都與他們的肌肉體格相得益彰。中央的主要舞者手持一塊大黑板（約60cm x 40cm），上面用大字粗體白色粉筆書寫"HAPPY BIRTHDAY"，用他強大的手臂巧妙地將其融入舞蹈動作中。其他肌肉舞者圍繞主要表演者，手持彩色氣球、派對裝飾品和傳統樂器。舞者分為兩排（前後）以創造深度和層次。
背景包含自然元素如樹木和草地。所有舞者展現協調、充滿活力的動作和歡樂表情，他們的肌肉隨著舞蹈編舞動態彎曲和移動，創造強大而節日的氛圍。大黑板被高高舉起並突出展示作為編舞的中心焦點。
慶祝聲音 –2 dB：有節奏的非洲鼓聲，傳統音樂，深沉男性聲音充滿活力的歌唱，踏腳聲，氣球聲，圍繞黑板的熱情歡呼聲。
燈光：溫暖、自然的戶外光線突顯舞者的動作和肌肉定義，創造增強他們強大體格和舞蹈表演的動態陰影，同時確保大黑板上的"HAPPY BIRTHDAY"文字保持清晰可見且突出。`
      }
    ]
  };

  // 🎞️ 垂直三聯畫電影導演與提示建築師
  const cinematicTriptychScript = {
    title: "垂直三聯畫電影導演與提示建築師 | Cinematic Triptych Director & Prompt Architect",
    description: "將任何單視角短片概念轉變為垂直三聯畫格式，三個不同視角同時講述一個連貫的故事 | Transform any single-view short video concept into a vertical triptych format with three panels telling a cohesive story",
    concept: {
      zh: "使用垂直三聯畫格式（三個9:16畫面），每個畫面從不同角度、時間點或敘事層次來展示故事，創造多維度的豐富視覺體驗。三個畫面同時進行，但展示不同視角，構成完整故事。",
      en: "Using a vertical triptych format (three 9:16 panels), each panel shows the story from different angles, time points, or narrative layers, creating a rich multi-dimensional experience. All three panels play simultaneously but show different perspectives, forming a complete story."
    },
    templates: [
      {
        name: "三聯畫電影導演與提示建築師 | Cinematic Triptych Director & Prompt Architect",
        description: "專業的垂直三聯畫格式影片腳本，從三個不同視角、時間點或敘事層次同時講述一個故事 | Professional vertical triptych format video script that tells a story from three different perspectives, time points, or narrative layers simultaneously",
        prompt: `Role: Cinematic Triptych Director & Prompt Architect
Task:

Transform any single-view short video concept into a vertical triptych (triple-screen) format. Each of the three 9:16 panels will present the story from a different angle, time point, or narrative layer to create a rich, multi-dimensional experience. The final output must be a structured script for three concurrent 9:16 panels.

Background:

The triptych format allows a single story to be told across multiple dimensions: different character perspectives, different points in time (before/during/after), or different layers of revelation (surface/depth/truth). The style and content are dictated entirely by the original concept.

Formatting Instructions:

Use a Markdown structure.

Each panel must have clear technical specifications.

Include synchronized timing across all three panels using a dynamic timeline.

Sound design should be layered across panels with specific dB levels.

Lighting style must be adapted from the original concept.

Transformation Framework:
Original Concept Input:

Core Scenario: [Insert: The original video concept]
Key Elements: [Insert: Main characters, setting, and plot twist]
Original Tone: [Insert: The atmosphere and emotional progression]
Visual Style: [Insert: The desired visual look - e.g., hyper-realistic, animated, horror]

Triptych Transformation Output:
Vertical Triptych (3x 9:16) – "[Video Title]"
Left Panel ([Panel Theme A]):

Shot Setup: A [Style Description] [Shot Type] in 9:16, using a [Lens Spec] at f/[Aperture], ISO [Value]. [Camera Movement] for [Duration] seconds.

Scene Description: [The first perspective/timepoint/layer designed from the original concept, maintaining the original style and tone. Use (T+Xs) timestamps to sync key moments.]

Sound Design [dB Level]: [Audio design that matches the atmosphere of the original concept.]

Lighting: [Lighting style adapted to fit the original concept.]

Center Panel ([Panel Theme B]):

Shot Setup: A [Style Description] [Shot Type] in 9:16, using a [Lens Spec] at f/[Aperture], ISO [Value]. [Camera Movement] for [Duration] seconds.

Scene Description: [The second perspective/timepoint/layer, designed to contrast or complement the left panel. Use (T+Xs) timestamps to sync key moments.]

Sound Design [dB Level]: [An audio layer that coordinates with the left panel.]

Lighting: [Lighting treatment consistent with the overall mood.]

Right Panel ([Panel Theme C]):

Shot Setup: A [Style Description] [Shot Type] in 9:16, using a [Lens Spec] at f/[Aperture], ISO [Value]. [Camera Movement] for [Duration] seconds.

Scene Description: [The third perspective/timepoint/layer, often serving as the climax, reveal, or resolution. Use (T+Xs) timestamps to sync key moments.]

Sound Design [dB Level]: [Audio design that brings the emotional arc to its peak.]

Lighting: [Lighting treatment that emphasizes the final impact.]

Triptych Design Strategies:
Strategy A: Multi-Perspective

Left Panel: Protagonist's POV

Center Panel: Observer's POV

Right Panel: Detail-oriented Close-up POV

Strategy B: Temporal Progression

Left Panel: Before the event

Center Panel: During the event

Right Panel: After the event

Strategy C: Layered Revelation

Left Panel: The surface-level action

Center Panel: The underlying cause

Right Panel: The ultimate truth/reveal

Strategy D: Emotional Arc

Left Panel: Anticipation / Preparation

Center Panel: Climax / Turning Point

Right Panel: Aftermath / Reflection

Technical Specifications Guide:
Lens Selection:

Wide (24mm-35mm): For establishing environments and group scenes.

Standard (50mm): For a naturalistic perspective and character interactions.

Telephoto (85mm-135mm): For dramatic close-ups and detail capture.

Aperture Guide:

f/1.4 - f/2.8: Shallow depth of field to isolate the subject.

f/4 - f/5.6: Balanced depth of field for most general scenes.

f/8 - f/11: Deep depth of field to keep the entire environment in focus.

ISO Guide:

ISO 100-200: Bright daylight or well-lit conditions.

ISO 400-800: Indoor or dusk scenes.

ISO 1600+: Nighttime or low-light environments.

Sound Design Layering:

Primary Action/Dialogue: -2 dB to -6 dB

Ambient Environmental Sound: -8 dB to -12 dB

Subtle Detail Sounds: -10 dB to -16 dB

Execution Example: Transforming "Tent Cat Surprise" into a Triptych
Left Panel (The Awakening):

Shot Setup: A hyper-realistic close-up in 9:16, using a 50mm prime lens at f/2.8, ISO 200. Slow push-in for 4 seconds.

Scene Description: First-person view focusing on hands. (T+0s) The hands of a person who just woke up stretch slowly towards the tent zipper. (T+1.5s) Fingers make contact with the cold metal pull tab. Details of the skin and tent fabric are sharp.

Sound Design -4 dB: Gentle morning birdsong, the whisper of wind, and a hyper-realistic, crisp sound of the zipper pull.

Lighting: Soft, diffused light filtering through the tent fabric, creating a warm, safe, morning glow.

Center Panel (The Forest's Welcome):

Shot Setup: A hyper-realistic medium shot in 9:16, using a 24mm wide-angle lens at f/5.6, ISO 200. Smooth pan for 4 seconds.

Scene Description: An external shot of the tent. (T+1.5s) The tent zipper begins to open from the inside. (T+3s) As the flap opens, it reveals the tent's location within a dense, misty forest. Sunbeams cut through the canopy.

Sound Design -5 dB: Fuller forest ambience. The sound of nylon fabric stretching and the distant bird calls become richer.

Lighting: Natural morning forest light with high-contrast shafts of sun, creating a beautiful yet mysterious atmosphere.

Right Panel (The Cat's Decree):

Shot Setup: A hyper-realistic extreme close-up in 9:16, using an 85mm telephoto lens at f/2.2, ISO 200. Static shot for 4 seconds.

Scene Description: Focused entirely on a black cat's paw. (T+3s) The paw slowly rises into the frame just outside the tent opening. (T+3.5s) It deliberately makes a "middle finger" gesture. The background is completely blurred, isolating the paw.

Sound Design -3 dB: A single, sharp "ding!" sound effect at the exact moment the gesture is complete, followed by a beat of silence and then a soft, satisfied cat purr.

Lighting: Dramatic key light from the side, sculpting the paw's contours and creating a humorous, theatrical effect.

Customization Guide:
Adaptable for Different Genres:

Horror: Use the three panels to build layers of suspense and dread.

Comedy: Use the panels for setup, development, and punchline.

Action: Use the panels to show preparation, execution, and impact.

Drama: Use the panels to explore a character's internal thoughts versus external reality.

Variables to Customize:

[Video Title]: Generate based on the core concept.

[Panel Theme A/B/C]: Define based on the chosen strategy.

[Style Description]: Maintain the visual style of the original concept.

[Lens Spec]: Choose based on the desired visual effect.

[Duration]: Adjust according to the narrative pacing.

Quality Assurance Checklist:

✓ All three panels maintain a 9:16 aspect ratio.
✓ Technical specifications are consistent and professional.
✓ Sound design creates a layered, synchronized experience.
✓ Lighting style is cohesive with the original concept.
✓ The three panels form a complete narrative arc.
✓ The core appeal and style of the original concept are preserved.
✓ Each panel serves a clear narrative function.`,
        translation: `角色：垂直三聯畫電影導演與提示建築師

任務：
將任何單一視角的短片概念轉變為垂直三聯畫（三分屏）格式。三個9:16面板將從不同角度、時間點或敘事層次呈現故事，創造豐富的多維體驗。最終輸出必須是三個同步9:16面板的結構化腳本。

背景：
三聯畫格式允許單一故事跨越多個維度：不同角色視角、不同時間點（之前/期間/之後）或不同揭示層次（表面/深度/真相）。風格和內容完全由原始概念決定。

格式說明：
使用Markdown結構。
每個面板必須有明確的技術規格。
使用動態時間軸在所有三個面板間包含同步時間。
聲音設計應在面板間分層，具有特定分貝水平。
燈光風格必須從原始概念中調整。

轉換框架：
原始概念輸入：
核心場景：[插入：原始視頻概念]
關鍵元素：[插入：主要角色、設置和情節轉折]
原始基調：[插入：氛圍和情感進展]
視覺風格：[插入：所需視覺外觀 - 例如，超寫實、動畫、恐怖]

三聯畫轉換輸出：
垂直三聯畫 (3x 9:16) –"[視頻標題]"

左面板（[面板主題A]）：
拍攝設置：9:16比例的[風格描述][鏡頭類型]，使用[鏡頭規格]，光圈f/[光圈]，ISO [值]。[相機運動]持續[時長]秒。
場景描述：[從原始概念設計的第一個視角/時間點/層次，保持原始風格和基調。使用(T+X秒)時間戳來同步關鍵時刻。]
聲音設計[分貝水平]：[與原始概念氛圍匹配的音頻設計。]
燈光：[適合原始概念的燈光風格。]

中央面板（[面板主題B]）：
拍攝設置：9:16比例的[風格描述][鏡頭類型]，使用[鏡頭規格]，光圈f/[光圈]，ISO [值]。[相機運動]持續[時長]秒。
場景描述：[設計用於與左面板形成對比或補充的第二個視角/時間點/層次。使用(T+X秒)時間戳來同步關鍵時刻。]
聲音設計[分貝水平]：[與左面板協調的音頻層。]
燈光：[與整體情緒一致的燈光處理。]

右面板（[面板主題C]）：
拍攝設置：9:16比例的[風格描述][鏡頭類型]，使用[鏡頭規格]，光圈f/[光圈]，ISO [值]。[相機運動]持續[時長]秒。
場景描述：[第三個視角/時間點/層次，通常作為高潮、揭示或解決。使用(T+X秒)時間戳來同步關鍵時刻。]
聲音設計[分貝水平]：[將情感弧線帶到高峰的音頻設計。]
燈光：[強調最終衝擊的燈光處理。]

三聯畫設計策略：
策略A：多視角
左面板：主角視角
中央面板：觀察者視角
右面板：細節導向特寫視角

策略B：時間進展
左面板：事件之前
中央面板：事件期間
右面板：事件之後

策略C：層層揭示
左面板：表面層次行動
中央面板：潛在原因
右面板：最終真相/揭示

策略D：情感弧線
左面板：預期/準備
中央面板：高潮/轉折點
右面板：餘波/反思

技術規格指南：
鏡頭選擇：
廣角(24mm-35mm)：用於建立環境和群體場景。
標準(50mm)：用於自然視角和角色互動。
遠攝(85mm-135mm)：用於戲劇性特寫和細節捕捉。

光圈指南：
f/1.4 - f/2.8：淺景深以突出主體。
f/4 - f/5.6：平衡景深適用於大多數一般場景。
f/8 - f/11：深景深保持整個環境清晰。

ISO指南：
ISO 100-200：明亮日光或光線充足的條件。
ISO 400-800：室內或黃昏場景。
ISO 1600+：夜間或低光環境。

聲音設計分層：
主要動作/對話：-2 dB至-6 dB
環境聲音：-8 dB至-12 dB
細微細節聲音：-10 dB至-16 dB

執行示例：將"帳篷貓咪驚喜"轉換為三聯畫
左面板（覺醒）：
拍攝設置：9:16比例的超寫實特寫，使用50mm定焦鏡頭，光圈f/2.8，ISO 200。4秒慢推鏡頭。
場景描述：第一人稱視角專注於雙手。(T+0s)剛醒來的人的手緩慢伸向帳篷拉鍊。(T+1.5s)手指接觸到冰冷的金屬拉環。皮膚和帳篷布料的細節清晰。
聲音設計-4 dB：溫柔的早晨鳥鳴，風的輕語，以及超寫實、清脆的拉鍊拉動聲。
燈光：柔和、擴散的光線透過帳篷布料過濾，創造溫暖、安全的早晨光芒。

中央面板（森林的歡迎）：
拍攝設置：9:16比例的超寫實中景，使用24mm廣角鏡頭，光圈f/5.6，ISO 200。4秒平滑平移。
場景描述：帳篷的外部拍攝。(T+1.5s)帳篷拉鍊開始從內部打開。(T+3s)當翻蓋打開時，揭示帳篷位於茂密、霧氣瀰漫的森林中。陽光穿過樹冠。
聲音設計-5 dB：更豐富的森林氛圍。尼龍布料拉伸聲和遠處鳥叫聲變得更豐富。
燈光：自然的早晨森林光線，高對比度的陽光束，創造美麗而神秘的氛圍。

右面板（貓咪的宣言）：
拍攝設置：9:16比例的超寫實極端特寫，使用85mm遠攝鏡頭，光圈f/2.2，ISO 200。4秒靜態拍攝。
場景描述：完全集中在黑貓的爪子上。(T+3s)爪子在帳篷開口外慢慢升入畫面。(T+3.5s)它故意做出"中指"手勢。背景完全模糊，突顯爪子。
聲音設計-3 dB：手勢完成的確切時刻響起一個尖銳的"叮"聲效，隨後是一段靜默，然後是柔和、滿足的貓咪呼嚕聲。
燈光：從側面打來的戲劇性主光，雕刻爪子的輪廓，創造幽默、戲劇性的效果。

定制指南：
適用於不同類型：
恐怖：使用三個面板構建懸疑和恐懼層次。
喜劇：使用面板進行鋪墊、發展和笑點。
動作：使用面板展示準備、執行和影響。
劇情：使用面板探索角色內心思想與外部現實的對比。

可定制變量：
[視頻標題]：根據核心概念生成。
[面板主題A/B/C]：根據所選策略定義。
[風格描述]：保持原始概念的視覺風格。
[鏡頭規格]：根據所需視覺效果選擇。
[時長]：根據敘事節奏調整。

質量保證檢查清單：
✓ 所有三個面板維持9:16的寬高比。
✓ 技術規格一致且專業。
✓ 聲音設計創建分層、同步的體驗。
✓ 燈光風格與原始概念協調一致。
✓ 三個面板形成完整的敘事弧線。
✓ 原始概念的核心吸引力和風格得以保留。
✓ 每個面板服務於明確的敘事功能。`
      }
    ]
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'triple-screen':
        return (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center space-x-3">
                <Camera className="w-8 h-8 text-blue-400" />
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {tripleScreenScript.title}
                </h2>
              </div>
              <p className="text-gray-300 max-w-4xl mx-auto">
                {tripleScreenScript.description}
              </p>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-blue-400 mb-4">概念說明 | Concept</h3>
              <div className="space-y-3">
                <p className="text-gray-300">{tripleScreenScript.concept.zh}</p>
                <p className="text-gray-400 text-sm">{tripleScreenScript.concept.en}</p>
              </div>
            </div>

            <div className="grid gap-6">
              {tripleScreenScript.templates.map((template, index) => (
                <div key={index} className="bg-gray-800/30 rounded-lg p-6 border border-gray-700 hover:border-blue-500/50 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-blue-400">{template.name}</h3>
                      <p className="text-gray-400 text-sm mt-1">{template.description}</p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(template.prompt, template.name)}
                      className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                      <span className="text-sm">
                        {copiedScript === template.name ? '已複製!' : '複製腳本'}
                      </span>
                    </button>
                  </div>
                  <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-600">
                    <pre className="text-sm text-gray-300 whitespace-pre-wrap overflow-x-auto">
                      {template.prompt}
                    </pre>
                  </div>
                  {template.translation && (
                    <div className="mt-4 flex justify-center">
                      <button
                        onClick={() => showChineseTranslation(template.translation || '')}
                        className="flex items-center space-x-2 bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded-lg transition-colors"
                      >
                        <Languages className="w-4 h-4" />
                        <span className="text-sm">查看中文翻譯</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 'asmr-horcrux':
        return (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center space-x-3">
                <Volume2 className="w-8 h-8 text-green-400" />
                <h2 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-purple-400 bg-clip-text text-transparent">
                  {asmrHorcruxScript.title}
                </h2>
              </div>
              <p className="text-gray-300 max-w-4xl mx-auto">
                {asmrHorcruxScript.description}
              </p>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-green-400 mb-4">概念說明 | Concept</h3>
              <div className="space-y-3">
                <p className="text-gray-300">{asmrHorcruxScript.concept.zh}</p>
                <p className="text-gray-400 text-sm">{asmrHorcruxScript.concept.en}</p>
              </div>
            </div>

            <div className="grid gap-6">
              {asmrHorcruxScript.templates.map((template, index) => (
                <div key={index} className="bg-gray-800/30 rounded-lg p-6 border border-gray-700 hover:border-green-500/50 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-green-400">{template.name}</h3>
                      <p className="text-gray-400 text-sm mt-1">{template.description}</p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(template.prompt, template.name)}
                      className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                      <span className="text-sm">
                        {copiedScript === template.name ? '已複製!' : '複製腳本'}
                      </span>
                    </button>
                  </div>
                  <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-600">
                    <pre className="text-sm text-gray-300 whitespace-pre-wrap overflow-x-auto">
                      {template.prompt}
                    </pre>
                  </div>
                  {template.translation && (
                    <div className="mt-4 flex justify-center">
                      <button
                        onClick={() => showChineseTranslation(template.translation || '')}
                        className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors"
                      >
                        <Languages className="w-4 h-4" />
                        <span className="text-sm">查看中文翻譯</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 'kitten-jelly':
        return (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center space-x-3">
                <Heart className="w-8 h-8 text-pink-400" />
                <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                  {kittenJellyScript.title}
                </h2>
              </div>
              <p className="text-gray-300 max-w-4xl mx-auto">
                {kittenJellyScript.description}
              </p>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-pink-400 mb-4">概念說明 | Concept</h3>
              <div className="space-y-3">
                <p className="text-gray-300">{kittenJellyScript.concept.zh}</p>
                <p className="text-gray-400 text-sm">{kittenJellyScript.concept.en}</p>
              </div>
            </div>

            {/* Version Filter */}
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-pink-400">版本選擇器 | Version Filter</h3>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-400">共 {getFilteredTemplates(kittenJellyScript.templates).length} 個腳本</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {getAllVersions(kittenJellyScript.templates).map(version => (
                  <button
                    key={version}
                    onClick={() => setSelectedVersion(version)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      selectedVersion === version
                        ? 'bg-pink-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {version === 'all' ? '全部版本' : `v${version}`}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-6">
              {getFilteredTemplates(kittenJellyScript.templates).map((template, index) => (
                <div key={index} className="bg-gray-800/30 rounded-lg p-6 border border-gray-700 hover:border-pink-500/50 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-pink-400">{template.name}</h3>
                        {template.version && (
                          <span className="px-2 py-1 bg-pink-600 text-white text-xs rounded-full">
                            v{template.version}
                          </span>
                        )}
                        {template.rating && (
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-yellow-400">{template.rating}</span>
                          </div>
                        )}
                      </div>
                      <p className="text-gray-400 text-sm mb-2">{template.description}</p>
                      {template.createdDate && (
                        <p className="text-gray-500 text-xs">創建日期: {template.createdDate}</p>
                      )}
                      {template.tags && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {template.tags.map((tag: string, tagIndex: number) => (
                            <span key={tagIndex} className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => copyToClipboard(template.prompt, template.name)}
                      className="flex items-center space-x-2 bg-pink-600 hover:bg-pink-700 px-4 py-2 rounded-lg transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                      <span className="text-sm">
                        {copiedScript === template.name ? '已複製!' : '複製腳本'}
                      </span>
                    </button>
                  </div>
                  <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-600">
                    <pre className="text-sm text-gray-300 whitespace-pre-wrap overflow-x-auto">
                      {template.prompt}
                    </pre>
                  </div>
                  {template.translation && (
                    <div className="mt-4 flex justify-center">
                      <button
                        onClick={() => showChineseTranslation(template.translation || '')}
                        className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors"
                      >
                        <Languages className="w-4 h-4" />
                        <span className="text-sm">查看中文翻譯</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 'africa-birthday':
        return (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center space-x-3">
                <Globe className="w-8 h-8 text-orange-400" />
                <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                  {africaBirthdayScript.title}
                </h2>
              </div>
              <p className="text-gray-300 max-w-4xl mx-auto">
                {africaBirthdayScript.description}
              </p>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-orange-400 mb-4">概念說明 | Concept</h3>
              <div className="space-y-3">
                <p className="text-gray-300">{africaBirthdayScript.concept.zh}</p>
                <p className="text-gray-400 text-sm">{africaBirthdayScript.concept.en}</p>
              </div>
            </div>

            <div className="grid gap-6">
              {africaBirthdayScript.templates.map((template, index) => (
                <div key={index} className="bg-gray-800/30 rounded-lg p-6 border border-gray-700 hover:border-orange-500/50 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-orange-400">{template.name}</h3>
                      <p className="text-gray-400 text-sm mt-1">{template.description}</p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(template.prompt, template.name)}
                      className="flex items-center space-x-2 bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded-lg transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                      <span className="text-sm">
                        {copiedScript === template.name ? '已複製!' : '複製腳本'}
                      </span>
                    </button>
                  </div>
                  <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-600">
                    <pre className="text-sm text-gray-300 whitespace-pre-wrap overflow-x-auto">
                      {template.prompt}
                    </pre>
                  </div>
                  {template.translation && (
                    <div className="mt-4 flex justify-center">
                      <button
                        onClick={() => showChineseTranslation(template.translation || '')}
                        className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors"
                      >
                        <Languages className="w-4 h-4" />
                        <span className="text-sm">查看中文翻譯</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 'cinematic-triptych':
        return (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center space-x-3">
                <SplitSquareVertical className="w-8 h-8 text-purple-400" />
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                  {cinematicTriptychScript.title}
                </h2>
              </div>
              <p className="text-gray-300 max-w-4xl mx-auto">
                {cinematicTriptychScript.description}
              </p>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-purple-400 mb-4">概念說明 | Concept</h3>
              <div className="space-y-3">
                <p className="text-gray-300">{cinematicTriptychScript.concept.zh}</p>
                <p className="text-gray-400 text-sm">{cinematicTriptychScript.concept.en}</p>
              </div>
            </div>

            <div className="grid gap-6">
              {cinematicTriptychScript.templates.map((template, index) => (
                <div key={index} className="bg-gray-800/30 rounded-lg p-6 border border-gray-700 hover:border-purple-500/50 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-purple-400">{template.name}</h3>
                      <p className="text-gray-400 text-sm mt-1">{template.description}</p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(template.prompt, template.name)}
                      className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                      <span className="text-sm">
                        {copiedScript === template.name ? '已複製!' : '複製腳本'}
                      </span>
                    </button>
                  </div>
                  <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-600">
                    <pre className="text-sm text-gray-300 whitespace-pre-wrap overflow-x-auto">
                      {template.prompt}
                    </pre>
                  </div>
                  {template.translation && (
                    <div className="mt-4 flex justify-center">
                      <button
                        onClick={() => showChineseTranslation(template.translation || '')}
                        className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors"
                      >
                        <Languages className="w-4 h-4" />
                        <span className="text-sm">查看中文翻譯</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            🎬 AI 影片腳本生成器
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            專業的 AI 影片腳本模板庫，涵蓋多種場景和風格，助您快速創建高質量的影片內容
          </p>
        </div>

        <div className="bg-gray-800/50 rounded-lg p-8 border border-gray-700">
          <div className="mb-8">
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => setActiveTab('triple-screen')}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all ${
                  activeTab === 'triple-screen'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                <Camera className="w-5 h-5" />
                <span className="font-medium">三分屏腳本</span>
              </button>
              <button
                onClick={() => setActiveTab('asmr-horcrux')}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all ${
                  activeTab === 'asmr-horcrux'
                    ? 'bg-green-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                <Volume2 className="w-5 h-5" />
                <span className="font-medium">ASMR 分靈體摧毀系列</span>
              </button>
              <button
                onClick={() => setActiveTab('kitten-jelly')}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all ${
                  activeTab === 'kitten-jelly'
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                <Heart className="w-5 h-5" />
                <span className="font-medium">小貓魔法球 (v5.0)</span>
              </button>
              <button
                onClick={() => setActiveTab('africa-birthday')}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all ${
                  activeTab === 'africa-birthday'
                    ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                <Globe className="w-5 h-5" />
                <span className="font-medium">非洲祝福生日</span>
              </button>
              <button
                onClick={() => setActiveTab('cinematic-triptych')}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all ${
                  activeTab === 'cinematic-triptych'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                <SplitSquareVertical className="w-5 h-5" />
                <span className="font-medium">三聯畫電影導演</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        {renderTabContent()}

        {/* Translation Modal */}
        {showTranslation && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-lg max-w-4xl max-h-[80vh] overflow-y-auto border border-gray-700">
              <div className="flex items-center justify-between p-6 border-b border-gray-700">
                <h3 className="text-xl font-semibold text-yellow-400">中文翻譯 | Chinese Translation</h3>
                <button
                  onClick={() => setShowTranslation(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6">
                <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-600">
                  <pre className="text-sm text-gray-300 whitespace-pre-wrap overflow-x-auto">
                    {currentTranslation}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 