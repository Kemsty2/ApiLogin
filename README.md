## Présentation 

  IntranetAuth est une API, basée sur NodeJs + Express. Son rôle est d'authentifier les differents utilisateurs d'un ensemble de plateforme. 

## Installation

- Pour pouvoir utiliser l'api, certains prerequis sont neccessaires.

* ###### **Prérequis**
	* **NodeJs 10+ And Npm 6+**
  * **MySql / Postgres / MSSql** pour la base de données  
* ###### **Procédure D'installation**  
```bash
$ git clone https://github.com/Kemsty2/ApiLogin.git
$ cd ApiLogin/
$ npm install
```
- Ensuite, il faut configurer les variables d'environnement. Pour cela se servir des fichiers: 
```bash
$ nano .env.dev // Pour configurer les variables d'environnement de developpement
```
ou
```bash
$ nano .env.prod // Pour configurer les variables d'environnement de production
``` 
- Ensuite, crée le fichier ``.env`` à utiliser : 
```bash
$ cp .env.prod .env // pour utiliser les V.E de production 
				ou
$ cp .env.env .env // pour utiliser les V.E de developpement
```

- Lancer le serveur Nodejs : 
```bash
$ npm run start-dev // Pour lancer le serveur de developpement
```
```bash
$ npm run start-prod // Pour lancer le serveur de production
```

