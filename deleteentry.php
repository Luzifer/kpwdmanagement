<?
/*
Listentries.php - Erstellt eine Liste der Passworteinträge für Knutshome.de Passwortverwaltung
*/

include_once('mysql.inc.php');

$sid = mysql_real_escape_string($_GET['sid']);
$id = mysql_real_escape_string($_GET['id']);

CheckLogin($sid, $ip);

if(mysql_query("DELETE FROM entries WHERE id=$id AND userid=(SELECT id FROM users WHERE sessionid='$sid')"))
	$state = 0;
else
	$state = -1;
	
echo <<<XML
<result>
	<state>$state</state>
</result>
XML;

?>