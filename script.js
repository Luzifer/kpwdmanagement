/*
 * ###
 * # Tiny multi user password management with webbased interface
 * #
 * # (c) 2007-2008 by K. Ahlers
 * #
 * # This program is free software; you can redistribute it and/or modify it under
 * # the terms of the GNU General Public License as published by the Free Software
 * # Foundation; either version 2 of the License, or (at your option) any later
 * # version.
 * #
 * # This program is distributed in the hope that it will be useful, but WITHOUT
 * # ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * # FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * #
 * # You should have received a copy of the GNU General Public License along with
 * # this program; if not, write to the Free Software Foundation, Inc.,
 * # 51 Franklin St, Fifth Floor, Boston, MA 02110, USA
 * ###
 * */

var sessionident;
var loadedentry;
var cookiehandler;


function Init() {
	sessionident = null;
	loadedentry = null;
	cookiehandler = new wp_Cookie({
		expires : 60
	});
	if(cookiehandler.get('kpwdsession') != null) {
		sessionident = cookiehandler.get('kpwdsession');
		document.getElementById('loginwin').style.display = "none";
		LoadEntries();
	}
}

function ShowMessageBox(title, message, width, height) {
	var mbox = document.getElementById('messagebox');
	var titleelem = document.getElementById('messagetitle');
	var msg = document.getElementById('message');
	
	mbox.style.width = width+'px';
	mbox.style.height = height+'px';
	mbox.style.left = ((700 - width) / 2)+'px';
	mbox.style.top = ((500 - height) / 2)+'px';
	mbox.style.display = "block";
	
	titleelem.innerHTML = title;
	msg.innerHTML = message;
	
}

function MessageHide() {
	var mbox = document.getElementById('messagebox');
	mbox.style.display = "none";
}

function CheckLogin() {
	var user = $('user').value;
	var pwd = $('pwd').value;
	
	new Ajax.Request('login.php?user='+user+'&pwd='+pwd, {
		method: 'GET',
		onSuccess: function(transport) {
			var xml = transport.responseXML;
			var state = xml.getElementsByTagName('state')[0].firstChild.nodeValue;
			if(state == "0") {
				sessionident = xml.getElementsByTagName('sid')[0].firstChild.nodeValue;
				cookiehandler.set('kpwdsession', sessionident);
				$('loginwin').style.display = 'none';
				LoadEntries();
			} else {
				ShowMessageBox('Fehler', 'Der Login war falsch. Bitte die Eingaben prüfen.', 250, 100);
			}
		}
	});
}

function LoadEntries() {
	if(!IsLoggedIn())
		return;
	
	$('content').innerHTML = '';
	
	new Ajax.Request('listentries.php?sid='+sessionident, {
		method: 'GET',
		onSuccess: function(transport) {
			var xml = transport.responseXML;
			var state = xml.getElementsByTagName('state')[0].firstChild.nodeValue;
			if(state == "0") {
				var entries = xml.getElementsByTagName('entry');
				
				var html = "<table cellspacing=\"0\" style=\"width: 100%;\">";
				for(var i = 0; i < entries.length; i++) {
					var entry = entries[i];

					var onclick = 'onclick="LoadEntryDetail('+entry.getAttribute('id')+');"';

					html += '<tr name="entryline" id="entry'+entry.getAttribute('id')+'">' +
					'<td class="btn" '+onclick+' style="width:18px;"><img src="page.png" '+onclick+' class="btn" /></td>' +
					'<td class="btn" '+onclick+'>'+unescape(entry.firstChild.nodeValue)+'</td>' +
					'</tr>';
				}
				html += "</table>";
				$('listcontent').innerHTML = html;

				if(loadedentry != null)
					LoadEntryDetail(loadedentry);
			} else if(state == "1") {
				ShowMessageBox('Fehler', 'Die Übergebene Session war ungültig. Bitte neu einloggen.', 250, 100);
				sessionident = null;
				ShowLoginWin();
			} else {
				ShowMessageBox('Fehler', 'Bei der Abfrage der Einträge ist ein Fehler aufgetreten.', 250, 100);
			}
		}
	});
}

function IsLoggedIn() {
	if(sessionident == null) {
		ShowMessageBox('Fehler', 'Du bist nicht eingeloggt.', 250, 100);
		ShowLoginWin();
		return false;
	}
	return true;
}

function ShowLoginWin() {
	$('loginwin').style.display = "block";
	$('listcontent').innerHTML = "";
}

function ShowAppInfo() {
	ShowMessageBox('Über Passwortverwaltung', '<a href="http://github.com/luzifer/kpwdmanagement" target="_blank">KPWDManagement</a> v.2.1<br /><br />'+
		'&copy; 2007-2008 by Knut Ahlers<br />E-Mail: info@knutshome.de<br />'+
		'WWW: www.knutshome.de<br /><br />Die verwendeten Icons kommen von:<br />'+
		'<a href="http://www.famfamfam.com" target="_blank">www.famfamfam.com</a>', 280, 180);
}

