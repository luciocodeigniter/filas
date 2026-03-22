<?php
defined('BASEPATH') or exit('No direct script access allowed');

class Unidades extends CI_Controller
{
	public function index()
	{
		$data['title']      = 'Unidades';
		// Unidades são carregados via API
		$this->load->view('unidades/index', $data); // aqui não tem layout
	}
}
