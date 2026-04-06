<?php
defined('BASEPATH') or exit('No direct script access allowed');

class Atendimentos extends CI_Controller
{
	public function __construct()
	{
		parent::__construct();

		if (! $this->ion_auth->logged_in()) {
			redirect('login');
		}

		$this->load->model('Sala_model');
	}

	public function index()
	{
		$data['title']      = 'Atendimentos';

		//mandamos as salas e os profissionais para a view
		$data = array_merge($data, $this->getData());
		$this->load->view('atendimentos/index', $data); // aqui não tem layout
	}

	/**
	 * Recupera os dados para a view
	 */
	private function getData(): array
	{

		$data = [];

		// salas ativas
		$data['salas'] = $this->Sala_model->getAll(where: ['ativo' => 1]);

		// profissionais
		$data['profissionais'] = $this->ion_auth
			->select('users.id, users.email, users.phone, users.first_name, users.last_name, users.active')
			->users('profissional')
			->result();

		// echo '<pre>';
		// print_r($data);
		// echo '</pre>';
		// exit;


		return $data;
	}
}
