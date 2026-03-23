<?php
defined('BASEPATH') or exit('No direct script access allowed');

/**
 * Tipos de atendimentos
 */
class Tipos extends CI_Controller
{
	public function index()
	{
		$data['title']      = 'Tipos de atendimento';
		// tipos são carregados via API
		$this->load->view('tipos/index', $data); // aqui não tem layout
	}
}
