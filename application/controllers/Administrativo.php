<?php
defined('BASEPATH') or exit('No direct script access allowed');

class Administrativo extends CI_Controller
{
	public function index()
	{
		$data['title'] = 'Administrativo';
		$this->load->view('administrativo/index', $data); // aqui não tem layout
	}
}
