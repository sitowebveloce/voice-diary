// Select elements
const textArea = document.querySelector('textarea');
const diary = document.querySelector('.diary');
const mic = document.querySelector('.mic');
const msgsInfo = document.querySelector('.messages-info');
const form = document.querySelector('form');
const itLang = document.querySelector('.flag-it');
const usLang = document.querySelector('.flag-us');
let speechText = '';
let it = 'it-IT';
let en = 'en-US';
let notes = [];
const actual = document.querySelector('.actual-lang');


//
// ─── VOICE RECOGNITION ──────────────────────────────────────────────────────────
const recognition = new window.webkitSpeechRecognition || window.webkitSpeechRecognition;
recognition.continuous = false;
recognition.lang = it;
recognition.interimResults = false;
recognition.maxAlternatives = 1;
// Show actual language
actual.innerHTML = recognition.lang;


//
// ─── ON RESULT EVENT ────────────────────────────────────────────────────────────
recognition.onresult = e => {
    if (typeof(e.results) === 'undefined') {
        recognition.onend = null;
        recognition.stop();
        return;
    } else {
        // console.log(e);
        // Speech text
        speechText = e.results[0][0].transcript;
        // Speech text confidence Value
        let confidenceVal = e.results[0][0].confidence;
        // console.log(speechText)
        // Append
        if (speechText === 'spazio' || speechText === 'space') {
            speechText = ' '
        }
        if (speechText === 'a capo' || speechText === 'wrap text') {
            speechText = '\n'
        }

        // textArea.value += speechText.replace(/([^\n]{1,103})/g, '$1\n'); + ' ';
        textArea.value += speechText + ' ';

    }
}

// Stop recognition on no match
recognition.onnomatch = e => {
        recognition.stop()
        messageInfo('Stop Recognition')
    }
    // Recognize button
mic.onclick = () => {
        // Start recognition
        recognition.start();
    }
    // ON SOUND START EVENT
recognition.onstart = () => {
        // Start recognition message
        messageInfo('Start Recognition')
    }
    // ON SOUND END EVENT
recognition.onsoundend = e => {
    // Stop recognition
    recognition.stop();
    // Start recognition message
    messageInfo('Stop Recognition')
};
// Message info function
const messageInfo = (stringText) => {
        msgsInfo.innerHTML = `<span>${stringText}</span>`
        setTimeout(() => {
            msgsInfo.innerHTML = `<span></span>`
        }, 5000)
    }
    //
    // ─── ON SUBMIT APPEND TO DIARY ──────────────────────────────────────────────────

// TODAY
const addZero = (num) => {
    // Add zero if < 10
    return (parseInt(num, 10) < 10 ? '0' : null) + num;
};
// Set Date
const setDate = () => {
    let date = new Date();
    let yy = date.getFullYear();
    let mm = date.getMonth() + 1;
    let dd = date.getDate();
    let hh = date.getHours();
    let min = date.getMinutes();
    let sec = date.getSeconds();
    let newDate = addZero(dd) + '/' + addZero(mm) + '/' + yy + ' ' + addZero(hh) + ':' + addZero(min) + ':' + addZero(sec);
    return newDate;
}

form.onsubmit = e => {
        // Prevent default reload
        e.preventDefault();
        // Append
        // Create a div element
        let diaryPage = document.createElement('div');
        // Assign a class name
        diaryPage.className = 'diary-page';
        // Textarea value Capitalize first chart
        let stringVal = '📝' + textArea.value.charAt(0).toUpperCase() +
            textArea.value.slice(1);
        // console.log(stringVal)
        // Create string object to append and push
        let note = { note: `<div>${stringVal}</div> <button class='btn-delete' onclick='deleteFunction(${Date.now()})'><img src='./imgs/delete.svg'></button> <small>⌚ ${setDate()}</small>`, id: Date.now() };
        // Attach text to the DOM
        diaryPage.innerHTML = note.note;
        // Prepend diary div
        diary.prepend(diaryPage);
        // Push new note
        notes.push(note);
        // Save in the local storage
        // First Retrive
        let retriveStored = JSON.parse(localStorage.getItem('diary'));

        if (retriveStored !== null) {
            console.log(retriveStored)
                // Push retrive
            retriveStored.push(note);
            // Save
            localStorage.setItem('diary', JSON.stringify(retriveStored));

        } else {
            localStorage.setItem('diary', JSON.stringify(notes));
        }
        // Get storage items
        let storedNotes = JSON.parse(localStorage.getItem('diary'));
        // console.log(storedNotes)
        // Reset form
        form.reset();
    }
    // Language onclick event change language
itLang.onclick = () => {
    messageInfo(`<span>Language set to ${it}</span>`);
    recognition.lang = it;
    actual.innerHTML = it;
    // console.log(recognition.lang)
};

usLang.onclick = () => {
    messageInfo(`<span>Language set to ${en}</span>`);
    recognition.lang = en;
    actual.innerHTML = en;
    // console.log(recognition.lang)
}

// ON START PREPEND LOCAL STORAGE VALUES
// First Retrive
const loadData = () => {
        console.log('Loadig...')
        let retriveStored = JSON.parse(localStorage.getItem('diary'));

        if (retriveStored !== null) {
            console.log(retriveStored)
                // LOOP THROUGH AND APPEND TO THE DOM
            retriveStored.forEach(note => {
                // console.log(note)
                // Create a div element
                let diaryPage = document.createElement('div');
                // Assign a class name
                diaryPage.className = 'diary-page';
                // Attach text to the DOM
                diaryPage.innerHTML = note.note;
                // Prepend diary div
                diary.prepend(diaryPage);
            });
        }

    }
    // Load data updated 
loadData()
    // DELETE

const deleteFunction = (id) => {
    // console.log(id)
    // Find data
    let retriveStored = JSON.parse(localStorage.getItem('diary'));
    // Filter all except this id
    let newData = retriveStored.filter(i => i.id !== id);
    // Save new data in the local storage
    localStorage.setItem('diary', JSON.stringify(newData));
    // Reload the page to see changes
    window.location.reload();
}