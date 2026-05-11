
const ids =[
 "6993a8adcd36cbda8cec3a03"
]

// QUESTIONS
const evaluationData = [
  { questionId: "1", questionText: "How would you rate the overall event?" },
  { questionId: "2", questionText: "How was the speaker's presentation?" },
  { questionId: "3", questionText: "Was the event well organized?" },
  { questionId: "4", questionText: "How satisfied are you with the venue?" },
  { questionId: "5", questionText: "Would you attend future events like this?" }
];

const questionsContainer = document.getElementById("questionsContainer");
const studentRate = {};

// =========================
// RENDER QUESTIONS
// =========================
evaluationData.forEach((q) => {
  const div = document.createElement("div");
  div.className = "question-card";

  div.innerHTML = `
    <div class="question-text">${q.questionText}</div>

    <div class="stars" data-id="${q.questionId}">
      ${[1, 2, 3, 4, 5]
        .map(
          (i) => `<i class="fa-solid fa-star star" data-value="${i}"></i>`
        )
        .join("")}
    </div>
  `;

  questionsContainer.appendChild(div);
});

// =========================
// STAR CLICK
// =========================
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("star")) {
    const value = Number(e.target.dataset.value);
    const parent = e.target.closest(".stars");
    const id = parent.dataset.id;

    studentRate[id] = value;

    parent.querySelectorAll(".star").forEach((star, index) => {
      star.classList.toggle("active", index < value);
    });
  }
});

// =========================
// SUBMIT
// =========================
document.getElementById("submitBtn").addEventListener("click", async () => {
  const suggestion = document.getElementById("suggestion").value;

  const infos = evaluationData.map((q) => ({
    question: q.questionText,
    studentRate: studentRate[q.questionId] || 0,
  }));

  const total = Object.values(studentRate).reduce((a, b) => a + b, 0);

  const avg =
    Object.values(studentRate).length > 0
      ? total / Object.values(studentRate).length
      : 0;

  const payload = {
    studentAverageRate: avg,
    studentSuggestion: suggestion,
    studentEvaluationInfos: infos,
  };



  try {
    // 🔥 SHOW LOADING
    document.getElementById("loading").style.display = "flex";

    // 🔥 CALL API
    const result = await addEventEvaluation(ids[0], payload);

    // 🔥 HIDE LOADING
    document.getElementById("loading").style.display = "none";

    // 🔥 SHOW SUCCESS MODAL
    document.getElementById("modal").style.display = "flex";

    console.log("SUCCESS:", result);
  } catch (error) {
    document.getElementById("loading").style.display = "none";
    alert("Failed to submit evaluation");
    console.error(error);
  }
});

// =========================
// API CALL FUNCTION
// =========================
async function addEventEvaluation(eventId, evaluationData) {
  try {
    const response = await fetch(
      `https://securebackend-ox2e.onrender.com/api/auth/${eventId}/addEvaluation`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(evaluationData),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to add evaluation");
    }

    return data;
  } catch (error) {
    console.error("❌ API Error:", error.message);
    throw error;
  }
}

// =========================
// CLOSE MODAL
// =========================
document.getElementById("closeModal").addEventListener("click", () => {
  document.getElementById("modal").style.display = "none";
});