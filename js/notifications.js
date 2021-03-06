// Make sure the bpReshare object exists.
window.bpReshare = window.bpReshare || {};

( function( bpReshare, document ) {

	// Bail if not set
	if ( 'undefined' === typeof bpReshare.userNotifications ) {
		return;
	}

	/**
	 * Notifications Class.
	 *
	 * @type {Object}
	 */
	bpReshare.Notifications = {
		/**
		 * Parse the My Account Bubble to eventually add new entries for unread reshares.
		 *
		 * @return {Void}
		 */
		start: function() {
			if ( bpReshare.userNotifications.items && 0 < bpReshare.userNotifications.items.length ) {
				this.dN     = document.getElementById( 'wp-admin-bar-no-notifications' );
				this.bubble = document.getElementById( 'ab-pending-notifications' );
				this.items  = bpReshare.userNotifications.items;
				this.amount = bpReshare.userNotifications.items.length;

				this.bubble.setAttribute( 'class', 'pending-count alert' );
				this.bubble.innerHTML = parseInt( this.bubble.innerHTML, 10 ) + this.amount;

				if ( ! this.dN ) {
					var list = document.querySelector( '#wp-admin-bar-bp-notifications-default' );

					for ( var child in list.childNodes ) {
						if ( 'LI' === list.childNodes[ child ].nodeName && ! this.dN ) {
							this.dN = list.childNodes[ child ].cloneNode( true );
						}
					}

					list.appendChild( this.dN );
				} else {
					this.restoreDN = this.dN.cloneNode( true );
				}

				if ( this.dN.nodeName ) {
					this.dN.setAttribute( 'id', 'wp-admin-bar-notification-reshares' );
					var dNlink = this.dN.firstChild;

					dNlink.setAttribute( 'href', '#' );
					dNlink.innerHTML = bpReshare.userNotifications.template.one;

					if ( 1 < this.amount ) {
						dNlink.innerHTML = bpReshare.userNotifications.template.more;
						dNlink.setAttribute( 'href', bpReshare.userNotifications.link.more );
					} else {
						var items = this.items;

						dNlink.setAttribute( 'href', bpReshare.userNotifications.link.one.replace( '%n', items.shift() ) );
					}

					var userReshared = document.querySelector( '#wp-admin-bar-my-account-activity-reshare' ).firstChild;

					userReshared.innerHTML += '&nbsp';

					this.itemBubble = document.createElement( 'SPAN' );
					this.itemBubble.setAttribute( 'class', 'count' );
					this.itemBubble.innerHTML = this.amount;

					userReshared.appendChild( this.itemBubble );
				}
			}

			var bodyClasses = document.getElementsByTagName( 'body' )[0].getAttribute( 'class' ).split( ' ' );

			if ( -1 !== bodyClasses.indexOf( 'my-activity' ) && -1 !== bodyClasses.indexOf( 'reshare' ) ) {
				this.highLightReshares();
			}

			var activityPermalink = bodyClasses.indexOf( 'activity-permalink' );
			this.activityID = bodyClasses[ activityPermalink + 1 ] || 0;

			if ( null !== document.querySelector( '#activity-' + this.activityID ) ) {
				this.updateBubbles( 1 );
			}
		},

		/**
		 * Adds a border to new reshares to make sure the current user will find them.
		 *
		 * @return {Void}
		 */
		highLightReshares: function() {
			if ( ! this.amount || ! this.items ) {
				return;
			}

			this.items.forEach( function( item ) {
				var activity = document.querySelector( '#activity-' + item );

				activity.setAttribute( 'style', 'border-left: 4px solid #21759b; padding-left: 1em' );
				window.setTimeout( function() {
					activity.removeAttribute( 'style' );
				}, 4000 );
			} );

			this.updateBubbles( this.amount );
		},

		/**
		 * Decrement the number of unread notifications into the My Account Bubble
		 *
		 * @param  {Integer} number The number of read notifications.
		 * @return {Void}
		 */
		updateBubbles: function( number ) {
			if ( ! this.amount ) {
				return;
			}

			this.bubble.innerHTML = parseInt( this.bubble.innerHTML, 10 ) - number;

			if ( 0 === parseInt( this.bubble.innerHTML, 10 ) ) {
				this.bubble.setAttribute( 'class', 'count no-alert' );
			}

			if ( this.amount === number ) {
				if ( this.restoreDN ) {
					document.querySelector( '#wp-admin-bar-bp-notifications-default' ).appendChild( this.restoreDN );
				}

				this.dN.remove();
				this.itemBubble.remove();
			} else {
				this.itemBubble.innerHTML = parseInt( this.itemBubble.innerHTML, 10 ) - number;

				if ( 1 === this.amount - number && this.activityID ) {
					var dNlink = this.dN.firstChild, self = this, remainingItems = this.items.filter( function( a ) {
							if ( parseInt( a, 10 ) !== parseInt( self.activityID, 10 ) ) {
								return a;
							}
						} );

					dNlink.setAttribute( 'href', bpReshare.userNotifications.link.one.replace( '%n', remainingItems.shift() ) );
					dNlink.innerHTML = bpReshare.userNotifications.template.one;
				}
			}
		}
	};

	/**
	 * Waits for the window to be loaded before starting notifications
	 *
	 * @return {Void}
	 */
	window.addEventListener( 'load', function() {
		var loaded = false;

		if ( loaded ) {
			return;
		}

		bpReshare.Notifications.start();
		loaded = true;
	} );

} )( window.bpReshare, window.document );
