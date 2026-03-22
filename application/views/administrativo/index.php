<div class="container mt-5">
	<div class="row justify-content-center">
		<div class="col-12">
			<div class="card shadow-lg">
				<div class="card-header bg-primary text-white text-center">
					<h3><i class="fas fa-home"></i> Selecione o Módulo</h3>
				</div>
				<div class="card-body p-3">
					<div class="row g-3 row-cols-2 row-cols-sm-3 row-cols-lg-5">
						<!-- Módulo Recepção -->
						<div class="col">
							<div class="card module-card h-100 border-primary" onclick="window.location.href='recepcao.html'">
								<div class="card-body text-center py-3">
									<div class="module-icon mb-2">
										<i class="fas fa-user-plus fa-4x text-primary"></i>
									</div>
									<h5 class="card-title">Recepção</h5>
									<p class="card-text small">Cadastrar pacientes e gerar senhas</p>
									<button class="btn btn-primary btn-sm mt-2">
										<i class="fas fa-arrow-right"></i> Acessar
									</button>
								</div>
							</div>
						</div>

						<!-- Módulo Atendimento -->
						<div class="col">
							<div class="card module-card h-100 border-success" onclick="window.location.href='atendimento.html'">
								<div class="card-body text-center py-3">
									<div class="module-icon mb-2">
										<i class="fas fa-headset fa-4x text-success"></i>
									</div>
									<h5 class="card-title">Atendimento</h5>
									<p class="card-text small">Visualizar fila e chamar próximo</p>
									<button class="btn btn-success btn-sm mt-2">
										<i class="fas fa-arrow-right"></i> Acessar
									</button>
								</div>
							</div>
						</div>

						<!-- Módulo Triagem -->
						<div class="col">
							<div class="card module-card h-100 border-info" onclick="window.location.href='triagem.html'">
								<div class="card-body text-center py-3">
									<div class="module-icon mb-2">
										<i class="fas fa-clipboard-list fa-4x text-info"></i>
									</div>
									<h5 class="card-title">Triagem</h5>
									<p class="card-text small">Classificar prioridade de atendimento</p>
									<button class="btn btn-info btn-sm mt-2">
										<i class="fas fa-arrow-right"></i> Acessar
									</button>
								</div>
							</div>
						</div>

						<!-- Módulo Painel TV -->
						<div class="col">
							<div class="card module-card h-100 border-danger" onclick="window.location.href='painel-tv.html'">
								<div class="card-body text-center py-3">
									<div class="module-icon mb-2">
										<i class="fas fa-tv fa-4x text-danger"></i>
									</div>
									<h5 class="card-title">Painel TV</h5>
									<p class="card-text small">Exibir chamadas em tempo real</p>
									<button class="btn btn-danger btn-sm mt-2">
										<i class="fas fa-desktop"></i> Acessar
									</button>
								</div>
							</div>
						</div>

						<!-- Módulo Administrativo -->
						<div class="col">
							<div class="card module-card h-100 border-indigo" onclick="window.location.href='administrativo.html'">
								<div class="card-body text-center py-3">
									<div class="module-icon mb-2">
										<i class="fas fa-cog fa-4x text-indigo"></i>
									</div>
									<h5 class="card-title">Administrativo</h5>
									<p class="card-text small">Configurações e relatórios</p>
									<button class="btn btn-indigo btn-sm mt-2">
										<i class="fas fa-arrow-right"></i> Acessar
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>