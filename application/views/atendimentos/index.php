<!DOCTYPE html>
<html lang="pt-BR">

<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Atendimento - Sistema de Senhas</title>
	<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
	<link rel="stylesheet" href="<?php echo base_url('public/'); ?>assets/css/style.css">
</head>

<body class="bg-light">
	<nav class="navbar navbar-dark bg-success">
		<div class="container-fluid">
			<a href="<?php echo site_url('/'); ?>" class="navbar-brand">
				<i class="fas fa-arrow-left"></i> Voltar
			</a>
			<span class="navbar-brand mb-0 h1">
				<i class="fas fa-headset"></i> Atendimento
			</span>
			<span class="navbar-text text-white" id="relogio"></span>
		</div>
	</nav>

	<div class="container-fluid mt-4">
		<!-- Informações do Atendimento -->
		<div class="row mb-4">
			<div class="col-md-12">
				<div class="card shadow">
					<div class="card-body">
						<div class="row align-items-center">
							<div class="col-md-3">
								<label for="selectMedico" class="form-label">Profissional:</label>
								<select class="form-select" id="selectMedico">
									<?php if (empty($profissionais)): ?>
										<option value="">Nenhum profissional cadastrado</option>
									<?php else: ?>
										<?php foreach ($profissionais as $profissional): ?>
											<option value="<?php echo $profissional->id; ?>"><?php echo $profissional->first_name; ?> <?php echo $profissional->last_name; ?></option>
										<?php endforeach; ?>
									<?php endif; ?>
								</select>
							</div>
							<div class="col-md-3">
								<label for="selectConsultorio" class="form-label">Sala:</label>
								<select class="form-select" id="selectConsultorio">
									<?php if (empty($salas)): ?>
										<option value="">Nenhuma sala cadastrada</option>
									<?php else: ?>
										<?php foreach ($salas as $sala): ?>
											<option value="<?php echo $sala->id; ?>"><?php echo $sala->nome; ?></option>
										<?php endforeach; ?>
									<?php endif; ?>
								</select>
							</div>
							<div class="col-md-3">
								<label for="guiche" class="form-label">Guichê</label>
								<select id="selectGuiche" class="form-select">
									<?php for ($i = 1; $i <= 10; $i++): ?>
										<option value="<?= $i ?>">Guichê <?= $i ?></option>
									<?php endfor; ?>
								</select>
							</div>
							<div class="col-md-3">
								<label class="form-label">Aguardando na fila:</label>
								<h3 class="text-primary mb-0" id="totalFila">0</h3>
							</div>
							<div class="col-md-12 mt-3">
								<label class="form-label">Atendimentos Hoje:</label>
								<h3 class="text-success mb-0" id="totalAtendimentos">0</h3>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="row">
			<!-- Fila de Pacientes -->
			<div class="col-md-8">
				<div class="card shadow">
					<div class="card-header bg-primary text-white d-flex justify-content-between align-items-center">
						<h5 class="mb-0"><i class="fas fa-users"></i> Fila de Espera</h5>
						<button class="btn btn-light btn-sm" onclick="atualizarFila()">
							<i class="fas fa-sync-alt"></i> Atualizar
						</button>
					</div>
					<div class="card-body" style="max-height: 600px; overflow-y: auto;">
						<table class="table table-hover" id="tabelaFila">
							<thead class="table-light sticky-top">
								<tr>
									<th width="80">Senha</th>
									<th>Nome</th>
									<th width="150">Classificação</th>
									<th width="100">Tempo</th>
									<th width="120">Ação</th>
								</tr>
							</thead>
							<tbody id="corpoTabelaFila">
								<!-- Pacientes serão inseridos aqui via JavaScript -->
							</tbody>
						</table>
					</div>
				</div>
			</div>

			<!-- Painel de Controle e Histórico -->
			<div class="col-md-4">
				<!-- Próximo Paciente -->
				<div class="card shadow mb-3 proximo-paciente-card">
					<div class="card-header bg-warning text-dark">
						<h5 class="mb-0"><i class="fas fa-arrow-right"></i> Próximo Paciente</h5>
					</div>
					<div class="card-body text-center p-4" id="proximoPacienteCard">
						<div class="senha-display mb-3">
							<h1 class="display-4 fw-bold text-primary" id="proximaSenha">---</h1>
						</div>
						<h5 id="proximoNome" class="mb-3">Aguardando...</h5>
						<span class="badge fs-6 mb-3" id="proximaClassificacao"></span>
						<div class="d-grid gap-2 mt-4">
							<button class="btn btn-success btn-lg" id="btnChamar" onclick="chamarPaciente()" disabled>
								<i class="fas fa-phone-volume"></i> CHAMAR PACIENTE
							</button>
							<button class="btn btn-primary" id="btnIniciarAtendimento" onclick="iniciarAtendimento()" disabled>
								<i class="fas fa-play"></i> Iniciar Atendimento
							</button>
							<button class="btn btn-danger" id="btnFinalizarAtendimento" onclick="finalizarAtendimento()" disabled>
								<i class="fas fa-check"></i> Finalizar Atendimento
							</button>
						</div>
					</div>
				</div>

				<!-- Paciente em Atendimento -->
				<div class="card shadow mb-3" id="cardAtendimento" style="display: none;">
					<div class="card-header bg-info text-white">
						<h6 class="mb-0"><i class="fas fa-user-check"></i> Em Atendimento</h6>
					</div>
					<div class="card-body">
						<h6 id="atendimentoNome">---</h6>
						<p class="mb-1"><strong>Senha:</strong> <span id="atendimentoSenha">---</span></p>
						<p class="mb-0"><small>Início: <span id="atendimentoHora">---</span></small></p>
					</div>
				</div>

				<!-- Histórico de Chamadas -->
				<div class="card shadow">
					<div class="card-header bg-secondary text-white">
						<h6 class="mb-0"><i class="fas fa-history"></i> Últimas Chamadas</h6>
					</div>
					<div class="card-body p-2" style="max-height: 250px; overflow-y: auto;">
						<div class="list-group list-group-flush" id="historicoChamadas">
							<!-- Histórico será inserido aqui -->
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Modal de Confirmação de Chamada -->
	<div class="modal fade" id="modalChamar" tabindex="-1">
		<div class="modal-dialog modal-dialog-centered">
			<div class="modal-content">
				<div class="modal-header bg-success text-white">
					<h5 class="modal-title"><i class="fas fa-bell"></i> Chamar Paciente</h5>
					<button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
				</div>
				<div class="modal-body text-center p-4">
					<i class="fas fa-volume-up fa-4x text-success mb-3"></i>
					<h4>Chamando Paciente</h4>
					<h2 class="text-primary fw-bold" id="modalSenha">A001</h2>
					<h5 id="modalNome">Nome</h5>
					<p class="mt-3">Para a Sala <strong id="modalConsultorio">1</strong></p>
				</div>
			</div>
		</div>
	</div>

	<script src="https://code.jquery.com/jquery-3.7.0.min.js"></script>
	<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
	<script src="<?php echo base_url('public/'); ?>assets/js/script.js"></script>
	<script src="<?php echo base_url('public/'); ?>assets/js/atendimento.js"></script>
</body>

</html>