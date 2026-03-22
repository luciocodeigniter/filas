<?php
defined('BASEPATH') or exit('No direct script access allowed');

class Classificacoes extends CI_Controller
{
	public function index()
	{
		$data['title']      = 'Classificações de Risco';
		// classificacoes são carregados via API
		$this->load->view('classificacoes/index', $data); // aqui não tem layout
	}
}
