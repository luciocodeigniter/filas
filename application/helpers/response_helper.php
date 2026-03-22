<?php
defined('BASEPATH') or exit('No direct script access allowed');

if (! function_exists('respond')) {

    /**
     * Respond with json
     * 
     * @param int $statusCode
     * @param mixed $data
     * @param string|null $message
     * @return void
     */
    function respond(int $statusCode = 200, $data = null, ?string $message = null)
    {
        $CI = &get_instance();

        $CI->output->set_status_header($statusCode);
        $CI->output->set_content_type('application/json', 'utf-8');
        // 🔥 se tiver mensagem, inclui junto
        $response = $data;

        if ($message !== null) {
            $response = [
                'message' => $message,
                'data' => $data
            ];
        }

        $CI->output->set_output(json_encode($response));
        $CI->output->_display();
        exit;
    }
}

if (! function_exists('get_json_input')) {

    function get_json_input()
    {
        return json_decode(file_get_contents('php://input'), true);
    }
}
