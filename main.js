// =========================
// QUESTIONS
// =========================
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
// STAR CLICK HANDLER
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

  const values = Object.values(studentRate);

  const total = values.length ? values.reduce((a, b) => a + b, 0) : 0;

  const avg = values.length ? total / values.length : 0;

  const payload = {
    studentAverageRate: avg,
    studentSuggestion: suggestion,
    studentEvaluationInfos: infos,
  };

  const eventId = "6993a8adcd36cbda8cec3a03";

  try {
    // 🔥 SHOW LOADING
    document.getElementById("loading").style.display = "flex";

    // 🔥 PREVENT DOUBLE CLICK
    const btn = document.getElementById("submitBtn");
    btn.disabled = true;

    // 🔥 API CALL
    const result = await addEventEvaluation(eventId, payload);

    console.log("SUCCESS:", result);

    // 🔥 SHOW MODAL
    document.getElementById("modal").style.display = "flex";

  } catch (error) {
    console.error("ERROR:", error);
    alert("Failed to submit evaluation");

  } finally {
    // 🔥 ALWAYS RUN
    document.getElementById("loading").style.display = "none";
    document.getElementById("submitBtn").disabled = false;
  }
});

// =========================
// API CALL FUNCTION
// =========================
async function addEventEvaluation(eventId, evaluationData) {
  const response = await fetch(
    `https://securebackend-ox2e.onrender.com/api/auth/${eventId}/addEvaluation`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(evaluationData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to add evaluation");
  }

  return data;
}

// =========================
// CLOSE MODAL
// =========================
document.getElementById("closeModal").addEventListener("click", () => {
  document.getElementById("modal").style.display = "none";
});