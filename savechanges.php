<?
/*
savechanges.php - Specichert einen geändeten Eintrag ab
*/

include_once('mysql.inc.php');

$sid = mysql_real_escape_string($_GET['sid']);
$id = mysql_real_escape_string($_GET['id']);
$titel = mysql_real_escape_string(urldecode($_GET['titel']));
$username = mysql_real_escape_string(urldecode($_GET['username']));
$password = mysql_real_escape_string(urldecode($_GET['password']));
$url = mysql_real_escape_string(urldecode($_GET['url']));
$notiz = mysql_real_escape_string(urldecode($_GET['notiz']));

CheckLogin($sid, $ip);

$sql = "UPDATE entries SET titel='$titel', username='$username', password='$password', url='$url', notiz='$notiz' ".
	"WHERE id=$id AND userid=(SELECT id FROM users WHERE sessionid='$sid')";
	
if(mysql_query($sql)) {
	$state = 0;
} else {
	$state = -1;
}

echo <<<XML
<result>
	<state>$state</state>
</result>
XML;

?>