/**
 * ============================================
 * ATENDIMENTO - JavaScript
 * Funções específicas da página de atendimento
 * ============================================
 */

let senhaAtual = null;
let senhaEmAtendimento = null;

$(document).ready(function() {
    // Carrega fila ao iniciar
    atualizarFila();
    atualizarHistorico();
    atualizarEstatisticasConsultorio();
    
    // Atualização automática
    setInterval(() => {
        atualizarFila();
        atualizarHistorico();
        atualizarEstatisticasConsultorio();
    }, CONFIG.atualizacaoAutomatica);
});

// ============= ATUALIZAR FILA DE ESPERA =============

function atualizarFila() {
    buscarSenhas({ status: 'aguardando' }).then(senhas => {
        const tbody = $('#corpoTabelaFila');
        tbody.empty();
        
        if (senhas.length === 0) {
            tbody.html(`
                <tr>
                    <td colspan="5" class="text-center text-muted py-4">
                        <i class="fas fa-inbox fa-2x mb-2"></i>
                        <p>Nenhum paciente aguardando</p>
                    </td>
                </tr>
            `);
            
            // Desabilita botão chamar se não há pacientes
            $('#btnChamar').prop('disabled', true);
            $('#proximaSenha').text('---');
            $('#proximoNome').text('Aguardando...');
            $('#proximaClassificacao').text('').removeClass();
            
            return;
        }
        
        // Atualiza próximo paciente
        const proximaSenha = senhas[0];
        atualizarProximoPaciente(proximaSenha);
        
        // Preenche tabela
        senhas.forEach((senha, index) => {
            const classificacao = getClassificacao(senha.classificacao_risco_id);
            const tempoEspera = calcularTempoDecorrido(senha.data_entrada);
            
            const row = $(`
                <tr data-senha-id="${senha.id}" ${index === 0 ? 'class="table-primary"' : ''}>
                    <td>
                        <strong>${senha.numero_senha}</strong>
                        ${index === 0 ? '<span class="badge bg-primary ms-1">Próximo</span>' : ''}
                    </td>
                    <td>${senha.nome_paciente}</td>
                    <td>
                        <span class="badge ${getClasseClassificacao(senha.classificacao_risco_id)}">
                            ${classificacao.nome}
                        </span>
                    </td>
                    <td>
                        <small>${formatarTempoEspera(tempoEspera)}</small>
                    </td>
                    <td>
                        <button class="btn btn-sm btn-success" onclick="chamarPacienteEspecifico(${senha.id})">
                            <i class="fas fa-phone"></i>
                        </button>
                    </td>
                </tr>
            `);
            
            tbody.append(row);
        });
        
        // Atualiza total da fila
        $('#totalFila').text(senhas.length);
    });
}

// ============= ATUALIZAR PRÓXIMO PACIENTE =============

function atualizarProximoPaciente(senha) {
    if (!senha) {
        $('#proximaSenha').text('---');
        $('#proximoNome').text('Aguardando...');
        $('#proximaClassificacao').text('').removeClass();
        $('#btnChamar').prop('disabled', true);
        senhaAtual = null;
        return;
    }
    
    senhaAtual = senha;
    const classificacao = getClassificacao(senha.classificacao_risco_id);
    
    $('#proximaSenha').text(senha.numero_senha);
    $('#proximoNome').text(senha.nome_paciente);
    
    const badge = $('#proximaClassificacao');
    badge.text(classificacao.nome);
    badge.removeClass();
    badge.addClass('badge fs-6');
    badge.addClass(getClasseClassificacao(senha.classificacao_risco_id));
    
    $('#btnChamar').prop('disabled', false);
}

// ============= CHAMAR PACIENTE =============

function chamarPaciente() {
    if (!senhaAtual) {
        exibirNotificacao('Nenhum paciente na fila!', 'warning');
        return;
    }
    
    const consultorioId = parseInt($('#selectConsultorio').val());
    const medicoId = parseInt($('#selectMedico').val());
    const consultorio = getConsultorio(consultorioId);
    
    // Atualiza status da senha
    atualizarSenha(senhaAtual.id, {
        status: 'chamando',
        data_chamada: new Date().toISOString(),
        consultorio_id: consultorioId,
        medico_id: medicoId
    }).then(senhaAtualizada => {
        // Registra chamada
        registrarChamada(senhaAtual.id, consultorioId, medicoId);
        
        // Exibe modal de chamada
        $('#modalSenha').text(senhaAtual.numero_senha);
        $('#modalNome').text(senhaAtual.nome_paciente);
        $('#modalConsultorio').text(consultorio.nome);
        
        const modal = new bootstrap.Modal(document.getElementById('modalChamar'));
        modal.show();
        
        // Reproduz som
        reproduzirSom();
        
        // Fecha modal automaticamente após 3 segundos
        setTimeout(() => {
            modal.hide();
        }, 3000);
        
        // Notificação
        exibirNotificacao(`Paciente ${senhaAtual.numero_senha} chamado!`, 'success');
        
        // Habilita botão de iniciar atendimento
        $('#btnIniciarAtendimento').prop('disabled', false);
        $('#btnChamar').prop('disabled', true);
        
        // Atualiza fila e histórico
        setTimeout(() => {
            atualizarFila();
            atualizarHistorico();
        }, 500);
    });
}

