const problems = [
    {
        image1: "https://kamu21.github.io/gazou3/a1.png",
        image2: "https://kamu21.github.io/gazou3/a2.png",
        mistakes: [
            { x: 107, y: 95, radius: 160 },
            { x: 320, y: 360, radius: 160 },
            { x: 551, y: 562, radius: 160 }
        ]
    },
    {
        image1: "https://kamu21.github.io/gazou3/a3.png",
        image2: "https://kamu21.github.io/gazou3/a4.png",
        mistakes: [
            { x: 138, y: 129, radius: 160 },
            { x: 105, y: 496, radius: 160 },
            { x: 489, y: 153, radius: 160 }
        ]
    },
    {
        image1: "https://kamu21.github.io/gazou3/a5.png",
        image2: "https://kamu21.github.io/gazou3/a6.png",
        mistakes: [
            { x: 492, y: 114, radius: 160 },
            { x: 104, y: 479, radius: 160 },
            { x: 554, y: 432, radius: 160 }
        ]
    },
    {
        image1: "https://kamu21.github.io/gazou3/a7.png",
        image2: "https://kamu21.github.io/gazou3/a8.png",
        mistakes: [
            { x: 273, y: 119, radius: 160 },
            { x: 487, y: 160, radius: 160 },
            { x: 330, y: 544, radius: 160 }
        ]
    },
    {
        image1: "https://kamu21.github.io/gazou3/a9.png",
        image2: "https://kamu21.github.io/gazou3/a10.png",
        mistakes: [
            { x: 92, y: 160, radius: 160 },
            { x: 252, y: 447, radius: 160 },
            { x: 499, y: 526, radius: 160 }
        ]
    }
];

let currentProblemIndex = 0;
let timeLeft = 180;
let timerInterval;

const bgm = document.getElementById("bgm");
const correctSound = document.getElementById("correctSound");
const circleSound = document.getElementById("circleSound");
const resultSound = document.getElementById("resultSound");

// シャッフル
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// スタート
document.getElementById("start-btn").addEventListener("click", () => {
    document.getElementById("intro-screen").style.display = "none";
    document.getElementById("game-screen").style.display = "flex";

    currentProblemIndex = 0;
    timeLeft = 180;

    shuffle(problems);

    bgm.currentTime = 0;
    bgm.play().catch(() => {});

    startTimer();
    loadNextProblem();
});

// タイマー
function startTimer() {
    clearInterval(timerInterval);

    const timerEl = document.getElementById("timer");

    timerInterval = setInterval(() => {
        timeLeft--;

        let min = Math.floor(timeLeft / 60);
        let sec = timeLeft % 60;

        timerEl.textContent =
            `残り ${min}:${sec.toString().padStart(2, "0")}`;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            endGame();
        }
    }, 1000);
}

// 終了
function endGame() {
    clearInterval(timerInterval);

    document.getElementById("game-screen").style.display = "none";
    document.getElementById("result-screen").style.display = "flex";

    document.getElementById("final-score").textContent =
        `あなたは ${currentProblemIndex} 問クリアしました！`;

    bgm.pause();

    resultSound.currentTime = 0;
    resultSound.play().catch(() => {});
}

// 問題表示
function loadNextProblem() {
    if (currentProblemIndex >= problems.length) {
        endGame();
        return;
    }

    const problem = problems[currentProblemIndex];

    document.querySelectorAll(".circle").forEach(c => c.remove());
    document.getElementById("result").textContent =
        `問題 ${currentProblemIndex + 1}`;

    document.getElementById("image1").src = problem.image1;
    document.getElementById("image2").src = problem.image2;

    problem.mistakes.forEach(m => m.found = false);
}

// クリック位置補正
function getCorrectedClickPosition(event) {
    const img = event.target;
    const rect = img.getBoundingClientRect();

    const naturalWidth = img.naturalWidth;
    const naturalHeight = img.naturalHeight;

    const displayRatio = rect.width / rect.height;
    const imageRatio = naturalWidth / naturalHeight;

    let offsetX, offsetY, drawWidth, drawHeight;

    if (displayRatio > imageRatio) {
        drawHeight = rect.height;
        drawWidth = rect.height * imageRatio;
        offsetX = (rect.width - drawWidth) / 2;
        offsetY = 0;
    } else {
        drawWidth = rect.width;
        drawHeight = rect.width / imageRatio;
        offsetX = 0;
        offsetY = (rect.height - drawHeight) / 2;
    }

    const x = event.clientX - rect.left - offsetX;
    const y = event.clientY - rect.top - offsetY;

    return {
        x: x * (naturalWidth / drawWidth),
        y: y * (naturalHeight / drawHeight)
    };
}

// 判定（★ミス時は完全無反応）
function checkMistake(event) {
    const problem = problems[currentProblemIndex];

    const pos = getCorrectedClickPosition(event);
    const x = pos.x;
    const y = pos.y;

    for (let m of problem.mistakes) {
        if (m.found) continue;

        const dx = x - m.x;
        const dy = y - m.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < m.radius) {
            m.found = true;

            showCircle("image1", m.x, m.y);
            showCircle("image2", m.x, m.y);

            correctSound.currentTime = 0;
            correctSound.play().catch(() => {});

            if (problem.mistakes.every(mm => mm.found)) {
                currentProblemIndex++;
                setTimeout(loadNextProblem, 800);
            }
            return;
        }
    }

    // ← 何も処理しない（完全無反応）
}

// 丸表示
function showCircle(id, x, y) {
    const img = document.getElementById(id);
    const rect = img.getBoundingClientRect();

    const naturalWidth = img.naturalWidth;
    const naturalHeight = img.naturalHeight;

    const displayRatio = rect.width / rect.height;
    const imageRatio = naturalWidth / naturalHeight;

    let offsetX, offsetY, drawWidth, drawHeight;

    if (displayRatio > imageRatio) {
        drawHeight = rect.height;
        drawWidth = rect.height * imageRatio;
        offsetX = (rect.width - drawWidth) / 2;
        offsetY = 0;
    } else {
        drawWidth = rect.width;
        drawHeight = rect.width / imageRatio;
        offsetX = 0;
        offsetY = (rect.height - drawHeight) / 2;
    }

    const circle = document.createElement("div");
    circle.className = "circle";

    circle.style.left =
        (x * (drawWidth / naturalWidth) + offsetX) + "px";
    circle.style.top =
        (y * (drawHeight / naturalHeight) + offsetY) + "px";

    img.parentElement.appendChild(circle);

    circleSound.currentTime = 0;
    circleSound.play().catch(() => {});
}

// クリック
document.getElementById("image1").onclick = checkMistake;
document.getElementById("image2").onclick = checkMistake;

// リスタート
document.getElementById("restart-btn").onclick = () => {
    document.getElementById("result-screen").style.display = "none";
    document.getElementById("intro-screen").style.display = "flex";
};
