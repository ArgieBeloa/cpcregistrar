// =========================
// QUESTIONS
// =========================
const evaluationData = [
  { questionId: "1", questionText: "Started on time" },
  { questionId: "2", questionText: "Venue Arrangement" },
  { questionId: "3", questionText: "Sound System" },
  { questionId: "4", questionText: "Program Flow" },
  { questionId: "5", questionText: "Time Management" },
  { questionId: "6", questionText: "Decorations/Stage setup" },
  { questionId: "7", questionText: "Safety and Security" },
  { questionId: "8", questionText: "Overall Experience" },
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
  const studentName = document.getElementById("studentName").value;
  const studentCourse = document.getElementById("course").value;
  const eventType = document.getElementById("type").value;
  const suggestion = document.getElementById("suggestion").value;

  const infos = evaluationData.map((q) => ({
    question: q.questionText,
    studentRate: studentRate[q.questionId] || 0,
  }));

  const values = Object.values(studentRate);
  const total = values.reduce((a, b) => a + b, 0);
  const avg = values.length ? total / values.length : 0;

  const payload = {
    studentName,
    studentAverageRate: avg,
    studentSuggestion: suggestion,
    course: studentCourse,
    studentEvaluationInfos: infos,
  };

  const eventId = "6993a8adcd36cbda8cec3a03";

  try {
    document.getElementById("loading").style.display = "flex";
    document.getElementById("submitBtn").disabled = true;

    await addEventEvaluation(eventId, payload);

    // =========================
    // SHOW MODAL DATA
    // =========================
    document.getElementById("modalName").innerText = studentName;
    document.getElementById("modalEvent").innerText = eventType;

    document.getElementById("modal").style.display = "flex";

  } catch (error) {
    alert("Failed to submit evaluation");
  } finally {
    document.getElementById("loading").style.display = "none";
    document.getElementById("submitBtn").disabled = false;
  }
});

// =========================
// API
// =========================
async function addEventEvaluation(eventId, evaluationData) {
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

  if (!response.ok) throw new Error(data.message);

  return data;
}

// =========================
// CLOSE MODAL
// =========================
document.getElementById("closeModal").addEventListener("click", () => {
  document.getElementById("modal").style.display = "none";
});

// =========================
// SCREENSHOT BACKUP
// =========================
document.getElementById("btnScreenshot").addEventListener("click", async () => {
  const modal = document.querySelector(".modal-content");

  const canvas = await html2canvas(modal);

  const link = document.createElement("a");
  link.download = "evaluation-backup.png";
  link.href = canvas.toDataURL();
  link.click();
});