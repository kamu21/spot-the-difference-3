const problems = [
    // サンプル2問（追加で50～100問まで同じ形式で追加可能）
    {
        image1: "https://kamu21.github.io/gazou3/a1.png",
        image2: "https://kamu21.github.io/gazou3/a2.png",
        mistakes: [
            { x: 107, y: 95, radius: 160, found: false },
            { x: 320, y: 360, radius: 160, found: false },
            { x: 551, y: 562, radius: 160, found: false }
        ]
    },
    {
        image1: "https://kamu21.github.io/gazou3/a3.png",
        image2: "https://kamu21.github.io/gazou3/a4.png",
        mistakes: [
            { x: 138, y: 129, radius: 160, found: false },
            { x: 105, y: 496, radius: 160, found: false },
            { x: 489, y: 153, radius: 160, found: false }
        ]
    }
];

let currentProblemIndex = 0;
let totalCorrect = 0;

const result = document.getElementById("result");
const bgm = document.getElementById("bgm");
const correctSound = document.getElementById("correctSound");

bgm.volume = 0.5;

// スタートボタン
document.getElementById("start-btn").addEventListener("click", function() {
    document.getElementById("intro-screen").style.display = "none";
    document.getElementById("game-screen").style.display = "block";
    loadNextProblem();
});

// 次の問題をロード
function loadNextProblem() {
    if (currentProblemIndex >= problems.length) return;

    const problem = problems[currentProblemIndex];

    document.getElementById("image1").src = problem.image1;
    document.getElementById("image2").src = problem.image2;

    problem.mistakes.forEach(m => m.found = false);
    document.querySelectorAll(".circle").forEach(c => c.remove());

    currentProblemIndex++;
}

// 間違いチェック
function checkMistake(event, problem) {
    const rect = event.target.getBoundingClientRect();
    const scaleX = event.target.naturalWidth / rect.width;
    const scaleY = event.target.naturalHeight / rect.height;

    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;

    console.log("クリック座標:", x.toFixed(0), y.toFixed(0));

    for (let mistake of problem.mistakes) {
        if (mistake.found) continue;

        const distance = Math.sqrt((x - mistake.x) ** 2 + (y - mistake.y) ** 2);

        if (distance < mistake.radius) {
            mistake.found = true;
            totalCorrect++;
            showCircle(event.target, mistake.x, mistake.y);
            correctSound.play();

            if (problem.mistakes.every(m => m.found)) {
                if (totalCorrect % 5 === 0) {
                    showCheckpoint();
                } else {
                    setTimeout(loadNextProblem, 1000);
                }
            }
            return;
        }
    }
}

// 〇表示
function showCircle(img, x, y) {
    const rect = img.getBoundingClientRect();
    const scaleX = rect.width / img.naturalWidth;
    const scaleY = rect.height / img.naturalHeight;

    const displayX = x * scaleX;
    const displayY = y * scaleY;

    const circle = document.createElement("div");
    circle.className = "circle";
    circle.style.left = displayX + "px";
    circle.style.top = displayY + "px";

    img.parentElement.appendChild(circle);
}

// 5問ごとのチェックポイント表示
function showCheckpoint() {
    document.getElementById("game-screen").style.display = "none";
    document.getElementById("checkpoint-screen").style.display = "flex";
}

// 次の5問へ
document.getElementById("next5-btn").addEventListener("click", function() {
    document.getElementById("checkpoint-screen").style.display = "none";
    document.getElementById("game-screen").style.display = "block";
    loadNextProblem();
});

// ここで終了
document.getElementById("finish-btn").addEventListener("click", function() {
    document.getElementById("checkpoint-screen").style.display = "none";
    document.getElementById("game-screen").style.display = "none";
    bgm.pause();
});

// 画像クリックイベント
document.getElementById("image1").addEventListener("click", function(event) {
    const problem = problems[currentProblemIndex - 1];
    checkMistake(event, problem);
});

document.getElementById("image2").addEventListener("click", function(event) {
    const problem = problems[currentProblemIndex - 1];
    checkMistake(event, problem);
});
