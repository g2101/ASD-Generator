function generateBBCode() {
    // Retrieve the date and format it as DD/MMM/YYYY
    const logDate = document.getElementById('logDate').value;
    const formattedDate = formatLogDate(logDate);

    // Generate BBCode for the checkboxes
    const checkboxes = document.querySelectorAll('.bbcode-checkbox');
    let bbcode = `[divbox2=white][center][b]FLIGHT LOG ENTRY[/b][/center]\n[hr][/hr]\n[list=none][*][b]Date[/b]: ${formattedDate}\n[list=none]`;

    checkboxes.forEach((checkbox) => {
        const id = checkbox.id;
        const label = document.querySelector(`label[for='${id}']`);
        const text = label.textContent.trim();
        const isChecked = checkbox.checked;

        if (isChecked) {
            bbcode += `[cb] [b]${text}[/b]: ${checkbox.getAttribute('data-points')} points\n`;
        } else {
            bbcode += `[cb] [b]${text}[/b]: ${checkbox.getAttribute('data-points')} points\n`;
        }
    });

    bbcode += `[/list][/divbox2]`;

    // Update the BBCode output textarea
    const bbcodeOutput = document.getElementById('bbcode-output');
    bbcodeOutput.value = bbcode;
}

function formatLogDate(logDate) {
    // Convert the input date to a JavaScript Date object
    const dateObj = new Date(logDate);

    // Format the date as DD/MMM/YYYY (e.g., 14/SEP/2023)
    const day = dateObj.getDate().toString().padStart(2, '0');
    const month = dateObj.toLocaleString('default', { month: 'short' }).toUpperCase();
    const year = dateObj.getFullYear();
    return `${day}/${month}/${year}`;
}

function copyToClipboard() {
    const bbcodeOutput = document.getElementById('bbcode-output');
    bbcodeOutput.select();
    document.execCommand('copy');
    alert('BBCode copied to clipboard');
}
