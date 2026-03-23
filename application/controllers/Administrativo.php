<?php
defined('BASEPATH') or exit('No direct script access allowed');

class Administrativo extends CI_Controller
{
	public function __construct()
	{
		parent::__construct();

		if (!$this->ion_auth->logged_in()) {
			redirect('login');
		}

		// if (!$this->ion_auth->is_admin()) // remove this elseif if you want to enable this for non-admins
		// {
		// 	show_error('É necessário ser administrador para acessar essa página.');
		// }
	}

	public function index()
	{
		$data['title'] = 'Administrativo';
		$this->load->view('administrativo/index', $data); // aqui não tem layout
	}
}
