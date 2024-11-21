const startButton = document.getElementById('start-button');
const dentalStage = document.getElementById('dental-stage');
const completionStage = document.getElementById('completion-stage');
const tools = document.querySelectorAll('.tool');
const instructionMessage = document.getElementById('instruction-message');
const restartGame = document.getElementById('restart-game');

// Variáveis de controle
let currentToolIndex = 0;
let totalScore = 0;

// Iniciar o jogo
startButton.addEventListener('click', () => {
    startButton.parentElement.classList.add('hidden');
    dentalStage.classList.remove('hidden');
    instructionMessage.textContent = "Escove os dentes!";
    totalScore = 0;
    currentToolIndex = 0;
    tools.forEach(tool => tool.style.transform = 'translateX(0)');
});

// Função para mover a ferramenta para a boca
function moveToMouth(tool, nextToolIndex) {
    // Mover a ferramenta até a posição da boca
    const boca = document.getElementById('boca_dentes_sujos');
    tool.style.transition = 'transform 0.5s ease-out';
    tool.style.transform = `translate(${boca.offsetLeft - tool.offsetLeft}px, 0)`;

    // Após a animação, atualiza a pontuação e vai para o próximo passo
    setTimeout(() => {
        totalScore += getPointsForTool(currentToolIndex); // Atualiza a pontuação
        currentToolIndex++;

        if (currentToolIndex < tools.length) {
            instructionMessage.textContent = getInstructionForNextStep();
            moveToNextTool(); // Chama a função que inicia a ação para a próxima ferramenta
        } else {
            checkDentalComplete();
        }
    }, 500); // Atraso para esperar a animação de movimento
}

// Função para obter pontos com base na ferramenta
function getPointsForTool(index) {
    if (index === 0) return 10; // Escova
    if (index === 1) return 15; // Fio Dental
    if (index === 2) return 20; // Enxaguante
    return 0;
}

// Instruções para cada ação
function getInstructionForNextStep() {
    if (currentToolIndex === 1) {
        return "Agora vamos usar o fio dental!";
    } else if (currentToolIndex === 2) {
        return "E para finalizar, vamos usar o enxaguante bucal!";
    }
    return "Escove os dentes!";
}

// Verifica se o tratamento está completo
function checkDentalComplete() {
    dentalStage.classList.add('hidden');
    completionStage.classList.remove('hidden');
    document.getElementById('final-score').textContent = `Sua pontuação total é: ${totalScore}`;
}

// Evento de arrasto e soltura
tools.forEach(tool => {
    tool.addEventListener('dragstart', () => {
        tool.classList.add('moving');
    });

    tool.addEventListener('dragend', () => {
        tool.classList.remove('moving');
        moveToMouth(tool, currentToolIndex); // Executa a animação de movimento
    });
});

// Função para reiniciar o jogo
restartGame.addEventListener('click', () => {
    location.reload();
});
