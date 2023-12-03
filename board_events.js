let cards = [];
let currentCard = null;
let currentCardIndex = -1;
let currentColumn = null; // Track the current column being dragged over
// let isCorrect = false;
// let isAnswered = false;
document.addEventListener('DOMContentLoaded', function () {

    const modals = {
        question: $("#questionModal").iziModal(),
        learn: $("#learnModal").iziModal()
    };

    const columns = document.querySelectorAll('.column');

    const quizArray = [
        {
            question: "What is Kanban1?",
            options: ["A project management method", "A programming language", "A type of sushi"],
            solution: "A project management method",
            isAnswered: false,
            isCorrect: false,
        },
        {
            question: "What is Kanban2?",
            options: ["A project management method", "A programming language", "A type of sushi"],
            solution: "A project management method",
            isAnswered: false,
            isCorrect: false,
        },
        {
            question: "What is Kanban3?",
            options: ["A project management method", "A programming language", "A type of sushi"],
            solution: "A project management method",
            isAnswered: false,
            isCorrect: false,
        },
        {
            question: "What is Kanban4?",
            options: ["A project management method", "A programming language", "A type of sushi"],
            solution: "A project management method",
            isAnswered: false,
            isCorrect: false,
        },
        {
            question: "What is Kanban5?",
            options: ["A project management method", "A programming language", "A type of sushi"],
            solution: "A project management method",
            isAnswered: false,
            isCorrect: false,
        },

        // Add more quiz objects as needed
    ];
    const learnArray = [
        {
            theme: "Kanban1",
            content: "Isto he sobre"
        },
        {
            theme: "Kanban4",
            content: "sobre o kanban"
        },
        {
            theme: "Kanban5",
            content: "Ckanban quit"
        },
        {
            theme: "Kanban6",
            content: "Content6"
        },
        {
            theme: "Kanban7",
            content: "Content7"
        },
        // Add more quiz objects as needed
    ];

    // Create a card element

    for (let i = 0; i < 4; i++) {
        const { cardObject, cardElement } = createCardObject(i, learnArray[i].theme, learnArray[i], quizArray[i]);
        cards[i] = cardObject;
        columns[0].appendChild(cardElement);
    }

    // Add event listeners for drag events
    columns.forEach(column => {
        column.addEventListener('dragstart', handleDragStart);
        column.addEventListener('dragenter', handleDragEnter);
        column.addEventListener('dragleave', handleDragLeave);
        column.addEventListener('dragover', handleDragOver);
        column.addEventListener('drop', handleDrop);
    });

    // Add click event listener to the card

    function createCardObject(index, name, learnObject, quizObject) {
        const cardObject = {
            index: index,
            name: name,
            learnObject: learnObject,
            quizObject: quizObject,
            time: 0, // game time (a partir do momento que é realizado o primeiro movimento TODO->LEARN)
            moves: 0, // card moves
            currentColumn: currentColumn
        }
        const cardElement = createTaskCard(cardObject.name, index);

        return { cardObject, cardElement };
    }

    function setQuizValues(quizObject, index) {
        let modalContent = generateQuizModalContent(quizObject, index);
        modals.question.iziModal('setContent', modalContent);
    }
    function setCardLearnValues(learnObject, index) {
        let modalContent = generateLearnModalContent(learnObject, index);
        modals.learn.iziModal('setContent', modalContent);
        console.log('Dados de aprendizagem Verficados: ', learnObject)
    }
    function createTaskCard(text, index) {
        let card = document.createElement('div');
        card.classList.add('task', 'card', index);
        card.setAttribute('draggable', 'true');
        card.innerHTML = `<p>${text}</p>`;
        card.addEventListener('click', handleCardClick)
        return card;
    }
    function handleDragStart(event) {
        const taskElement = event.target.closest('.task');
        if (taskElement) {
            currentCard = taskElement;
            currentCardIndex = taskElement.classList[2];
        }
    }
    function handleDragEnter(event) {
        event.preventDefault();
        const column = event.currentTarget;

        // Check if the dragged item is being dragged over the column itself
        if (currentCard == event.target.closest('.task')) {
            currentColumn = column;
            let cardIndex = currentCard.classList[2];
            cards[cardIndex].currentColumn = currentColumn;
            column.classList.add('drag-over');
        }
    }

    function handleDragLeave(event) {
        event.preventDefault();
        const column = event.currentTarget;
        let cardIndex = currentCard.classList[2];
        cards[cardIndex].currentColumn = column;
        // Check if leaving the column that was previously entered
        if (column === cards[cardIndex].currentColumn) {
            cards[cardIndex].currentColumn.classList.remove('drag-over');
            cards[cardIndex].currentColumn.classList.add('click');
        }
    }

    function handleDragOver(event) {
        event.preventDefault();
    }

    function handleDrop(event) {
        event.preventDefault();
        const column = event.currentTarget;
        column.classList.remove('drag-over');
        let cardIndex = currentCard.classList[2];
        cards[cardIndex].currentColumn = column;

        if (!currentCard) {
            console.error('No dragged element found.');
            console.log('Event target:', event.target);
            console.log('Current column:', column);
            console.log('Current card:', currentCard);
            return;
        }

        const taskElement = currentCard;
        const sourceColumn = taskElement.parentNode;
        const targetColumn = column;
        // if isChange true then happened some of those ifelse scenarios
        let isChange = false;
        // Check if the task is moved to a different column
        if (sourceColumn !== targetColumn) {
            if (sourceColumn.id === "todo") {
                if (targetColumn.id === "learn") {
                    // Remove the task from the source column
                    sourceColumn.removeChild(taskElement);
                    // Append the task to the target column
                    column.appendChild(taskElement);
                    isChange = true;
                }
            } else if (sourceColumn.id === "learn") {
                if (targetColumn.id === "quiz") {
                    // Remove the task from the source column
                    sourceColumn.removeChild(taskElement);
                    // Append the task to the target column
                    column.appendChild(taskElement);
                    isChange = true;
                }
            } else if (sourceColumn.id === "quiz") {
                if (targetColumn.id === "test" && cards[currentCardIndex].quizObject.isAnswered) {
                    showAnswer(cards[currentCardIndex].quizObject.isCorrect)
                }
                if (targetColumn.id === "test" && cards[currentCardIndex].quizObject.isAnswered
                    || targetColumn.id === "learn") {
                    // Remove the task from the source column
                    sourceColumn.removeChild(taskElement);
                    // Append the task to the target column
                    column.appendChild(taskElement);
                    isChange = true;
                }
            } else if (sourceColumn.id === "test") {
                // if fails the question can go back to learn,quiz column
                if ((targetColumn.id === "learn" ||
                    targetColumn.id === "quiz" && !cards[currentCardIndex].quizObject.isCorrect)) {//
                    // Remove the task from the source column
                    sourceColumn.removeChild(taskElement);
                    // Append the task to the target column
                    column.appendChild(taskElement);
                    isChange = true;
                } else
                    if (targetColumn.id === "done" && cards[currentCardIndex].quizObject.isCorrect) {
                        // if answers correctly the question
                        // Remove the task from the source column
                        sourceColumn.removeChild(taskElement);
                        // Append the task to the target column
                        column.appendChild(taskElement);
                        isChange = true;
                    }
            }
            if (!isChange) {
                console.log("isChange=False");
                cards[cardIndex].currentColumn = column;
                Swal.fire({
                    title: "Ação Impossível",
                    text: "Não pode passar do " + sourceColumn.id + " para " + targetColumn.id,
                    icon: "error"
                });
            }
        }
    }

    function showAnswer(isCorrect) {
        if (isCorrect) {
            Swal.fire({
                title: "Good job!",
                text: "You did great!",
                icon: "success"
            });
        } else {
            Swal.fire({
                title: "Try again!",
                text: "You did not answer correctly!",
                icon: "error"
            });
        }
    }
    function showQuestion(i, event) {
        console.log(i)
        // alert(cards[i].quizObject)
        // Open the question modal associated with the clicked card
        setQuizValues(cards[i].quizObject, i)
        modals.question.iziModal('open');
    }

    function showLearn(i, event) {
        // alert(cards[i].learnObject)
        // Open the learn modal associated with the clicked card
        setCardLearnValues(cards[i].learnObject, i)
        modals.learn.iziModal('open');
    }

    window.submitAnswer = function () {
        // Get the selected answer
        const selectedAnswer = $("input[name='answer']:checked");
        // Process the selected answer as needed
        if (selectedAnswer.val()) {
            cards[currentCardIndex].quizObject.isAnswered = true;
            if (selectedAnswer.next('span').text() === cards[currentCardIndex].quizObject.solution) {
                cards[currentCardIndex].quizObject.isCorrect = true;
            }
            // alert(cards[currentCardIndex].quizObject.solution+"\n"+selectedAnswer)
            //// Close the IziModal
            $("#questionModal").iziModal('close');
        } else {
            alert("Please select an answer.");
        }

    }
    function handleCardClick(event) {

        let cardIndex = event.currentTarget.classList[2]; // index
        currentCard = event.currentTarget;

        // Check if the card is in the "learning" column
        if (cards[cardIndex].currentColumn && cards[cardIndex].currentColumn.id === 'learn') {
            // Display information or perform an action when clicking the card in the "learning" column
            showLearn(cardIndex, event);
        }
        if (cards[cardIndex].currentColumn && cards[cardIndex].currentColumn.id === 'quiz') {
            // Display information or perform an action when clicking the card in the "learning" column
            showQuestion(cardIndex, event);
        }
    }
        
         
        function moveCardToNextColumn(cardIndex) {
        const currentCard = cards[cardIndex];
        const currentColumnIndex = Array.from(columns).indexOf(currentCard.currentColumn);

        // Verifica se não é a última coluna
        if (currentColumnIndex < columns.length - 1) {
            const nextColumn = columns[currentColumnIndex + 1];

            // Remove o cartão da coluna atual
            currentCard.currentColumn.removeChild(currentCard.cardElement);

            // Adiciona o cartão à próxima coluna
            nextColumn.appendChild(currentCard.cardElement);

            // Atualiza a referência à coluna atual no objeto do cartão
            currentCard.currentColumn = nextColumn;
        }
    }
   

    // Função para iniciar o temporizador de 10 segundos para mover o cartão
    function startCardTimer(cardIndex) {
        const cardTimer = setTimeout(() => {
            moveCardToNextColumn(cardIndex);
        }, 10000); // 10 segundos

        // Adiciona o identificador do temporizador ao objeto do cartão
        cards[cardIndex].timerId = cardTimer;
    }

    // Adiciona a lógica de temporizador durante a criação dos cartões
    for (let i = 0; i < 4; i++) {
        const { cardObject, cardElement } = createCardObject(i, learnArray[i].theme, learnArray[i], quizArray[i]);
        cards[i] = cardObject;

        // Adiciona o elemento do cartão à primeira coluna
        columns[0].appendChild(cardElement);

        // Adiciona o temporizador para mover o cartão após 10 segundos
        startCardTimer(i);
    }
         
    // ...

    // Função para reiniciar o temporizador do cartão
    function restartCardTimer(cardIndex) {
        // Limpa o temporizador existente
        clearTimeout(cards[cardIndex].timerId);

        // Inicia um novo temporizador
        startCardTimer(cardIndex);
    }

    // Event listener para reiniciar o temporizador quando o cartão é arrastado
    columns.forEach(column => {
        column.addEventListener('dragstart', (event) => {
            const taskElement = event.target.closest('.task');
            if (taskElement) {
                currentCard = taskElement;
                currentCardIndex = taskElement.classList[2];

                // Reinicia o temporizador do cartão ao iniciar o arrasto
                restartCardTimer(currentCardIndex);
            }
        });

        // Adicione outros event listeners, se necessário...
    });

        
    window.startGame = function () {
        $('.startGameBtn').css('display', 'none');
        $('.game').css('display', 'block');
    }
    function generateQuizModalContent(quizObject, index) {
        return `
        <div class="card container ${index}" style="border:none">
            <div class="card-title">
                <h2>${quizObject.question}</h2>
            </div>
            <div class="card-body">
                <div class="container">
                    <div class="row">
                        <label>
                            <input type="radio" name="answer"> 
                            <span>${quizObject.options[0]}</span>
                        </label>
                    </div>
                    <div class="row">
                        <label>
                            <input type="radio" name="answer">
                            <span>${quizObject.options[1]}</span> 
                        </label>
                    </div>
                    <div class="row">
                        <label>
                            <input type="radio" name="answer" > 
                            <span>${quizObject.options[2]}</span> 
                        </label>
                    </div>
                </div>
                <button type="button" class="btn btn-primary mt-3" onclick="submitAnswer()">Submit Answer</button>
            </div>
        </div>`;
    }
    function generateLearnModalContent(learnObject, index) {
        return `
        <div class="card container" style="border:none">
            <div class="card-title">
                <h2 id="learnTheme">${learnObject.theme}</h2>
            </div>
            <div id="learnContent" class="card-body ">
            ${learnObject.content}
            </div>
        </div>`;
    }
});

