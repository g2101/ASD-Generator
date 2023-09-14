// Get the current date in UTC format (e.g., "14/SEP/2023" for today)
function getCurrentUTCDate() {
    const currentDate = new Date();
    const options = { year: 'numeric', month: 'short', day: '2-digit' };
    return currentDate.toLocaleDateString('en-US', options).toUpperCase();
}

// Update the date input with the current UTC date
document.getElementById('logDate').value = getCurrentUTCDate();

// Function to update the date
function updateDate(value) {
    if (value) {
        // Use the selected date if available
        document.getElementById('logDate').value = value;
    } else {
        // If no date is selected, autofill with the current UTC date
        document.getElementById('logDate').value = getCurrentUTCDate();
    }
}

// Function to generate BBCode
function generateBBCode() {
    const date = document.getElementById('logDate').value;
    const checkboxes = document.querySelectorAll('.bbcode-checkbox');
    let bbcode = `[divbox2=white][center][b]FLIGHT LOG ENTRY[/b][/center]\n[hr][/hr]\n[list=none]\n[*][b]Date[/b]: ${date}\n\n[list=none]\n`;
    
    checkboxes.forEach((checkbox) => {
        if (checkbox.checked) {
            const label = checkbox.nextElementSibling.textContent.trim();
            bbcode += `[cb] [b]${label}[/b]\n`;
        }
        else {
            bbcode += `[cbc] [b]${label}[/b][/cb]\n`;
        }
    });

    bbcode += `[/list][/list][/divbox2]`;

    const bbcodeOutput = document.getElementById('bbcode-output');
    bbcodeOutput.value = bbcode;
}
