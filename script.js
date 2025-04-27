document.addEventListener("DOMContentLoaded", function () {
    const quizForm = document.getElementById("quiz-form");
    const resultDisplay = document.getElementById("result");

    quizForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const discordId = document.getElementById("discordId").value.trim();
        const applicantDetails = document.getElementById("applicantDetails").value.trim();
        const declaration = document.getElementById("declaration").checked;

        if (!discordId || !applicantDetails || !declaration) {
            resultDisplay.textContent = "All fields and declaration are mandatory!";
            resultDisplay.className = "error";
            return;
        }

        let userResponses = {};
        document.querySelectorAll("input[type=checkbox]:checked").forEach(input => {
            if (!userResponses[input.name]) userResponses[input.name] = [];
            userResponses[input.name].push(input.value);
        });

        // Ensure all questions are answered
        const totalQuestions = 12; // Assuming 12 questions, adjust as needed
        if (Object.keys(userResponses).length < totalQuestions) {
            resultDisplay.textContent = "You must answer all questions!";
            resultDisplay.className = "error";
            return;
        }

        const response = await fetch("/submit-quiz", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userResponses, discordId })
        });

        const result = await response.json();
        resultDisplay.textContent = `Result: ${result.result} (${result.correctCount}/12)`;
        resultDisplay.className = result.result === "Pass" ? "pass" : "fail";
    });
});
