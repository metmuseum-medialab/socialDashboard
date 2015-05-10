/*
code secrets. copy to secrets.js, modify values, but don't commit.
*/
function secrets(){

	var secrets = { 
		db_name : "",
		port: ,
		prod_port : ,
		twitter :{
		  consumer_key: '',
		  consumer_secret: '',
		  access_token_key: '',
		  access_token_secret: ''

		},
		instagram : {
			client_id: '',
			client_secret: '',
		}


	};

	return secrets;

}

module.exports.secrets = secrets;