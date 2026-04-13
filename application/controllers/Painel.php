<?php
defined('BASEPATH') or exit('No direct script access allowed');

class Painel extends CI_Controller
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
		$data['title']      = 'Painel de chamadas';
		$this->load->view('painel/index', $data); // aqui não tem layout
	}
}
