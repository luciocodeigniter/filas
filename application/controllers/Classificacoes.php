<?php
defined('BASEPATH') or exit('No direct script access allowed');

class Classificacoes extends CI_Controller
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
		$data['title']      = 'Classificações de Risco';
		// classificacoes são carregados via API
		$this->load->view('classificacoes/index', $data); // aqui não tem layout
	}
}
