<?php
defined('BASEPATH') or exit('No direct script access allowed');

class Salas extends CI_Controller
{
	public function index()
	{
		$data['title']      = 'Salas';
		// Salas são carregados via API
		$this->load->view('salas/index', $data); // aqui não tem layout
	}
}
