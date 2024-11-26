import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js'
import { getFirestore, doc, setDoc, getDoc, collection, getDocs } from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js';
var score = 0;
var tries = 0;

const firebaseConfig = {
    apiKey: "AIzaSyD6su1cHYsxq2GXzwtJTFeTaR98gZtluK4",
    authDomain: "math-quiz-9f398.firebaseapp.com",
    projectId: "math-quiz-9f398",
    storageBucket: "math-quiz-9f398.firebasestorage.app",
    messagingSenderId: "630588276904",
    appId: "1:630588276904:web:f59d3ace021a85122d829d",
    measurementId: "G-DT1EDQRP12"
};
const collisionSound = new Audio("cash.mp3")
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
async function loadData(username) {
    try {
        const userDocRef = doc(db, 'users', username);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
            const userData = userDoc.data();
            score = userData.score;
            tries = userData.tries;
            document.getElementById("score").innerHTML = "Score: " + score + "/" + tries;

        } else {
            console.log('No such document!');
        }
    } catch (error) {
        console.error('Error loading data:', error);
    }
}
async function saveData(username, score, tries) {
    try {
        const userDocRef = doc(db, 'users', username);
        await setDoc(userDocRef, { score: score, tries: tries });
        console.log('Data saved successfully!');
    } catch (error) {
        console.error('Error saving data:', error);
    }
}
document.getElementById("score").style.display = "none";
document.getElementById("bowl").style.display = "none";
document.getElementById("money").style.display = "none";
document.getElementById("start").addEventListener("click", function () {
    if (!document.getElementById("interval").value || document.getElementById("interval").value<400){
        alert("Please enter an interval. Min. 400");

    }else{
        alert("Please wait while we load your data");
        loadData(document.getElementById("username").value).then(function () {
            document.getElementById("score").style.display = "block";
            document.getElementById("pause").style.display = "block";

            document.getElementById("bowl").style.display = "block";
            document.getElementById("start").style.display = "none";
            document.getElementById("username").style.display = "none";
            document.getElementById("title").style.display = "none";
            document.getElementById("instructions").style.display = "none";
            document.getElementById("interval").style.display = "none";
            document.getElementById("leader").style.display = "none";

            setInterval(createMoneyClone, document.getElementById("interval").value);
        });


    }

});
function updateScore() {
    document.getElementById("score").innerText = score+"/"+tries;
}
setInterval(updateScore, 1);
function createMoneyClone(){
    tries++;
    const money = document.getElementById("money");
    const moneyClone = money.cloneNode(true);
    moneyClone.style.left = Math.random() * window.innerWidth + "px";
    moneyClone.style.display = "block";
    function checkCollision() {
        const bowl = document.getElementById("bowl");
        const money = moneyClone;
        const bowlRect = bowl.getBoundingClientRect();
        const moneyRect = money.getBoundingClientRect();
        if (
            bowlRect.left <= moneyRect.right &&
            bowlRect.right >= moneyRect.left &&
            bowlRect.top <= moneyRect.bottom &&
            bowlRect.bottom >= moneyRect.top
        ) {
            score++;
            const collisionSound = new Audio("cash.mp3")

            collisionSound.play();

            saveData(document.getElementById("username").value, score, tries);
            loadData(document.getElementById("username").value);
            document.getElementById("score").innerText = score+"/"+tries;
            clearInterval(collisionInterval);
            money.remove();
        }
    }
    const collisionInterval = setInterval(checkCollision, 1);
    document.body.appendChild(moneyClone);

}
document.onkeydown = function (e) {
    if (e.key === "ArrowRight") {
        const bowl = document.getElementById("bowl");
        // Get the current left position of the bowl
        const currentLeft = parseInt(window.getComputedStyle(bowl).left, 10) || 0;
        // Move the bowl 10px to the right
        bowl.style.left = (currentLeft + 50) + "px";
    }

    if (e.key === "ArrowLeft") {
        const bowl = document.getElementById("bowl");
        const currentLeft = parseInt(window.getComputedStyle(bowl).left, 10) || 0;
        // Move the bowl 10px to the left
        bowl.style.left = (currentLeft - 50) + "px";
    }
};