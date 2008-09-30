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

var XMLHTTP;
var sessionident;
var loadedentry;


function Init() {
	AjaxInit();
	sessionident = null;
	loadedentry = null;
	if(document.cookie && (document.cookie != "")) {
		sessionident = document.cookie;
		document.getElementById('loginwin').style.display = "none";
		LoadEntries();
	}
}

function AjaxInit() {
	if(window.XMLHttpRequest) {
		XMLHTTP = new XMLHttpRequest();
	} else if(window.ActiveXObject) {
		try{
			XMLHTTP = new ActiveXObject("Msxml2.XMLHTTP");
		} catch(ex) {
			try{
				XMLHTTP = new ActiveXObject("Microsoft.XMLHTTP");
			} catch(ex) {
			}
		}
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
	var user = document.getElementById('user').value;
	var pwd = document.getElementById('pwd').value;
	
	XMLHTTP.open('GET', 'login.php?user='+user+'&pwd='+pwd);
	XMLHTTP.onreadystatechange = ProcessLogin;
	XMLHTTP.send(null);
}

function ProcessLogin() {
	if(XMLHTTP.readyState == 4) {
		var state = XMLHTTP.responseXML.getElementsByTagName('state')[0].firstChild.nodeValue;
		if(state == "0") {
			sessionident = XMLHTTP.responseXML.getElementsByTagName('sid')[0].firstChild.nodeValue;
			document.cookie = sessionident;
			document.getElementById('loginwin').style.display = "none";
			LoadEntries();
		} else {
			ShowMessageBox('Fehler', 'Der Login war falsch. Bitte die Eingaben prüfen.', 250, 100);
		}
	}
}

function LoadEntries() {
	if(!IsLoggedIn())
		return;
	document.getElementById('content').innerHTML = '';
	XMLHTTP.open('GET', 'listentries.php?sid='+sessionident);
	XMLHTTP.onreadystatechange = WriteEntryList;
	XMLHTTP.send(null);
}

function WriteEntryList() {
	if(XMLHTTP.readyState == 4) {
		var state = XMLHTTP.responseXML.getElementsByTagName('state')[0].firstChild.nodeValue;
		if(state == "0") {
			var entries = XMLHTTP.responseXML.getElementsByTagName('entry');
			
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
			document.getElementById('listcontent').innerHTML = html;
			
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
	document.getElementById('loginwin').style.display = "block";
	document.getElementById('listcontent').innerHTML = "";
}

function ShowAppInfo() {
	ShowMessageBox('Über Passwortverwaltung', 'Knutshome.de - Passwortverwaltung v.1.0<br /><br />'+
		'&copy; 2007 by Knut Ahlers<br />E-Mail: info@knutshome.de<br />'+
		'WWW: www.knutshome.de<br /><br />Die verwendeten Icons kommen von:<br />'+
		'<a href="http://www.famfamfam.com" target="_blank">www.famfamfam.com</a>', 280, 180);
}

function LoadEntryDetail(id) {
	if(!IsLoggedIn())
		return;
	
	/*var lines = document.getElementsByName('entryline');
	for(var i = 0; i < lines.length; i++) {
			lines[i].style.background = '#ffffff';
	}*/
	if(loadedentry != null)
		document.getElementById('entry'+loadedentry).style.background = '#ffffff';
	document.getElementById('entry'+id).style.background = '#cccccc';
	loadedentry = id;
	
	XMLHTTP.open('GET', 'entrydetail.php?sid='+sessionident+'&id='+id);
	XMLHTTP.onreadystatechange = WriteEntryDetail;
	XMLHTTP.send(null);
	
}

function WriteEntryDetail() {
	if(XMLHTTP.readyState == 4) {
		var state = XMLHTTP.responseXML.getElementsByTagName('state')[0].firstChild.nodeValue;
		if(state == "0") {
		
			var id = GetXMLHTTPnodeValue('id');
			var titel = unescape(GetXMLHTTPnodeValue('titel'));
			var username = unescape(GetXMLHTTPnodeValue('username'));
			var password = unescape(GetXMLHTTPnodeValue('password'));
			var url = unescape(GetXMLHTTPnodeValue('url'));
			var notiz = unescape(GetXMLHTTPnodeValue('notiz'));
		
			var html = '<table style="width: 100%;">'+
				'<tr><td style="width: 150px;"><b>Titel des Eintrags:</b></td><td><span id="ct_titel">'+titel+'</span></td></tr>' +
				'<tr><td><b>Benutzername:</b></td><td><span id="ct_username">'+username+'</span></td></tr>' +
				'<tr><td><b>Passwort:</b></td><td><span id="ct_password">'+password+'</span></td></tr>' +
				'<tr><td><b>URL:</b></td><td id="td_url"><a href="'+url+'" target="_blank"><span id="ct_url">'+url+'</span></a></td></tr>' +
				'<tr><td><b>Notiz:</b></td><td><span id="ct_notiz">'+notiz.replace(/\n/g, "<br />")+'</span><span id="r_notiz" style="display:none;">'+notiz+'</span></td></tr>' +
				'</table>';
			
			document.getElementById('content').innerHTML = html;
		} else if(state == "1") {
			ShowMessageBox('Fehler', 'Die Übergebene Session war ungültig. Bitte neu einloggen.', 250, 100);
			sessionident = null;
			ShowLoginWin();
		} else {
			ShowMessageBox('Fehler', 'Bei der Abfrage des Eintrags ist ein Fehler aufgetreten.', 250, 100);
		}
	}
}

function GetXMLHTTPnodeValue(nodename) {
	return XMLHTTP.responseXML.getElementsByTagName(nodename)[0].firstChild.nodeValue;
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
	var titel = escape(document.getElementById('field_titel').value);
	var username = escape(document.getElementById('field_username').value);
	var password = escape(document.getElementById('field_password').value);
	var url = escape(document.getElementById('field_url').value);
	var notiz = escape(document.getElementById('field_notiz').value);
	
	if(url.indexOf('%3A//') == -1)
		url = 'http%3A//'+url;
	
	XMLHTTP.open('GET', 'savechanges.php?sid='+sessionident+'&id='+loadedentry+'&titel='+titel+'&username='+username+'&password='+password+'&url='+url+'&notiz='+notiz);
	XMLHTTP.onreadystatechange = ProcessSave;
	XMLHTTP.send(null);
}

function ProcessSave() {
	if(XMLHTTP.readyState == 4) {
		var state = XMLHTTP.responseXML.getElementsByTagName('state')[0].firstChild.nodeValue;
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
}

function Logout() {
	sessionident = null;
	document.cookie = "";
	window.location.reload();
}

function AddEntry() {
	if(!IsLoggedIn())
		return;
	XMLHTTP.open('GET', 'createentry.php?sid='+sessionident);
	XMLHTTP.onreadystatechange = CallNewEntry;
	XMLHTTP.send(null);
}

function CallNewEntry() {
	if(XMLHTTP.readyState == 4) {
		var state = XMLHTTP.responseXML.getElementsByTagName('state')[0].firstChild.nodeValue;
		if(state == "0") {
			var newid = XMLHTTP.responseXML.getElementsByTagName('newid')[0].firstChild.nodeValue;
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
}

function DeleteEntry() {
	if(!IsLoggedIn())
		return;
	if(loadedentry == null) {
		ShowMessageBox('Fehler', 'Bitte zuerst einen Datensatz auswählen.', 250, 100);
		return;
	}
	XMLHTTP.open('GET', 'deleteentry.php?sid='+sessionident+'&id='+loadedentry);
	XMLHTTP.onreadystatechange = ParseDelete;
	XMLHTTP.send(null);
}

function ParseDelete() {
	if(XMLHTTP.readyState == 4) {
		var state = XMLHTTP.responseXML.getElementsByTagName('state')[0].firstChild.nodeValue;
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
	var oldpwd = document.getElementById('oldpwd').value;
	var newpwd = document.getElementById('newpwd').value;
	var newpwdwdh = document.getElementById('newpwdwdh').value;
	
	if(newpwd != newpwdwdh) {
		ShowMessageBox('Fehler', 'Das neue Passwort stimmt nicht mit seiner Wiederholung überein.', 250, 100);
		return;
	}
	
	XMLHTTP.open('GET', 'changepwd.php?sid='+sessionident+'&oldpwd='+oldpwd+'&newpwd='+newpwd);
	XMLHTTP.onreadystatechange = ParsePwdChange;
	XMLHTTP.send(null);
}

function ParsePwdChange() {
	if(XMLHTTP.readyState == 4) {
		var state = XMLHTTP.responseXML.getElementsByTagName('state')[0].firstChild.nodeValue;
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
}
