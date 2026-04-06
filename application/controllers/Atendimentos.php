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
	}

	public function index()
	{
		$data['title']      = 'Atendimentos';
		// Dados são carregados via API
		$this->load->view('atendimentos/index', $data); // aqui não tem layout
	}
}
