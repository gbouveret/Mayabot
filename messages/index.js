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
			//session.beginDialog('/end');
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
    },
	function (session, args, next) {
		session.sendTyping();
		setTimeout(function(){
			session.send("C'était une bien belle aventure ! Partagez bien le chocolat en " + session.userData.nbPeople  + " parts équitables, hein !")
			session.sendTyping();
		}, 2000);
		setTimeout(function(){
			session.send("Allez, à une prochaine fois, et profitez-bien du trésor ;)");
		}, 4000);
		setTimeout(function(){
			session.beginDialog('/end');
		}, 5000);
	}
]);

bot.dialog('/end', [
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
        session.endDialog();
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
		session.sendTyping();
		setTimeout(function(){
			session.send("Bonjour, je suis Eduardo Rodriguez. Je suis  heureux de savoir que vous acceptez de m'aider à retrouver le trésor sacré des Mayas.");
			session.sendTyping();
		}, 1500);
		setTimeout(function(){
			builder.Prompts.text(session, "Mais avant de commencer, faisons d'abord connaissance. Quel est ton prénom ?");
		}, 4000);
	},
    function (session, results) {
        var curName = results.response;
		curName = curName.replace(".", "").replace("!", "").trim();
		var tName = curName.split(' ');
		curName = tName[tName.length - 1];
		session.userData.name = curName;
		session.sendTyping();
		setTimeout(function(){		
			session.send(session.userData.name + ", c'est un  joli prénom !");
    	    session.endDialog();
		}, 2000);
    }
]);

bot.dialog('/nbPeople', [
	function (session) {
		session.sendTyping();
		setTimeout(function() {
	       builder.Prompts.number(session, "Alors, dis-moi, combien êtes-vous à vouloir m'aider ?"); 
		}, 1500);
	},
    function (session, results) {
        session.userData.nbPeople = results.response;

		session.sendTyping();
		setTimeout(function() {		
			if (session.userData.nbPeople >= 5){
				session.send("Ca fait une bien belle équipe dis-moi !");
			}
			else{
				session.send("C'est déjà bien, ce qui compte c'est votre motivation !");
			}
        	session.endDialog();
		}, 1500);
    }
]);

bot.dialog('/code', [
	function (session) {
		if (session.userData.retryCode){
			builder.Prompts.text(session, "Ce n'est pas le bon code, réfléchissez encore un peu et faites moi une autre proposition.");
		} else {
			session.sendTyping();
			setTimeout(function() {
				session.send("Bien, pour commencer, vous allez devoir trouver les 3 chiffres permettant de décrypter le nom des villes Mayas qui nous intéressent.");
				session.sendTyping();
			}, 1500);
			setTimeout(function() {
				session.send("Pour cela, je vous ai fait parvenir une lettre contenant des indices.");
				session.sendTyping();
			}, 3000);
			setTimeout(function() {
				builder.Prompts.text(session, "Je vous laisse chercher et vous me donnerez ces 3 chiffres quand vous les aurez trouvé. A tout à l'heure");
			}, 4500);			
		}
	},
    function (session, results) {
		var curCode = results.response;
		if (curCode.indexOf("0") >= 0 && curCode.indexOf("5") >= 0 && curCode.indexOf("9") >= 0) {
			session.userData.code = "059";
			session.endDialog();        
		} else{
			session.userData.retryCode = true;
			session.beginDialog('/code');
		}
    }
]);

bot.dialog('/cities', [
	function (session) {
		session.sendTyping();
		setTimeout(function() {
			session.send("Super, avec ce code vous pouvez maintenant ouvrir l'enveloppe des sites Mayas. Coloriez les cases comportant un des chiffres du code pour découvrir le nom des villes qui nous intéressent.");					
			session.sendTyping();
		}, 1500);
		setTimeout(function() {
			session.send("Je vous ai fourni aussi une carte afin que vous puissiez vérifier vos découvertes.")
			session.sendTyping();
		}, 6500);
		setTimeout(function(){
			builder.Prompts.text(session, "Prévenez-moi quand vous aurez trouvé toutes les villes.");
		}, 9000); 
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
			session.sendTyping();
			setTimeout(function(){
				session.send("Nous nous rapprochons du but, mais cela fait encore trop de villes où chercher.");
				session.sendTyping();
			}, 2800);
			setTimeout(function(){
				session.send("Afin de trouver le bon site archéologique, je vous propose de fouiller dans le jardin pour trouver un indice qui nous guidera vers le bon endroit.");
				session.sendTyping();
			}, 5500);
			setTimeout(function(){
				//session.send("J'ai pu retrouver les initiales de la bonne ville dans un vieux parchemin décrivant la cérémonie funéraire : CI.");
				builder.Prompts.text(session, "Retrouvez-le et indiquez-moi le nom de la ville.");
			}, 11000);
		} 
	},
    function (session, results) {
		var city = results.response;
		city = city.replace("é", "e").replace("á", "").toLowerCase();
		if (city.indexOf("chichen itza") >= 0){
        	session.userData.city = "Chichén Itzá";
			session.sendTyping();
			setTimeout(function(){
				session.send("Oui ! " + session.userData.city + ", ça correspond à un des plus grands temples Mayas et à la région dans laquelle avait vécu Patte de Jaguar.");
	        	session.endDialog();
			}, 1800);
		}	
		else{
			session.userData.retryCity = true;
			session.beginDialog('/city');
		}
    }
]);

