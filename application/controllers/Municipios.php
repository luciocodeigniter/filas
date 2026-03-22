<?php
defined('BASEPATH') or exit('No direct script access allowed');

class Municipios extends CI_Controller
{
	public function index()
	{
		$data['title']      = 'Municipios';
		// municipios são carregados via API
		$this->load->view('municipios/index', $data); // aqui não tem layout
	}
}
