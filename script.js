/*
     Jogo: Tetris
     Autor: Code Explained (www.codeexplained.org)
     Adaptado por: Gilson Filho
     Modificado por: Italo Araújo e Davi Silveira
  */

const I = [
  [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  [
    [0, 0, 1, 0],
    [0, 0, 1, 0],
    [0, 0, 1, 0],
    [0, 0, 1, 0],
  ],
  [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
  ],
  [
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 0, 0],
  ],
];

const J = [
  [
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  [
    [0, 1, 1],
    [0, 1, 0],
    [0, 1, 0],
  ],
  [
    [0, 0, 0],
    [1, 1, 1],
    [0, 0, 1],
  ],
  [
    [0, 1, 0],
    [0, 1, 0],
    [1, 1, 0],
  ],
];

const L = [
  [
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 0],
  ],
  [
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 1],
  ],
  [
    [0, 0, 0],
    [1, 1, 1],
    [1, 0, 0],
  ],
  [
    [1, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
  ],
];

const O = [
  [
    [0, 0, 0, 0],
    [0, 1, 1, 0],
    [0, 1, 1, 0],
    [0, 0, 0, 0],
  ],
];

const S = [
  [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0],
  ],
  [
    [0, 1, 0],
    [0, 1, 1],
    [0, 0, 1],
  ],
  [
    [0, 0, 0],
    [0, 1, 1],
    [1, 1, 0],
  ],
  [
    [1, 0, 0],
    [1, 1, 0],
    [0, 1, 0],
  ],
];

