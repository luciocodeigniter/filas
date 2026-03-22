/**
 * ============================================
 * PROFISSIONAL - JavaScript
 * Funções específicas da página de profissionais
 * ============================================
 */

// Carregar profissionais do localStorage
let profissionais = [];
if (localStorage.getItem('profissionais')) {
    try {
        profissionais = JSON.parse(localStorage.getItem('profissionais'));
    } catch (e) {
        console.error('Erro ao carregar profissionais:', e);
    }
}

function salvarProfissionais() {
    localStorage.setItem('profissionais', JSON.stringify(profissionais));
}

function getUnidades() {
    try {
        return JSON.parse(localStorage.getItem('unidades') || '[]');
    } catch (e) {
        return [];
    }
}

function getUnidadeNome(id) {
    const unidades = getUnidades();
    const unidade = unidades.find(u => u.id === id);
    return unidade ? unidade.nome : '-';
}

function getTiposAtendimento() {
    try {
        return JSON.parse(localStorage.getItem('tiposAtendimento') || '[]');
    } catch (e) {
        return [];
    }
}

function getTipoAtendimentoNome(id) {
    const tipos = getTiposAtendimento();
    const tipo = tipos.find(t => t.id === id);
    return tipo ? tipo.nome : '-';
}

function carregarUnidadesCheckbox() {
    const unidades = getUnidades().filter(u => u.ativo);
    const container = $('#listaUnidadesCheckbox');
    container.empty();
    
    if (unidades.length === 0) {
        container.html('<small class="text-muted">Nenhuma unidade cadastrada. <a href="unidades.html">Cadastrar unidades</a></small>');
        return;
    }
    
    unidades.forEach(unidade => {
        const check = $(`
            <div class="form-check">
                <input class="form-check-input unidade-check" type="checkbox" value="${unidade.id}" id="unidade_${unidade.id}">
                <label class="form-check-label" for="unidade_${unidade.id}">${unidade.nome}</label>
            </div>
        `);
        container.append(check);
    });
}

function carregarTiposAtendimentoCheckbox() {
    const tipos = getTiposAtendimento().filter(t => t.ativo);
    const container = $('#listaTiposAtendimentoCheckbox');
    container.empty();
    
    if (tipos.length === 0) {
        container.html('<small class="text-muted">Nenhum tipo cadastrado. <a href="tipos_atendimentos.html">Cadastrar tipos</a></small>');
        return;
    }
    
    tipos.forEach(tipo => {
        const check = $(`
            <div class="form-check">
                <input class="form-check-input tipo-atendimento-check" type="checkbox" value="${tipo.id}" id="tipo_${tipo.id}">
                <label class="form-check-label" for="tipo_${tipo.id}">${tipo.nome}</label>
            </div>
        `);
        container.append(check);
    });
}

$(document).ready(function() {
    carregarUnidadesCheckbox();
    carregarTiposAtendimentoCheckbox();
    carregarListaProfissionais();
    
    // Máscara de telefone
    $('#telefoneProfissional').mask('(00) 00000-0000');
});

$('#formProfissional').on('reset', function() {
    setTimeout(() => {
        $('.unidade-check').prop('checked', false);
        $('.tipo-atendimento-check').prop('checked', false);
        $('#ativoProfissional').prop('checked', true);
        $('#perfilAcesso').val('');
    }, 0);
});

$('#formProfissional').submit(function(e) {
    e.preventDefault();
    
    const nome = $('#nomeProfissional').val().trim();
    const telefone = $('#telefoneProfissional').val();
    const email = $('#emailProfissional').val().trim();
    const perfilAcesso = $('#perfilAcesso').val();
    const senha = $('#senhaProfissional').val();
    const ativo = $('#ativoProfissional').is(':checked');
    const unidadeIds = $('.unidade-check:checked').map(function() { return parseInt($(this).val()); }).get();
    const tipoAtendimentoIds = $('.tipo-atendimento-check:checked').map(function() { return parseInt($(this).val()); }).get();
    
    if (!nome) {
        exibirNotificacao('Por favor, digite o nome do profissional!', 'warning');
        return;
    }
    
    if (!perfilAcesso) {
        exibirNotificacao('Por favor, selecione o perfil de acesso!', 'warning');
        return;
    }
    
    if (!senha || senha.length < 4) {
        exibirNotificacao('Por favor, digite uma senha com no mínimo 4 caracteres!', 'warning');
        return;
    }
    
    if (unidadeIds.length === 0) {
        exibirNotificacao('Por favor, selecione ao menos uma unidade!', 'warning');
        return;
    }
    
    const tiposDisponiveis = getTiposAtendimento().filter(t => t.ativo);
    if (tiposDisponiveis.length > 0 && tipoAtendimentoIds.length === 0) {
        exibirNotificacao('Por favor, selecione ao menos um tipo de atendimento!', 'warning');
        return;
    }
    
    const profissional = {
        id: Date.now(),
        nome: nome,
        telefone: telefone || '',
        email: email || '',
        perfil_acesso: perfilAcesso,
        senha: senha,
        unidade_ids: unidadeIds,
        tipo_atendimento_ids: tipoAtendimentoIds,
        ativo: ativo
    };
    
    profissionais.push(profissional);
    salvarProfissionais();
    
    exibirNotificacao('Profissional cadastrado com sucesso!', 'success');
    $('#formProfissional')[0].reset();
    $('#ativoProfissional').prop('checked', true);
    $('#perfilAcesso').val('');
    $('.unidade-check').prop('checked', false);
    $('.tipo-atendimento-check').prop('checked', false);
    carregarListaProfissionais();
});

