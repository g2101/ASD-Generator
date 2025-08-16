function generateBBCode() {
  const currentUTCDate = new Date();
  const day = currentUTCDate.getUTCDate().toString().padStart(2, "0");
  const month = currentUTCDate
    .toLocaleString("default", { month: "short", timeZone: "UTC" })
    .toUpperCase();
  const year = currentUTCDate.getUTCFullYear();
  const formattedDate = `${day}/${month}/${year}`;
  var totalPoints = 0;
  var totalHours = document.getElementById("totalHours").value
  if (totalHours == '') {
    totalHours = "N/A";
  }

  const checkboxes = document.querySelectorAll(".bbcode-checkbox");
  let bbcode = `[divbox2=white][center][b]FLIGHT LOG ENTRY[/b][/center]\n[hr][/hr]\n[list=none][*][b]Date[/b]: ${formattedDate}\n[*][b]Total Flight Hours (Optional)[/b]: ${totalHours} [/list][list=none]\n`;

  checkboxes.forEach((checkbox) => {
    const label = checkbox.nextElementSibling;
    const text = label.textContent.trim();
    const isChecked = checkbox.checked;
    const pointValue = parseInt(checkbox.getAttribute("data-points"), 10);

    if (isChecked) {
      bbcode += `[cbc] [b]${text}[/b]\n`;
      totalPoints += pointValue;
    } else {
      bbcode += `[cb] [b]${text}[/b]\n`;
    }
  });

  bbcode += `[/list][/divbox2]`;

  const bbcodeOutput = document.getElementById("bbcode-output");
  bbcodeOutput.value = bbcode;

  const totalPointsOutput = document.getElementById("totalPoints");
  totalPointsOutput.textContent = `Total Points: ${totalPoints}`;
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
    let encodedLink = encodeURIComponent(document.getElementById("personnel-file-link").value.trim());

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

  const totalPointsOutput = document.getElementById("totalPoints");
  totalPointsOutput.textContent = `Total Points: 0`;
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

function initializePage() {
  showSections(); 
}

window.addEventListener("load", initializePage);