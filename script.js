const allStudents = [
 ”たかはしきんしろう”,”たなかはやと”,”ゆもとはなえ”,
“かたぎりかいと”,”あべこうた”,“ひらつかしゅんすけ”,”にへいみお”,“はんだまさたか”,
“ひらいさき”,”かとうりひと”,”もちづきりん”,”やざきあいな”,”はむろあさひ”,
“よこかわみく”
];
  
  let quizData = [];
  let currentQuestion = 0;
  let correctCount = 0;
  let timer;
  let timeLeft = 10;
  let introIndex = 0;
  
  // 導入モード
  function startIntroMode() {
    document.querySelector(".mode-selection").classList.add("hidden");
    document.getElementById("intro").classList.remove("hidden");
  
    quizData = shuffle([...allStudents]);
    introIndex = 0;
    showIntro();
  }
  
  function showIntro() {
    document.getElementById("intro-name").classList.add("hidden");
    document.getElementById("intro-image").src = `images/${quizData[introIndex]}.jpg`;
    setTimeout(() => {
      document.getElementById("intro-name").textContent = quizData[introIndex];
      document.getElementById("intro-name").classList.remove("hidden");
    }, 1000);
  }
  
  function nextIntro() {
    introIndex++;
    if (introIndex < quizData.length) {
      showIntro();
    } else {
      location.reload();
    }
  }
  
  // ホームに戻る
  function goHome() {
    document.getElementById("intro").classList.add("hidden");
    document.querySelector(".mode-selection").classList.remove("hidden");
  }
  
  // 練習・テストモード
  function startGame(mode) {
    document.querySelector(".mode-selection").classList.add("hidden");
    document.getElementById("quiz").classList.remove("hidden");
  
    quizData = shuffle([...allStudents]);
    if (mode === "practice") quizData = quizData.slice(0, 10);
  
    currentQuestion = 0;
    correctCount = 0;
    showQuestion();
  }
  
  function showQuestion() {
    resetTimer();
    document.getElementById("feedback").textContent = "";
    document.getElementById("answer").value = "";
    document.getElementById("quiz-image").src = `images/${quizData[currentQuestion]}.jpg`;
    document.getElementById("question-counter").textContent = `${currentQuestion + 1} / ${quizData.length}`;
    startTimer();
  }
  
  function submitAnswer() {
    const userAnswer = document.getElementById("answer").value.trim();
    if (!userAnswer) return;
  
    stopTimer();
    const correctAnswer = quizData[currentQuestion];
  
    if (userAnswer === correctAnswer) {
      document.getElementById("feedback").textContent = "⭕️ 正解！";
      correctCount++;
    } else {
      document.getElementById("feedback").textContent = `❌ 不正解… 正解は「${correctAnswer}」でした`;
    }
  
    currentQuestion++;
    if (currentQuestion < quizData.length) {
      setTimeout(showQuestion, 1500);
    } else {
      setTimeout(showResult, 1500);
    }
  }
  
  function showResult() {
    document.getElementById("quiz").classList.add("hidden");
    document.getElementById("result").classList.remove("hidden");
    document.getElementById("score").textContent = `正解数：${correctCount} / ${quizData.length}`;
  }

  // ランキング保存
  function saveRanking(score, total) {
    const newEntry = {
      score: score,
      total: total,
      date: new Date().toLocaleString()
    };
  
    let ranking = JSON.parse(localStorage.getItem("ranking")) || [];
    ranking.push(newEntry);
    ranking.sort((a, b) => (b.score / b.total) - (a.score / a.total)); // 正答率順
    ranking = ranking.slice(0, 5); // 上位5件
  
    localStorage.setItem("ranking", JSON.stringify(ranking));
  }
  
  // ランキング表示
  function renderRanking() {
    const rankingList = document.getElementById("ranking");
    rankingList.innerHTML = "";
  
    const ranking = JSON.parse(localStorage.getItem("ranking")) || [];
  
    ranking.forEach((entry, index) => {
      const li = document.createElement("li");
      const percent = ((entry.score / entry.total) * 100).toFixed(1);
      li.textContent = `${index + 1}位 - ${entry.score}/${entry.total}（${percent}%） [${entry.date}]`;
      rankingList.appendChild(li);
    });
  }
  
  
  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
  
  // タイマー
  function startTimer() {
    timeLeft = 10;
    document.getElementById("timer").textContent = `残り時間: ${timeLeft}秒`;
    timer = setInterval(() => {
      timeLeft--;
      document.getElementById("timer").textContent = `残り時間: ${timeLeft}秒`;
      if (timeLeft <= 0) {
        stopTimer();
        submitAnswer();
      }
    }, 1000);
  }
  
  function stopTimer() {
    clearInterval(timer);
  }
  
  function resetTimer() {
    clearInterval(timer);
    document.getElementById("timer").textContent = "残り時間: 10秒";
  }
  function submitRanking() {
    const name = document.getElementById("player-name").value.trim();
    if (!name) {
      alert("名前を入力してください！");
      return;
    }
  
    saveRanking(name, correctCount, quizData.length);
    renderRanking();
  
    // 入力フォームを無効化
    document.getElementById("player-name").disabled = true;
  }
  
  function saveRanking(name, score, total) {
    const newEntry = {
      name: name,
      score: score,
      total: total,
      date: new Date().toLocaleString()
    };
  
    let ranking = JSON.parse(localStorage.getItem("ranking")) || [];
    ranking.push(newEntry);
    ranking.sort((a, b) => (b.score / b.total) - (a.score / a.total)); // 正答率順
    ranking = ranking.slice(0, 5); // 上位5件のみ
  
    localStorage.setItem("ranking", JSON.stringify(ranking));
  }
   
  function renderRanking() {
    const rankingList = document.getElementById("ranking");
    rankingList.innerHTML = "";
  
    const ranking = JSON.parse(localStorage.getItem("ranking")) || [];
  
    ranking.forEach((entry, index) => {
      const percent = ((entry.score / entry.total) * 100).toFixed(1);
      const li = document.createElement("li");
      li.textContent = `${index + 1}位 - ${entry.name}：${entry.score}/${entry.total}（${percent}%） [${entry.date}]`;
      rankingList.appendChild(li);
    });
  }
