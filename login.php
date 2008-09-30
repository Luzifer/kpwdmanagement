<?
/*
Login.php - Loginscript für die Knutshome.de Passwortverwaltung
*/

include_once('mysql.inc.php');

$user = mysql_real_escape_string($_GET['user']);
$pwd = md5($_GET['pwd']);
$sid = md5(time());

if(mysql_num_rows(mysql_query("SELECT * FROM users WHERE username='$user' AND password='$pwd'")) === 1) {
	if(mysql_query("UPDATE users SET sessionid='$sid', ip='$ip' WHERE username='$user'")) {
		$state = 0;
	}
	else 
		$state = -1;
}
else {
	$state = 1;
	$sid = "";
}
	
header('Content-Type: text/xml');
echo <<<XML
<response>
	<state>$state</state>
	<sid>$sid</sid>
</response>
XML;

?>