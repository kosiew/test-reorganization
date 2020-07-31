// ==UserScript==
// @name         Zendesk Master Note
// @namespace    http://automattic.com/zendesk/
// @description  Create a summary "Master Note" including all comments found within a ticket.
// @match        https://*.zendesk.com/*
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @version      1.1.0
// @author       Rasmy Nguyen (@chickenn00dle)
// ==/UserScript==

/* globals jQuery */

/*
 * Parses a Zendesk ticket for any notes and creates a Summary note containing all
 * of the details from these notes. This will hopefully reduce time scanning through
 * longer tickets and reduce repeat information in notes.
 */
jQuery( function( $ ) {
    /*
     * Define a global counter to keep track of number of comments on a page.
     * This is necessary for cases where we stay on current ticket after submitting ticket/note.
     */
    let commentCount = 0

    /*
     * Searches for notes in the ticket and returns a list of comment objects containing
     * date and text.
     */
    function getComments() {
        let comments = []
        // Zendesk contains hidden panes when multiple tickets are open.
        // This ensures we only grab notes from the currently visible ticket.
        const visibleTab = $( '#main_panes > .workspace:visible .pane.right.section' );
        $( visibleTab ).find( '.event-container .audits .event' ).each( function() {
            // filters out any events that are public, created by the system, or crated by HappyBot
            if ( ! $( this ).hasClass( 'is-public') && ! $( this ).hasClass( 'system' ) && ! isHappyBot( this ) ) {
                let comment = {}
                comment.date = $( this ).find( 'time' ).text()
                comment.text = $( this ).find( '.comment' ).clone()
                comment.name = $( this ).find( '.name').clone();
                comment.user_photo = $( this ).find( '.user_photo' ).clone();
                comments.push( comment )
            }
        })
        return comments
    }

    /*
     * Creates the summary note.
     * To maintain styling consistency, replicates HTML structure of normal note.
     */
    function createNote( commentList, id ) {
        if ( commentList.length < 1 ) {
            return false // If there are no notes, return false
        }

        let note = document.createElement('div')
        let content = document.createElement('div')
        let body = document.createElement( 'div' )
        let view = document.createElement( 'div' )
        let commentDiv = document.createElement( 'div' )
        let zdCommentDiv = document.createElement( 'div' )
        let noteHeading = document.createElement( 'h3' )
        noteHeading.textContent = 'Master Note'
        note.classList.add( 'ember-view', 'event', 'regular', 'noodle-note' )

        // Assign ticket ID as element id.
        // This ensures we clear out the note only when not on the correct ticket
        note.setAttribute( 'id', 'noodle-note-' + id )

        content.classList.add( 'content' )
        body.classList.add( 'body' )
        view.classList.add( 'ember-view' )
        commentDiv.classList.add( 'comment' )
        commentDiv.style.backgroundColor = '#ffeaa6'
        zdCommentDiv.classList.add( 'zd-comment' )
        zdCommentDiv.style.marginBottom = '20px'
        note.appendChild( content )
        content.appendChild( body )
        body.appendChild( view )
        view.appendChild( commentDiv )
        commentDiv.appendChild( zdCommentDiv )
        zdCommentDiv.appendChild( noteHeading )

        for ( let comment of commentList ) {
            let date = document.createElement( 'p' )
            date.style.fontWeight = '600'
            date.style.margin = '20px 0 5px 0'
            date.textContent = '- ' + comment.date 
            zdCommentDiv.appendChild( date )
            comment.user_photo.css('position', 'unset')
            $( date ).append(comment.name)
            $( date ).append( comment.user_photo )
            $( zdCommentDiv ).append(' <br> ')
            $( comment.text ).children().each( function() {
                $( this ).find( 'p' ).css( { marginBottom: '5px' } )
                // Inject target=_blank and rel=noopener into any link tags within note
                if ( $( this ).find( 'a' ).length ) {
                    $( this ).find( 'a' ).attr( {
                        target: '_blank',
                        rel: 'noopener'
                    } )
                }
                zdCommentDiv.appendChild( this )
            })
        }
        return note
    }

    /*
     * Inserts a summary note before the top reply in a ticket, then clears global timer.
     * Does nothing if a summary note has already been added with the appropriate ID or if
     * there are no notes.
     */
    function insertNote( note, id, numComments ) {
        const workspace = $( '.ember-view.ticket.section' )
        // Adding a check for comment count change using global commentCount to detect new notes
        // when staying on a ticket after submitting.
        if ( ! $( workspace ).find( '#noodle-note-' + id ).length || numComments != commentCount ) {
            $( workspace ).find( '.noodle-note' ).remove()
            commentCount = numComments
            if ( note ) {
                workspace.find( '.event-container' ).before( note )
            }
        }
    }

    /*
     * Checks if the current element was generated by Happy Bot
     */
    function isHappyBot( element ) {
        const user = $( element ).find( '.name' ).text()
        return user.includes( 'Happy Bot' )
    }

    /*
     * Init function.
     * Gets comments, creates/inserts a summary note into DOM, and clears insertTimer.
     */
    function init() {
        // We need to run the script on all zd pages so script runs with multiple tabs.
        // This ensures it only does anything when in a ticket page.
        const ticketDetailPage = new RegExp( 'agent\/tickets\/[0-9]+$', 'gi' );
        const ticketId = location.pathname.split( '/' ).pop();

        if ( ticketDetailPage.test( location.pathname ) ) {
            let comments = getComments()
            const note = createNote( comments, ticketId )
            insertNote( note, ticketId, comments.length )
        }
    }

    setInterval( init, 500 );
})