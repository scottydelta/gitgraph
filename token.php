<?php
$data = 'client_id=' . '7cb3ed877d67aa4ac9d5' . '&' .
		'client_secret=' . '2990c694d4cbb1127e1ebdd4cbac109a39f4fed3' . '&' .
		'code=' . urlencode($_GET['code']);

$ch = curl_init('https://github.com/login/oauth/access_token');
curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);

preg_match('/access_token=([0-9a-f]+)/', $response, $out);
echo $out[1];
curl_close($ch);
?>
