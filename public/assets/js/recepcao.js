/**
 * ============================================
 * RECEPÇÃO - JavaScript
 * Funções específicas da página de recepção
 * ============================================
 */

function getTiposAtendimento() {
    try {
        return JSON.parse(localStorage.getItem('tiposAtendimento') || '[]');
    } catch (e) {
        return [];
    }
}

function carregarTiposAtendimento() {
    const tipos = getTiposAtendimento().filter(t => t.ativo);
    const select = $('#tipoAtendimento');
    select.find('option:not(:first)').remove();
    
    tipos.forEach(tipo => {
        select.append(`<option value="${tipo.id}">${tipo.nome}</option>`);
    });
}

function carregarClassificacoesRisco() {
    const classificacoes = (dadosMockados.classificacoes || []).slice();
    const container = $('#listaClassificacaoRisco');
    container.empty();
    
    if (classificacoes.length === 0) {
        container.html('<p class="text-muted">Nenhuma classificação cadastrada. <a href="classificacoes.html">Cadastrar classificações</a></p>');
        return;
    }
    
    classificacoes.sort((a, b) => (a.prioridade || 99) - (b.prioridade || 99));
    
    classificacoes.forEach((c, i) => {
        const tempo = c.tempo_estimado_min != null 
            ? (c.tempo_estimado_min === 0 ? 'Atendimento imediato' : `Até ${c.tempo_estimado_min} minutos`)
            : '';
        const corClass = `risco-${c.cor}`;
        const item = $(`
            <div class="form-check classificacao-item ${corClass}">
                <input class="form-check-input" type="radio" name="classificacao" 
                       id="risco${c.id}" value="${c.id}" ${i === 0 ? 'required' : ''}>
                <label class="form-check-label" for="risco${c.id}">
                    <strong>${c.nome}</strong>
                    ${tempo ? `<small>${tempo}</small>` : ''}
                </label>
            </div>
        `);
        container.append(item);
    });
}

$(document).ready(function() {
    carregarTiposAtendimento();
    carregarClassificacoesRisco();
    carregarUltimasChamadas();
    atualizarEstatisticas();
    
    // Botão "Encaminhar para triagem" - redireciona para triagem.html
    $('#btnEncaminharTriagem').on('click', function() {
        sessionStorage.setItem('recepcao_dados', JSON.stringify({
            nome: $('#nomePaciente').val().trim(),
            cpf: $('#cpfPaciente').val(),
            telefone: $('#telefonePaciente').val(),
            tipo_atendimento_id: $('#tipoAtendimento').val()
        }));
        window.location.href = 'triagem.html';
    });
    
    // Limpar Formulário - também limpa os dados da pessoa
    $('#formCadastroPaciente').on('reset', function() {
        setTimeout(function() {
            $('#nomePaciente').val('');
            $('#cpfPaciente').val('');
            $('#telefonePaciente').val('');
        }, 0);
    });
    
    // Atualização automática a cada 5 segundos
    setInterval(() => {
        carregarUltimasChamadas();
        atualizarEstatisticas();
    }, CONFIG.atualizacaoAutomatica);
});

// ============= CADASTRO DE PACIENTE =============

