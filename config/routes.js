exports.default =
{
	routes: function(api)
	{
		return {
			get:			[
				/* 	STATUS 	*/
				{path: '/:apiVersion/Service/Status'				, action: 'Status'}
			]
		};
	}
};
