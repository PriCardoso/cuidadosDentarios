const startButton = document.getElementById('start-button');
const dentalStage = document.getElementById('dental-stage');
const completionStage = document.getElementById('completion-stage');
const tools = document.querySelectorAll('.tool');
const instructionMessage = document.getElementById('instruction-message');
const restartGame = document.getElementById('restart-game');

// Modal de erro
const errorModal = document.getElementById('error-modal');
const modalErrorMessage = document.getElementById('modal-error-message');
const closeModalButton = document.getElementById('close-modal');

// Variáveis de controle
let currentToolIndex = 0;
let totalScore = 0;

// Adicionando o elemento para exibir a pontuação na tela
const scoreDisplay = document.getElementById('final-score'); // Certifique-se de ter esse elemento no HTML

// Função para atualizar a pontuação
function updateScore() {
    console.log('Atualizando pontuação:', totalScore);  // Verifica o valor de totalScore
    const scoreDisplay = document.getElementById('final-score');
    if (scoreDisplay) {
        scoreDisplay.textContent = `Sua pontuação total é: ${totalScore}`;
    } else {
        console.error('Elemento de pontuação não encontrado!');
    }
}



// Iniciar o jogo
startButton.addEventListener('click', () => {
    document.getElementById('start-screen').classList.add('hidden');
    dentalStage.classList.remove('hidden');
    completionStage.classList.add('hidden');

    // Reiniciar variáveis
    instructionMessage.textContent = "Escove os dentes!";
    totalScore = 0;  // Reinicia a pontuação
    currentToolIndex = 0;
    usedToolY = 20;

    // Posicionar ferramentas em uma coluna no lado esquerdo
    let toolY = 20; // Posição inicial para ferramentas (lado esquerdo)
    tools.forEach(tool => {
        tool.style.top = `${toolY}px`;
        tool.style.left = `20px`; // Sempre no lado esquerdo
        tool.style.transform = 'translate(0, 0)';
        tool.style.pointerEvents = 'auto'; // Reativar interatividade
        toolY += tool.offsetHeight + 10; // Espaçamento entre as ferramentas
        tool.addEventListener('click', () => moveToMouth(tool));
    });
});

// Exibe o modal de erro
function showErrorModal(message) {
    modalErrorMessage.textContent = message; // Define a mensagem de erro
    errorModal.classList.remove('hidden'); // Exibe o modal
}

// Fecha o modal ao clicar no botão "OK"
closeModalButton.addEventListener('click', () => {
    errorModal.classList.add('hidden'); // Esconde o modal
});

// Função para verificar se a ferramenta usada é a correta
function checkCorrectTool(tool) {
    const correctToolIndex = currentToolIndex; // A ferramenta esperada deve ser a que corresponde ao índice atual
    if (tool !== tools[correctToolIndex]) {
        return false; // Se a ferramenta não for a correta, retorna false
    }
    return true; // Caso contrário, retorna true
}

// Função para mover a ferramenta até a boca com GSAP
function moveToMouth(tool) {
    if (!checkCorrectTool(tool)) {
        showErrorModal("Use a ferramenta correta!");
        return;
    }

    const boca = document.getElementById('dentes_sujos');
    const bocaRect = boca.getBoundingClientRect();
    const toolRect = tool.getBoundingClientRect();

    const finalX = bocaRect.left + (bocaRect.width / 2) - (toolRect.width / 2);
    const finalY = bocaRect.top + (bocaRect.height / 2) - (toolRect.height / 2);

    gsap.to(tool, {
        duration: 1,
        x: finalX - toolRect.left,
        y: finalY - toolRect.top,
        ease: "power1.out",
        onComplete: () => {
            totalScore += getPointsForTool();
            console.log("Pontuação atual:", totalScore); // Log para verificar o totalScore
            updateScore();
            currentToolIndex++;
            if (currentToolIndex < tools.length) {
                instructionMessage.textContent = getInstructionForNextStep();
            } else {
                checkDentalComplete(); // Verifica se o jogo está completo
            }
        }
    });

    tool.style.pointerEvents = 'none';
}

function addPoints(points) {
    totalScore += points;
    console.log("Pontuação adicionada: ", points, "Total agora é: ", totalScore);  // Log da pontuação
}

// Mover a ferramenta usada para a lateral direita da imagem da boca
let usedToolY = null; // Variável global para controlar a posição vertical cumulativa das ferramentas

function moveToolToSide(tool) {
    const boca = document.getElementById('dentes_sujos');
    const bocaRect = boca.getBoundingClientRect();

    // Calcula a posição inicial da barra lateral direita
    const rightSideX = bocaRect.right + 50; // Adiciona um espaçamento maior (50px) ao lado direito da boca

    // Define a posição inicial de Y para a primeira ferramenta
    if (usedToolY === null) {
        usedToolY = bocaRect.bottom + 20; // Começa 20px abaixo da parte inferior da boca
    }

    gsap.to(tool, {
        duration: 1,
        x: rightSideX - tool.getBoundingClientRect().left, // Move para a lateral direita em relação à posição inicial
        y: usedToolY - tool.getBoundingClientRect().top,   // Usa a posição Y acumulativa
        ease: "power1.out",
        onComplete: () => {
            usedToolY += tool.offsetHeight + 20; // Incrementa a posição Y para a próxima ferramenta
        }
    });

    tool.style.pointerEvents = 'none'; // Desativa o clique na ferramenta após o uso
}

// Função para pegar os pontos da ferramenta (Agora com a pontuação correta)
function getPointsForTool() {
    const points = [10, 15, 20]; // Pontuação específica para cada ferramenta
    return points[currentToolIndex]; // Retorna os pontos de acordo com a ferramenta
}

// Função para exibir as instruções para a próxima etapa
function getInstructionForNextStep() {
    const steps = [
        "Agora vamos usar o fio dental!",
        "E para finalizar, vamos usar o enxaguante bucal!"
    ];
    return steps[currentToolIndex - 1] || "Escove os dentes!";
}

// Exibir fogos de artifício ao completar o jogo
function showFireworks() {
    const container = document.getElementById('fireworks-container');

    for (let i = 0; i < 30; i++) {
        const firework = document.createElement('div');
        firework.classList.add('firework');
        container.appendChild(firework);

        gsap.to(firework, {
            duration: 1.5 + Math.random(),
            x: Math.random() * window.innerWidth - window.innerWidth / 2,
            y: Math.random() * window.innerHeight - window.innerHeight / 2,
            scale: Math.random() * 2,
            opacity: 0,
            ease: "power1.out",
            onComplete: () => firework.remove()
        });
    }
}

// Verificar conclusão do jogo
function checkDentalComplete() {
    if (currentToolIndex === tools.length) {
        console.log("Função de conclusão chamada");

        setTimeout(() => {
            // Tira a tela de jogo
            dentalStage.classList.add('hidden');
            completionStage.classList.remove('hidden');
            
            // Atraso antes de atualizar a pontuação
            setTimeout(() => {
                const finalScoreElement = document.getElementById('final-score');
                if (finalScoreElement) {
                    finalScoreElement.style.display = "block";  // Torna visível
                    finalScoreElement.textContent = `Sua pontuação total é: ${totalScore}`;
                    console.log("Pontuação atualizada na tela.");
                } else {
                    console.error('Elemento de pontuação não encontrado!');
                }
                showFireworks(); // Exibe os fogos de artifício
            }, 100);  // Pequeno atraso após exibir a tela
        }, 2000);  // Atraso antes de mostrar a tela de conclusão
    }
}

// Reiniciar o jogo
restartGame.addEventListener('click', () => {
    location.reload();
});
