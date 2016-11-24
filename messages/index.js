/*-----------------------------------------------------------------------------
This template demonstrates how to use Waterfalls to collect input from a user using a sequence of steps.
For a complete walkthrough of creating this type of bot see the article at
https://docs.botframework.com/en-us/node/builder/chat/dialogs/#waterfall
-----------------------------------------------------------------------------*/
"use strict";
var builder = require("botbuilder");
var botbuilder_azure = require("botbuilder-azure");

var useEmulator = process.env['BotEnv'] != 'prod';// || !process.env.NODE_ENV;

console.log(useEmulator);

var connector = useEmulator ? new builder.ChatConnector() : new botbuilder_azure.BotServiceConnector({
    appId: process.env['MicrosoftAppId'],
    appPassword: process.env['MicrosoftAppPassword'],
    stateEndpoint: process.env['BotStateEndpoint'],
    openIdMetadata: process.env['BotOpenIdMetadata']
});

var bot = new builder.UniversalBot(connector, {
	autoBatchDelay: 500
});

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
		if (!session.userData.city) {
			session.beginDialog('/city');
		} else {
			next();
		}
    },
    function (session, args, next) {
		if (!session.userData.decrypt) {
			session.beginDialog('/decrypt');
		} else {
			next();
		}
    },
    function (session, args, next) {
		if (!session.userData.location) {
			session.beginDialog('/location');
		} else {
			next();
		}
    },
    function (session, args, next) {
		if (!session.userData.final){
			session.beginDialog('/final');
		}
		else{
			session.send("C'était une bien belle aventure hein ! :)");

			session.beginDialog('/deleteprofile');
		}
    }
]);

bot.dialog('/deleteprofile', [
	function(session){
		session.userData.name = null;
		session.userData.nbPeople = null;
		session.userData.code = null;
		session.userData.retryCode = null;
		session.userData.cities = null;
		session.userData.city = null;
		session.userData.retryCity = null;
		session.userData.decrypt = null;
		session.userData.location = null;
		session.userData.retryLocation = null;
		session.userData.final = null;
	}
]);

bot.dialog('/name', [
	function (session) {
		/*var msg = new builder.Message(session)
            .attachments([{
                contentType: "image/jpeg",
                contentUrl: "https://manonmaya.azurewebsites.net/eduardo.jpg"
            }]);
		session.send(msg);
		session.sendTyping();*/
		setTimeout(function() {
			builder.Prompts.text(session, "Bonjour, je suis Eduardo, content de savoir que vous acceptez de m'aider à retrouver le trésor. Quel est ton prénom ?");
		}, 1000);
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
		if (session.userData.retryCode){
			builder.Prompts.text(session, "Ce n'est pas le bon code, réfléchissez encore un peu et faites moi une autre proposition.");
		} else {
			session.send("Bien, pour commencer, vous allez devoir trouver les 3 numéros permettant de déchiffrer l'emplacement des villes.");
			session.send("Pour cela, je vous ai fait parvenir une lettre contenant une énigme Maya qui devrait vous permettre de trouver un code à 3 chiffres.");
			builder.Prompts.text(session, "Je vous laisse chercher et vous me direz le code quand vous l'aurez trouvé. A tout à l'heure");
		}
	},
    function (session, results) {
		var curCode = results.response;
		if (curCode.indexOf("0") >= 0 && curCode.indexOf("5") >= 0 && curCode.indexOf("9") >= 0) {
			session.userData.code = "059";
			session.send("Parfait, c'est bien ce code ! (y)");
			session.endDialog();        
		} else{
			session.userData.retryCode = true;
			session.beginDialog('/code');
		}
    }
]);

bot.dialog('/cities', [
	function (session) {
		session.send("Grâce à ce code, vous allez pouvoir m'aider à trouver le nom des quelques villes dans lesquelles nous devrions trouver le temple.");
		builder.Prompts.text(session, "Prévenez-moi quand vous aurez trouvé toutes les villes."); 
	},
    function (session, results) {
        session.userData.cities = results.response;
        session.endDialog();
    }
]);

