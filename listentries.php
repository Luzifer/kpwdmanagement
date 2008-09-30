<?
/*
Listentries.php - Erstellt eine Liste der Passworteinträge für Knutshome.de Passwortverwaltung
*/

include_once('mysql.inc.php');

$sid = mysql_real_escape_string($_GET['sid']);

CheckLogin($sid, $ip);

$res = mysql_query("SELECT id,titel FROM entries WHERE userid = (SELECT id FROM users WHERE sessionid='$sid') ORDER BY titel");

echo "<result><state>0</state>";

while($result = mysql_fetch_assoc($res)) {
	echo "<entry id=\"".$result['id']."\">".escape($result['titel'])."</entry>";
}

echo "</result>";

?>