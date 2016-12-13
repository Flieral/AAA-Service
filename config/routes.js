exports.default = {
	routes: function(api) {
		return {
			get:[
				{path: '/account/login'											, action: 'login'},
				{path: '/:apiVersion/Service/Status'				, action: 'Status'}
			],
			put:[
				{path: '/account/changePassword'						, action: 'changePassword'}
			],
			post:[
				{path: '/account/register'									, action: 'register'},
				{path: '/account/confirm/:accountHashID'		, action: 'confirm'},
				{path: '/account/verificate/:accountHashID'	, action: 'verificate'}
			],
			delete:[

			]
		}
	}
}
