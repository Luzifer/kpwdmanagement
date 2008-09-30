<?
/*
Listentries.php - Erstellt eine Liste der Passworteinträge für Knutshome.de Passwortverwaltung
*/

include_once('mysql.inc.php');

$sid = mysql_real_escape_string($_GET['sid']);
$oldpwd = mysql_real_escape_string($_GET['oldpwd']);
$newpwd = mysql_real_escape_string($_GET['newpwd']);

CheckLogin($sid, $ip);

if(mysql_num_rows(mysql_query("SELECT * FROM users WHERE password=MD5('$oldpwd') AND sessionid='$sid'")) == 0) {
	$state = 1;
} else {
	if(mysql_query("UPDATE users SET password=MD5('$newpwd') WHERE sessionid='$sid'"))
		$state = 0;
	else
		$state = -1;
}

echo <<<XML
<result>
	<state>$state</state>
</result>
XML;

?>