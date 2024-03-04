// Definindo a cena principal do jogo usando a biblioteca Phaser
class Deserto extends Phaser.Scene {

    // Construtor da cena
    constructor() {
        super({
            key: 'Deserto',
            // Configurações específicas da cena podem ser adicionadas aqui
            physics: {
                arcade: {
                    debug: false, // Ativa ou desativa a visualização de debug da física
                    gravity: { y: 500 } // Define a gravidade vertical
                } 
            } 
        });
    }

    // Pré-carregamento de recursos
    preload() {
        // Carrega as imagens necessárias para o jogo
        this.load.image('cena', '../assets/bg-teladeserto.png'); // Imagem de fundo do deserto
        this.load.image('play', '../assets/bt-entrar.png'); // Imagem do botão de play
    }

    // Criação dos elementos na cena
    create() {
        // Adiciona o background do jogo
        this.add.image(larguraJogo/2, alturaJogo/2, 'cena');

        // Adiciona o botão de play
        const botao = this.add.image(360, 370, 'play').setScale(0.4); // Adiciona o botão de play na posição especificada e estabelece a escala
        botao.setInteractive(); // Torna o botão interativo
        botao.on('pointerdown', () => { // Adiciona um evento de clique ao botão
            this.scene.stop(); // Pausa a cena atual
            this.scene.start('Piramide'); // Inicia a cena 'Piramide'
        });
    };
}

