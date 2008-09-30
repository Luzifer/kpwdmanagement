<?
/*
Listentries.php - Erstellt eine Liste der Passworteinträge für Knutshome.de Passwortverwaltung
*/

include_once('mysql.inc.php');

$sid = mysql_real_escape_string($_GET['sid']);

CheckLogin($sid, $ip);

$state = 0;

if(!mysql_query("INSERT INTO entries (userid, titel, username, password, url, notiz) VALUES ((SELECT id FROM users WHERE sessionid='$sid'), '!!Neuer Datensatz', ' ', ' ', ' ', ' ')"))
	$state = -1;
	
$re = mysql_fetch_assoc(mysql_query("SELECT MAX(id) as newid FROM entries WHERE userid = (SELECT id FROM users WHERE sessionid='$sid')"));

$id = $re['newid'];

echo <<<XML
<result>
	<state>$state</state>
	<newid>$id</newid>
</result>
XML;

?>