// ============= CHAMAR PACIENTE ESPECÍFICO =============

function chamarPacienteEspecifico(senhaId) {
    buscarSenhas({ status: 'aguardando' }).then(senhas => {
        const senha = senhas.find(s => s.id === senhaId);
        if (senha) {
            senhaAtual = senha;
            atualizarProximoPaciente(senha);
            chamarPaciente();
        }
    });
}

// ============= INICIAR ATENDIMENTO =============

function iniciarAtendimento() {
    if (!senhaAtual) {
        exibirNotificacao('Nenhum paciente chamado!', 'warning');
        return;
    }
    
    atualizarSenha(senhaAtual.id, {
        status: 'atendendo',
        data_atendimento: new Date().toISOString()
    }).then(() => {
        senhaEmAtendimento = senhaAtual;
        
        // Atualiza card de atendimento
        $('#cardAtendimento').show();
        $('#atendimentoNome').text(senhaAtual.nome_paciente);
        $('#atendimentoSenha').text(senhaAtual.numero_senha);
        $('#atendimentoHora').text(formatarHora(new Date()));
        
        // Desabilita botões
        $('#btnIniciarAtendimento').prop('disabled', true);
        $('#btnFinalizarAtendimento').prop('disabled', false);
        
        exibirNotificacao('Atendimento iniciado!', 'info');
        
        // Limpa próximo paciente
        senhaAtual = null;
        
        // Atualiza fila
        atualizarFila();
    });
}

// ============= FINALIZAR ATENDIMENTO =============

function finalizarAtendimento() {
    if (!senhaEmAtendimento) {
        exibirNotificacao('Nenhum atendimento em andamento!', 'warning');
        return;
    }
    
    atualizarSenha(senhaEmAtendimento.id, {
        status: 'finalizado',
        data_finalizacao: new Date().toISOString()
    }).then(() => {
        exibirNotificacao('Atendimento finalizado!', 'success');
        
        // Limpa card de atendimento
        $('#cardAtendimento').hide();
        senhaEmAtendimento = null;
        
        // Habilita botão chamar
        $('#btnFinalizarAtendimento').prop('disabled', true);
        
        // Atualiza estatísticas
        atualizarEstatisticasConsultorio();
        atualizarFila();
    });
}

// ============= ATUALIZAR HISTÓRICO =============

function atualizarHistorico() {
    buscarUltimasChamadas(10).then(chamadas => {
        const container = $('#historicoChamadas');
        container.empty();
        
        if (chamadas.length === 0) {
            container.html(`
                <div class="text-center text-muted py-3">
                    <small>Nenhuma chamada registrada</small>
                </div>
            `);
            return;
        }
        
        chamadas.forEach(chamada => {
            if (!chamada.senha) return;
            
            const classificacao = getClassificacao(chamada.senha.classificacao_risco_id);
            const consultorio = getConsultorio(chamada.consultorio_id);
            
            const item = $(`
                <div class="list-group-item list-group-item-action list-group-item-chamada">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <strong>${chamada.senha.numero_senha}</strong> - ${chamada.senha.nome_paciente}
                            <br>
                            <small class="text-muted">
                                <i class="fas fa-door-open"></i> ${consultorio.nome}
                                <span class="ms-2">${formatarHora(chamada.data_chamada)}</span>
                            </small>
                        </div>
                        <span class="badge ${getClasseClassificacao(chamada.senha.classificacao_risco_id)}">
                            ${classificacao.nome}
                        </span>
                    </div>
                </div>
            `);
            
            container.append(item);
        });
    });
}

// ============= ATUALIZAR ESTATÍSTICAS =============

function atualizarEstatisticasConsultorio() {
    const stats = calcularEstatisticas();
    $('#totalAtendimentos').text(stats.finalizado);
}

// ============= ATALHOS DE TECLADO =============

$(document).keydown(function(e) {
    // F5 - Chamar próximo paciente
    if (e.keyCode === 116) { // F5
        e.preventDefault();
        chamarPaciente();
    }
    
    // F6 - Iniciar atendimento
    if (e.keyCode === 117) { // F6
        e.preventDefault();
        iniciarAtendimento();
    }
    
    // F7 - Finalizar atendimento
    if (e.keyCode === 118) { // F7
        e.preventDefault();
        finalizarAtendimento();
    }
});

console.log('Atendimento carregado com sucesso!');
