<!DOCTYPE html>
<html lang="pt-BR">

<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Painel de Chamadas</title>
	<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
	<link rel="stylesheet" href="<?php echo base_url('public/'); ?>assets/css/style.css">
</head>

<body class="painel-tv-body">
	<!-- Cabeçalho do Painel -->
	<div class="painel-header">
		<div class="container-fluid">
			<div class="row align-items-center">
				<div class="col-md-2 text-center">
					<i class="fas fa-hospital fa-3x text-white"></i>
				</div>
				<div class="col-md-8 text-center">
					<h1 class="text-white mb-0">PAINEL DE CHAMADAS</h1>
					<p class="text-white-50 mb-0">Sistema de Senhas</p>
				</div>
				<div class="col-md-2 text-center">
					<div class="relogio-painel text-white" id="relogioPainel"></div>
					<div class="data-painel text-white-50" id="dataPainel"></div>
				</div>
			</div>
		</div>
	</div>

	<!-- Área Principal de Chamada -->
	<div class="container-fluid mt-4">
		<div class="row">
			<!-- Chamada Atual (Grande) -->
			<div class="col-md-7">
				<div class="card shadow-lg chamada-atual-card" id="chamadaAtualCard">
					<div class="card-header bg-danger text-white text-center">
						<h2 class="mb-0"><i class="fas fa-bell"></i> CHAMANDO AGORA</h2>
					</div>
					<div class="card-body text-center p-5">
						<div class="senha-chamada-display mb-4">
							<h1 class="display-1 fw-bold text-primary animate__animated" id="senhaAtual">
								---
							</h1>
						</div>
						<h2 class="nome-paciente-display mb-4" id="nomeAtual">
							Aguardando próxima chamada...
						</h2>
						<div class="classificacao-display mb-4">
							<span class="badge classificacao-badge" id="classificacaoAtual"></span>
						</div>
						<div class="consultorio-display">
							<h3 class="text-muted mb-2">Dirija-se à</h3>
							<div class="consultorio-numero">
								<h1 class="display-3 text-success fw-bold" id="consultorioAtual">
									<i class="fas fa-door-open"></i> ---
								</h1>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Fila de Espera e Últimas Chamadas -->
			<div class="col-md-5">
				<!-- Próximas Chamadas -->
				<div class="card shadow mb-3">
					<div class="card-header bg-warning text-dark">
						<h5 class="mb-0"><i class="fas fa-hourglass-half"></i> AGUARDANDO ATENDIMENTO</h5>
					</div>
					<div class="card-body" style="max-height: 300px; overflow-y: auto;">
						<table class="table table-sm">
							<thead>
								<tr>
									<th>Senha</th>
									<th>Classificação</th>
									<th>Tempo</th>
								</tr>
							</thead>
							<tbody id="filaEspera">
								<!-- Será preenchido via JavaScript -->
							</tbody>
						</table>
					</div>
				</div>

				<!-- Últimas Chamadas -->
				<div class="card shadow">
					<div class="card-header bg-info text-white">
						<h6 class="mb-0"><i class="fas fa-history"></i> ÚLTIMAS CHAMADAS</h6>
					</div>
					<div class="card-body p-2" style="max-height: 350px; overflow-y: auto;">
						<div id="ultimasChamadas">
							<!-- Será preenchido via JavaScript -->
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Mensagens e Avisos -->
		<div class="row mt-3">
			<div class="col-md-12">
				<div class="alert alert-info text-center mensagem-rodape">
					<h5 class="mb-0">
						<i class="fas fa-info-circle"></i>
						<span id="mensagemRodape">
							Por favor, mantenha distância de segurança e use máscara nas dependências
						</span>
					</h5>
				</div>
			</div>
		</div>
	</div>

	<!-- Overlay de Chamada (Animação) -->
	<div class="chamada-overlay" id="chamadaOverlay">
		<div class="chamada-overlay-content">
			<i class="fas fa-bell fa-5x text-white mb-4 animate__animated animate__swing animate__infinite"></i>
			<h1 class="text-white display-1 fw-bold" id="overlayNumero">A001</h1>
			<h2 class="text-white" id="overlayConsultorio">Sala 1</h2>
		</div>
	</div>

	<!-- Controles (Ocultos - apenas para debug) -->
	<div class="controles-painel" id="controlesPainel">
		<button class="btn btn-sm btn-secondary" onclick="toggleControles()">
			<i class="fas fa-cog"></i>
		</button>
		<div class="controles-content" style="display: none;">
			<button class="btn btn-sm btn-primary m-1" onclick="simularChamada()">
				<i class="fas fa-play"></i> Simular Chamada
			</button>
			<button class="btn btn-sm btn-success m-1" onclick="toggleFullscreen()">
				<i class="fas fa-expand"></i> Tela Cheia
			</button>
			<button class="btn btn-sm btn-warning m-1" onclick="location.reload()">
				<i class="fas fa-sync"></i> Recarregar
			</button>
		</div>
	</div>

	<!-- Áudio de Chamada -->
	<audio id="audioChamada" preload="auto">
		<!-- Em produção, adicionar arquivo de áudio real -->
		<source src="audio/chamada.mp3" type="audio/mpeg">
	</audio>

	<script src="https://code.jquery.com/jquery-3.7.0.min.js"></script>
	<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"></script>
	<script src="<?php echo base_url('public/'); ?>assets/js/script.js"></script>
	<script src="<?php echo base_url('public/'); ?>assets/js/painel-tv.js"></script>
</body>

</html>