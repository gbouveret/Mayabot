/*-----------------------------------------------------------------------------
This template demonstrates how to use Waterfalls to collect input from a user using a sequence of steps.
For a complete walkthrough of creating this type of bot see the article at
https://docs.botframework.com/en-us/node/builder/chat/dialogs/#waterfall
-----------------------------------------------------------------------------*/
"use strict";
var builder = require("botbuilder");
var botbuilder_azure = require("botbuilder-azure");

var useEmulator = (process.env.NODE_ENV == 'development');

var connector = useEmulator ? new builder.ChatConnector() : new botbuilder_azure.BotServiceConnector({
    appId: process.env['MicrosoftAppId'],
    appPassword: process.env['MicrosoftAppPassword'],
    stateEndpoint: process.env['BotStateEndpoint'],
    openIdMetadata: process.env['BotOpenIdMetadata']
});

var bot = new builder.UniversalBot(connector);

bot.dialog('/', [
    function (session, args, next) {
		if (!session.userData.name) {
			session.beginDialog('/name');
		} else {
			session.send("Rebonjour " + session.userData.name + ".");
			next();
		}
    },
    function (session, results) {
        if (!session.userData.nbPeople){
			session.beginDialog('/nbPeople');
		} else {
			next();
		}
    },
    function (session, results) {
        if (!session.userData.nbPeople){
			session.beginDialog('/nbPeople');
		} else {
			next();
		}
    },
    function (session, results) {
		if (!session.userData.code){
			session.beginDialog('/code');
		} else {
			next();
		}
    },
    function (session, results) {
        session.userData.code = results.response;
        builder.Prompts.choice(session, "What language do you code Node using?", ["JavaScript", "CoffeeScript", "TypeScript"]);
    },
    function (session, results) {
        session.userData.language = results.response.entity;
        session.send("Got it... " + session.userData.name + 
                    " you've been programming for " + session.userData.coding + 
                    " years and use " + session.userData.language + ".");
    }
]);

bot.dialog('/name', [
	function (session) {
		builder.Prompts.text(session, "Bonjour, je suis Eduardo, content de savoir que vous acceptez de m'aider à retrouver le trésor. Quel est ton prénom ?");
	},
    function (session, results) {
        session.userData.name = results.response;
        session.endDialog();
    }
]);

bot.dialog('/nbPeople', [
	function (session) {
       builder.Prompts.number(session, results.response + ", quel joli prénom ! Combien êtes-vous à m'aider ?"); 
	},
    function (session, results) {
        session.userData.nbPeople = results.response;
		session.send(session.userData.nbPeople " ! Ca fait une bien belle équipe dis-moi !");
        session.endDialog();
    }
]);

bot.dialog('/code', [
	function (session) {
		session.send("Bien, pour commencer, vous allez devoir trouver les 3 numéros permettant de déchiffrer l'emplacement des villes. Pour cela, je vous ai fait parvenir une lettre contenant une énigme Maya qui devrait vous permettre de trouver un code à 3 chiffres.");
        builder.Prompts.text(session, "Je vous laisse chercher et vous me direz le code quand vous l'aurez trouvé. A tout à l'heure");
	},
    function (session, results) {
		var curCode = results.response;
		if (curCode == "059"){
			session.userData.code = curCode;
		}		
        session.endDialog();        
    }
]);

if (useEmulator) {
    var restify = require('restify');
    var server = restify.createServer();
    server.listen(3978, function() {
        console.log('test bot endpont at http://localhost:3978/api/messages');
    });
    server.post('/api/messages', connector.listen());    
} else {
    module.exports = { default: connector.listen() }
}
