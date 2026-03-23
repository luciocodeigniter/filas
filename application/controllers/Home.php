<?php
defined('BASEPATH') or exit('No direct script access allowed');

class Home extends CI_Controller
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
		$data['title'] = 'Home';
		$data['content'] = $this->load->view('home/index', NULL, TRUE);
		$this->load->view('layouts/main', $data);
	}
}
