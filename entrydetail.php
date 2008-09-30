<?
/*
Listentries.php - Erstellt eine Liste der Passworteinträge für Knutshome.de Passwortverwaltung
*/

/*
###
# Tiny multi user password management with webbased interface
#
# (c) 2007-2008 by K. Ahlers
#
# This program is free software; you can redistribute it and/or modify it under
# the terms of the GNU General Public License as published by the Free Software
# Foundation; either version 2 of the License, or (at your option) any later
# version.
#
# This program is distributed in the hope that it will be useful, but WITHOUT
# ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
# FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License along with
# this program; if not, write to the Free Software Foundation, Inc.,
# 51 Franklin St, Fifth Floor, Boston, MA 02110, USA
###
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
