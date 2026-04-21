/**
 * ============================================
 * PAINEL DE TV - JavaScript
 * Funções específicas do painel de exibição
 * ============================================
 */

let ultimaChamadaId = null;
let pusherIniciado = false;
let intervalMensagens = null;
let mensagensCache = [];
let indiceMensagem = 0;

$(document).ready(function () {
    exibirTelaInicio();
});

// ============= TELA DE INÍCIO (GARANTE INTERAÇÃO ANTES DO PAINEL) =============

function exibirTelaInicio() {
    const overlay = $(`
        <div id="overlayInicio" style="
            position: fixed; inset: 0; z-index: 99999;
            background: rgba(0,0,0,0.85);
            display: flex; flex-direction: column;
            align-items: center; justify-content: center;
            cursor: pointer;
        ">
            <i class="fas fa-tv fa-4x text-white mb-4"></i>
            <h2 class="text-white mb-2">Painel de Senhas</h2>
            <p class="text-white-50">Clique em qualquer lugar para iniciar</p>
        </div>
    `);

    $('body').append(overlay);

    overlay.one('click', function () {
        console.log('[Painel] Interação detectada, iniciando painel...');

        // Inicializa áudio após interação do usuário
        inicializarAudio();

        // Entra em tela cheia
        document.documentElement.requestFullscreen().catch(err => {
            console.log('[Painel] Tela cheia não disponível:', err);
        });

        // Remove overlay e inicia painel
        overlay.fadeOut(300, function () {
            overlay.remove();

            atualizarPainel();           // Busca inicial no servidor (1x)
            atualizarFilaEspera();
            atualizarUltimasChamadasPainel();
            iniciarMensagensRotativas();
            iniciarPusher();             // Inicia Pusher após interação do usuário
        });
    });
}

// ============= PUSHER =============

function iniciarPusher() {
    if (pusherIniciado) return;
    pusherIniciado = true;

    const pusher = new Pusher(document.getElementById('pusher_key').value, {
        cluster: document.getElementById('pusher_cluster').value
    });

    const channel = pusher.subscribe('painel');

    // Recebe nova chamada
    channel.bind('nova-chamada', function (chamada) {
        console.log('[Pusher] Nova chamada recebida:', chamada);

        const isNovaChamada = ultimaChamadaId !== String(chamada.id);

        if (isNovaChamada) {
            ultimaChamadaId = String(chamada.id);
            exibirOverlayChamada(chamada); chamada
            reproduzirSom();
            falarChamada(chamada);
            setTimeout(() => esconderOverlayChamada(), 6000);
        }

        exibirChamadaAtual(chamada);
        atualizarUltimasChamadasPainel();
    });

    // Recebe fila atualizada
    channel.bind('fila-atualizada', function (chamada) {
        console.log('[Pusher] Fila atualizada:', chamada);
        atualizarFilaEspera();
    });

    // Recebe chamadas atualizadas
    channel.bind('chamadas-atualizadas', function () {
        console.log('[Pusher] Chamadas atualizadas');
        atualizarUltimasChamadasPainel();
    });

    // Recebe mensagens atualizadas
    channel.bind('mensagens-atualizadas', function () {
        console.log('[Pusher] Mensagens atualizadas');
        iniciarMensagensRotativas();
    });
}

// ============= ATUALIZAR PAINEL PRINCIPAL =============

function atualizarPainel() {
    buscarUltimaChamada().then(chamada => {
        if (!chamada || !chamada.numero_senha) {
            exibirMensagemAguardando();
            return;
        }

        const isNovaChamada = ultimaChamadaId !== String(chamada.id);

        if (isNovaChamada) {
            ultimaChamadaId = String(chamada.id);
            exibirOverlayChamada(chamada);
            reproduzirSom();
            falarChamada(chamada);
            setTimeout(() => esconderOverlayChamada(), 6000);
        }

        exibirChamadaAtual(chamada);
    });
}

// ============= EXIBIR CHAMADA ATUAL =============

