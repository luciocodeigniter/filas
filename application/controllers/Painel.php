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

		$this->config->load('pusher');
	}

	public function index()
	{
		$data['title']          = 'Painel de chamadas';
		$data['pusher_key']     = $this->config->item('key');
		$data['pusher_cluster'] = $this->config->item('cluster');
		$this->load->view('painel/index', $data); // aqui não tem layout
	}
}
