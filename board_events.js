document.addEventListener('DOMContentLoaded', function () {
    
    $("#questionModal").iziModal();

    const columns = document.querySelectorAll('.column');
    let currentColumn = null; // Track the current column being dragged over
    let isCorrect=false;
    let isAnswered=false;

    function createDelayedCard() { // criei esta funcao
    // Create a card element
        const cardObject = createCardObject();
        const cardElement = createCardElement(cardObject.title);
        setCardValues(cardObject)
        // Add the card to the first column
        columns[0].appendChild(cardElement);

         // Add event listeners for drag events
        columns.forEach(column => {
            column.addEventListener('dragenter', handleDragEnter);
            column.addEventListener('dragleave', handleDragLeave);
            column.addEventListener('dragover', handleDragOver);
            column.addEventListener('drop', handleDrop);
        });
        // para o cart\ao ir em outra coluna
        columnsIndex++;

        // Reset the column index if it exceeds the number of columns
        if (columnIndex >= columns.length) {
          columnIndex = 0;
        }

        // chamo a funcao depois de 10 seconds
        setTimeout(createDelayedCard, 10000);
    }

    // Add click event listener to the card== crateQuiz objecto - learObject, 
    cardElement.addEventListener('click', handleCardClick);
    function createCardObject(){
        const cardObject = {
            title:"Lorem Ipsum",
            question:"What does Lorem Ipsum mean?",
            options:["Opt1","Opt2","Opt3"],
        }
        cardObject["solution"] = cardObject.options[0];
        return cardObject;
    }
    function setCardValues(cardObject){
        $('#title').text(cardObject.title)
        $('#question').text(cardObject.question)
        // option input values
        $("#option1").val(cardObject.options[0]);
        $("#option2").val(cardObject.options[1]);
        $("#option3").val(cardObject.options[2]);
        // option label value
        $("#option1Label").text(cardObject.options[0]);
        $("#option2Label").text(cardObject.options[1]);
        $("#option3Label").text(cardObject.options[2]);
    }
    function createCardElement(text) {
        const card = document.createElement('div');
        card.className = 'task card';
        card.setAttribute('draggable', 'true');
        card.innerHTML = `<p>${text}</p>`;
        return card;
    }

    function handleDragEnter(event) {
        event.preventDefault();
        const column = event.currentTarget;
        // Check if the dragged item is being dragged over the column itself
        if (event.target.closest('.task')) {
            currentColumn = column;
            column.classList.add('drag-over');
        }
    }

    function handleDragLeave(event) {
        const column = event.currentTarget;

        // Check if leaving the column that was previously entered
        if (column === currentColumn) {
            column.classList.remove('drag-over');
        }
    }

    function handleDragOver(event) {
        event.preventDefault();
    }

    function handleDrop(event) {
        event.preventDefault();
        const column = event.currentTarget;
        column.classList.remove('drag-over');

        const taskElement = document.querySelector('.task');
        const sourceColumn = taskElement.parentNode;
        const targetColumn = column;
        currentColumn = column;
        // if isChange true then happened some of those ifelse scenarios
        let isChange = false;
        // Check if the task is moved to a different column
        if (sourceColumn !== targetColumn) {
            if(sourceColumn.id === "todo"){
                if(targetColumn.id === "learn"){
                    // Remove the task from the source column
                    sourceColumn.removeChild(taskElement);
                    // Append the task to the target column
                    column.appendChild(taskElement);
                    isChange = true;
                   }
            }else if(sourceColumn.id === "learn"){
                if(targetColumn.id === "quiz"){
                    // Remove the task from the source column
                    sourceColumn.removeChild(taskElement);
                    // Append the task to the target column
                    column.appendChild(taskElement);
                    isChange = true;
                }
            }else if(sourceColumn.id === "quiz"){
                if(targetColumn.id === "test" && isAnswered){
                    showAnswer()
                }
                if(targetColumn.id === "learn" || (targetColumn.id === "test" && isAnswered)){
                     // Remove the task from the source column
                     sourceColumn.removeChild(taskElement);
                     // Append the task to the target column
                     column.appendChild(taskElement);
                     isChange = true;
                }   
            }else if(sourceColumn.id === "test"){
                // if fails the question can go back to learn,quiz column
                if((targetColumn.id=== "learn" ||
                 targetColumn.id=== "quiz") && 
                 !isCorrect){
                     // Remove the task from the source column
                     sourceColumn.removeChild(taskElement);
                     // Append the task to the target column
                     column.appendChild(taskElement);
                     isChange = true;
                }else if(targetColumn.id === "done" && isCorrect){
                    // if answers correctly the question
                    // Remove the task from the source column
                    sourceColumn.removeChild(taskElement);
                    // Append the task to the target column
                    column.appendChild(taskElement);
                    isChange = true;
                }   
            }
            if(!isChange){
                console.log("isChange=False");
                currentColumn = sourceColumn;
                Swal.fire({
                    title: "Ação Impossível",
                    text: "Não pode passar do " + sourceColumn.id + " para " + targetColumn.id,
                    icon: "error"
                });
            }            
        }
    }

    function showAnswer(){
        if(isCorrect){
            Swal.fire({
                title: "Good job!",
                text: "You did great!",
                icon: "success"
              });
        }else{
            Swal.fire({
                title: "Try again!",
                text: "You did not answer correctly!",
                icon: "error"
              });
        }
    }
    function showQuestion() {
        // Open the IziModal
        $("#questionModal").iziModal('open');
    }

    window.submitAnswer = function () {
        // Close the IziModal
        $("#questionModal").iziModal('close');

        // Get the selected answer
        const selectedAnswer = $("input[name='answer']:checked").val();

        // Process the selected answer as needed
        if (selectedAnswer) {
            isAnswered=true;
            if(selectedAnswer === cardObject.solution){
                isCorrect = true;
            }
        } else {
            alert("Please select an answer.");
        }
    }
    function handleCardClick(event) {
        event.preventDefault();
        // Check if the card is in the "learning" column
        if (currentColumn && currentColumn.id === 'learn') {
            // Display information or perform an action when clicking the card in the "learning" column
           
        }
        if (currentColumn && currentColumn.id === 'quiz') {
            // Display information or perform an action when clicking the card in the "learning" column
            showQuestion()
        }
    }
    window.startGame = function () {
        $('.startGameBtn').css('display','none');
        $('.game').css('display','block');
    }
});

