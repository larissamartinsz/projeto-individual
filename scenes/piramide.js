// Declarando variáveis globais
var player; // Variável para armazenar o jogador
var teclado; // Variável para armazenar as teclas pressionadas
var chao; // Variável para armazenar o chão
var plataformas; // Variável para armazenar as plataformas
var rato; // Variável para armazenar o rato
var placar; // Variável para armazenar o texto do placar
var pontuacao = 0; // Variável para armazenar a pontuação
var moeda; // Variável para armazenar a moeda

// Definindo a cena principal do jogo usando a biblioteca Phaser
class Piramide extends Phaser.Scene {

    // Construtor da cena
    constructor() {
        super({
            key: 'Piramide',
            // Configurações específicas da cena podem ser adicionadas aqui
            physics: { // Adicionando física ao jogo
                default: 'arcade',
                arcade: {
                    gravity: { y: 450 }, // Define a gravidade vertical
                    debug: true // Ativa a visualização de debug da física
                } 
            }
        });
    }

    // Pré-carregamento de recursos
    preload() {
        // Carrega as imagens necessárias para o jogo
        this.load.image('personagem', '../assets/personagem.png'); // Imagem do personagem
        this.load.image('piramide', '../assets/bg-telapiramide.png'); // Imagem do background
        this.load.image('chao', '../assets/chao.png'); // Imagem do chão
        this.load.image('plataforma', '../assets/plataformas.png'); // Imagem das plataformas
        this.load.image('moeda', '../assets/moeda.png'); // Imagem da moeda
        this.load.spritesheet('rato', 'assets/rato.png', { frameWidth: 685, frameHeight: 182 }); // Spritesheet do rato
    }

    // Criação dos elementos na cena
    create() {
        // Adiciona o background do jogo
        this.add.image(larguraJogo/2, alturaJogo/2, 'piramide');
    
        // Adiciona o chão
        chao = this.physics.add.staticImage(larguraJogo/2, 600, 'chao');

        // Adiciona o personagem
        player = this.physics.add.sprite(40, 350, 'personagem').setScale(1);
        player.setCollideWorldBounds(true); // Define que o jogador não pode sair dos limites do mundo

        // Adiciona colisão entre o personagem e o chão
        this.physics.add.collider(player, chao);

        // Cria um grupo de plataformas estáticas
        plataformas = this.physics.add.staticGroup();
        this.physics.add.collider(player, plataformas); // Adicionando colisão entre o personagem e a plataforma

        // Adiciona texto para exibir o placar
        placar = this.add.text(600, 550, 'Moedas: ' + pontuacao, { fontSize: '20px', fill: '#ffffff' });

        // Define as coordenadas para as diversas plataformas
        const coordenadasPlataformas = [
            { x: 350, y: 110 },
            { x: 460, y: 210 }, 
            { x: 200, y: 220 },
            { x: 630, y: 317 },
            { x: 400 ,y: 350 },
            { x: 50, y: 350 },
            { x: 200, y: 420 }, 
            
        ];
    
        // Adiciona cada plataforma usando as coordenadas anteriormente definidas
        coordenadasPlataformas.forEach(coordenada => {
            const plataforma = plataformas.create(coordenada.x, coordenada.y, 'plataforma');
        });

        // Adiciona o rato na posição especificada e estabelece a escala
        rato = this.add.sprite(600, 480, 'rato').setScale(0.25);
        rato.ida = false; // Define que o rato inicialmente não está se movendo na direção ida

        // Cria a animação de andar do rato
        this.anims.create({
            key: 'andar-rato',
            frames: this.anims.generateFrameNumbers('rato', { start: 0, end: 1 }),
            frameRate: 5,
            repeat: -1
        });

        // Inicia a animação de andar do rato
        rato.anims.play('andar-rato', true);

        // Adiciona colisão entre o jogador e o rato
        this.physics.add.collider(player, rato);

        // Adiciona a moeda no topo da tela
        moeda = this.physics.add.sprite(larguraJogo/2, 0, 'moeda');
        moeda.setCollideWorldBounds(true);
        moeda.setScale(0.5); // Redimensiona a moeda
        moeda.setBounce(0.7); // Define o coeficiente de restituição da moeda

        // Adiciona colisão da moeda com as plataformas e o chão
        this.physics.add.collider(moeda, plataformas);
        this.physics.add.collider(moeda, chao);

        // Detecta a sobreposição entre o jogador e a moeda
        this.physics.add.overlap(player, moeda, function(){
            moeda.setVisible(false); // Torna a moeda invisível
            var posicaoMoeda_Y = Phaser.Math.RND.between(50, 650); // Define uma nova posição Y aleatória para a moeda
            moeda.setPosition(posicaoMoeda_Y, 100); // Define a nova posição da moeda
            moeda.setVisible(true); // Torna a moeda visível novamente
            pontuacao += 1; // Incrementa a pontuação
            placar.setText('Moedas: ' + pontuacao); // Atualiza o texto do placar com a nova pontuação
        });

        // Cria as teclas de controle do jogador
        teclado = this.input.keyboard.createCursorKeys();
    };

    update() {
        // Movimento jogador
        // Movimenta o jogador para a esquerda
        if (teclado.left.isDown) {
            player.setVelocityX(-150);
        } 
        // Movimenta o jogador para a direita
        else if (teclado.right.isDown) {
            player.setVelocityX(150);
        } 
        // Para o jogador se nenhuma tecla de movimento estiver pressionada
        else {
            player.setVelocityX(0);
        }

        let podePular = true; // Verifica se o jogador pode pular

        // Verifica se o jogador pode pular e se a tecla de pulo está pressionada
        if (teclado.up.isDown && player.body.touching.down && podePular) {
            player.setVelocityY(-310); // Define uma velocidade vertical menor para um pulo curto
            podePular = false; // Define a permissão de pulo para false para impedir múltiplos pulos
        }

        // Verifica se o jogador soltou a tecla de pulo para que ele possa pular novamente
        if (teclado.up.isUp && player.body.touching.down) {
            podePular = true; // Define que o jogador pode pular
        }

        // Movimento do rato
        while (true) {
            // Verifica se a posição do rato é igual a 200 para estabelecer limites
            if (rato.x === 200) {
                rato.setFlip(true, false); // Vira o rato para a esquerda
                rato.ida = true; // Define a variável 'ida' como verdadeira, indicando que o rato está indo para a direita
            }
    
            // Verifica se a posição do rato é menor que 700, delimitando um limite e se 'ida' é verdadeiro
            if (rato.x < 700 && rato.ida === true) {
                rato.x += 5; // Move o rato para a direita
            }
    
            // Verifica se a posição do rato é igual a 700, se for
            if (rato.x === 700) {
                rato.setFlip(false, false); // Vira o rato para a direita
                rato.ida = false; // Define a variável 'ida' como falsa, indicando que o rato está voltando para a esquerda
            }
    
            // Verifica se a posição do rato é maior que 200 e se 'ida' é falso
            if (rato.x > 200 && rato.ida === false) {
                rato.x -= 5; // Move o rato para a esquerda
            }
    
            // Se as condições não forem satisfeitas, saia do loop
            break;
        }

        // Verifica se houve interseção entre o jogador e do rato
        if (Phaser.Geom.Intersects.RectangleToRectangle(player.getBounds(), rato.getBounds())) {
            this.scene.start('Deserto'); // Muda para a próxima cena quando o jogador encosta no rato
            pontuacao = 0; // Reinicia a pontuação para 0
        }
    }
}