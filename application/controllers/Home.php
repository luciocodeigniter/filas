<?php
defined('BASEPATH') or exit('No direct script access allowed');

class Home extends CI_Controller
{
	public function index()
	{
		$data['title'] = 'Home';
		$data['content'] = $this->load->view('home/index', NULL, TRUE);
		$this->load->view('layouts/main', $data);
	}
}