function LoadEntryDetail(id) {
	if(!IsLoggedIn())
		return;
	
	if(loadedentry != null)
		$('entry'+loadedentry).style.background = '#ffffff';
	$('entry'+id).style.background = '#cccccc';
	loadedentry = id;
	
	new Ajax.Request('entrydetail.php?sid='+sessionident+'&id='+id, {
		method: 'GET',
		onSuccess: function(transport) {
			var xml = transport.responseXML;
			var state = xml.getElementsByTagName('state')[0].firstChild.nodeValue;
			if(state == "0") {
				var id = xml.getElementsByTagName('id')[0].firstChild != null ? xml.getElementsByTagName('id')[0].firstChild.nodeValue : "";
				var titel = xml.getElementsByTagName('titel')[0].firstChild != null ? unescape(xml.getElementsByTagName('titel')[0].firstChild.nodeValue) : "";
				var username = xml.getElementsByTagName('username')[0].firstChild != null ? unescape(xml.getElementsByTagName('username')[0].firstChild.nodeValue) : "";
				var password = xml.getElementsByTagName('password')[0].firstChild != null ? unescape(xml.getElementsByTagName('password')[0].firstChild.nodeValue) : "";
				var url = xml.getElementsByTagName('url')[0].firstChild != null ? unescape(xml.getElementsByTagName('url')[0].firstChild.nodeValue) : "";
				var notiz = xml.getElementsByTagName('notiz')[0].firstChild != null ? unescape(xml.getElementsByTagName('notiz')[0].firstChild.nodeValue) : "";

				var html = '<table style="width: 100%;">'+
					'<tr><td style="width: 150px;"><b>Titel des Eintrags:</b></td><td><span id="ct_titel">'+titel+'</span></td></tr>' +
					'<tr><td><b>Benutzername:</b></td><td><span id="ct_username">'+username+'</span></td></tr>' +
					'<tr><td><b>Passwort:</b></td><td><span id="ct_password">'+password+'</span></td></tr>' +
					'<tr><td><b>URL:</b></td><td id="td_url"><a href="'+url+'" target="_blank"><span id="ct_url">'+url+'</span></a></td></tr>' +
					'<tr><td><b>Notiz:</b></td><td><span id="ct_notiz">'+notiz.replace(/\n/g, "<br />")+'</span><span id="r_notiz" style="display:none;">'+notiz+'</span></td></tr>' +
					'</table>';

				$('content').innerHTML = html;
			} else if(state == "1") {
				ShowMessageBox('Fehler', 'Die Übergebene Session war ungültig. Bitte neu einloggen.', 250, 100);
				sessionident = null;
				ShowLoginWin();
			} else {
				ShowMessageBox('Fehler', 'Bei der Abfrage des Eintrags ist ein Fehler aufgetreten.', 250, 100);
			}
		}	
	});
}

function EditEntry() {
	if(!IsLoggedIn())
		return;
	if(loadedentry == null) {
		ShowMessageBox('Fehler', 'Bitte zuerst einen Datensatz auswählen.', 250, 100);
		return;
	}
	var ct_titel = document.getElementById('ct_titel');
	var ct_username = document.getElementById('ct_username');
	var ct_password = document.getElementById('ct_password');
	var ct_url = document.getElementById('ct_url');
	var td_url = document.getElementById('td_url');
	var ct_notiz = document.getElementById('ct_notiz');
	var r_notiz = document.getElementById('r_notiz');
	
	if(ct_titel.innerHTML.search(/<input/) != -1)
		return;
		
	var onfocus = 'onfocus="if(this.value == \' \') this.value = \'\';"';
	var onblur = 'onblur="if(this.value==\'\') this.value=\' \';"';
	
	var onfocustitle = 'onfocus="if((this.value == \'!!Neuer Datensatz\') || (this.value == \'!!Kein Titel\')) this.value = \'\';"';
	var onblurtitle = 'onblur="if(this.value==\'\') this.value=\'!!Kein Titel\';"';
	
	ct_titel.innerHTML = '<input type="text" '+onfocustitle+' '+onblurtitle+' id="field_titel" value="'+ct_titel.innerHTML+'" />';
	ct_username.innerHTML = '<input type="text" '+onfocus+' '+onblur+' id="field_username" value="'+ct_username.innerHTML+'" />';
	ct_password.innerHTML = '<input type="text" '+onfocus+' '+onblur+' id="field_password" value="'+ct_password.innerHTML+'" />';
	td_url.innerHTML = '<input type="text" '+onfocus+' '+onblur+' id="field_url" value="'+ct_url.innerHTML+'" />';
	ct_notiz.innerHTML = '<textarea id="field_notiz" '+onfocus+' '+onblur+'>'+r_notiz.innerHTML+'</textarea>';
	
	var content = document.getElementById('content');
	content.innerHTML = content.innerHTML + '<span class="btn savebtn" onclick="SaveChanges();">Speichern...</span>';
}

