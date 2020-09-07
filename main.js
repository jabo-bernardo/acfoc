/**
 * ACFOC is a JavaScript library for cheating protection
 * on online classes. This library will record how the user
 * interact with the website such as inactivity, copying, 
 * pasting, and tab changing.
 * 
 * REPOSITORY: https://github.com/jabo-bernardo/acfoc.git
 * BUGS: https://github.com/jabo-bernardo/acfoc/issues
 * 
 * @author jabo-bernardo <joelvincent.work@gmail.com>
 */

class ACFOC {

	DEFAULT_TIMEOUT = 30000;
	DEFAULT_SCORE = 0.1;
	VERSION = 'acfoc-0.1.0'

	/**
	 * Create a new instance of ACFOC
	 * 
	 * @param {object} opt 
	 * @property {number} idleTimeout?			- Allowed time for idling. Defaults to ACFOC.DEFAULT_TIMEOUT
	 * @property {object} scores? 				- Customized penalty scoring.
	 * @property {boolean} allowCopy?			- Whether to allow copying (aka ctrl+c) or not. Defaults to false
	 * @property {boolean} allowPaste?			- Whether to allow pasting (aka ctrl+v) or not. Defaults to false
	 * @property {boolean} allowIdle?			- Whether to allow idling or not. Defaults to false
	 */
	constructor(opt) {
		let {
			idleTimeout,
			scores,
			allowCopy,
			allowPaste,
			allowIdle
		} = opt;

		/**
		 * Validations
		 */
		if(!idleTimeout) idleTimeout = this.DEFAULT_TIMEOUT;

		/**
		 * List of penalties
		 */
		this.penalties = [];

		/**
		 * 
		 * (Optional) Score Customization
		 */
		this._scores = scores;

		/**
		 * Idle Watcher
		 */
		this._idleWatcher = null;
		this._idleTimeout = idleTimeout;
		

		/**
		 * Configurations
		 */
		this._allowCopy = allowCopy;
		this._allowPaste = allowPaste;
		this._allowIdle = allowIdle;
	}

	/**
	 * [REQUIRED] Initializes ACFOC.
	 * 
	 * @returns {ACFOC}
	 */
	initialize = () => {
		console.log(`%c This page is protected by ACFOC (Anti-Cheating For Online Classes)`, 'color: orange; font-size: 1rem; font-weight: bold; text-shadow: 1px 1px 0px black, 2px 2px 0px white')

		// Idling
		if(!this._allowIdle) {
			this._addEventPenalty('load', this._resetIdle)
				._addEventPenalty('mousemove', this._resetIdle)
				._addEventPenalty('mousedown', this._resetIdle)
				._addEventPenalty('touchstart', this._resetIdle)
				._addEventPenalty('click', this._resetIdle)
				._addEventPenalty('keydown', this._resetIdle);
		}

		// Copying
		if(!this._allowCopy) {
			this._addEventPenalty('copy', e => {
				this.addPenalty('COPY', this.getScoreFor('copy'));
				e.preventDefault();
			});
		}

		// Pasting
		if(!this._allowPaste) {
			this._addEventPenalty('paste', e => {
				this.addPenalty('PASTE', this.getScoreFor('paste'));
				e.preventDefault();
			});
		}

		// Tab Changing/ Opening Dev Tools
		this._addEventPenalty('blur', e => {
			this.addPenalty('CHANGE_FOCUS', this.getScoreFor('changeFocus'));
		});

		return this;
	}

	/**
	 * 
	 * Adds penalty to the user
	 * 
	 * @param {string} reason 		- Penalty reason
	 * @param {number} score 		- Penalty Score. Defaults to ACFOC.DEFAULT_SCORE
	 * 
	 * @private
	 */
	addPenalty = (reason, score = this.DEFAULT_SCORE) => {	
		this.penalties = [...this.penalties, {
			reason,
			score: score || this.DEFAULT_score
		}];
		return this;
	}

	/**	
	 * @param {string} event  	- Events such as 'PASTE', 'COPY', 'CHANGE_FOCUS'
	 * 
	 * @private
	 */
	getScoreFor = event => {
		return this._scores[event]
	}

	/**
	 * Resets the idle timer
	 * 
	 * @private
	 */
	_resetIdle = () => {
		clearTimeout(this._idleWatcher);
		this._idleWatcher = setTimeout(() => this.addPenalty('IDLE', this.getScoreFor('idle')), this._idleTimeout);
		return this;
	}

	/**
	 * 
	 * @param {string} evt - The name of the event. e.g 'mousemove', 'click', and more
	 * @param {function} cb - Callback when the event has triggered
	 */
	_addEventPenalty(evt, cb) {
		window.addEventListener(evt, cb);
		return this;
	}

	/**
	 * Returns true if the user have at least one penalty
	 */
	hasSuspectedCheating = () => {
		return this.penalties.length > 0;
	}

	/**
	 * Get the total score of penalties
	 */
	getTotalScore = () => {
		return this.penalties.reduce((val, cur) => val + cur.score, 0);
	}

	/**
	 * Penalty Getters
	 * 
	 * Retrieves the penalty based on the given event.
	 */
	getListOf(penalty) { return this.penalties.filter(current => current.reason == penalty); }
	getIdlePenalty() { return this.getListOf('IDLE'); }
	getCopyPenalty() { return this.getListOf('COPY'); }
	getPastePenalty() {	return this.getListOf('PASTE'); }
	getChangeFocusPenalty() { return this.getListOf('CHANGE_FOCUS') }

}