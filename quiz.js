const QUIZ_ANSWERS = {
    'q1-answer': {
        correct: 'KEYWORD',
        points: 2, 
        type: 'text'
    },
    'q2-choice': {
        correct: 'B', 
        points: 1, 
        type: 'radio'
    },
   
    'q5-choice': {
        correct: ['X', 'Z'],
        points: 3, 
        type: 'checkbox'
    }
};

const PASS_THRESHOLD = 5; 
document.getElementById('assessment-quiz').addEventListener('submit', function(e) {
    e.preventDefault(); 
    let totalScore = 0;
    let maxScore = 0;
    let resultsHTML = '<h2>Quiz Results</h2>';

  
    document.getElementById('submit-quiz').disabled = true;

  
    for (const name in QUIZ_ANSWERS) {
        const q = QUIZ_ANSWERS[name];
        maxScore += q.points;
        let score = 0;
        let isCorrect = false;
        let userAnswer = '';
        
        const formElements = this.elements[name];
        
       
        if (q.type === 'text') {
            userAnswer = formElements.value.trim().toUpperCase();
            const correctText = q.correct.toUpperCase();
            if (userAnswer === correctText) {
                score = q.points;
                isCorrect = true;
            }
        } else if (q.type === 'radio') {
            const selected = formElements.value;
            userAnswer = selected || 'No Answer';
            if (selected === q.correct) {
                score = q.points;
                isCorrect = true;
            }
        } else if (q.type === 'checkbox') {
   
            const checkedValues = Array.from(formElements)
                .filter(el => el.checked)
                .map(el => el.value);
            
            userAnswer = checkedValues.join(', ') || 'No Answer';

          
            const allCorrectSelected = q.correct.every(val => checkedValues.includes(val));
            const noIncorrectSelected = checkedValues.every(val => q.correct.includes(val));
            
            if (allCorrectSelected && noIncorrectSelected) {
                score = q.points;
                isCorrect = true;
            }
        }
        
        totalScore += score;


        const resultClass = isCorrect ? 'correct' : 'incorrect';
        const resultText = isCorrect ? 'Correct' : 'Incorrect';
        const correctDisplay = q.type === 'text' ? q.correct : q.correct.join ? q.correct.join(', ') : q.correct;
        
        resultsHTML += `
            <div class="result-item ${resultClass}">
                <p><strong>Question ${name.substring(1, 2)}:</strong> ${resultText} (${score}/${q.points} points)</p>
                <p>Your Answer: <span>${userAnswer}</span></p>
                <p>Correct Answer: <span>${correctDisplay}</span></p>
            </div>
        `;
    }


    const overallResult = totalScore >= PASS_THRESHOLD ? 'PASS' : 'FAIL';
    const overallClass = totalScore >= PASS_THRESHOLD ? 'pass' : 'fail';
    
    resultsHTML += `
        <div class="final-score ${overallClass}">
            <h3>Overall Result: <span style="font-weight: bold;">${overallResult}</span></h3>
            <p>Total Score: <span style="font-size: 1.5em; font-weight: bold;">${totalScore} / ${maxScore}</span></p>
        </div>
    `;

    document.getElementById('quiz-results').innerHTML = resultsHTML;
});


document.getElementById('reset-quiz').addEventListener('click', function() {

    document.getElementById('quiz-results').innerHTML = '';
    document.getElementById('submit-quiz').disabled = false;
});