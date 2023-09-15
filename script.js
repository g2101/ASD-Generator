function generateBBCode() {
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
  return copyToClipboard();
  bbcodeOutput.select();
  document.execCommand("copy");
  alert("Copied to clipboard!");
}

function copyToClipboard() {
  const bbcodeOutput = document.getElementById("bbcode-output");
  bbcodeOutput.select();
  document.execCommand("copy");
  alert("Copied to clipboard!");
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

function getSavedPersonnelFileLink() {
  const cookies = document.cookie.split(";");

  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split("=");
    if (name === "personnelFileLink") {
      return decodeURIComponent(value);
    }
  }

  return "#"; 
}

function savePersonnelFileLink() {
  if (document.getElementById("personnel-file-link").value.trim() !== "") {
    var encodedLink = encodeURIComponent(document.getElementById("personnel-file-link").value.trim());

    const expirationDate = new Date();
    expirationDate.setFullYear(expirationDate.getFullYear() + 10);
    document.cookie = `personnelFileLink=${encodedLink}; expires=${expirationDate.toUTCString()}`;

    const personnelFilesLink = document.getElementById("personnel-files-link"); 
    personnelFilesLink.href = encodedLink;
    showSections();
  }
  else {
    alert("Please enter a link to your personnel file");
  }
}

function clearInputs() {
  const checkboxes = document.querySelectorAll(".bbcode-checkbox");
  checkboxes.forEach((checkbox) => {
    checkbox.checked = false;
  });
  

  const bbcodeOutput = document.getElementById("bbcode-output");
  bbcodeOutput.value = "";
}

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

    personnelFilesLink.href = getSavedPersonnelFileLink();
  } else {
    personnelFileSection.style.display = "block";
    checkboxSection.style.display = "none";
    outputSection.style.display = "none";

    personnelFilesLink.href = "#";
  }
}

function generateBBCode() {
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

function initializePage() {
  showSections(); 
}

window.addEventListener("load", initializePage);