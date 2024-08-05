# Discord-bot
Bot para Discord desenvolvido em JavaScript, com várias funcionalidades úteis para ajudar os usuários, especialmente aqueles que jogam League of Legends.
Principais funcionalidades:

*Configuração Inicial e Conexão:

O bot utiliza a biblioteca discord.js para se conectar e interagir com o Discord.
Configura as intenções do Gateway do Discord para permitir a leitura de mensagens, estados de voz, etc.
Utiliza o axios para fazer requisições HTTP e o express para rodar um servidor web simples.

*Funções Principais:

getServerStatus: Obtém o status do servidor de League of Legends na região especificada.
getSummonerData: Busca dados de um invocador específico no League of Legends, incluindo seu PUUID e informações ranqueadas.

*Listas de Campeões por Posição:

Define listas de campeões para as posições de topo, selva, meio, atirador e suporte.

*Funções de Utilidade:

sortearCampeao: Sorteia um campeão aleatório de uma lista.
shuffle: Embaralha uma lista de jogadores.
sortearEquipes: Sorteia jogadores em duas equipes balanceadas.

*Eventos do Discord:

ready: Quando o bot está pronto, ele loga informações sobre sua conexão.
guildCreate e guildDelete: Loga quando o bot entra ou sai de um servidor.

*Comandos do Bot:

ping: Responde com o tempo de latência do bot.
sortearcomp: Sorteia uma composição de campeões para uma partida de League of Legends.
sortear: Sorteia jogadores conectados no canal de voz em duas equipes.
statuslol: Checa e mostra o status do servidor de League of Legends.
clear: Limpa mensagens no canal de texto (requer permissão de gerenciamento de mensagens).
help: Mostra a lista de comandos disponíveis.
elosolo e eloflex: Mostra o elo e dados ranqueados de um invocador na fila solo/duo ou flexível.