const T = [
  [
    [0, 1, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  [
    [0, 1, 0],
    [0, 1, 1],
    [0, 1, 0],
  ],
  [
    [0, 0, 0],
    [1, 1, 1],
    [0, 1, 0],
  ],
  [
    [0, 1, 0],
    [1, 1, 0],
    [0, 1, 0],
  ],
];

const Z = [
  [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0],
  ],
  [
    [0, 0, 1],
    [0, 1, 1],
    [0, 1, 0],
  ],
  [
    [0, 0, 0],
    [1, 1, 0],
    [0, 1, 1],
  ],
  [
    [0, 1, 0],
    [1, 1, 0],
    [1, 0, 0],
  ],
];

const PECAS = [
    [Z, "blue"],
    [S, "white"],
    [T, "red"],
    [O, "green"],
    [L, "brown"],
    [I, "pink"],
    [J, "yellow"]
];

// const PECAS = [
//     [O, "green"]
// ];

const LINHA = 20;
const COLUNA = 10;
const TAMANHO = 30;

const VAGO = "black"; // Cor de fundo

var peca;
var tabuleiro = []; // Vetor 2D (Matriz)

var inicioDescida;
var fimDeJogo = false;

var tela = document.getElementById("tela"); // Armazena o elemento HTML "canvas" em uma variável tela
var c = tela.getContext("2d"); // Atribui à tela o tipo "2D"

var nivel = 1;
var linhasRemovidas = 0;
var pontosTotais = 0;

var pecasUtilizadas = [];
var proximasPecas = [];

var nomeJogador = "";

var jogadores = JSON.parse(localStorage.getItem("jogadoresLS")) || [];

onkeydown = controlarPeca; // Atributo HTML que recebe uma função JS

iniciarTabuleiro();

desenharTabuleiro();

for (var i = 0; i < 3; i++) gerarPecaFutura(); // Executa N vezes, sendo N o número de peças a serem mostradas com antecedência

gerarPeca();

inicioDescida = Date.now();

descerPeca();

// Para um número i de linhas, cria um vetor vazio e o armazena dentro do vetor tabuleiro, formando uma matriz.
// Dentro de cada elemento da matriz, atribui-se a constante VAGO, equivalente à string da cor de fundo.
function iniciarTabuleiro() {
  for (var i = 0; i < LINHA; i++) {
    tabuleiro[i] = [];

    for (var j = 0; j < COLUNA; j++) {
      tabuleiro[i][j] = VAGO;
    }
  }
}

// Chama a função desenharQuadrado em cada elemento da matriz, passando como argumento a string da cor de fundo.
function desenharTabuleiro() {
  for (var i = 0; i < LINHA; i++) {
    for (var j = 0; j < COLUNA; j++) {
      desenharQuadrado(j, i, tabuleiro[i][j]);
    }
  }
}

function desenharQuadrado(x, y, cor) {
  c.fillStyle = cor; // OBS: c = HTMLCanvasElement.getContext("2d")
  c.fillRect(x * TAMANHO, y * TAMANHO, TAMANHO, TAMANHO);

  c.strokeStyle = "black";
  c.strokeRect(x * TAMANHO, y * TAMANHO, TAMANHO, TAMANHO);
}

function gerarPecaFutura() {
  var r = Math.floor(Math.random() * PECAS.length); // Escolhe uma peça aleatória
  proximasPecas.push(r);
}

function gerarPeca() {
  gerarPecaFutura();
  exibirProximasPecas();
  var r = proximasPecas.shift();

  peca = {
    tetramino: PECAS[r][0], // Padrão da peça.
    cor: PECAS[r][1],
    tetraminoN: 0, // Configuração do padrão da peça.
    tetraminoAtivo: [[]],
    x: 3,
    y: -2,
  };

  peca.tetraminoAtivo = peca.tetramino[peca.tetraminoN];
  pecasUtilizadas.push(r);
}

function exibirProximasPecas() {
  var converterPecaEmTexto = (numeroPeca) => {
    switch (numeroPeca) {
      case 0:
        return "Z";
      case 1:
        return "S";
      case 2:
        return "T";
      case 3:
        return "O";
      case 4:
        return "L";
      case 5:
        return "I";
      case 6:
        return "J";
    }
  };

  document.getElementById("painel-direito").innerHTML = `PRÓXIMAS<br>PEÇAS
  <img src="assets/pieces/${converterPecaEmTexto(proximasPecas[1])}.png" alt="Peça ${converterPecaEmTexto(proximasPecas[1])}">
  <img src="assets/pieces/${converterPecaEmTexto(proximasPecas[2])}.png" alt="Peça ${converterPecaEmTexto(proximasPecas[2])}">
  <img src="assets/pieces/${converterPecaEmTexto(proximasPecas[3])}.png" alt="Peça ${converterPecaEmTexto(proximasPecas[3])}">`

  var pecaAtual = converterPecaEmTexto(proximasPecas[0]);
  var pecasSeguintes = proximasPecas.slice(1).map(converterPecaEmTexto);

  console.log(`Peça atual: ${pecaAtual}`);
  console.log(`Próximas peças: ${pecasSeguintes}`);
}

function descerPeca() {
  if (fimDeJogo) return;

  var agora = Date.now(); // milissegundos
  var delta = agora - inicioDescida;
  var tempoDescida = 1100 / Math.pow(1.1, nivel); // A cada nível, aumenta a velocidade em 10%

  if (delta > tempoDescida) {
    moverAbaixo();
    inicioDescida = Date.now();
  }

  requestAnimationFrame(descerPeca);
}

function moverAbaixo() {
  if (fimDeJogo) return;
  if (!colisao(0, 1, peca.tetraminoAtivo)) {
    // Se não colidir
    apagarPeca();
    peca.y++;
    desenharPeca();
  } else {
    // Se colidir
    travarPeca();
    tocarEfeitoSonoro(1);
    gerarPeca();
    return true;
  }
}

function moverFim() {
  var quadradosDescidos = 0;

  while (true) {
    if (moverAbaixo()) break;
    quadradosDescidos++;
  }

  return quadradosDescidos;
}

function moverDireita() {
  if (!colisao(1, 0, peca.tetraminoAtivo)) {
    apagarPeca();
    peca.x++;
    desenharPeca();
  }
}

function moverEsquerda() {
  if (!colisao(-1, 0, peca.tetraminoAtivo)) {
    apagarPeca();
    peca.x--;
    desenharPeca();
  }
}

function colisao(x, y, p) {
  for (var i = 0; i < p.length; i++) {
    for (var j = 0; j < p.length; j++) {
      if (!p[i][j]) {
        continue;
      }

      var novoX = peca.x + j + x;
      var novoY = peca.y + i + y;

      if (novoX < 0 || novoX >= COLUNA || novoY >= LINHA) {
        return true;
      }

      if (novoY < 0) {
        continue;
      }

      if (tabuleiro[novoY][novoX] != VAGO) {
        return true;
      }
    }
  }

  return false;
}

function apagarPeca() {
  preencherPeca(VAGO);
}

function desenharPeca() {
  preencherPeca(peca.cor);
}

function preencherPeca(cor) {
  for (var i = 0; i < peca.tetraminoAtivo.length; i++) {
    for (var j = 0; j < peca.tetraminoAtivo.length; j++) {
      if (peca.tetraminoAtivo[i][j]) {
        desenharQuadrado(peca.x + j, peca.y + i, cor);
      }
    }
  }
}

function travarPeca() {
  if (fimDeJogo) return;
  var linhasRemovidasDeUmaVez = 0;

  for (var i = 0; i < peca.tetraminoAtivo.length; i++) {
    for (var j = 0; j < peca.tetraminoAtivo.length; j++) {
      if (!peca.tetraminoAtivo[i][j]) {
        continue;
      }

      if (peca.y + i < 0) {
        finalizarJogo();
        throw new Error("Fim de jogo.");
      }

      tabuleiro[peca.y + i][peca.x + j] = peca.cor;
    }
  }

  for (var i = 0; i < LINHA; i++) {
    var linhaCheia = true;

    for (var j = 0; j < COLUNA; j++) {
      linhaCheia = linhaCheia && tabuleiro[i][j] != VAGO;
    }

    if (linhaCheia) {
      for (var y = i; y > 1; y--) {
        for (var j = 0; j < COLUNA; j++) {
          tabuleiro[y][j] = tabuleiro[y - 1][j];
        }
      }

      for (var j = 0; j < COLUNA; j++) {
        tabuleiro[0][j] = VAGO;
      }

      linhasRemovidasDeUmaVez++;
      progredir();
    }
  }

  desenharTabuleiro();
  contarPontos(linhasRemovidasDeUmaVez);
}

function finalizarJogo() {
  fimDeJogo = true;
  document.getElementById("musicaTema").pause();
  document.getElementById("gameOver").play();
  exibirEstatisticas();
  atualizarRanking();
}

function exibirEstatisticas() {
  contagemZ = pecasUtilizadas.filter((numeroPeca) => numeroPeca === 0).length;
  contagemS = pecasUtilizadas.filter((numeroPeca) => numeroPeca === 1).length;
  contagemT = pecasUtilizadas.filter((numeroPeca) => numeroPeca === 2).length;
  contagemO = pecasUtilizadas.filter((numeroPeca) => numeroPeca === 3).length;
  contagemL = pecasUtilizadas.filter((numeroPeca) => numeroPeca === 4).length;
  contagemI = pecasUtilizadas.filter((numeroPeca) => numeroPeca === 5).length;
  contagemJ = pecasUtilizadas.filter((numeroPeca) => numeroPeca === 6).length;

  console.log(`Peças utilizadas:
	Z: ${contagemZ} vezes
	S: ${contagemS} vezes
	T: ${contagemT} vezes
	O: ${contagemO} vezes
	L: ${contagemL} vezes
	I: ${contagemI} vezes
	J: ${contagemJ} vezes`);

  document.getElementById("game-container").innerText = `GAME OVER
	Z: ${contagemZ}
	S: ${contagemS}
	T: ${contagemT}
	O: ${contagemO}
	L: ${contagemL}
	I: ${contagemI}
	J: ${contagemJ}`;
}

function atualizarRanking() {
  var nomeEhValido = (nome) => {
    if (nome.length !== 3) return 2;

    for (var i = 0; i < nome.length; i++) {
      var c = nome.charCodeAt(i);
      if (!((c >= 65 && c <= 90) || (c >= 97 && c <= 122))) return 3;
    }

    if (jogadores.filter((jogador) => jogador.nome === nomeJogador).length > 0)
      return 4;

    return 1;
  };

  nomeJogador = prompt("Fim de jogo! Digite seu nome (3 letras):");
  while (nomeEhValido(nomeJogador) !== 1) {
    codigoErro = nomeEhValido(nomeJogador);

    switch (codigoErro) {
      case 2:
        nomeJogador = prompt(
          "Tamanho do nome diferente de 3 caracteres. Tente novamente:"
        );
        break;
      case 3:
        nomeJogador = prompt(
          "Caracteres não pertencentes ao alfabeto. Tente novamente:"
        );
        break;
      case 4:
        nomeJogador = prompt("Nome já existente. Tente novamente:");
        break;
    }
  }

  jogadores.push({
    nome: nomeJogador,
    pontuacao: pontosTotais,
    sequencia: jogadores[0] ? jogadores[jogadores.length - 1].sequencia + 1 : 0,
  });

  localStorage.setItem("jogadoresLS", JSON.stringify(jogadores));

  function ordenarJogadores(jogadores) {
    for(let i = 0; i < jogadores.length; i++){
        for(let j = 0; j < jogadores.length - i - 1; j++){
            let diferenca = jogadores[j].pontuacao - jogadores[j + 1].pontuacao;
            if(diferenca < 0 || (diferenca === 0 && jogadores[j].sequencia > jogadores[j + 1].sequencia)){
                let temp = jogadores[j];
                jogadores[j] = jogadores[j+1];
                jogadores[j+1] = temp;
            }
        }
    }
    return jogadores;
  }

  let jogadoresOrdenados = ordenarJogadores(jogadores);

  console.log("Jogadores ordenados: ");
  console.log(jogadoresOrdenados.slice(0, 5));

  adicionarTexto(`<br>RANKING`);

  for (let i = 0; i < 5; i++) {
    adicionarTexto(`${jogadoresOrdenados[i].nome} ${jogadoresOrdenados[i].pontuacao}`);
  }
}

function contarPontos(linhasRemovidas) {
  var pontos = 0;
  switch (linhasRemovidas) {
    case 1:
      pontos = 100;
      break;
    case 2:
      pontos = 300;
      break;
    case 3:
      pontos = 500;
      break;
    case 4:
      pontos = 800;
      break;
  }

  var pontosAdicionados = pontos * nivel;
  pontosTotais += pontosAdicionados;
  if (pontos) {
    document.getElementById("score").innerText = pontosTotais;
    console.log(`+${pontosAdicionados} pontos! Pontos totais: ${pontosTotais}`);
  }
}

function progredir() {
  linhasRemovidas++;
  tocarEfeitoSonoro(2);
  document.getElementById("linhas").innerText = linhasRemovidas;
  console.log({ linhasRemovidas });

  if (linhasRemovidas % 10 === 0) {
    nivel = linhasRemovidas / 10 + 1;
    document.getElementById("nivel").innerText = nivel;
    console.log(`Subindo de nível! Você está no nível ${nivel}`);
  }
}

function rodarPeca() {
  var proximoPadrao =
    peca.tetramino[(peca.tetraminoN + 1) % peca.tetramino.length];
  var recuo = 0;

  if (colisao(0, 0, proximoPadrao)) {
    if (peca.x > COLUNA / 2) {
      recuo = -1;
    } else {
      recuo = 1;
    }
  }

  if (!colisao(recuo, 0, proximoPadrao)) {
    apagarPeca();
    peca.x += recuo;
    peca.tetraminoN = (peca.tetraminoN + 1) % peca.tetramino.length; // Número da configuração do padrão da peça. Alterna entre 0, 1, 2 e 3 em todos, menos o "O", que é sempre 0.
    peca.tetraminoAtivo = peca.tetramino[peca.tetraminoN]; // Matriz da configuração ativa.
    desenharPeca();
  }
}

function rodarPecaInverso() {
  var proximoPadrao =
    peca.tetramino[
      (peca.tetraminoN + peca.tetramino.length - 1) % peca.tetramino.length
    ];
  var recuo = 0;

  if (colisao(0, 0, proximoPadrao)) {
    if (peca.x > COLUNA / 2) {
      recuo = -1;
    } else {
      recuo = 1;
    }
  }

  if (!colisao(recuo, 0, proximoPadrao)) {
    apagarPeca();
    peca.x += recuo;
    peca.tetraminoN =
      (peca.tetraminoN + peca.tetramino.length - 1) % peca.tetramino.length; // Número da configuração do padrão da peça. Alterna entre 0, 1, 2 e 3 em todos, menos o "O", que é sempre 0.
    peca.tetraminoAtivo = peca.tetramino[peca.tetraminoN]; // Matriz da configuração ativa.
    desenharPeca();
  }
}

function controlarPeca(evento) {
  var tecla = evento.keyCode;

  if (tecla == 37) {
    moverEsquerda();
    tocarEfeitoSonoro(1);
    inicioDescida = Date.now();
  } else if (tecla == 38) {
    rodarPeca();
    tocarEfeitoSonoro(1);
    inicioDescida = Date.now();
  } else if (tecla == 39) {
    moverDireita();
    tocarEfeitoSonoro(1);
    inicioDescida = Date.now();
  } else if (tecla == 40) {
    moverAbaixo();
    tocarEfeitoSonoro(1);
    pontosTotais++;
    document.getElementById("score").innerText = pontosTotais;
    console.log("+1 ponto (descida rápida)");
  } else if (tecla == 32) {
    pontuacaoAdicionada = 2 * moverFim();
    pontosTotais += pontuacaoAdicionada;
    document.getElementById("score").innerText = pontosTotais;
    console.log(`+${pontuacaoAdicionada} pontos (descida instantânea)`);
  } else if (tecla == 90) {
    rodarPecaInverso();
    tocarEfeitoSonoro(1);
    inicioDescida = Date.now();
  }
}

function adicionarTexto(texto) {
  let textoAdicionado = `<br>${texto}`;
  document.getElementById("game-container").innerHTML += textoAdicionado;
}

function tocarEfeitoSonoro(efeito) { 
  switch (efeito) {
    case 1:
      document.getElementById("efeito").play();
      break;
    case 2:
      document.getElementById("removerLinha").play(); 
      break;
  }
} 