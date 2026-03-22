/**
 * ============================================
 * TRIAGEM - JavaScript
 * Funções específicas da página de triagem (Classificação de Risco)
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
    atualizarRelogio();
});

$('#formClassificacaoRisco').submit(function(e) {
    e.preventDefault();
    
    const motivoPrincipal = $('#motivoPrincipal').val().trim();
    const tipoAtendimento = $('#tipoAtendimento').val();
    const classificacao = $('input[name="classificacao"]:checked').val();
    
    if (!motivoPrincipal) {
        exibirNotificacao('Por favor, descreva o motivo principal!', 'warning');
        return;
    }
    
    const tiposDisponiveis = getTiposAtendimento().filter(t => t.ativo);
    if (tiposDisponiveis.length > 0 && !tipoAtendimento) {
        exibirNotificacao('Por favor, selecione o tipo de atendimento!', 'warning');
        return;
    }
    
    if (!classificacao) {
        exibirNotificacao('Por favor, selecione a classificação de risco!', 'warning');
        return;
    }
    
    // Armazena dados da triagem para uso posterior (ex: ao criar senha na recepção)
    sessionStorage.setItem('triagem_tipo_atendimento', tipoAtendimento);
    sessionStorage.setItem('triagem_classificacao', classificacao);
    sessionStorage.setItem('triagem_motivo', motivoPrincipal);
    
    exibirNotificacao('Classificação registrada! Encaminhando para atendimento.', 'success');
    
    setTimeout(() => {
        window.location.href = 'atendimento.html';
    }, 1500);
});
