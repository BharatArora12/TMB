/**
 * Towards My Bharat — Contact Form Controller
 * Features:
 * - Robust client-side validation (Email format, typos, phone, name, message)
 * - Serverless submission to FormSubmit (recipient: bhartiyasanskriti120706@gmail.com)
 * - Real-time error feedback without page reload
 */

document.addEventListener("DOMContentLoaded", () => {
  const contactForm = document.getElementById("contactForm");
  if (!contactForm) return;

  const submitBtn = document.getElementById("submitBtn");
  const buttonText = document.getElementById("buttonText");
  const formStatus = document.getElementById("formStatus");

  const nameInput = document.getElementById("name");
  const mobileInput = document.getElementById("mobile");
  const emailInput = document.getElementById("email");
  const messageInput = document.getElementById("message");
  const charCount = document.getElementById("charCount");

  const nameError = document.getElementById("nameError");
  const mobileError = document.getElementById("mobileError");
  const emailError = document.getElementById("emailError");
  const messageError = document.getElementById("messageError");

  // Destination email address specified by the administration
  const RECIPIENT_EMAIL = "bhartiyasanskriti120706@gmail.com";

  // Common email domain typo detection dictionary
  const DOMAIN_TYPOS = {
    "gmai.com": "gmail.com",
    "gamil.com": "gmail.com",
    "gmial.com": "gmail.com",
    "gmaill.com": "gmail.com",
    "gmai.in": "gmail.com",
    "yaho.com": "yahoo.com",
    "yahooo.com": "yahoo.com",
    "hotmial.com": "hotmail.com",
    "hotmaill.com": "hotmail.com",
    "outlok.com": "outlook.com",
    "outloo.com": "outlook.com",
    "redifmail.com": "rediffmail.com",
    "rediff.com": "rediffmail.com"
  };

  /**
   * Character Counter for Message Area
   */
  if (messageInput && charCount) {
    messageInput.addEventListener("input", () => {
      charCount.textContent = `${messageInput.value.length}/3000`;
    });
  }

  /**
   * Displays general status messages at the bottom of the card
   * @param {string} text - Message text
   * @param {'success'|'error'} type - Style modifier class
   */
  function showStatus(text, type) {
    if (!formStatus) return;
    formStatus.textContent = text;
    formStatus.className = `form-status ${type}`;
    formStatus.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function clearStatus() {
    if (!formStatus) return;
    formStatus.textContent = "";
    formStatus.className = "form-status";
  }

  /**
   * Shows an inline field error message and marks the input red
   */
  function setFieldError(inputEl, errorEl, message) {
    if (inputEl) {
      inputEl.classList.add("is-invalid");
      inputEl.setAttribute("aria-invalid", "true");
    }
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.classList.add("visible");
    }
  }

  /**
   * Clears an inline field error message and resets input border
   */
  function clearFieldError(inputEl, errorEl) {
    if (inputEl) {
      inputEl.classList.remove("is-invalid");
      inputEl.removeAttribute("aria-invalid");
    }
    if (errorEl) {
      errorEl.textContent = "";
      errorEl.classList.remove("visible");
    }
  }

  /**
   * Rigorous client-side email validator
   * Validates structure, symbols, valid TLD, and catches common domain typos
   */
  function validateEmail(val) {
    const email = val ? val.trim() : "";
    if (!email) {
      return {
        isValid: false,
        message: "Email address is required."
      };
    }

    // Standard RFC 5322 matching regex
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

    if (!emailRegex.test(email)) {
      return {
        isValid: false,
        message: "Please enter a valid email address (e.g. name@domain.com)."
      };
    }

    const atParts = email.split("@");
    if (atParts.length !== 2) {
      return {
        isValid: false,
        message: "Email must have exactly one '@' symbol."
      };
    }

    const domain = atParts[1].toLowerCase();
    const domainParts = domain.split(".");
    const tld = domainParts[domainParts.length - 1];

    if (!tld || tld.length < 2) {
      return {
        isValid: false,
        message: "The domain extension (.com, .in, etc.) appears invalid."
      };
    }

    // Detect and warn about common domain typos
    if (DOMAIN_TYPOS[domain]) {
      const suggestedEmail = `${atParts[0]}@${DOMAIN_TYPOS[domain]}`;
      return {
        isValid: false,
        message: `Did you mean ${suggestedEmail}? Please check for spelling mistakes.`
      };
    }

    return {
      isValid: true,
      email: email
    };
  }

  /**
   * Validates full name
   */
  function validateName(val) {
    const name = val ? val.trim() : "";
    if (!name) {
      return { isValid: false, message: "Full Name is required." };
    }
    if (name.length < 2) {
      return { isValid: false, message: "Please enter your full name (at least 2 characters)." };
    }
    return { isValid: true, name: name };
  }

  /**
   * Validates mobile / phone number
   */
  function validateMobile(val) {
    const mobile = val ? val.trim() : "";
    if (!mobile) {
      return { isValid: false, message: "Mobile number is required." };
    }
    // Must contain between 7 and 15 digits
    const digitsOnly = mobile.replace(/\D/g, "");
    if (digitsOnly.length < 7 || digitsOnly.length > 15) {
      return {
        isValid: false,
        message: "Please enter a valid phone number with 7 to 15 digits."
      };
    }
    return { isValid: true, mobile: mobile };
  }

  /**
   * Validates message length
   */
  function validateMessage(val) {
    const msg = val ? val.trim() : "";
    if (!msg) {
      return { isValid: false, message: "Please enter a message for the admin." };
    }
    if (msg.length < 6) {
      return { isValid: false, message: "Message is too short (minimum 6 characters)." };
    }
    return { isValid: true, message: msg };
  }

  // Real-time validation listeners on blur and input
  if (emailInput) {
    emailInput.addEventListener("blur", () => {
      const result = validateEmail(emailInput.value);
      if (!result.isValid) {
        setFieldError(emailInput, emailError, result.message);
      } else {
        clearFieldError(emailInput, emailError);
      }
    });

    emailInput.addEventListener("input", () => {
      if (emailInput.classList.contains("is-invalid")) {
        const result = validateEmail(emailInput.value);
        if (result.isValid) {
          clearFieldError(emailInput, emailError);
        }
      }
    });
  }

  if (nameInput) {
    nameInput.addEventListener("blur", () => {
      const res = validateName(nameInput.value);
      if (!res.isValid) {
        setFieldError(nameInput, nameError, res.message);
      } else {
        clearFieldError(nameInput, nameError);
      }
    });
    nameInput.addEventListener("input", () => {
      if (nameInput.classList.contains("is-invalid")) {
        if (validateName(nameInput.value).isValid) {
          clearFieldError(nameInput, nameError);
        }
      }
    });
  }

  if (mobileInput) {
    mobileInput.addEventListener("blur", () => {
      const res = validateMobile(mobileInput.value);
      if (!res.isValid) {
        setFieldError(mobileInput, mobileError, res.message);
      } else {
        clearFieldError(mobileInput, mobileError);
      }
    });
    mobileInput.addEventListener("input", () => {
      if (mobileInput.classList.contains("is-invalid")) {
        if (validateMobile(mobileInput.value).isValid) {
          clearFieldError(mobileInput, mobileError);
        }
      }
    });
  }

  if (messageInput) {
    messageInput.addEventListener("blur", () => {
      const res = validateMessage(messageInput.value);
      if (!res.isValid) {
        setFieldError(messageInput, messageError, res.message);
      } else {
        clearFieldError(messageInput, messageError);
      }
    });
    messageInput.addEventListener("input", () => {
      if (messageInput.classList.contains("is-invalid")) {
        if (validateMessage(messageInput.value).isValid) {
          clearFieldError(messageInput, messageError);
        }
      }
    });
  }

  /**
   * Main Form Submission Handler
   */
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearStatus();

    // Check honeypot spam protection
    const honeyField = contactForm.elements["_honey"];
    if (honeyField && honeyField.value !== "") {
      showStatus("Unable to process this submission.", "error");
      return;
    }

    // Run complete validation
    const nameCheck = validateName(nameInput.value);
    const mobileCheck = validateMobile(mobileInput.value);
    const emailCheck = validateEmail(emailInput.value);
    const messageCheck = validateMessage(messageInput.value);

    let hasError = false;

    if (!nameCheck.isValid) {
      setFieldError(nameInput, nameError, nameCheck.message);
      hasError = true;
    } else {
      clearFieldError(nameInput, nameError);
    }

    if (!mobileCheck.isValid) {
      setFieldError(mobileInput, mobileError, mobileCheck.message);
      hasError = true;
    } else {
      clearFieldError(mobileInput, mobileError);
    }

    if (!emailCheck.isValid) {
      setFieldError(emailInput, emailError, emailCheck.message);
      hasError = true;
    } else {
      clearFieldError(emailInput, emailError);
    }

    if (!messageCheck.isValid) {
      setFieldError(messageInput, messageError, messageCheck.message);
      hasError = true;
    } else {
      clearFieldError(messageInput, messageError);
    }

    if (hasError) {
      if (!emailCheck.isValid) {
        showStatus(
          `Please provide a valid email address (${emailCheck.message}) so we can reply back to you.`,
          "error"
        );
        emailInput.focus();
      } else {
        showStatus("Please correct the highlighted fields before submitting.", "error");
      }
      return;
    }

    // Begin Submission State
    submitBtn.disabled = true;
    const originalText = buttonText.textContent;
    buttonText.textContent = "Sending Message...";

    try {
      const payload = {
        name: nameCheck.name,
        mobile: mobileCheck.mobile,
        email: emailCheck.email,
        message: messageCheck.message,
        _replyto: emailCheck.email, // Admin can click reply in their email client
        _subject: `New Contact Message from ${nameCheck.name} - Towards My Bharat`,
        _template: "table",
        _captcha: "false"
      };

      const response = await fetch(
        `https://formsubmit.co/ajax/${RECIPIENT_EMAIL}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
          },
          body: JSON.stringify(payload)
        }
      );

      const responseText = await response.text();
      let result;

      try {
        result = JSON.parse(responseText);
      } catch (parseErr) {
        throw new Error(
          "The email service sent an unexpected response. Please try again or reach out directly to info@towardsmybharat.in."
        );
      }

      if (!response.ok || result.success === false || result.success === "false") {
        throw new Error(
          result.message || "The email service could not deliver this message. Please try again."
        );
      }

      // Success Confirmation
      showStatus(
        "Thank you! Your message has been sent successfully to the Towards My Bharat team. We will get back to you shortly.",
        "success"
      );

      contactForm.reset();
      if (charCount) charCount.textContent = "0/3000";
      clearFieldError(nameInput, nameError);
      clearFieldError(mobileInput, mobileError);
      clearFieldError(emailInput, emailError);
      clearFieldError(messageInput, messageError);

    } catch (error) {
      console.error("Form submission error:", error);

      const isNetworkErr = error.message && error.message.includes("Failed to fetch");
      const errorMsg = isNetworkErr
        ? "Network connection error. Please verify your internet connection or email us directly at info@towardsmybharat.in."
        : error.message;

      showStatus(errorMsg, "error");

    } finally {
      submitBtn.disabled = false;
      buttonText.textContent = originalText;
    }
  });
});