function SaveChanges() {
	var titel = escape($('field_titel').value);
	var username = escape($('field_username').value);
	var password = escape($('field_password').value);
	var url = escape($('field_url').value);
	var notiz = escape($('field_notiz').value);
	
	if(url.indexOf('%3A//') == -1)
		url = 'http%3A//'+url;
	
	var url = 'savechanges.php?sid='+sessionident+'&id='+loadedentry+'&titel='+titel+'&username='+username+'&password='+password+'&url='+url+'&notiz='+notiz;
	new Ajax.Request(url, {
		method: 'GET',
		onSuccess: function(transport) {
			var xml = transport.responseXML;
			var state = xml.getElementsByTagName('state')[0].firstChild.nodeValue;
			if(state == "0") {
				LoadEntries();
			} else if(state == "1") {
				ShowMessageBox('Fehler', 'Die Übergebene Session war ungültig. Bitte neu einloggen.', 250, 100);
				sessionident = null;
				ShowLoginWin();
			} else {
				ShowMessageBox('Fehler', 'Beim Speichern des Eintrags ist ein Fehler aufgetreten.', 250, 100);
			}
		}
	});
}

function Logout() {
	sessionident = null;
	cookiehandler.remove('kpwdsession');
	window.location.reload();
}

function AddEntry() {
	if(!IsLoggedIn())
		return;
	new Ajax.Request('createentry.php?sid='+sessionident, {
		method: 'GET',
		onSuccess: function(transport) {
			var xml = transport.responseXML;
			var state = xml.getElementsByTagName('state')[0].firstChild.nodeValue;
			if(state == "0") {
				var newid = xml.getElementsByTagName('newid')[0].firstChild.nodeValue;
				loadedentry = newid;
				LoadEntries();
			} else if(state == "1") {
				ShowMessageBox('Fehler', 'Die Übergebene Session war ungültig. Bitte neu einloggen.', 250, 100);
				sessionident = null;
				ShowLoginWin();
			} else {
				ShowMessageBox('Fehler', 'Beim Anlegen des Eintrags ist ein Fehler aufgetreten.', 250, 100);
			}
		}
	});
}

function DeleteEntry() {
	if(!IsLoggedIn())
		return;
	if(loadedentry == null) {
		ShowMessageBox('Fehler', 'Bitte zuerst einen Datensatz auswählen.', 250, 100);
		return;
	}
	new Ajax.Request('deleteentry.php?sid='+sessionident+'&id='+loadedentry, {
		method: 'GET',
		onSuccess: function(transport) {
			var xml = transport.responseXML;
			var state = xml.getElementsByTagName('state')[0].firstChild.nodeValue;
			if(state == "0") {
				loadedentry = null;
				LoadEntries();
			} else if(state == "1") {
				ShowMessageBox('Fehler', 'Die Übergebene Session war ungültig. Bitte neu einloggen.', 250, 100);
				sessionident = null;
				ShowLoginWin();
			} else {
				ShowMessageBox('Fehler', 'Beim Löschen des Eintrags ist ein Fehler aufgetreten.', 250, 100);
			}
		}
	});
}

function ChangePwdForm() {
	if(!IsLoggedIn())
		return;
	var html = '<table>'+
		'<tr><td>Altes Passwort:</td><td><input type="password" id="oldpwd" /></td></tr>'+
		'<tr><td>Neues Passwort:</td><td><input type="password" id="newpwd" /></td></tr>'+
		'<tr><td>Neues Passwort (Wiederholung):</td><td><input type="password" id="newpwdwdh" /></td></tr>'+
		'<tr><td colspan="2"><span class="btn" onclick="ChangePwd();">Speichern...</span></td></tr>'+
		'</table>';
	loadedentry = null;
	document.getElementById('content').innerHTML = html;
}

function ChangePwd() {
	if(!IsLoggedIn())
		return;
	var oldpwd = $('oldpwd').value;
	var newpwd = $('newpwd').value;
	var newpwdwdh = $('newpwdwdh').value;
	
	if(newpwd != newpwdwdh) {
		ShowMessageBox('Fehler', 'Das neue Passwort stimmt nicht mit seiner Wiederholung überein.', 250, 100);
		return;
	}
	
	new Ajax.Request('changepwd.php?sid='+sessionident+'&oldpwd='+oldpwd+'&newpwd='+newpwd, {
		method: 'GET',
		onSuccess: function(transport) {
			var xml = transport.responseXML;
			var state = xml.getElementsByTagName('state')[0].firstChild.nodeValue;
			if(state == "0") {
				ShowMessageBox('Passwort geändert', 'Das Passwort wurde erfolgreich geändert.', 250, 100);
				LoadEntries();
			} else if(state == "1") {
				ShowMessageBox('Fehler', 'Die Übergebene Session war ungültig. Bitte neu einloggen.', 250, 100);
				sessionident = null;
				ShowLoginWin();
			} else {
				ShowMessageBox('Fehler', 'Beim Ändern des Passworts ist ein Fehler aufgetreten.', 250, 100);
			}
		}
	});
}