bot.dialog('/decrypt', [
	function (session) {
		session.sendTyping();
		setTimeout(function(){
			session.send("Nous ne sommes vraiment plus très loin ! Et ça tombe très bien, j'ai une de mes équipes déjà sur place qui travaille sur des retranscriptions des sculptures murales");
			session.sendTyping();
		}, 2000);
		setTimeout(function(){
			session.send("Je pense que nous devrions trouver une trappe ou un passage secret caché quelque part sur cette pyramide.");
			session.sendTyping();
		}, 9000);
		setTimeout(function(){
			session.send("Un vieux texte Maya parle de cela, je vous invite à le traduire et à essayer de comprendre ce qu'il veut dire. N'hésitez pas à vous aider de l'indice précédent.");
			session.sendTyping();
		}, 15000);
		setTimeout(function(){
			builder.Prompts.text(session, "Prévenez-moi quand vous aurez terminé la traduction, je vais en profiter pour contacter mes collègues.");
		}, 23000);
		//session.send("Le message ainsi obtenu devrait aider mes collègues archéologues dans leurs fouilles.");
		//session.send("Nous avons pu effectuer des fouilles, et j'ai trouvé un texte nécessitant d'être traduit depuis les caractères Mayas. Je vous envoie ça.");		
		//builder.Prompts.text(session, "Faites moi signe quand vous aurez fini de le traduire.");
	},
    function (session, results) {
        session.userData.decrypt = results.response;
        session.endDialog();
    }
]);

bot.dialog('/location', [
	function (session) {
		if (session.userData.retryLocation){
			session.sendTyping();
			setTimeout(function(){
				builder.Prompts.text(session, "Mmmh, non, cela ne semble pas correspondre, notre sonar n'a rien détecté derrière cette marche, auriez-vous une autre proposition ?");
			}, 2000);
		}
		else
		{
			session.sendTyping();
			setTimeout(function(){
				session.send("Très bien. Mes collègues sur place me disent que cela doit se cacher derrière l'une des marches d'un des nombreux escaliers.");
				session.sendTyping();
			}, 2000);
			setTimeout(function(){
				builder.Prompts.text(session, "Avez-vous une idée du numéro de la marche et de l'orientation de l'escalier où fouiller ?");
			}, 6000); 
			/*session.send("Bon, avec les informations sur la Pyramide de Kukulcán trouvées sur Wikipedia, vous devriez pouvoir devenir l'emplacement exact de la cachette de la sépulture.");		
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
			*/
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
		session.sendTyping();
		setTimeout(function(){
			session.send("YESSSSSSSS !!! On vient de m'informer qu'une des pierres a pivoté et laisse la place de se faufiler jusqu'à une petite pièce.");
			session.sendTyping();
		}, 3000);
		setTimeout(function(){
			session.send("Celle-ci contient le sarcophage de notre cher roi, et un trésor que nous avons pu ouvrir.");
			session.sendTyping();
		}, 7000);
		setTimeout(function(){
			session.send("Et ce trésor c'est... Du cacao ! Il est vrai que c'était une matière fort précieuse à leur époque, et souvent donnée en offrande aux dieux.")
			session.sendTyping();
		}, 10000);
		setTimeout(function(){
			session.send("Je ne sais pas comment vous remercier... Ou, plutôt, si ! Je vous envoie du chocolat pour fêter ça dignement, comme des rois et reines Mayas !");
			session.sendTyping();
		}, 16000);
		setTimeout(function(){
			builder.Prompts.text(session, "J'espère que cette chasse au trésor vous aura plu autant qu'à moi !"); 
		}, 23000);
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