bot.dialog('/city', [
	function (session) {
		if (session.userData.retryCity){
			builder.Prompts.text(session, "Je ne crois pas que ce soit la bonne ville. Une autre idée ?");
		} else {
			session.send("Bien, parmi ces différents sites Mayas, il n'y en a qu'un sur lesquels nous devons nous focaliser.");
			session.send("J'ai pu retrouver les initiales de la bonne ville dans un vieux parchemin décrivant la cérémonie funéraire : KI.");
			builder.Prompts.text(session, "Pouvez-vous me donner le nom complet parmi ceux que vous avez déchiffré ?");
		} 
	},
    function (session, results) {
		var city = results.response;
		city = city.replace("é", "e").replace("á", "").toLowerCase();
		if (city.indexOf("chichen itza") >= 0){
        	session.userData.city = "Chichén Itzá";
			session.send("Oui (rock) ! " + session.userData.city + ", ça correspond à un des plus grands temples Mayas et à la région dans laquelle avait vécu Patte de Jaguar.")
        	session.endDialog();
		}	
		else{
			session.userData.retryCity = true;
			session.beginDialog('/city');
		}
    }
]);

bot.dialog('/decrypt', [
	function (session) {
		session.send("Nous avons pu effectuer des fouilles, et j'ai trouvé un texte nécessitant d'être traduit depuis les caractères Mayas.");		
		session.send("Je vous envoie ça.");		
		builder.Prompts.text(session, "Faites moi signe quand vous aurez fini de le traduire."); 
	},
    function (session, results) {
        session.userData.decrypt = results.response;
        session.endDialog();
    }
]);

bot.dialog('/location', [
	function (session) {
		if (session.userData.retryLocation){
			builder.Prompts.text(session, "Cela ne semble pas correspondre, notre sonar n'a rien détecté derrière cette marche, auriez-vous une autre proposition ?");
		}
		else
		{
			session.send("Bon, avec les informations sur la Pyramide de Kukulcán trouvées sur Wikipedia, vous devriez pouvoir devenir l'emplacement exact de la cachette de la sépulture.");		
			var msg = new builder.Message(session)
            .textFormat(builder.TextFormat.xml)
            .attachments([
                new builder.HeroCard(session)
                    .title("Pyramide de Kukulcán")
                    .subtitle("Wikipedia")
                    .text("La pyramide de Kukulcán, également appelée El Castillo, est un monument précolombien, vieux de plus de mille ans [...]")
                    .images([
                        builder.CardImage.create(session, "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/El_Castillo_Stitch_2008_Edit_1.jpg/390px-El_Castillo_Stitch_2008_Edit_1.jpg")
                    ])
                    .tap(builder.CardAction.openUrl(session, "https://fr.wikipedia.org/wiki/Pyramide_de_Kukulc%C3%A1n"))
            ]);
			session.send(msg);
			builder.Prompts.text(session, "Du coup, à votre avis quel est l'escalier et le numéro de la marche sur lesquels je dois me focaliser ?");
		} 
	},
    function (session, results) {
		var location = results.response.toLowerCase();
		if (location.indexOf('nord') >= 0 && (location.indexOf('172') >= 0 || location.indexOf('173') >= 0)) {
	        session.userData.location = results.response;
	        session.endDialog();
		}
		else{
			session.userData.retryLocation = true;
			session.beginDialog('/location');		
		}
    }
]);

bot.dialog('/final', [
	function (session) {
		session.send("Oui (victory) !!! J'ai trouvé le trésor, c'est magnifique. (celebrate)");
		session.send("Je ne sais pas comment vous remercier...");
		builder.Prompts.text(session, "J'espère que cette chasse au trésor vous aura plu autant qu'à moi !"); 
	},
    function (session, results) {
		session.userData.final = true;
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
