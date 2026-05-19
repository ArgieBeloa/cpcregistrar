// =========================
// QUESTIONS
// =========================
const evaluationData = [
  { questionId: "1", questionText: "1. Started on time" },
  { questionId: "2", questionText: "2. Venue Arrangement" },
  { questionId: "3", questionText: "3. Sound System" },
  { questionId: "4", questionText: "4. Program Flow" },
  { questionId: "5", questionText: "5. Time Management" },
  { questionId: "6", questionText: "6. Decorations/Stage setup" },
  { questionId: "7", questionText: "7. Safety and Security" },
  { questionId: "8", questionText: "8. Overall Experience" },
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
        .map((i) => `<i class="fa-solid fa-star star" data-value="${i}"></i>`)
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

  let eventId = "";

  // GET SELECTED EVENT TYPE
  const eventType = document.getElementById("type").value;

  // CHECK EVENT TYPE
  if (eventType === "Baccalaureate") {
    eventId = "6a0bc2adaf3c7dac867da630";
  } else if (eventType === "Completion") {
    eventId = "6a0bc304af3c7dac867da631";
  } else if (eventType === "Commencement") {
    eventId = "6a0bc381af3c7dac867da632";
  }
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
    },
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
