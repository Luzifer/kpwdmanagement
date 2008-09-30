<?
/*
Mysql.php - Mysql-Zugangsöffner für Knutshome.de Passwortverwaltung
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