function carregarListaProfissionais() {
    const tbody = $('#listaProfissionais');
    tbody.empty();
    
    if (profissionais.length === 0) {
        tbody.html(`
            <tr>
                <td colspan="7" class="text-center text-muted py-4">
                    <i class="fas fa-user-tie fa-3x mb-3 d-block"></i>
                    Nenhum profissional cadastrado
                </td>
            </tr>
        `);
        return;
    }
    
    profissionais.forEach(profissional => {
        const unidadesNomes = (profissional.unidade_ids || []).map(id => getUnidadeNome(id)).join(', ') || '-';
        const atendimentosNomes = (profissional.tipo_atendimento_ids || []).map(id => getTipoAtendimentoNome(id)).join(', ') || '-';
        const perfil = profissional.perfil_acesso || '-';
        const contato = [];
        if (profissional.telefone) contato.push(`<i class="fas fa-phone"></i> ${profissional.telefone}`);
        if (profissional.email) contato.push(`<i class="fas fa-envelope"></i> ${profissional.email}`);
        
        const row = $(`
            <tr class="${!profissional.ativo ? 'table-secondary' : ''}">
                <td><strong>${profissional.nome}</strong></td>
                <td><small>${perfil}</small></td>
                <td><small>${unidadesNomes}</small></td>
                <td><small>${atendimentosNomes}</small></td>
                <td><small>${contato.join('<br>') || '-'}</small></td>
                <td>
                    <span class="badge ${profissional.ativo ? 'bg-success' : 'bg-secondary'}">
                        ${profissional.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                </td>
                <td>
                    <button class="btn btn-sm btn-outline-primary" onclick="abrirModalAssociar(${profissional.id})" title="Associar unidades e atendimentos">
                        <i class="fas fa-link"></i>
                    </button>
                </td>
            </tr>
        `);
        tbody.append(row);
    });
}

let profissionalEmEdicao = null;

function abrirModalAssociar(profissionalId) {
    const profissional = profissionais.find(p => p.id === profissionalId);
    if (!profissional) return;
    
    profissionalEmEdicao = profissional;
    $('#modalProfissionalNome').text(profissional.nome);
    
    // Preenche checkboxes das unidades
    const unidades = getUnidades().filter(u => u.ativo);
    const containerUnidades = $('#modalUnidadesCheckbox');
    containerUnidades.empty();
    
    if (unidades.length === 0) {
        containerUnidades.html('<small class="text-muted">Nenhuma unidade cadastrada. <a href="unidades.html">Cadastrar unidades</a></small>');
    } else {
        const unidadeIds = profissional.unidade_ids || [];
        unidades.forEach(unidade => {
            const checked = unidadeIds.includes(unidade.id) ? 'checked' : '';
            const check = $(`
                <div class="form-check">
                    <input class="form-check-input modal-unidade-check" type="checkbox" value="${unidade.id}" id="modal_unidade_${unidade.id}" ${checked}>
                    <label class="form-check-label" for="modal_unidade_${unidade.id}">${unidade.nome}</label>
                </div>
            `);
            containerUnidades.append(check);
        });
    }
    
    // Preenche checkboxes dos tipos de atendimento
    const tipos = getTiposAtendimento().filter(t => t.ativo);
    const containerTipos = $('#modalTiposAtendimentoCheckbox');
    containerTipos.empty();
    
    if (tipos.length === 0) {
        containerTipos.html('<small class="text-muted">Nenhum tipo cadastrado. <a href="tipos_atendimentos.html">Cadastrar tipos</a></small>');
    } else {
        const tipoIds = profissional.tipo_atendimento_ids || [];
        tipos.forEach(tipo => {
            const checked = tipoIds.includes(tipo.id) ? 'checked' : '';
            const check = $(`
                <div class="form-check">
                    <input class="form-check-input modal-tipo-atendimento-check" type="checkbox" value="${tipo.id}" id="modal_tipo_${tipo.id}" ${checked}>
                    <label class="form-check-label" for="modal_tipo_${tipo.id}">${tipo.nome}</label>
                </div>
            `);
            containerTipos.append(check);
        });
    }
    
    const modal = new bootstrap.Modal(document.getElementById('modalAssociarUnidades'));
    modal.show();
}

$('#btnSalvarAssociacoes').click(function() {
    if (!profissionalEmEdicao) return;
    
    const unidadeIds = $('.modal-unidade-check:checked').map(function() { return parseInt($(this).val()); }).get();
    const tipoAtendimentoIds = $('.modal-tipo-atendimento-check:checked').map(function() { return parseInt($(this).val()); }).get();
    
    if (unidadeIds.length === 0) {
        exibirNotificacao('Selecione ao menos uma unidade!', 'warning');
        return;
    }
    
    const tiposDisponiveis = getTiposAtendimento().filter(t => t.ativo);
    if (tiposDisponiveis.length > 0 && tipoAtendimentoIds.length === 0) {
        exibirNotificacao('Selecione ao menos um tipo de atendimento!', 'warning');
        return;
    }
    
    profissionalEmEdicao.unidade_ids = unidadeIds;
    profissionalEmEdicao.tipo_atendimento_ids = tipoAtendimentoIds;
    salvarProfissionais();
    carregarListaProfissionais();
    
    bootstrap.Modal.getInstance(document.getElementById('modalAssociarUnidades')).hide();
    exibirNotificacao('Associações salvas com sucesso!', 'success');
    profissionalEmEdicao = null;
});
