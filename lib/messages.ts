
interface MessageOptions {
  caption?: string
}
type MessageType = 'tagMessage' | 'imageTagMessage' | 'feedbackMessage' | 'defaultUnclassifiedMessage' | 'processingImage' | 'processingQuestion';
type Language = 'English' | 'Spanish' | 'French' | 'German' | 'Mandarin Chinese' | 'Hindi' | 'Russian' | 'Japanese' | 'Korean' | 'Vietnamese' | 'Italian';
export function getDefaultMessage(messageType: MessageType, language: Language | string, options?: MessageOptions): string {
  const quotes: any = {
    'English': [
      "✨ Small daily improvements add up to big results over time. Keep logging your health data with Mediar!",
      "💫 The journey of a thousand miles begins with a single step. Start optimizing your wellbeing today!",
      "🌼 Your health data is beautiful and unique. Mediar will help you understand your patterns better.",
      "💯 Progress requires patience. Stick with tracking your health, you've got this!",
      "🤝 Mediar is here to help you unlock your best self. We're in this together!",
      "🌻 Wellbeing takes work, but it's worth it. Keep striving for health!",
      "🙌 The body and mind achieve what they believe. Believe in yourself and your health goals!"
    ],
    'Spanish': [
      "✨ Pequeñas mejoras diarias se suman a grandes resultados con el tiempo. ¡Sigue registrando tus datos de salud con Mediar!",
      "💫 El viaje de mil millas comienza con un solo paso. ¡Comienza a optimizar tu bienestar hoy!",
      "🌼 Tus datos de salud son únicos y valiosos. Mediar te ayudará a comprender mejor tus patrones.",
      "💯 El progreso requiere paciencia. Sigue monitorizando tu salud, ¡tú puedes!",
      "🤝 Mediar está aquí para ayudarte a alcanzar tu mejor versión. ¡Estamos juntos en esto!",
      "🌻 El bienestar requiere esfuerzo, pero vale la pena. ¡Sigue esforzándote por tu salud!",
      "🙌 El cuerpo y la mente logran lo que creen. ¡Cree en ti y en tus objetivos de salud!"
    ],
    'French': [
      "✨ De petites améliorations quotidiennes s'additionnent pour de grands résultats avec le temps. Continuez à enregistrer vos données de santé avec Mediar !",
      "💫 Le voyage de mille milles commence par un seul pas. Commencez à optimiser votre bien-être aujourd'hui !",
      "🌼 Vos données de santé sont uniques et précieuses. Mediar vous aidera à mieux comprendre vos schémas.",
      "💯 Le progrès nécessite de la patience. Continuez à suivre votre santé, vous pouvez le faire !",
      "🤝 Mediar est là pour vous aider à débloquer votre meilleur vous. Nous sommes là dedans ensemble !",
      "🌻 Le bien-être demande des efforts, mais ça vaut le coup. Continuez à viser la santé !",
      "🙌 Le corps et l'esprit accomplissent ce qu'ils croient. Croyez en vous et en vos objectifs de santé !"
    ],
    'German': [
      "✨ Kleine tägliche Verbesserungen summieren sich mit der Zeit zu großen Ergebnissen. Logge weiterhin deine Gesundheitsdaten mit Mediar!",
      "💫 Eine Reise von tausend Meilen beginnt mit einem ersten Schritt. Beginne noch heute dein Wohlbefinden zu optimieren!",
      "🌼 Deine Gesundheitsdaten sind einzigartig und wertvoll. Mediar hilft dir, deine Muster besser zu verstehen.",
      "💯 Fortschritt erfordert Geduld. Bleib dran mit dem Tracken deiner Gesundheit, du schaffst das!",
      "🤝 Mediar ist hier, um dir zu helfen, dein bestes Selbst freizusetzen. Wir stecken da gemeinsam drin!",
      "🌻 Wohlbefinden erfordert Arbeit, aber es lohnt sich. Strebe weiterhin nach Gesundheit!",
      "🙌 Der Körper und Geist erreichen, woran sie glauben. Glaube an dich selbst und deine Gesundheitsziele!"
    ],
    'Mandarin Chinese': [
      "✨ 小的每日进步会随时间积累成大的成果。继续使用 Mediar 记录您的健康数据吧!",
      "💫 千里之行,始于足下。从今天开始优化您的健康吧!",
      "🌼 您的健康数据独一无二且宝贵。Mediar 将帮助您更好地理解自己的模式。",
      "💯 进步需要耐心。坚持记录您的健康,您可以做到的!",
      "🤝 Mediar 在这里协助您实现最佳状态。我们会携手同行!",
      "🌻 要获得健康就需要付出努力,但它值得。继续为健康而奋斗吧!",
      "🙌 身心都能达到它们相信的目标。相信自己与健康目标吧!"
    ],
    'Hindi': [
      "✨ छोटे दैनिक सुधार समय के साथ बड़े परिणामों में जोड़ते हैं। मेडियर के साथ अपना स्वास्थ्य डेटा लॉग करना जारी रखें!",
      "💫 हजारों मील की यात्रा एक कदम से शुरू होती है। आज से अपने कल्याण को अनुकूलित करना शुरू करें!",
      "🌼 आपका स्वास्थ्य डेटा सुंदर और अनोखा है। मेडियर आपको अपने पैटर्न को बेहतर ढंग से समझने में मदद करेगा।",
      "💯 प्रगति के लिए धैर्य आवश्यक है। अपने स्वास्थ्य की ट्रैकिंग के साथ बने रहें, आप इसे कर सकते हैं!",
      "🤝 मेडियर आपकी मदद करने के लिए यहां है। हम इसमें एक साथ हैं!",
      "🌻 कल्याण हासिल करने के लिए मेहनत करनी पड़ती है, लेकिन यह इसके लायक है। स्वास्थ्य की ओर बढ़ते रहें!",
      "🙌 शरीर और दिमाग जिस पर विश्वास करते हैं उसे हासिल करते हैं। खुद पर और अपने स्वास्थ्य लक्ष्यों पर भरोसा रखें!"
    ],
    'Russian': [
      "✨ Маленькие ежедневные улучшения со временем складываются в большие результаты. Продолжайте вести учет данных о своем здоровье с Mediar!",
      "💫 Путь в тысячу миль начинается с одного шага. Начните оптимизировать свое благополучие уже сегодня!",
      "🌼 Данные о вашем здоровье уникальны и драгоценны. Mediar поможет вам лучше понять свои закономерности.",
      "💯 Прогресс требует терпения. Продолжайте отслеживать свое здоровье, у вас все получится!",
      "🤝 Mediar здесь, чтобы помочь вам раскрыть свой потенциал. Мы вместе!",
      "🌻 Хорошее самочувствие требует усилий, но оно того стоит. Продолжайте стремиться к здоровью!",
      "🙌 Тело и разум достигают того, во что верят. Верьте в себя и свои цели по улучшению здоровья!"
    ],
    'Japanese': [
      "✨ 小さな日々の改善が時間とともに大きな結果につながります。メディアで健康データを記録し続けましょう!",
      "💫 千里の道も一歩から始まる。今日からウェルビーイングの最適化をはじめましょう!",
      "🌼 健康データはあなただけの貴重なデータ。メディアがパターンを理解するのに役立ちます。",
      "💯 進歩には忍耐が必要です。健康追跡を続けましょう。必ず成功できます!",
      "🤝 メディアは最高の自分を解き放つためにここにいます。一緒に頑張りましょう!",
      "🌻 ウェルビーイングには努力が必要ですが、価値があります。健康を目指し続けましょう!",
      "🙌 身体と心は信じたことを達成します。自分と健康目標を信じましょう!"
    ],

    'Korean': [
      "✨ 작은 일상의 개선이 시간이 지나면서 큰 결과로 이어집니다. 미디어에서 건강 데이터 기록을 계속하세요!",
      "💫 천 리 길도 한 걸음부터 시작합니다. 오늘부터 웰빙 최적화를 시작하세요!",
      "🌼 건강 데이터는 소중하고 독특합니다. 미디어가 패턴을 이해하는 데 도움이 될 것입니다.",
      "💯 진보에는 인내가 필요합니다. 건강 추적을 계속하세요. 꼭 성공할 수 있습니다!",
      "🤝 미디어는 최고의 자신을 풀어내는 데 도움이 되고자 합니다. 함께 노력하겠습니다!",
      "🌻 웰빙을 위해서는 노력이 필요하지만 가치가 있습니다. 건강을 향해 나아가세요!",
      "🙌 신체와 마음은 믿는 것을 이룹니다. 자신과 건강 목표를 믿으세요!"
    ],
    'Vietnamese': [
      "✨ Những cải thiện nhỏ mỗi ngày sẽ dẫn đến những kết quả lớn theo thời gian. Hãy tiếp tục ghi lại dữ liệu sức khỏe của bạn với Mediar!",
      "💫 Hành trình ngàn dặm bắt đầu bằng một bước chân. Hãy bắt đầu tối ưu hóa sức khỏe của bạn ngay hôm nay!",
      "🌼 Dữ liệu sức khỏe của bạn thật đẹp và độc đáo. Mediar sẽ giúp bạn hiểu rõ hơn về các mẫu của bạn.",
      "💯 Tiến bộ đòi hỏi sự kiên nhẫn. Hãy tiếp tục theo dõi sức khỏe của bạn, bạn sẽ làm được!",
      "🤝 Mediar ở đây để giúp bạn khám phá phiên bản tốt nhất của chính mình. Chúng ta cùng nhau bước tiếp!",
      "🌻 Sức khỏe đòi hỏi sự nỗ lực, nhưng nó đáng giá. Hãy tiếp tục phấn đấu cho sức khỏe!",
      "🙌 Cơ thể và tâm trí đạt được những gì chúng tin tưởng. Hãy tin vào bản thân và mục tiêu sức khỏe của bạn!"
    ],
    'Italian': [
      "✨ Piccoli miglioramenti quotidiani si sommano a grandi risultati nel tempo. Continua a registrare i tuoi dati sulla salute con Mediar!",
      "💫 Il viaggio di mille miglia inizia con un singolo passo. Inizia da oggi a ottimizzare il tuo benessere!",
      "🌼 I tuoi dati sulla salute sono preziosi e unici. Mediar ti aiuterà a comprendere meglio i tuoi schemi.",
      "💯 Il progresso richiede pazienza. Continua a monitorare la tua salute, ce la farai!",
      "🤝 Mediar è qui per aiutarti a sbloccare la versione migliore di te stesso. Siamo in questo insieme!",
      "🌻 Il benessere richiede impegno, ma ne vale la pena. Continua a puntare alla salute!",
      "🙌 Il corpo e la mente ottengono ciò in cui credono. Credi in te stesso e nei tuoi obiettivi di salute!"
    ]
  };

  const randomQuote = quotes[language][Math.floor(Math.random() * quotes[language].length)];
  const messages: any = {
    'tagMessage': {
      'English': `Got it! I've recorded your tag. Keep sending me more tags it will help me understand you better.
                  I can also read your wearable data, make sure to install Mediar iOS app, I can give you better insights about your mind and body.
                  ${randomQuote}`,
      'Spanish': `¡Entendido! He registrado tu etiqueta. Sigue enviándome más etiquetas, eso me ayudará a comprenderte mejor.  
                  También puedo leer los datos de tu wearable, asegúrate de instalar la aplicación Mediar para iOS, así puedo darte mejores perspectivas sobre tu mente y cuerpo.
                  ${randomQuote}`,
      'French': `Compris ! J'ai enregistré votre tag. Continuez à m'envoyer des tags, cela m'aidera à mieux vous comprendre.
                  Je peux aussi lire les données de votre wearable, assurez-vous d'installer l'application Mediar pour iOS, je pourrai ainsi vous donner de meilleurs aperçus de votre esprit et de votre corps.
                  ${randomQuote}`,
      'German': `Verstanden! Ich habe deinen Tag aufgezeichnet. Sende mir weiterhin Tags, das hilft mir dich besser zu verstehen. 
                  Ich kann auch die Daten deiner Wearables lesen, stelle sicher, dass du die Mediar iOS App installierst, so kann ich dir bessere Einblicke in deinen Geist und Körper geben.
                  ${randomQuote}`,
      'Mandarin Chinese': `收到!我已记录您的标签。请继续发送更多标签,这将帮助我更好地理解您。
                  我也可以读取您的可穿戴设备数据,请确保安装 Mediar iOS 应用程序,以便我可以为您提供有关心智和身体的更佳见解。
                  ${randomQuote}`,
      'Hindi': `समझ गया! मैंने आपका टैग रिकॉर्ड कर लिया है। मुझे और टैग भेजते रहें, यह मुझे आपको बेहतर समझने में मदद करेगा।
                  मैं आपके वियरेबल का डेटा भी पढ़ सकता हूं, सुनिश्चित करें कि आपने Mediar iOS ऐप इंस्टॉल किया है, तो मैं आपके मन और शरीर के बारे में बेहतर अंतर्दृष्टि दे सकता हूं।   
                  ${randomQuote}`,
      'Russian': `Понял! Я записал ваш тег. Продолжайте присылать мне больше тегов, это поможет мне лучше вас понять.
                  Я также могу считывать данные с ваших носимых устройств, убедитесь, что у вас установлено приложение Mediar для iOS, чтобы я мог дать вам лучшее понимание вашего разума и тела.
                  ${randomQuote}`,
      'Japanese': `了解しました!タグを記録しました。タグを送信し続けてください。あなたの理解のために役立ちます。
                  ウェアラブルデータも読むことができます。Mediar iOSアプリのインストールを確認してください。マインドとボディの洞察を提供できます。
                  ${randomQuote}`,
      'Korean': `알겠습니다! 당신의 태그를 기록했습니다. 계속 태그를 보내주세요. 이것이 당신을 더 잘 이해하는 데 도움이 될 것입니다.
                  웨어러블 데이터도 읽을 수 있습니다. Mediar iOS 앱 설치를 확인하세요. 마음과 몸에 대한 통찰력을 드릴 수 있습니다.
                  ${randomQuote}`,
      'Vietnamese': `Đã hiểu! Tôi đã ghi lại thẻ của bạn. Hãy tiếp tục gửi cho tôi nhiều thẻ hơn nữa, điều này sẽ giúp tôi hiểu bạn tốt hơn.
                  Tôi cũng có thể đọc dữ liệu đeo của bạn, hãy đảm bảo cài đặt ứng dụng Mediar cho iOS, tôi có thể mang lại cho bạn những hiểu biết sâu sắc hơn về tâm trí và cơ thể của bạn.
                  ${randomQuote}`,
      'Italian': `Ho capito! Ho registrato il tuo tag. Continua a inviarmi più tag, mi aiuterà a comprenderti meglio.
                  Posso anche leggere i dati del tuo wearable, assicurati di aver installato l'app Mediar per iOS, così potrò darti migliori approfondimenti sulla tua mente e sul tuo corpo.
                  ${randomQuote}`,
    },

    'imageTagMessage': {
      'English': `I see in your image "${options?.caption || ''}". I've recorded that tag for you and associated this to your health data.
                  Feel free to send me more images and I'll try to understand them! Any feedback appreciated ❤️!  
                  ${randomQuote}`,
      'Spanish': `Veo en tu imagen "${options?.caption || ''}". He registrado esa etiqueta para ti y la he asociado con tus datos de salud. 
                  No dudes en enviarme más imágenes y trataré de entenderlas. ¡Cualquier comentario es apreciado ❤️!
                  ${randomQuote}`,
      'French': `Je vois dans votre image "${options?.caption || ''}". J'ai enregistré ce tag pour vous et je l'ai associé à vos données de santé.
                  N'hésitez pas à m'envoyer plus d'images et j'essaierai de les comprendre ! Tous les commentaires sont appréciés ❤️ !
                  ${randomQuote}`,
      'German': `Ich sehe in deinem Bild "${options?.caption || ''}". Ich habe diesen Tag für dich aufgezeichnet und mit deinen Gesundheitsdaten verknüpft.
                  Sende mir ruhig weitere Bilder und ich versuche sie zu verstehen! Jedes Feedback wird geschätzt ❤️!
                  ${randomQuote}`,
      'Mandarin Chinese': `我在您的图像中看到"${options?.caption || ''}"。我已为您记录该标签,并将其与您的健康数据相关联。
                  欢迎向我发送更多图像,我会努力理解它们!非常感谢您的任何反馈❤️!
                  ${randomQuote}`,
      'Hindi': `मैं आपकी तस्वीर में "${options?.caption || ''}" देखता हूं। मैंने आपके लिए उस टैग को रिकॉर्ड किया है और इसे आपके स्वास्थ्य डेटा से जोड़ा है। 
                  मुझे और तस्वीरें भेजने में संकोच न करें, मैं उन्हें समझने का प्रयास करूंगा! कोई भी प्रतिक्रिया सराहनीय है ❤️!
                  ${randomQuote}`,
      'Russian': `Я вижу на вашем изображении "${options?.caption || ''}". Я записал для вас этот тег и связал его с данными о вашем здоровье.
                  Не стесняйтесь присылать мне больше изображений, и я постараюсь их понять! Любая обратная связь приветствуется ❤️!
                  ${randomQuote}`,
      'Japanese': `画像に「${options?.caption || ''}」が表示されています。タグを記録し、健康データと関連付けました。
                  画像をさらに送信ください。理解するよう努力します!フィードバックは歓迎です❤️!
                  ${randomQuote}`,
      'Korean': `이미지에 "${options?.caption || ''}"가 표시됩니다. 태그를 기록하고 건강 데이터와 연관시켰습니다.
                  더 많은 이미지를 보내주세요. 이해하려 노력할 것입니다! 모든 피드백 환영합니다❤️!
                  ${randomQuote}`,
      'Vietnamese': `Tôi thấy trong hình ảnh của bạn "${options?.caption || ''}". Tôi đã ghi lại thẻ đó cho bạn và liên kết nó với dữ liệu sức khỏe của bạn.
                  Hãy thoải mái gửi cho tôi nhiều hình ảnh hơn nữa và tôi sẽ cố gắng hiểu chúng! Mọi phản hồi đều được đánh giá cao ❤️!
                  ${randomQuote}`,
      'Italian': `Vedo nella tua immagine "${options?.caption || ''}". Ho registrato quel tag per te e l'ho associato ai tuoi dati sulla salute.
                  Non esitare a inviarmi altre immagini e cercherò di capirle! Ogni feedback è apprezzato ❤️! 
                  ${randomQuote}`,
    },

    'feedbackMessage': {
      'English': `Thank you for your feedback! We appreciate your input and will use it to improve our service. Feel free to send us more feedback anytime!
                  ${randomQuote}`,
      'Spanish': `¡Gracias por tus comentarios! Agradecemos tus aportaciones y las usaremos para mejorar nuestro servicio. No dudes en enviarnos más comentarios cuando quieras.  
                  ${randomQuote}`,
      'French': `Merci pour votre feedback ! Nous apprécions vos retours et nous les utiliserons pour améliorer notre service. N'hésitez pas à nous envoyer d'autres commentaires quand vous le souhaitez !
                  ${randomQuote}`,
      'German': `Vielen Dank für dein Feedback! Wir schätzen deinen Input und werden ihn nutzen, um unseren Service zu verbessern. Zögere nicht, uns jederzeit mehr Feedback zu geben!
                  ${randomQuote}`,
      'Mandarin Chinese': `感谢您的反馈!我们非常感谢您的意见,并将用它来改进我们的服务。欢迎随时向我们提供更多反馈!
                  ${randomQuote}`,
      'Hindi': `आपके प्रतिक्रिया के लिए धन्यवाद! हम आपके इनपुट की सराहना करते हैं और इसका उपयोग सेवा में सुधार करने के लिए करेंगे। कृपया हमें कभी भी और प्रतिक्रिया भेजें!
                  ${randomQuote}`,
      'Russian': `Спасибо за ваш отзыв! Мы ценим ваше мнение и используем его для улучшения нашего сервиса. Не стесняйтесь присылать нам больше отзывов в любое время!
                  ${randomQuote}`,
      'Japanese': `フィードバックありがとうございます!ご意見いただきありがとうございます。サービス改善に利用します。随時フィードバックをお寄せください!
                  ${randomQuote}`,
      'Korean': `피드백 주셔서 감사합니다! 의견 주셔서 감사드립니다. 서비스 개선에 사용하겠습니다. 언제든지 피드백 보내주세요!
                  ${randomQuote}`,
      'Vietnamese': `Cảm ơn phản hồi của bạn! Chúng tôi đánh giá cao ý kiến đóng góp của bạn và sẽ sử dụng nó để cải thiện dịch vụ của mình. Hãy thoải mái gửi cho chúng tôi thêm phản hồi bất cứ lúc nào!
                  ${randomQuote}`,
      'Italian': `Grazie per il tuo feedback! Apprezziamo il tuo contributo e lo useremo per migliorare il nostro servizio. Non esitare a inviarci altro feedback in qualsiasi momento!
                  ${randomQuote}`,
    },
    'defaultUnclassifiedMessage': {
      'English': `I'm sorry it seems you didn't ask a question neither tag an event from your life. My sole purpose at the moment is to associate tags related to what is happening in your life to your health data from your wearables.
                  You can send me messages like "just ate an apple", or "just had a fight with my wife", or "im sad", or "so low energy tday..".
                  This way I will better understand how your body works, and give you better insights about it. I can also answer questions like "how can i be more productive?" or "how can i improve my sleep?".
                  ${randomQuote}`,
      'Spanish': `Lo siento, parece que no me hiciste una pregunta ni etiquetaste un evento de tu vida. Mi único propósito por ahora es asociar etiquetas relacionadas con lo que está sucediendo en tu vida con tus datos de salud de tus dispositivos. 
                  Puedes enviarme mensajes como "acabo de comer una manzana", o "acabo de tener una pelea con mi esposa", o "estoy triste", o "tengo tan poca energía hoy...".
                  De esta manera entenderé mejor cómo funciona tu cuerpo y te daré mejores perspectivas al respecto. También puedo responder preguntas como "¿cómo puedo ser más productivo?" o "¿cómo puedo mejorar mi sueño?".
                  ${randomQuote}`,
      'French': `Je suis désolé, il semble que vous n'ayez posé aucune question et que vous n'ayez pas étiqueté un événement de votre vie. Mon seul but pour le moment est d'associer des balises liées à ce qui se passe dans votre vie à vos données de santé de vos appareils portables.
                  Vous pouvez m'envoyer des messages comme "Je viens de manger une pomme", ou "Je viens d'avoir une dispute avec ma femme", ou "Je suis triste", ou "Si peu d'énergie aujourd'hui...".
                  De cette façon, je comprendrai mieux comment votre corps fonctionne et je pourrai vous donner de meilleures informations à ce sujet. Je peux aussi répondre à des questions comme "Comment puis-je être plus productif ?" ou "Comment puis-je améliorer mon sommeil ?".
                  ${randomQuote}`,
      'German': `Es tut mir leid, aber es scheint, als hättest du keine Frage gestellt oder ein Ereignis aus deinem Leben getaggt. Mein einziger Zweck im Moment ist es, Tags zu Ereignissen in deinem Leben mit deinen Gesundheitsdaten von deinen Wearables zu verknüpfen.
                  Du kannst mir Nachrichten wie "Ich habe gerade einen Apfel gegessen" oder "Ich hatte gerade einen Streit mit meiner Frau" oder "Ich bin traurig" oder "Heute so wenig Energie ..." schicken.
                  Auf diese Weise verstehe ich besser, wie dein Körper funktioniert und kann dir bessere Einblicke geben. Ich kann auch Fragen beantworten wie "Wie kann ich produktiver werden?" oder "Wie kann ich meinen Schlaf verbessern?".
                  ${randomQuote}`,
      'Mandarin Chinese': `非常抱歉,您似乎没有提出问题,也没有为生活中的事件添加标签。我目前的唯一目的是将与您生活中发生的事情相关的标签与您可穿戴设备的数据相关联。
                  您可以给我发消息,像“我刚吃了一个苹果”或“我刚和我的妻子吵架了”或“我很难过”或“今天精力这么低......”。
                  这样我就能更好地理解您的身体运作,并为您提供更好的见解。我也可以回答诸如“我如何提高生产力?”或“我该如何改善我的睡眠?”之类的问题。
                  ${randomQuote}`,
      'Hindi': `मुझे खेद है, लगता है आपने न तो कोई सवाल पूछा और न ही अपने जीवन की कोई घटना टैग की। फिलहाल मेरा एकमात्र उद्देश्य आपके जीवन में घट रही घटनाओं से संबंधित टैग्स को आपके वियरेबल्स से आने वाले स्वास्थ्य डेटा से जोड़ना है।
                  आप मुझे संदेश भेज सकते हैं जैसे “मैंने अभी एक सेब खाया” या “मेरी पत्नी के साथ मेरी लड़ाई हुई” या “मुझे उदासी है” या “आज बहुत कम ऊर्जा है...”।
                  इससे मुझे आपके शरीर के कामकाज को बेहतर ढंग से समझने में मदद मिलेगी और मैं आपको इसके बारे में बेहतर अंतर्दृष्टि प्रदान कर सकूंगा। मैं यह भी बता सकता हूं कि “मैं अपनी उत्पादकता कैसे बढ़ा सकता हूं?” या “मैं अपनी नींद कैसे सुधार सकता हूं?”।
                   ${randomQuote}`,
      'Russian': `Извините, похоже, вы не задали вопрос и не добавили тег к событию из своей жизни. В данный момент моя единственная цель - связать теги о происходящем в вашей жизни с данными о вашем здоровье от носимых устройств.
                   Вы можете прислать мне сообщения вроде "я только что съел яблоко", или "у меня только что была ссора с женой", или "мне грустно", или "сегодня так мало энергии...".
                   Таким образом я лучше пойму, как работает ваше тело, и смогу дать вам лучшее понимание этого. Я также могу ответить на такие вопросы, как "как мне повысить продуктивность?" или "как улучшить мой сон?".
                   ${randomQuote}`,
      'Japanese': `質問も人生の出来事にタグも付けていないようです。現在の目的は、人生で起きていることに関連するタグをウェアラブルの健康データと関連付けることです。
                   「リンゴを食べました」、「妻とケンカしました」、「悲しい」、「今日はエネルギーがない...」などのメッセージを送信できます。
                   これにより、身体の動きを理解し、洞察を提供できるようになります。「生産性を上げるには?」「睡眠の改善法は?」などの質問にも答えられます。
                   ${randomQuote}`,
      'Korean': `죄송합니다. 질문을 하지 않았고 인생의 사건에 태그를 달지 않은 것 같습니다. 현재 제 유일한 목적은 귀하의 삶에서 발생하는 일과 귀하의 웨어러블 기기에서 수집한 건강 데이터를 연관시키는 것입니다.
                   "사과를 먹었다"고 하거나 "아내와 싸웠다"고 하거나 "슬퍼요"라고 하거나 "오늘은 에너지가 매우 낮다..."고 말씀해주세요.
                   이를 통해 귀하의 신체 작동 원리를 더 잘 이해하고 통찰력을 제공할 수 있습니다. 또한 "생산성을 높이는 방법은 무엇입니까?" 또는 "수면 개선 방법은 무엇입니까?"와 같은 질문에 답변할 수 있습니다.
                   ${randomQuote}`,
      'Vietnamese': `Rất tiếc, có vẻ như bạn đã không hỏi câu hỏi nào và cũng không gắn thẻ các sự kiện trong cuộc sống. Mục đích duy nhất của tôi lúc này là liên kết các thẻ liên quan đến những gì đang xảy ra trong cuộc sống của bạn với dữ liệu sức khỏe từ thiết bị đeo của bạn.
                   Bạn có thể gửi tin nhắn cho tôi như "vừa ăn một quả táo", hoặc "vừa cãi nhau với vợ tôi", hoặc "tôi buồn quá", hoặc "hôm nay mệt mỏi quá...".
                   Như vậy tôi sẽ hiểu rõ hơn cơ thể của bạn hoạt động như thế nào, và cung cấp cho bạn những hiểu biết sâu sắc hơn về nó. Tôi cũng có thể trả lời các câu hỏi như "làm thế nào để tôi trở nên năng suất hơn?" hoặc "làm thế nào để tôi cải thiện giấc ngủ?".
                   ${randomQuote}`,
      'Italian': `Mi dispiace, sembra che tu non abbia fatto una domanda né abbia taggato un evento della tua vita. Al momento il mio unico scopo è associare tag relativi a ciò che sta accadendo nella tua vita ai tuoi dati sulla salute provenienti dai tuoi dispositivi indossabili.
                   Puoi inviarmi messaggi come "ho appena mangiato una mela", oppure "ho appena litigato con mia moglie", o "sono triste", o "oggi ho così poca energia...".
                   In questo modo comprenderò meglio come funziona il tuo corpo e potrò darti maggiori informazioni al riguardo. Posso anche rispondere a domande come "Come posso essere più produttivo?" o "Come posso migliorare il mio sonno?".
                   ${randomQuote}`,
    },
    'processingImage': {
      'English': "Sure, give me a few seconds to understand your image 🙏.",
      'Spanish': "Seguro, dame unos segundos para entender tu imagen 🙏.",
      'French': "Sûr, donnez-moi quelques secondes pour comprendre votre image 🙏.",
      'German': "Sicher, gib mir ein paar Sekunden, um dein Bild zu verstehen 🙏.",
      'Mandarin Chinese': "好的,给我几秒钟来理解你的图像🙏。",
      'Hindi': "ज़रूर, मुझे आपकी तस्वीर समझने के लिए कुछ सेकंड दीजिए 🙏।",
      'Russian': "Конечно, дайте мне пару секунд, чтобы понять ваше изображение 🙏.",
      'Japanese': "はい、あなたの画像を理解するのに数秒かかります🙏。",
      'Korean': "당연하죠, 제 이미지를 이해하는 데 몇 초가 걸릴 것입니다 🙏.",
      'Vietnamese': "Được rồi, cho tôi vài giây để hiểu hình ảnh của bạn 🙏.",
      'Italian': "Certo, dammi qualche secondo per capire la tua immagine 🙏.",
    },

    'processingQuestion': {
      'English': "Sure, give me a few seconds to read your data and I'll get back to you with an answer in less than a minute 🙏. PS: Any feedback appreciated ❤️",
      'Spanish': "Seguro, dame unos segundos para leer tus datos y te responderé en menos de un minuto 🙏. PD: Se agradece cualquier comentario ❤️",
      'French': "Bien sûr, donnez-moi quelques secondes pour lire vos données et je reviendrai vers vous avec une réponse en moins d'une minute 🙏. PS : Tous les commentaires sont appréciés ❤️",
      'German': "Sicher, gib mir ein paar Sekunden, um deine Daten zu lesen und ich werde dir in weniger als einer Minute eine Antwort geben 🙏. PS: Jedes Feedback ist willkommen ❤️",
      'Mandarin Chinese': "好的,给我几秒钟看看您的数据,我会在一分钟内给您回复🙏。另:欢迎您提供任何反馈❤️",
      'Hindi': "ज़रूर, मुझे आपका डेटा पढ़ने के लिए कुछ सेकंड दीजिए, मैं एक मिनट से भी कम समय में आपको जवाब दे दूंगा🙏। बस: कोई भी प्रतिक्रिया स्वागत है❤️",
      'Russian': "Конечно, дайте мне пару секунд, чтобы прочитать ваши данные, и я вернусь к вам с ответом менее чем за минуту 🙏. ПС: Любая обратная связь приветствуется ❤️",
      'Japanese': "はい、あなたのデータを読むのに数秒かかります。1分以内に回答します🙏。追伸:フィードバックは歓迎です❤️",
      'Korean': "물론이죠, 제가 데이터를 읽는 데 몇 초가 걸릴 것이고 1분 이내로 답변 드리겠습니다🙏. PS: 모든 피드백 환영합니다❤️",
      'Vietnamese': "Được rồi, cho tôi vài giây để đọc dữ liệu của bạn và tôi sẽ trả lời bạn trong vòng một phút 🙏. PS: Mọi phản hồi đều được đánh giá cao ❤️",
      'Italian': "Certo, dammi qualche secondo per leggere i tuoi dati e ti risponderò in meno di un minuto 🙏. PS: Ogni feedback è apprezzato ❤️",
    }
  };

  return messages[messageType][language] || messages[messageType]['English'];

}