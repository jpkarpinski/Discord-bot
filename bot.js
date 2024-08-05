const { Client, GatewayIntentBits, PermissionsBitField } = require('discord.js'); 
const axios = require('axios');
const config = require("./config.json"); // Arquivo de configuração contendo o token do bot
const fs = require('fs');
const express = require('express')
const app = express()

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates
    ]
});

// Função para obter o status do servidor
async function getServerStatus() {
    const apiKey = config.riotApiKey;
    const region = 'br1'; // Região do servidor (por exemplo, 'na1', 'euw1', 'br1')
    const url = `https://${region}.api.riotgames.com/lol/status/v4/platform-data?api_key=${apiKey}`;

    try {
        const response = await axios.get(url);
        console.log(response.data); // Log para ver a estrutura dos dados
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function getSummonerData(summonerName, tagline) {
    try {
        // URL para obter o PUUID através do summonerName e tagline
        const accountUrl = `https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${summonerName}/${tagline}?api_key=${config.riotApiKey}`;
        const accountResponse = await axios.get(accountUrl);
        const puuid = accountResponse.data.puuid;

        // URL para obter o summonerId através do PUUID
        const summonerUrl = `https://br1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}?api_key=${config.riotApiKey}`;
        const summonerResponse = await axios.get(summonerUrl);
        const summonerId = summonerResponse.data.id;

        // URL para obter as informações das filas ranqueadas do jogador utilizando o summonerId
        const leagueUrl = `https://br1.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerId}?api_key=${config.riotApiKey}`;
        const leagueResponse = await axios.get(leagueUrl);
        return leagueResponse.data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

// Lista de campeões por posição
const posicoes = {
    top: [
    'Aatrox', 'Akali', 'Alistar',
    'Camille', 'Cho\'Gath', 'Darius', 'Dr. Mundo',
    'Fiora', 'Fizz',
    'Galio', 'Gangplank', 'Garen', 'Gnar', 'Gragas', 'Graves', 'Hecarim', 'Heimerdinger',
    'Illaoi', 'Irelia', 'Janna', 'Jax', 'Jayce',
    'Karma', 'Kayle',
    'Kennen', 'Kled',
    'Lulu', 'Malphite', 'Maokai',
    'Mordekaiser', 'Nasus', 'Nautilus',
    'Olaf', 'Ornn', 'Pantheon',
    'Poppy', 'Quinn', 'Rek\'Sai', 'Renekton',
    'Rengar', 'Riven', 'Rumble', 'Ryze', 'Sejuani', 'Sett',
    'Shaco', 'Shen', 'Shyvana', 'Singed', 'Sion', 'Skarner',
    'Swain', 'Sylas', 'Tahm Kench', 'Taric', 'Teemo',
    'Trundle', 'Tryndamere', 'Twisted Fate', 'Udyr',
    'Urgot', 'Varus', 'Vayne', 'Viego', 'Vladimir',
    'Volibear', 'Warwick', 'Wukong', 'Xin Zhao', 'Yasuo', 'Yone', 'Yorick',
    'Zac', 'Zeri', 'Gwen',
    'K\'sante'],
    
    jungle: [
    'Amumu', 'Brand', 'Cho\'Gath', 'Diana', 'Dr. Mundo',
    'Ekko', 'Elise', 'Evelynn', 'Fiddlesticks', 
    'Gragas', 'Graves', 'Hecarim', 'Ivern', 'Jarvan IV', 'Jax', 'Karthus', 'Kayn',
    'Kha\'Zix', 'Kindred', 'Kled', 'Lee Sin',
    'Lillia', 'Maokai',
    'Master Yi', 'Mordekaiser', 'Morgana', 'Nasus', 'Nautilus',
    'Neeko', 'Nidalee', 'Nocturne', 'Nunu & Willump', 'Olaf',
    'Poppy', 'Qiyana', 'Rammus', 'Rek\'Sai', 'Rell', 
    'Rengar', 'Rumble', 'Sejuani', 
    'Shaco', 'Shyvana', 'Skarner', 'Sylas', 'Taliyah', 'Talon', 'Trundle', 'Twitch', 'Udyr',
    'Vi', 'Viego', 
    'Volibear', 'Warwick', 'Wukong', 'Xin Zhao', 'Yorick',
    'Zac', 'Zed', 'Zyra', 'Gwen', 'Bel\'Veth', 'Briar'
    ],

    mid: [
        'Ahri', 'Akali', 'Anivia', 'Annie', 'Aurelion Sol', 'Azir', 'Cassiopeia', 'Cho\'Gath', 'Corki', 'Diana',
    'Ekko', 'Ezreal', 'Fizz',
    'Galio', 'Gragas', 'Heimerdinger',
    'Irelia', 'Jayce',
    'Kai\'Sa', 'Karma', 'Karthus', 'Kassadin', 'Katarina', 'Kayle', 'Kog\'Maw', 'LeBlanc', 'Lee Sin', 
    'Lissandra', 'Lucian', 'Lux', 'Malphite', 'Malzahar',
    'Morgana', 'Nasus',
    'Neeko', 'Orianna', 'Pantheon',
    'Pyke', 'Qiyana', 'Renekton',
    'Rumble', 'Ryze', 'Seraphine', 'Singed', 'Sion',
    'Swain', 'Sylas', 'Syndra', 'Taliyah', 'Talon', 'Tristana', 'Tryndamere', 'Twisted Fate', 'Twitch', 
    'Varus', 'Veigar', 'Vel\'Koz', 'Viktor', 'Vladimir',
    'Xerath', 'Yasuo', 'Yone', 'Zac', 'Zed', 'Ziggs', 'Zilean', 'Zoe', 'Zyra', 'Akshan', 'Vex',
    'K\'sante', 'Naafiri', 'Hwei', 'Smolder'
    ],

    adc:[
        'Aphelios',
    'Ashe', 'Caitlyn',
    'Corki', 
    'Draven', 'Ezreal', 'Jhin', 'Jinx',
    'Kai\'Sa', 'Kalista', 'Karthus',
    'Kog\'Maw', 'Lucian', 
    'Miss Fortune', 'Samira', 'Senna', 'Seraphine', 'Sivir',
    'Swain', 'Teemo',
    'Tristana', 'Twisted Fate', 'Twitch', 'Varus', 'Vayne', 'Veigar', 'Xayah', 'Yasuo', 'Zeri', 'Ziggs',
    'Nilah', 'Smolder'
    ],

    sup: [
        'Alistar', 'Amumu', 
    'Ashe', 'Bard', 'Blitzcrank', 'Brand', 'Braum', 
    'Galio', 'Heimerdinger',
    'Janna', 'Karma', 'Leona',
    'Lulu', 'Lux', 'Maokai',
    'Morgana', 'Nami', 'Nautilus',
    'Neeko', 'Pantheon',
    'Poppy', 'Pyke', 'Rakan', 'Rell', 'Senna', 'Seraphine', 'Sett',
    'Shaco', 'Shen', 'Sona', 'Soraka',
    'Swain', 'Tahm Kench', 'Taric', 'Teemo',
    'Thresh', 'Veigar', 'Vel\'Koz', 'Xerath', 
    'Yuumi', 'Zilean', 'Zoe', 'Zyra', 
    'Renata Glasc', 'Milio'
    ]
}

// Função para sortear um campeão aleatório de uma lista
function sortearCampeao(lista) {
    return lista[Math.floor(Math.random() * lista.length)];
}

// Função para embaralhar a lista de jogadores
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Função para sortear duas equipes
function sortearEquipes(jogadores) {
    const jogadoresEmbaralhados = shuffle(jogadores);
    const equipe1 = jogadoresEmbaralhados.slice(0, Math.ceil(jogadoresEmbaralhados.length / 2));
    const equipe2 = jogadoresEmbaralhados.slice(Math.ceil(jogadoresEmbaralhados.length / 2));
    return { equipe1, equipe2 };
} 

client.on("ready", () => {
    console.log(`Bot foi iniciado como ${client.user.tag}, com ${client.users.cache.size} usuários, em ${client.channels.cache.size} canais, em ${client.guilds.cache.size} servidores.`);
    client.user.setActivity(`Eu estou em ${client.guilds.cache.size} servidores`);
});

client.on("guildCreate", guild => {
    console.log(`O bot entrou no servidor: ${guild.name} (id: ${guild.id}). População: ${guild.memberCount} membros!`);
    client.user.setActivity(`Estou em ${client.guilds.cache.size} servidores`);
});

client.on("guildDelete", guild => {
    console.log(`O bot foi removido do servidor: ${guild.name} (id: ${guild.id})`);
    client.user.setActivity(`Serving ${client.guilds.cache.size} servers`);
});

client.on("messageCreate", async message => {
    if (message.author.bot) return;
    if (message.channel.type === "dm") return;
    if (!message.content.startsWith(config.prefix)) return;

    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

// *!COMANDOS*

if (command === "ping") {
    const m = await message.channel.send("Ping?");
    m.edit(`Plim Plom! A latência é ${m.createdTimestamp - message.createdTimestamp}ms.`);
}

// Comando para sortear uma composição no League Of Legends
if (command === "sortearcomp") {
    const composicao = {
        top: sortearCampeao(posicoes.top),
        jungle: sortearCampeao(posicoes.jungle),
        mid: sortearCampeao(posicoes.mid),
        adc: sortearCampeao(posicoes.adc),
        sup: sortearCampeao(posicoes.sup)
    };

    message.channel.send(`Composição Sorteada:`);
    message.channel.send(`**Top:** ${composicao.top}`);
    message.channel.send(`**Jungle:** ${composicao.jungle}`);
    message.channel.send(`**Mid:** ${composicao.mid}`);
    message.channel.send(`**ADC:** ${composicao.adc}`);
    message.channel.send(`**Support:** ${composicao.sup}`);
}

// Comando para sortear em duas equipes os usuários conectados no canal de voz do servidor Discord
if (command === "sortear") {
    if (message.member.voice.channel) {
        const channel = message.member.voice.channel;
        const members = Array.from(channel.members.values()).map(member => member.user.username);

        if (members.length < 2) {
            message.channel.send('Precisa de pelo menos 2 jogadores no canal de voz para sortear equipes.');
            return;
        }

        const { equipe1, equipe2 } = sortearEquipes(members);

        message.channel.send(`Equipe 1: ${equipe1.join(', ')}`);
        message.channel.send(`Equipe 2: ${equipe2.join(', ')}`);
    } else {
        message.channel.send('Você precisa estar em um canal de voz para sortear equipes.');
    }
}

// Comando para checar os status do servidor br de League of Legends
if (command === "statuslol") {
    const status = await getServerStatus();

    if (status) {
        const { name, maintenances, incidents } = status;
        let statusMessage = `Status do servidor **${name}**:\n`;

        if (maintenances.length > 0) {
            statusMessage += `\n**Manutenções em andamento:**\n`;
            maintenances.forEach(maintenance => {
                console.log('Maintenance:', maintenance); // Log para ver a estrutura de cada manutenção
                const title = maintenance.titles.find(title => title.locale === 'pt_BR');
                const update = maintenance.updates.find(update => update.translations.find(translation => translation.locale === 'pt_BR'));
                statusMessage += `- ${title ? title.content : 'Sem título disponível'}: ${update ? update.translations.find(translation => translation.locale === 'pt_BR').content : 'Sem detalhes disponíveis'}\n`;
            });
        } else {
            statusMessage += `Nenhuma manutenção em andamento.\n`;
        }

        if (incidents.length > 0) {
            statusMessage += `\n**Incidentes em andamento:**\n`;
            incidents.forEach(incident => {
                console.log('Incident:', incident); // Log para ver a estrutura de cada incidente
                const title = incident.titles.find(title => title.locale === 'pt_BR');
                const update = incident.updates.find(update => update.translations.find(translation => translation.locale === 'pt_BR'));
                statusMessage += `- ${title ? title.content : 'Sem título disponível'}: ${update ? update.translations.find(translation => translation.locale === 'pt_BR').content : 'Sem detalhes disponíveis'}\n`;
            });
        } else {
            statusMessage += `Nenhum incidente em andamento.\n`;
        }

        message.channel.send(statusMessage);
    } else {
        message.channel.send('Não foi possível obter o status do servidor. Tente novamente mais tarde.');
    }
}

// Comando para limpar o chat
if (command === "clear") {
    // Verifica se o usuário tem permissão para gerenciar mensagens
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
        return message.reply("Você não tem permissão para usar este .");
    }

    // Número de mensagens a serem excluídas, padrão para 100
    const deleteCount = parseInt(args[0], 10) || 100;

    // Verifica se o número fornecido é válido
    if (isNaN(deleteCount) || deleteCount < 1 || deleteCount > 100) {
        return message.reply("Por favor, forneça um número de 1 a 100 para excluir as mensagens.");
    }

    // Limpa as mensagens do canal
    try {
        const fetched = await message.channel.messages.fetch({ limit: deleteCount });
        await message.channel.bulkDelete(fetched);
        message.channel.send(`${fetched.size} mensagens foram deletadas.`).then(msg => {
            setTimeout(() => msg.delete(), 5000);
        });
    } catch (error) {
        console.error(error);
        message.reply("Houve um erro ao tentar deletar mensagens no canal.");
    }
}

    // Comando para mostrar todos os comandos disponíveis
    if (command === "help") {
        const helpMessage = `
Comandos disponíveis:
- \`${config.prefix}ping\`: Mostra o ping do bot.
- \`${config.prefix}statuslol\`: Mostra o status do servidor do League of Legends BR.
- \`${config.prefix}elosolo <nome_do_invocador> <tagsem#>\`: Mostra o elo do invocador na fila solo/duo.
- \`${config.prefix}eloflex <nome_do_invocador> <tagsem#>\`: Mostra o elo do invocador na fila flexível.
- \`${config.prefix}clear <número>\`: Limpa o chat com o número especificado de mensagens (até 100).
- \`${config.prefix}help\`: Mostra esta mensagem de ajuda.
- \`${config.prefix}sortear\`: Sorteia os jogadores que estiverem em um canal de voz em duas equipes.
- \`${config.prefix}comptroll\`: Gera uma comp troll.
        `;
        message.channel.send(helpMessage);
    }

    // Comando para mostrar os dados ranqueados do jogador
    if (command === "elosolo" || command === "eloflex") {
        const summonerName = args[0];
        const tagline = args[1];

        if (!summonerName || !tagline) {
            message.channel.send('Por favor, forneça o nome do invocador e a tagline.');
            return;
        }

        const leagueEntries = await getSummonerData(summonerName, tagline);

        if (!leagueEntries) {
            message.channel.send('Não foi possível obter os dados do invocador. Tente novamente mais tarde.');
            return;
        }

        let rankedInfo = '';
        if (command === "elosolo") {
            const soloQueue = leagueEntries.find(entry => entry.queueType === 'RANKED_SOLO_5x5');
            if (soloQueue) {
                const totalGames = soloQueue.wins + soloQueue.losses;
                const winRate = ((soloQueue.wins / totalGames) * 100).toFixed(2);
                rankedInfo = `
**Ranqueada Solo/Duo**
\`\`\`
Tier: ${soloQueue.tier} ${soloQueue.rank}
Pontos de Liga: ${soloQueue.leaguePoints}
Vitórias: ${soloQueue.wins}
Derrotas: ${soloQueue.losses}
Total de Partidas: ${totalGames}
Winrate: ${winRate}%
\`\`\`
                `;
            } else {
                rankedInfo = 'O invocador não possui dados ranqueados na Ranqueada Solo/Duo.';
            }
        } else if (command === "eloflex") {
            const flexQueue = leagueEntries.find(entry => entry.queueType === 'RANKED_FLEX_SR');
            if (flexQueue) {
                const totalGames = flexQueue.wins + flexQueue.losses;
                const winRate = ((flexQueue.wins / totalGames) * 100).toFixed(2);
                rankedInfo = `
**Ranqueada Flexível**
\`\`\`
Tier: ${flexQueue.tier} ${flexQueue.rank}
Pontos de Liga: ${flexQueue.leaguePoints}
Vitórias: ${flexQueue.wins}
Derrotas: ${flexQueue.losses}
Total de Partidas: ${totalGames}
Winrate: ${winRate}%
\`\`\`
                `;
            } else {
                rankedInfo = 'O invocador não possui dados ranqueados na Ranqueada Flexível.';
            }
        }

        message.channel.send(rankedInfo);
    }
});

client.login(config.token);

// Para subir na Render
app.get('/', function (req, res) {
    res.send('Hello World')
})

app.listen(3000)