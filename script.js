// Function to generate BBCode
function generateBBCode() {
    const dateInput = document.getElementById('logDate').value;
    
    // Format the date as "DD/MMM/YYYY" (e.g., "09/SEP/2023")
    const dateParts = dateInput.split('-'); // Assuming the input format is "YYYY-MM-DD"
    const day = dateParts[2];
    const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    const month = monthNames[parseInt(dateParts[1]) - 1];
    const year = dateParts[0];
    const formattedDate = `${day}/${month}/${year}`;
    
    const checkboxes = document.querySelectorAll('.bbcode-checkbox');
    let bbcode = `[divbox2=white][center][b]FLIGHT LOG ENTRY[/b][/center]\n[hr][/hr]\n[list=none]\n[*][b]Date[/b]: ${formattedDate}\n\n[list=none]\n`;
    
    checkboxes.forEach((checkbox) => {
        if (checkbox.checked) {
            const label = checkbox.nextElementSibling.textContent.trim();
            bbcode += `[cb] [b]${label}[/b]\n`;
        }
    });

    bbcode += `[/list][/list][/divbox2]`;

    const bbcodeOutput = document.getElementById('bbcode-output');
    bbcodeOutput.value = bbcode;
}
