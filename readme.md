# Creative Structures Configurator

This is a Wordpress plugin for Creative Structures, which shows a configurator from TWIKIT. 

### Installation
```shell
wp-env start
npm install
npx mix watch
```

#### Reset password
To reset the password for the admin user, you can run the following command:
```shell
wp-env run cli wp user reset-password admin --show-password
```