$('#formCadastroPaciente').submit(function(e) {
    e.preventDefault();
    
    const dados = {
        nome: $('#nomePaciente').val().trim(),
        cpf: $('#cpfPaciente').val(),
        telefone: $('#telefonePaciente').val(),
        tipo_atendimento_id: $('#tipoAtendimento').val(),
        classificacao: $('input[name="classificacao"]:checked').val()
    };
    
    // Validações
    if (!dados.nome) {
        exibirNotificacao('Por favor, digite o nome do paciente!', 'warning');
        return;
    }
    
    const tiposDisponiveis = getTiposAtendimento().filter(t => t.ativo);
    if (tiposDisponiveis.length > 0 && !dados.tipo_atendimento_id) {
        exibirNotificacao('Por favor, selecione o tipo de atendimento!', 'warning');
        return;
    }
    
    if (!dados.classificacao) {
        exibirNotificacao('Por favor, selecione a classificação de risco!', 'warning');
        return;
    }
    
    // Cria a senha
    criarSenha(dados).then(senha => {
        // Exibe modal com a senha gerada
        exibirModalSenhaGerada(senha);
        
        // Limpa formulário
        $('#formCadastroPaciente')[0].reset();
        
        // Atualiza lista e estatísticas
        carregarUltimasChamadas();
        atualizarEstatisticas();
        
        // Notificação
        exibirNotificacao('Senha gerada com sucesso!', 'success');
        
        // Som
        reproduzirSom();
    });
});

// ============= EXIBIR MODAL SENHA GERADA =============

function exibirModalSenhaGerada(senha) {
    const classificacao = getClassificacao(senha.classificacao_risco_id);
    
    $('#senhaGeradaNumero').text(senha.numero_senha);
    $('#senhaGeradaNome').text(senha.nome_paciente);
    
    const badge = $('#senhaGeradaClassificacao');
    badge.text(classificacao.nome);
    badge.removeClass();
    badge.addClass('badge fs-5');
    badge.addClass(getClasseClassificacao(senha.classificacao_risco_id));
    
    const modal = new bootstrap.Modal(document.getElementById('modalSenhaGerada'));
    modal.show();
}

// ============= CARREGAR ÚLTIMAS CHAMADAS =============

function carregarUltimasChamadas() {
    buscarUltimasChamadas(10).then(chamadas => {
        const container = $('#listaChamadas');
        container.empty();
        
        if (chamadas.length === 0) {
            container.html(`
                <div class="ultimos-chamados-vazio py-5">
                    <i class="fas fa-tv fa-4x text-muted mb-3"></i>
                    <p class="text-muted mb-0">Nenhuma chamada recente</p>
                </div>
            `);
            return;
        }
        
        chamadas.forEach(chamada => {
            if (!chamada.senha) return;
            
            const classificacao = getClassificacao(chamada.senha.classificacao_risco_id);
            const consultorio = getConsultorio(chamada.consultorio_id);
            
            const item = $(`
                <div class="senha-item classificacao-${chamada.senha.classificacao_risco_id} animate-entrada">
                    <div class="d-flex justify-content-between align-items-start">
                        <div class="flex-grow-1">
                            <div class="d-flex align-items-center mb-2">
                                <span class="senha-numero me-3">${chamada.senha.numero_senha}</span>
                                <span class="badge ${getClasseClassificacao(chamada.senha.classificacao_risco_id)}">
                                    ${classificacao.nome}
                                </span>
                            </div>
                            <h6 class="mb-1">${chamada.senha.nome_paciente}</h6>
                            <small class="text-muted">
                                <i class="fas fa-door-open"></i> ${consultorio ? consultorio.nome : '-'}
                                <span class="ms-2">${formatarHora(chamada.data_chamada)}</span>
                            </small>
                        </div>
                    </div>
                </div>
            `);
            
            container.append(item);
        });
    });
}

// ============= ATUALIZAR ESTATÍSTICAS =============

function atualizarEstatisticas() {
    const stats = calcularEstatisticas();
    
    $('#totalSenhas').text(stats.total);
    $('#senhasAtendidas').text(stats.finalizado);
    $('#senhasAguardando').text(stats.aguardando);
}

// ============= ATALHOS DE TECLADO =============

$(document).keydown(function(e) {
    // F2 - Foca no campo nome
    if (e.keyCode === 113) { // F2
        e.preventDefault();
        $('#nomePaciente').focus();
    }
    
    // ESC - Limpa formulário
    if (e.keyCode === 27) { // ESC
        $('#formCadastroPaciente')[0].reset();
    }
});

console.log('Recepção carregada com sucesso!');
