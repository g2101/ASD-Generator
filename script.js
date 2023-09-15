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

function savePersonnelFileLink() {
  const personnelFileLinkInput = document.getElementById("personnel-file-link");
  const linkValue = personnelFileLinkInput.value.trim();

  if (linkValue !== "") {
    const expirationDate = new Date();
    expirationDate.setFullYear(expirationDate.getFullYear() + 10); // Set expiration to 10 years from now
    document.cookie = `personnelFileLink=${linkValue}; expires=${expirationDate.toUTCString()}`;
    
    showSections();
  }
}

function showSections() {
  const personnelFileSection = document.getElementById("personnel-file-section");
  const checkboxSection = document.getElementById("checkbox-section");
  const outputSection = document.getElementById("output-section");

  if (personnelFileLinkExists()) {
    personnelFileSection.style.display = "none";
    checkboxSection.style.display = "block";
    outputSection.style.display = "block";
  } else {
    personnelFileSection.style.display = "block";
    checkboxSection.style.display = "none";
    outputSection.style.display = "none";
  }
}

showSections();

function clearInputs() {
  const personnelFileLinkInput = document.getElementById("personnel-file-link");
  personnelFileLinkInput.value = "";

  const checkboxes = document.querySelectorAll(".bbcode-checkbox");
  checkboxes.forEach((checkbox) => {
    checkbox.checked = false;
  });

  const bbcodeOutput = document.getElementById("bbcode-output");
  bbcodeOutput.value = "";
}
