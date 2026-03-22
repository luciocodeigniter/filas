/**
 * ============================================
 * PAINEL DE TV - JavaScript
 * Funções específicas do painel de exibição
 * ============================================
 */

let ultimaChamadaId = null;

$(document).ready(function() {
    // Carrega painel ao iniciar
    atualizarPainel();
    atualizarFilaEspera();
    atualizarUltimasChamadasPainel();
    
    // Atualização automática mais frequente (3 segundos)
    setInterval(() => {
        atualizarPainel();
        atualizarFilaEspera();
        atualizarUltimasChamadasPainel();
    }, 3000);
    
    // Mensagem rotativa no rodapé
    iniciarMensagensRotativas();
});

// ============= ATUALIZAR PAINEL PRINCIPAL =============

function atualizarPainel() {
    buscarUltimaChamada().then(chamada => {
        if (!chamada || !chamada.senha) {
            exibirMensagemAguardando();
            return;
        }
        
        // Verifica se é uma nova chamada
        const isNovaChamada = ultimaChamadaId !== chamada.id;
        
        if (isNovaChamada) {
            ultimaChamadaId = chamada.id;
            
            // Exibe overlay de chamada
            exibirOverlayChamada(chamada);
            
            // Reproduz som
            reproduzirSom();
            
            // Após 5 segundos, esconde overlay
            setTimeout(() => {
                esconderOverlayChamada();
            }, CONFIG.tempoOverlayChamada);
        }
        
        // Atualiza informações na tela
        exibirChamadaAtual(chamada);
    });
}

// ============= EXIBIR CHAMADA ATUAL =============

function exibirChamadaAtual(chamada) {
    const senha = chamada.senha;
    const classificacao = getClassificacao(senha.classificacao_risco_id);
    const consultorio = getConsultorio(chamada.consultorio_id);
    
    // Atualiza número da senha
    $('#senhaAtual').text(senha.numero_senha);
    $('#senhaAtual').addClass('animate__animated animate__pulse');
    
    // Atualiza nome do paciente
    $('#nomeAtual').text(senha.nome_paciente.toUpperCase());
    
    // Atualiza classificação
    const badge = $('#classificacaoAtual');
    badge.text(classificacao.nome);
    badge.removeClass();
    badge.addClass('badge classificacao-badge');
    badge.addClass(getClasseClassificacao(senha.classificacao_risco_id));
    
    // Atualiza sala
    $('#consultorioAtual').html(`
        <i class="fas fa-door-open"></i> ${consultorio.nome}
    `);
    
    // Remove animação após completar
    setTimeout(() => {
        $('#senhaAtual').removeClass('animate__pulse');
    }, 1000);
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
    const consultorio = getConsultorio(chamada.consultorio_id);
    
    $('#overlayNumero').text(chamada.senha.numero_senha);
    $('#overlayConsultorio').text(consultorio.nome.toUpperCase());
    
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
        
        // Mostra apenas os primeiros 5
        const senhasExibir = senhas.slice(0, 5);
        
        senhasExibir.forEach((senha, index) => {
            const classificacao = getClassificacao(senha.classificacao_risco_id);
            const tempoEspera = calcularTempoDecorrido(senha.data_entrada);
            
            const row = $(`
                <tr>
                    <td><strong>${senha.numero_senha}</strong></td>
                    <td>
                        <span class="badge ${getClasseClassificacao(senha.classificacao_risco_id)}">
                            ${classificacao.nome}
                        </span>
                    </td>
                    <td><small>${formatarTempoEspera(tempoEspera)}</small></td>
                </tr>
            `);
            
            tbody.append(row);
        });
        
        // Se houver mais de 5, adiciona linha indicando
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
            if (!chamada.senha) return;
            
            const classificacao = getClassificacao(chamada.senha.classificacao_risco_id);
            const consultorio = getConsultorio(chamada.consultorio_id);
            
            const item = $(`
                <div class="list-group-item ${index === 0 ? 'list-group-item-primary' : ''}">
                    <div class="d-flex justify-content-between align-items-center">
                        <div class="flex-grow-1">
                            <strong>${chamada.senha.numero_senha}</strong>
                            <i class="fas fa-arrow-right mx-2"></i>
                            <strong>${consultorio.nome}</strong>
                        </div>
                        <span class="badge ${getClasseClassificacao(chamada.senha.classificacao_risco_id)}">
                            ${classificacao.nome}
                        </span>
                    </div>
                    <small class="text-muted">
                        ${formatarHora(chamada.data_chamada)}
                    </small>
                </div>
            `);
            
            container.append(item);
        });
    });
}

