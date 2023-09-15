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

function copyToClipboard() {
  const bbcodeOutput = document.getElementById("bbcode-output");
  bbcodeOutput.select();
  document.execCommand("copy");
}

// Function to save the personnel file link in cookies
function savePersonnelFileLink() {
  const personnelFileLinkInput = document.getElementById("personnel-file-link");
  const personnelFileLink = personnelFileLinkInput.value;

  // Check if the link is not empty
  if (personnelFileLink.trim() !== "") {
    // Save the link in a cookie that expires in 30 days
    document.cookie = `personnelFileLink=${encodeURIComponent(personnelFileLink)}; expires=${getCookieExpiration(30)}`;

    // Clear the input field
    personnelFileLinkInput.value = "";

    // Notify the user that the link has been saved (you can customize this part)
    alert("Personnel file link saved successfully!");
  } else {
    // Notify the user that the input is empty (you can customize this part)
    alert("Please enter a personnel file link.");
  }
}

// Function to retrieve the personnel file link from cookies
function getPersonnelFileLink() {
  const cookies = document.cookie.split(";");

  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split("=");
    if (name === "personnelFileLink") {
      return decodeURIComponent(value);
    }
  }

  return null;
}

// Function to set the personnel file link if it exists in cookies
function setPersonnelFileLink() {
  const personnelFileLink = getPersonnelFileLink();
  if (personnelFileLink) {
    const personnelFileLinkInput = document.getElementById("personnel-file-link");
    personnelFileLinkInput.value = personnelFileLink;
  }
}

// Get the expiration date for a cookie in days
function getCookieExpiration(days) {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  return date.toUTCString();
}

// Call setPersonnelFileLink to set the link if it exists in cookies
setPersonnelFileLink();