function exibirChamadaAtual(chamada) {
    $('#senhaAtual')
        .text(chamada.numero_senha)
        .addClass('animate__animated animate__pulse');

    $('#nomeAtual').text(chamada.nome_paciente.toUpperCase());

    const badge = $('#classificacaoAtual');
    badge.text(chamada.classificacao_nome);
    badge.removeClass();
    badge.addClass(`badge classificacao-badge ${getClasseClassificacao(chamada.classificacao_cor)}`);

    $('#consultorioAtual').html(`<i class="fas fa-door-open"></i> ${chamada.sala_nome}`);

    setTimeout(() => $('#senhaAtual').removeClass('animate__pulse'), 1000);
}

// ============= EXIBIR MENSAGEM AGUARDANDO =============

function exibirMensagemAguardando() {
    $('#senhaAtual').text('---');
    $('#nomeAtual').text('Aguardando próxima chamada...');
    $('#classificacaoAtual').text('').removeClass();
    $('#consultorioAtual').html('<i class="fas fa-door-open"></i> ---');
}

// ============= OVERLAY DE CHAMADA =============

function exibirOverlayChamada(chamada) {
    $('#overlayNumero').text(chamada.numero_senha);
    $('#overlayNome').text(chamada.nome_paciente.toUpperCase());
    $('#overlayConsultorio').text(chamada.sala_nome.toUpperCase());
    $('#overlayTipo').text('ATENDIMENTO ' + chamada.tipo_atendimento_nome.toUpperCase());
    $('#chamadaOverlay').addClass('active');
}

function esconderOverlayChamada() {
    $('#chamadaOverlay').removeClass('active');
}

// ============= ATUALIZAR FILA DE ESPERA =============

function atualizarFilaEspera() {
    buscarSenhas({ status: 'aguardando' }).then(senhas => {
        const tbody = $('#filaEspera');
        tbody.empty();

        if (senhas.length === 0) {
            tbody.html(`
                <tr>
                    <td colspan="3" class="text-center text-muted">
                        <small>Nenhum paciente aguardando</small>
                    </td>
                </tr>
            `);
            return;
        }

        const senhasExibir = senhas.slice(0, 5);

        senhasExibir.forEach((senha) => {
            const tempoEspera = calcularTempoDecorrido(senha.data_entrada);

            const row = $(`
                <tr>
                    <td><strong>${senha.numero_senha}</strong></td>
                    <td>
                        <span class="badge ${getClasseClassificacao(senha.classificacao_cor)}">
                            ${senha.classificacao_nome}
                        </span>
                    </td>
                    <td><small>${formatarTempoEspera(tempoEspera)}</small></td>
                </tr>
            `);

            tbody.append(row);
        });

        if (senhas.length > 5) {
            tbody.append(`
                <tr>
                    <td colspan="3" class="text-center text-muted">
                        <small>+ ${senhas.length - 5} pacientes</small>
                    </td>
                </tr>
            `);
        }
    });
}

// ============= ATUALIZAR ÚLTIMAS CHAMADAS =============

function atualizarUltimasChamadasPainel() {
    buscarUltimasChamadas(5).then(chamadas => {
        const container = $('#ultimasChamadas');
        container.empty();

        if (chamadas.length === 0) {
            container.html(`
                <div class="text-center text-muted py-3">
                    <small>Nenhuma chamada registrada</small>
                </div>
            `);
            return;
        }

        chamadas.forEach((chamada, index) => {
            if (!chamada.numero_senha) return;

            const item = $(`
                <div class="list-group-item ${index === 0 ? 'list-group-item-primary' : ''}">
                    <div class="d-flex justify-content-between align-items-center">
                        <div class="flex-grow-1">
                            <strong>${chamada.numero_senha}</strong>
                            <i class="fas fa-arrow-right mx-2"></i>
                            <strong>${chamada.sala_nome}</strong>
                        </div>
                        <span class="badge ${getClasseClassificacao(chamada.classificacao_cor)}">
                            ${chamada.classificacao_nome}
                        </span>
                    </div>
                    <small class="text-muted">${formatarHora(chamada.data_chamada)}</small>
                </div>
            `);

            container.append(item);
        });
    });
}

// ============= MENSAGENS ROTATIVAS =============

