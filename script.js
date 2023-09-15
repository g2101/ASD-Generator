function generateBBCode() {
  // Get the current date in UTC
  const currentUTCDate = new Date();
  const day = currentUTCDate.getUTCDate().toString().padStart(2, "0");
  const month = currentUTCDate
    .toLocaleString("default", { month: "short", timeZone: "UTC" })
    .toUpperCase();
  const year = currentUTCDate.getUTCFullYear();
  const formattedDate = `${day}/${month}/${year}`;

  const checkboxes = document.querySelectorAll(".bbcode-checkbox");
  let bbcode = `[divbox2=white][center][b]FLIGHT LOG ENTRY[/b][/center]\n[hr][/hr]\n[list=none][*][b]Date[/b]: ${formattedDate}\n[list=none]`;

  checkboxes.forEach((checkbox) => {
    const label = checkbox.nextElementSibling;
    const text = label.textContent.trim();
    const isChecked = checkbox.checked;

    if (isChecked) {
      bbcode += `[cbc] [b]${text}[/b]\n`;
    } else {
      bbcode += `[cb] [b]${text}[/b]\n`;
    }
  });

  bbcode += `[/list][/divbox2]`;

  const bbcodeOutput = document.getElementById("bbcode-output");
  bbcodeOutput.value = bbcode;
}

function copyToClipboard() {
  const bbcodeOutput = document.getElementById("bbcode-output");
  bbcodeOutput.select();
  document.execCommand("copy");
}

function personnelFileLinkExists() {
  const cookies = document.cookie.split(";");

  for (const cookie of cookies) {
    const [name] = cookie.trim().split("=");
    if (name === "personnelFileLink") {
      return true;
    }
  }

  return false;
}

/// Function to check if the personnel file link exists in cookies
function personnelFileLinkExists() {
  const cookies = document.cookie.split(";");

  for (const cookie of cookies) {
    const [name] = cookie.trim().split("=");
    if (name === "personnelFileLink") {
      return true;
    }
  }

  return false;
}

// Function to retrieve the saved personnel file link from cookies
function getSavedPersonnelFileLink() {
  const cookies = document.cookie.split(";");

  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split("=");
    if (name === "personnelFileLink") {
      return decodeURIComponent(value);
    }
  }

  return "#"; // Return a default value if the link is not found
}

// Function to save the personnel file link to cookies (with "posting" mode)
function savePersonnelFileLink() {
  const personnelFileLinkInput = document.getElementById("personnel-file-link");
  const linkValue = personnelFileLinkInput.value.trim();

  if (linkValue !== "") {
    // Construct the link in "posting" mode
    alert(linkValue);


  
    // Set the expiration date to a very large value (e.g., 10 years from now)
    const expirationDate = new Date();
    expirationDate.setFullYear(expirationDate.getFullYear() + 10); // Set expiration to 10 years from now
    document.cookie = `personnelFileLink=${linkValue}; expires=${expirationDate.toUTCString()}`;

    // Update the link for "Go to Personnel File" button
    const personnelFilesLink = document.getElementById("personnel-files-link"); 
    personnelFilesLink.href = linkValue;

    // Hide the input section and show the rest of the page
    showSections();
    return linkValue;
  }
}

// Function to clear the input field and checkboxes
function clearInputs() {
  const personnelFileLinkInput = document.getElementById("personnel-file-link");
  personnelFileLinkInput.value = "";

  const checkboxes = document.querySelectorAll(".bbcode-checkbox");
  checkboxes.forEach((checkbox) => {
    checkbox.checked = false;
  });

  // Clear the BBCode output
  const bbcodeOutput = document.getElementById("bbcode-output");
  bbcodeOutput.value = "";
}

// Function to show/hide sections based on personnel file link existence
function showSections() {
  const personnelFileSection = document.getElementById(
    "personnel-file-section"
  );
  const checkboxSection = document.getElementById("checkbox-section");
  const outputSection = document.getElementById("output-section");
  let personnelFilesLink = document.getElementById("personnel-files-link");

  if (personnelFileLinkExists()) {
    personnelFileSection.style.display = "none";
    checkboxSection.style.display = "block";
    outputSection.style.display = "block";

    // Update the link for "Go to Personnel File" button
    personnelFilesLink.href = getSavedPersonnelFileLink();
  } else {
    personnelFileSection.style.display = "block";
    checkboxSection.style.display = "none";
    outputSection.style.display = "none";

    // Reset the link for "Go to Personnel File" button to default
    personnelFilesLink.href = "#";
  }
}

// Function to generate BBCode for checkboxes
function generateBBCode() {
  // Get the current date in UTC
  const currentUTCDate = new Date();
  const day = currentUTCDate.getUTCDate().toString().padStart(2, "0");
  const month = currentUTCDate
    .toLocaleString("default", { month: "short", timeZone: "UTC" })
    .toUpperCase();
  const year = currentUTCDate.getUTCFullYear();
  const formattedDate = `${day}/${month}/${year}`;

  // Generate BBCode for the checkboxes
  const checkboxes = document.querySelectorAll(".bbcode-checkbox");
  let bbcode = `[divbox2=white][center][b]FLIGHT LOG ENTRY[/b][/center]\n[hr][/hr]\n[list=none][*][b]Date[/b]: ${formattedDate}\n[list=none]`;

  checkboxes.forEach((checkbox) => {
    const label = checkbox.nextElementSibling;
    const text = label.textContent.trim();
    const isChecked = checkbox.checked;

    if (isChecked) {
      bbcode += `[cbc] [b]${text}[/b]\n`;
    } else {
      bbcode += `[cb] [b]${text}[/b]\n`;
    }
  });

  bbcode += `[/list][/divbox2]`;

  // Update the BBCode output textarea
  const bbcodeOutput = document.getElementById("bbcode-output");
  bbcodeOutput.value = bbcode;
}

// Function to copy BBCode to clipboard
function copyToClipboard() {
  const bbcodeOutput = document.getElementById("bbcode-output");
  bbcodeOutput.select();
  document.execCommand("copy");
}

// Function to initialize the page
function initializePage() {
  showSections(); // Show/hide sections based on personnel file link
}

// Call the initializePage function when the page loads
window.addEventListener("load", initializePage);