// ============= MENSAGENS ROTATIVAS =============

function getMensagensPainel() {
    try {
        const msgs = JSON.parse(localStorage.getItem('mensagens') || '[]');
        return msgs.filter(m => m.ativo !== false).sort((a, b) => (a.ordem || 0) - (b.ordem || 0));
    } catch (e) {
        return [];
    }
}

let indiceMensagem = 0;

function iniciarMensagensRotativas() {
    function exibirProximaMensagem() {
        const mensagens = getMensagensPainel().map(m => m.conteudo);
        
        if (mensagens.length === 0) {
            $('#mensagemRodape').text('Bem-vindo ao nosso atendimento. Obrigado pela compreensão!');
            return;
        }
        
        indiceMensagem = (indiceMensagem + 1) % mensagens.length;
        
        $('#mensagemRodape').fadeOut(500, function() {
            $(this).text(mensagens[indiceMensagem]).fadeIn(500);
        });
    }
    
    // Exibe primeira mensagem
    const mensagens = getMensagensPainel().map(m => m.conteudo);
    if (mensagens.length > 0) {
        $('#mensagemRodape').text(mensagens[0]);
    }
    
    setInterval(exibirProximaMensagem, 10000); // Troca a cada 10 segundos
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
    // Busca uma senha aguardando aleatória para simular
    buscarSenhas({ status: 'aguardando' }).then(senhas => {
        if (senhas.length === 0) {
            alert('Nenhuma senha aguardando para simular!');
            return;
        }
        
        const senhaAleatoria = senhas[Math.floor(Math.random() * senhas.length)];
        const consultorioAleatorio = Math.floor(Math.random() * 5) + 1;
        
        // Atualiza status
        atualizarSenha(senhaAleatoria.id, {
            status: 'chamando',
            data_chamada: new Date().toISOString(),
            consultorio_id: consultorioAleatorio,
            medico_id: 1
        }).then(() => {
            // Registra chamada
            registrarChamada(senhaAleatoria.id, consultorioAleatorio, 1);
            
            // Força atualização
            setTimeout(() => {
                atualizarPainel();
                atualizarUltimasChamadasPainel();
            }, 500);
        });
    });
}

// ============= ENTRAR EM TELA CHEIA AUTOMATICAMENTE =============

// Opcional: entra em tela cheia ao clicar na tela
$(document).one('click', function() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.log('Tela cheia não disponível:', err);
        });
    }
});

// ============= PREVENIR SLEEP DO DISPLAY =============

// Wake Lock API para manter a tela ligada
let wakeLock = null;

async function manterTelaLigada() {
    try {
        if ('wakeLock' in navigator) {
            wakeLock = await navigator.wakeLock.request('screen');
            console.log('Wake Lock ativo - tela permanecerá ligada');
        }
    } catch (err) {
        console.log('Wake Lock não disponível:', err);
    }
}

// Ativa ao carregar
manterTelaLigada();

// Reativa se a página voltar ao foco
document.addEventListener('visibilitychange', async () => {
    if (wakeLock !== null && document.visibilityState === 'visible') {
        await manterTelaLigada();
    }
});

console.log('Painel de TV carregado com sucesso!');
console.log('Pressione qualquer tecla para ativar tela cheia');