async function getMensagensPainel() {
    try {
        const result = await apiRequest('/api/mensagens?ativo=true');
        const mensagens = result.data || result || [];
        return mensagens
            .filter(m => m.ativo !== false)
            .sort((a, b) => (a.ordem || 0) - (b.ordem || 0));
    } catch (e) {
        console.error('Erro ao buscar mensagens:', e);
        return [];
    }
}



async function iniciarMensagensRotativas() {
    if (intervalMensagens) {
        clearInterval(intervalMensagens);
        intervalMensagens = null;
    }

    // Busca mensagens do servidor (1x) e cacheia
    mensagensCache = (await getMensagensPainel()).map(m => m.conteudo);
    indiceMensagem = 0;

    $('#mensagemRodape').text(
        mensagensCache.length > 0
            ? mensagensCache[0]
            : 'Bem-vindo ao nosso atendimento. Obrigado pela compreensão!'
    );

    intervalMensagens = setInterval(function () {
        if (mensagensCache.length === 0) return;

        indiceMensagem = (indiceMensagem + 1) % mensagensCache.length;

        $('#mensagemRodape').fadeOut(500, function () {
            $(this).text(mensagensCache[indiceMensagem]).fadeIn(500);
        });
    }, 10000);
}

// ============= TELA CHEIA =============

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.log('Erro ao entrar em tela cheia:', err);
        });
    } else {
        document.exitFullscreen();
    }
}

// ============= CONTROLES (DEBUG) =============

function toggleControles() {
    $('.controles-content').fadeToggle();
}

// ============= SIMULAÇÃO DE CHAMADA (TESTE) =============

function simularChamada() {
    buscarSenhas({ status: 'aguardando' }).then(senhas => {
        if (senhas.length === 0) {
            alert('Nenhuma senha aguardando para simular!');
            return;
        }

        const senhaAleatoria = senhas[Math.floor(Math.random() * senhas.length)];
        const consultorioAleatorio = Math.floor(Math.random() * 5) + 1;

        atualizarSenha(senhaAleatoria.id, {
            status: 'chamando',
            data_chamada: new Date().toISOString(),
            consultorio_id: consultorioAleatorio,
            medico_id: 1
        }).then(() => {
            registrarChamada(senhaAleatoria.id, consultorioAleatorio, 1);

            setTimeout(() => {
                atualizarPainel();
            }, 500);
        });
    });
}

// ============= PREVENIR SLEEP DO DISPLAY =============

let wakeLock = null;

async function manterTelaLigada() {
    try {
        if ('wakeLock' in navigator) {
            wakeLock = await navigator.wakeLock.request('screen');
            console.log('[Painel] Wake Lock ativo - tela permanecerá ligada');
        }
    } catch (err) {
        console.log('[Painel] Wake Lock não disponível:', err);
    }
}

manterTelaLigada();

document.addEventListener('visibilitychange', async () => {
    if (wakeLock !== null && document.visibilityState === 'visible') {
        await manterTelaLigada();
    }
});

// ============= FALA DA CHAMADA (TEXT-TO-SPEECH) =============

function falarChamada(chamada) {
    if (!window.speechSynthesis) {
        console.warn('[Painel] SpeechSynthesis não suportado neste navegador.');
        return;
    }

    // Cancela qualquer fala em andamento
    window.speechSynthesis.cancel();

    const senha = chamada.numero_senha || '';
    const nome = chamada.nome_paciente || '';
    const sala = chamada.sala_nome || '';
    const tipo = chamada.tipo_atendimento_nome || '';

    // Separa as letras da senha para falar corretamente: "S004" → "S, 0, 0, 4"
    const senhaFalada = senha.split('').join(', ');

    const texto = `Atenção! Senha ${senhaFalada}. ${nome}, dirija-se à ${sala}. Atendimento ${tipo}.`;

    const utterance = new SpeechSynthesisUtterance(texto);
    utterance.lang = 'pt-BR';
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.volume = 1;

    // Aguarda o som tocar antes de falar
    setTimeout(() => {
        window.speechSynthesis.speak(utterance);
    }, 3000);
}

console.log('[Painel] Painel de TV carregado. Aguardando interação do usuário...');