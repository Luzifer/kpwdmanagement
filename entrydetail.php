<?
/*
Listentries.php - Erstellt eine Liste der Passworteinträge für Knutshome.de Passwortverwaltung
*/

include_once('mysql.inc.php');

$sid = mysql_real_escape_string($_GET['sid']);
$id = mysql_real_escape_string($_GET['id']);

CheckLogin($sid, $ip);

$res = mysql_query("SELECT * FROM entries WHERE id=$id AND userid=(SELECT id FROM users WHERE sessionid='$sid')");

if(mysql_num_rows($res) === 0) {
echo <<<XML
<result>
	<state>1</state>
</result>
XML;
die();
}

$result = mysql_fetch_assoc($res);

$id = $result['id'];
$titel = escape($result['titel']);
$username = escape($result['username']);
$password = escape($result['password']);
$url = escape($result['url']);
$notiz = escape(stripslashes($result['notiz']));

echo <<<XML
<result>
	<state>0</state>
	<entry>
		<id>$id</id>
		<titel>$titel</titel>
		<username>$username</username>
		<password>$password</password>
		<url>$url</url>
		<notiz>$notiz</notiz>
	</entry>
</result>
XML;

?>