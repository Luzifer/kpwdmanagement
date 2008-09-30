<?
/*
Mysql.php - Mysql-Zugangsöffner für Knutshome.de Passwortverwaltung
*/

header("Content-Type: text/xml");
header("Expires: Mon, 26 Nov 1962 00:00:00 GMT");

$password = "***CHANGETHISVALUE***"; 
$user = "khpwdmgmt";
$host = "localhost";
$db = $user;

mysql_connect($host, $user, $password);
mysql_select_db($db);

mysql_query("SET character_set_client = latin1");
mysql_query("SET character_set_results = latin1");
mysql_query("SET character_set_connection = latin1");

$ip = $_SERVER['REMOTE_ADDR'];

function CheckLogin($sid, $ip) {
	if(mysql_num_rows(mysql_query("SELECT * FROM users WHERE sessionid = '$sid' AND ip = '$ip'")) === 0) {
		die("<result><state>1</state></result>");
	}
}
function escape($string) {
	return str_replace("+", "%20", urlencode($string));
}

?>
