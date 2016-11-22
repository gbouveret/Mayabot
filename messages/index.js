/*-----------------------------------------------------------------------------
This template demonstrates how to use Waterfalls to collect input from a user using a sequence of steps.
For a complete walkthrough of creating this type of bot see the article at
https://docs.botframework.com/en-us/node/builder/chat/dialogs/#waterfall
-----------------------------------------------------------------------------*/
"use strict";
var builder = require("botbuilder");
var sleep = require("sleep");
var botbuilder_azure = require("botbuilder-azure");

var useEmulator = (process.env.NODE_ENV == 'development') || !process.env.NODE_ENV;
console.log(useEmulator);
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
    function (session, args, next) {
        if (!session.userData.nbPeople){
			session.beginDialog('/nbPeople');
		} else {
			next();
		}
    },
    function (session, args, next) {
        if (!session.userData.nbPeople){
			session.beginDialog('/nbPeople');
		} else {
			next();
		}
    },
    function (session, args, next) {
		if (!session.userData.code) {
			session.beginDialog('/code');
		} else {
			next();
		}
    },
    function (session, args, next) {
		if (!session.userData.cities) {
			session.beginDialog('/cities');
		} else {
			next();
		}
    },
    function (session, args, next) {
		if (!session.userData.end){
			session.beginDialog('/final');
		}
		else{
			session.send("C'était une bien belle aventure hein ! :)");

			session.userData.name = null;
			session.userData.nbPeople = null;
			session.userData.code = null;
			session.userData.cities = null;
			session.userData.end = null;
		}
    }
]);

bot.dialog('/name', [
	function (session) {
		var msg = new builder.Message(session)
            .attachments([{
                contentType: "image/jpeg",
                contentUrl: "https://manonmaya.azurewebsites.net/eduardo.jpg"
            }]);
		session.send(msg);
		var count = 0;
		do{
			session.sendTyping();
			sleep.sleep(1);
			count++;
		}while(count < 3);
		builder.Prompts.text(session, "Bonjour, je suis Eduardo, content de savoir que vous acceptez de m'aider à retrouver le trésor. Quel est ton prénom ?");
	},
    function (session, results) {
        var curName = results.response;
		curName = curName.replace(".", "").replace("!", "");
		var tName = curName.split(' ');
		curName = tName[tName.length - 1];
		session.userData.name = curName;
		session.send(session.userData.name + ", quel joli prénom !");
        session.endDialog();
    }
]);

bot.dialog('/nbPeople', [
	function (session) {
       builder.Prompts.number(session, "Alors, combien êtes-vous à m'aider ?"); 
	},
    function (session, results) {
        session.userData.nbPeople = results.response;
		session.send(session.userData.nbPeople + " ! Ca fait une bien belle équipe dis-moi !");
        session.endDialog();
    }
]);

bot.dialog('/code', [
	function (session) {
		session.send("Bien, pour commencer, vous allez devoir trouver les 3 numéros permettant de déchiffrer l'emplacement des villes.");
		session.send("Pour cela, je vous ai fait parvenir une lettre contenant une énigme Maya qui devrait vous permettre de trouver un code à 3 chiffres.");
        builder.Prompts.text(session, "Je vous laisse chercher et vous me direz le code quand vous l'aurez trouvé. A tout à l'heure");
	},
    function (session, results) {
		var curCode = results.response;
		if (curCode.indexOf("059") >= 0) {
			session.userData.code = "059";
			session.send("Parfait, c'est bien ce code !");
			session.endDialog();        
		} else{
			session.beginDialog('/code');		
		}
    }
]);

bot.dialog('/cities', [
	function (session) {
		session.send("Grâce à ce code, vous allez pouvoir m'aider à trouver le nom des quelques villes dans lesquelles nous devrions trouver le temple.");
		builder.Prompts.text(session, "Pouvez-vous me dire le nom des villes que vous aurez trouvé ?"); 
	},
    function (session, results) {
        session.userData.cities = results.response;
		//session.send(session.userData.nbPeople + " ! Ca fait une bien belle équipe dis-moi !");
        session.endDialog();
    }
]);

bot.dialog('/final', [
	function (session) {
		session.send("Oui !!! J'ai trouvé le trésor, c'est magnifique.");
		session.send("Je ne sais pas comment vous remercier...");
		builder.Prompts.text(session, "J'espère que cette chasse au trésor vous aura plus autant qu'à moi !"); 
	},
    function (session, results) {
		session.userData.end = true;
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
