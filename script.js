const form = document.getElementById("contactForm");
const resetBtn = document.getElementById("resetBtn");

const inputs = {
  username: document.getElementById("username"),
  email: document.getElementById("email"),
  phone: document.getElementById("phone"),
  message: document.getElementById("message"),
};

const successMsg = document.getElementById("successMsg");
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Show error
function setError(input, message) {
  const group = input.parentElement;
  group.classList.add("error");
  group.classList.remove("success");
  group.querySelector(".error-msg").textContent = message;
}

// Show success
function setSuccess(input) {
  const group = input.parentElement;
  group.classList.remove("error");
  group.classList.add("success");
  group.querySelector(".error-msg").textContent = "";
}

// Load saved data
function loadSavedData() {
  const savedData = JSON.parse(localStorage.getItem("contactFormData"));
  if (savedData) {
    inputs.username.value = savedData.username || "";
    inputs.email.value = savedData.email || "";
    inputs.phone.value = savedData.phone || "";
    inputs.message.value = savedData.message || "";
  }
}
loadSavedData();

// Save on input
Object.values(inputs).forEach((input) => {
  input.addEventListener("input", () => {
    const data = {
      username: inputs.username.value,
      email: inputs.email.value,
      phone: inputs.phone.value,
      message: inputs.message.value,
    };
    localStorage.setItem("contactFormData", JSON.stringify(data));

    // Real-time validation
    if (input === inputs.username) {
      input.value.trim() === "" ? setError(input, "Name is required.") : setSuccess(input);
    } else if (input === inputs.email) {
      const value = input.value.trim();
      if (value === "") setError(input, "Email is required.");
      else if (!emailRegex.test(value)) setError(input, "Invalid email format.");
      else setSuccess(input);
    } else if (input === inputs.message) {
      input.value.trim() === "" ? setError(input, "Message cannot be empty.") : setSuccess(input);
    }
  });
});

// Submit form
form.addEventListener("submit", (e) => {
  e.preventDefault();
  let valid = true;

  if (inputs.username.value.trim() === "") {
    setError(inputs.username, "Name is required.");
    valid = false;
  }
  if (inputs.email.value.trim() === "") {
    setError(inputs.email, "Email is required.");
    valid = false;
  } else if (!emailRegex.test(inputs.email.value.trim())) {
    setError(inputs.email, "Invalid email format.");
    valid = false;
  }
  if (inputs.message.value.trim() === "") {
    setError(inputs.message, "Message cannot be empty.");
    valid = false;
  }

  if (valid) {
    successMsg.textContent = "✅ Message sent successfully!";
    form.reset();
    localStorage.removeItem("contactFormData");
    Object.values(inputs).forEach((input) => {
      input.parentElement.classList.remove("success");
    });
  } else {
    successMsg.textContent = "";
  }
});

// Reset button clears everything
resetBtn.addEventListener("click", () => {
  form.reset();
  localStorage.removeItem("contactFormData");
  successMsg.textContent = "🧹 Form cleared!";
  Object.values(inputs).forEach((input) => {
    input.parentElement.classList.remove("error", "success");
    input.parentElement.querySelector(".error-msg").textContent = "";
  });
});
