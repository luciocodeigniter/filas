<?php
defined('BASEPATH') or exit('No direct script access allowed');

class Municipios extends CI_Controller
{
	public function index()
	{
		$data['title']      = 'Municipios';
		$data['municipios'] = []; //! buscar os dados de municípios
		$data['content']    = $this->load->view('municipios/index', NULL, TRUE);
		$this->load->view('layouts/main', $data);
	}
}
