define(['jquery'],function($){

	var scopes = {
		'Aloha.empty': [],
		'Aloha.global': ['Aloha.empty'],
		'Aloha.continuoustext': ['Aloha.global']
	};

	var activeScopes = [];
	var addedScopes = {};
	var scopeSetDuringSelectionChanged = false;

	function pushScopeAncestors(ancestorScopes, scope) {
		if ( ! scopes.hasOwnProperty(scope) ) {
			return;
		}
		var parentScopes = scopes[scope];
		for (var i = 0; i < parentScopes.length; i++) {
			var parentScope = parentScopes[i];
			ancestorScopes.push(parentScope);
			pushScopeAncestors(ancestorScopes, parentScope);
		}
	}

	Aloha.bind('aloha-selection-changed-before', function(){
		scopeSetDuringSelectionChanged = false;
	});

	Aloha.bind('aloha-selection-changed-after', function(event, range, originalEvent){
		// I don't know why we check for originalEvent != 'undefined', here is the original comment:
		// "Only set the specific scope if an event was provided, which means
		//  that somehow an editable was selected"
		if ( typeof originalEvent != 'undefined' && ! scopeSetDuringSelectionChanged ) {
			Scopes.setScope('Aloha.continuoustext', true);
		}
	});

	var Scopes = {

		addScope: function(scope) {
			var ancestorScopes = [];
			pushScopeAncestors(ancestorScopes, scope);
			addedScopes[scope] = ancestorScopes;
			Aloha.trigger('aloha-ui-scope-change');
		},

		removeScope: function(scope) {
			delete addedScopes[scope];
			Aloha.trigger('aloha-ui-scope-change');
		},

		isActiveScope: function(scope){
			var isActive = (-1 !== jQuery.inArray(scope, activeScopes));
			if (isActive) {
				return true;
			}
			for (var addedScope in addedScopes) {
				if (addedScopes.hasOwnProperty(addedScope)) {
					if (scope == addedScope) {
						return true;
					}
					var addedScopeAncestors = addedScopes[addedScope];
					if (-1 != jQuery.inArray(scope, addedScopeAncestors)) {
						return true;
					}
				}
			}
			return false;
		},

		/**
		 * TODO this should probably not be here and be called something else.
		 *
		 * @param name
		 *        The name of a component that exists in the tab that should be activated.
		 */
		activateTabOfButton: function(name){
			// Tabs listen to focus events on components and show themselves if appropriate.
			Aloha.trigger('aloha-ui-component-focus', name);
		},

		/**
		 * @deprecated
		 *     Problem with setScope is that scopes defined by multiple plugins are exclusive to one another.
		 *     Example: table plugin and link plugin - you want to be able to set both table and link scopes.
		 *     Use addScope and removeScope instead.
		 */
		setScope: function(scope, noActivateTab) {
			scopeSetDuringSelectionChanged = true;
			if (activeScopes[0] != scope) {
				activeScopes = [scope];
				pushScopeAncestors(activeScopes, scope);
				Aloha.trigger('aloha-ui-scope-change');
				if ( ! noActivateTab ) {
					Aloha.trigger('aloha-ui-tab-activate-for-scope', scope);
				}
			}
		},

		/**
		 * @deprecated
		 *     This method was used to define an ancestry for scopes.
		 *     The purpose for this is unknown, and the method is therefore deprecated.
		 */
		createScope: function(scope, parentScopes){
			if ( ! parentScopes ) {
				parentScopes = ['Aloha.empty'];
			} else if (typeof parentScopes === 'string') {
				parentScopes = [parentScopes];
			}
			scopes[scope] = parentScopes;
		},

		unhideTab: function(){
			//TODO I don't know what this method is supposed to do
		},
		hideTab: function(tabName){
			//TODO I don't know what this method is supposed to do
		}
	};
	return Scopes;
});