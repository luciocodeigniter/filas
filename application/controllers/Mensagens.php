<?php
defined('BASEPATH') or exit('No direct script access allowed');

class Mensagens extends CI_Controller
{
	public function __construct()
	{
		parent::__construct();

		if (!$this->ion_auth->logged_in()) {
			redirect('login');
		}
	}

	public function index()
	{
		$data['title']      = 'Mensagens';
		// Mensagens são carregados via API
		$this->load->view('mensagens/index', $data); // aqui não tem layout
	}
}
